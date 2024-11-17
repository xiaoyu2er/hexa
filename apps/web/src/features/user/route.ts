import { DeleteOauthAccountSchema } from '@/features/auth/oauth/schema';
import {
  getUserOauthAccounts,
  removeUserOauthAccount,
} from '@/features/auth/oauth/store';
import { EmailSchema } from '@/features/common/schema';
import { updatePasscodeAndSendEmail } from '@/features/passcode/service';
import auth from '@/features/user/middleware';
import {
  ChangeUserNameSchema,
  UpdateDisplayNameSchema,
  UpdateUserAvatarSchema,
} from '@/features/user/schema';
import {
  createUserEmail,
  deleteUser,
  getUserByName,
  getUserEmails,
  removeUserEmail,
  updateProfileName,
  updateUserAvatar,
  updateUserPrimaryEmail,
  updateUsername,
} from '@/features/user/store';
import authWorkspace from '@/features/workspace/middleware';
import {
  getWorkspaceByWsId,
  setUserDefaultWorkspace,
} from '@/features/workspace/store';
import { PUBLIC_URL } from '@/lib/env';
import { ApiError } from '@/lib/error/error';
import { invalidateUserSessions } from '@/lib/session';
import { isStored, storage } from '@/lib/storage';
import type { Context } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

const user = new Hono<Context>()
  .use('/user/*', auth)
  // Get user info
  .get('/user/info', (c) => {
    const { user } = c.var;
    return c.json(user);
  })
  // Get user email
  .get('/user/emails', async (c) => {
    const { db, userId } = c.var;
    const emails = await getUserEmails(db, userId);
    return c.json(emails);
  })
  // Get user oauth accounts
  .get('/user/oauth-accounts', async (c) => {
    const { db, userId } = c.var;
    const oauthAccounts = await getUserOauthAccounts(db, userId);
    return c.json(oauthAccounts);
  })
  // Set user primary email
  .put('/user/emails/primary', zValidator('json', EmailSchema), async (c) => {
    const { email } = c.req.valid('json');
    const { db, userId } = c.var;
    await updateUserPrimaryEmail(db, userId, email);
    return c.json({});
  })
  // Update display name
  .put(
    '/user/display-name',
    zValidator('json', UpdateDisplayNameSchema),
    async (c) => {
      const { db, userId } = c.var;
      const { displayName } = c.req.valid('json');
      await updateProfileName(db, userId, displayName);
      return c.json({});
    }
  )
  // Change username
  .put(
    '/user/username',
    zValidator('json', ChangeUserNameSchema),
    async (c) => {
      const { db, userId } = c.var;
      const { name } = c.req.valid('json');
      const existUser = await getUserByName(db, name);
      if (existUser) {
        throw new ApiError('CONFLICT', 'Username already exists');
      }
      await updateUsername(db, userId, name);
      return c.json({});
    }
  )
  // Add user email
  .post('/user/emails', zValidator('json', EmailSchema), async (c) => {
    const { db, userId } = c.var;
    const { email } = c.req.valid('json');

    await createUserEmail(db, {
      email,
      verified: false,
      primary: false,
      userId,
    });

    const data = await updatePasscodeAndSendEmail(db, {
      userId,
      email,
      type: 'VERIFY_EMAIL',
      publicUrl: PUBLIC_URL,
    });

    return c.json(data);
  })
  // Remove user email
  .delete('/user/emails', zValidator('json', EmailSchema), async (c) => {
    const { db, userId } = c.var;
    const { email } = c.req.valid('json');
    await removeUserEmail(db, userId, email);
    return c.json({});
  })
  // Update user avatar
  .put(
    '/user/avatar',
    zValidator('form', UpdateUserAvatarSchema),
    async (c) => {
      const {
        db,
        userId,
        user: { avatarUrl },
      } = c.var;
      const { image } = c.req.valid('form');
      const { url } = await storage.upload(`avatars/${generateId()}`, image);
      await updateUserAvatar(db, userId, url);
      // Delete old avatar
      c.ctx.waitUntil(
        (async () => {
          if (avatarUrl && isStored(avatarUrl)) {
            await storage.delete(avatarUrl);
          }
        })()
      );
      // revalidatePath("/");
      return c.json({});
    }
  )
  // Delete user
  .delete('/user', async (c) => {
    const { db, userId } = c.var;
    await deleteUser(db, userId);
    await invalidateUserSessions(userId);
    // setBlankSessionCookie();
    return c.json({});
  })
  // Remove user oauth account
  .delete(
    '/user/oauth-accounts',
    zValidator('json', DeleteOauthAccountSchema),
    async (c) => {
      const { db, userId } = c.var;
      const { provider } = c.req.valid('json');
      await removeUserOauthAccount(db, userId, provider);
      return c.json({});
    }
  )
  // Set user default workspace
  .put('/user/default-workspace', authWorkspace, async (c) => {
    const { db, userId, wsId } = c.var;
    const newUser = await setUserDefaultWorkspace(db, { userId, wsId });
    if (!newUser) {
      throw new ApiError(
        'INTERNAL_SERVER_ERROR',
        'Failed to set default workspace'
      );
    }
    const ws = await getWorkspaceByWsId(db, wsId);
    if (!ws) {
      throw new ApiError('NOT_FOUND', 'Workspace not found');
    }
    return c.json({ ws });
  });

export default user;
