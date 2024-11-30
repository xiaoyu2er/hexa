import { EmailSchema } from '@/server/schema/common';
import { DeleteOauthAccountSchema } from '@/server/schema/oauth';
import { EditPasswordSchema } from '@/server/schema/reset-password';
import {
  getUserOauthAccounts,
  removeUserOauthAccount,
} from '@/server/store/oauth';

import { generateId, isHashValid } from '@/lib/crypto';
import { APP_URL } from '@/lib/env';
import { ApiError } from '@/lib/error/error';
import { invalidateUserSessions } from '@/lib/session';
import { isStored, storage } from '@/lib/storage';
import {
  getPasscodeByTokenMiddleware,
  getPasscodeMiddleware,
  resendPasscodeMiddleware,
} from '@/server/middleware/passcode';
import authProject from '@/server/middleware/project';
import { turnstileMiddleware } from '@/server/middleware/turnstile';
import type { Context } from '@/server/route/route-types';
import {
  ResendPasscodeSchema,
  VerifyPassTokenSchema,
  VerifyPasscodeSchema,
} from '@/server/schema/passcode';
import { ProjectIdSchema } from '@/server/schema/project';
import {
  DeleteUserSchema,
  UpdateUserAvatarSchema,
  UpdateUserNameSchema,
} from '@/server/schema/user';
import { addPasscodeAndSendEmail } from '@/server/service/passcode';
import {} from '@/server/store/passcode';
import { getProject, setUserDefaultProject } from '@/server/store/project';
import {
  createEmail,
  deleteUser,
  getEmail,
  getUser,
  getUserEmails,
  getUserForClient,
  removeUserEmail,
  updateUserAvatar,
  updateUserEmailVerified,
  updateUserPassword,
  updateUserPrimaryEmail,
  updateUsername,
} from '@/server/store/user';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { DeleteEmailSchema } from '../schema/email';

const user = new Hono<Context>()
  // Get user info
  .get('/user/info', async (c) => {
    const user = await getUserForClient(c.var.db, c.var.userId);
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
  // Update user primary email
  .put(
    '/user/set-primary-email',
    zValidator('json', EmailSchema),
    async (c) => {
      const { email } = c.req.valid('json');
      const { db, userId } = c.var;
      await updateUserPrimaryEmail(db, userId, email);
      return c.json({});
    }
  )

  // Update username
  .put(
    '/user/update-name',
    zValidator('json', UpdateUserNameSchema),
    async (c) => {
      const { db, userId } = c.var;
      const { name } = c.req.valid('json');
      await updateUsername(db, userId, name);
      return c.json({});
    }
  )
  // Add user email
  .post(
    '/user/add-email/send-passcode',
    zValidator('json', EmailSchema),
    async (c) => {
      const { db, userId } = c.var;
      const { email } = c.req.valid('json');
      const emailItem = await getEmail(db, email);
      if (emailItem) {
        throw new ApiError('BAD_REQUEST', 'Email already exists');
      }
      await createEmail(db, {
        email,
        verified: false,
        primary: false,
        userId,
      });
      const data = await addPasscodeAndSendEmail(db, {
        userId,
        email,
        type: 'ADD_EMAIL',
        verifyUrlPrefex: `${APP_URL}/user/add-email/verify-token`,
      });

      return c.json(data);
    }
  )
  // Resend passcode
  .post(
    '/user/add-email/resend-passcode',
    zValidator('json', ResendPasscodeSchema),
    turnstileMiddleware(),
    resendPasscodeMiddleware(`${APP_URL}/user/add-email/verify-token`)
  )
  // Verify passcode
  .post(
    '/user/add-email/verify-passcode',
    zValidator('json', VerifyPasscodeSchema),
    getPasscodeMiddleware('json', 'ADD_EMAIL'),
    async (c) => {
      const { db, userId } = c.var;
      const passcode = c.get('passcode');
      if (!passcode) {
        throw new ApiError('BAD_REQUEST', 'Passcode not found');
      }
      await updateUserEmailVerified(db, userId, passcode.email);
      return c.json({});
    }
  )
  // Login by verify token sent to email
  .get(
    '/user/add-email/verify-token/:token',
    zValidator('param', VerifyPassTokenSchema),
    getPasscodeByTokenMiddleware('param', 'ADD_EMAIL'),
    async (c) => {
      const { db, userId } = c.var;
      const passcode = c.get('passcode');
      if (!passcode) {
        throw new ApiError('BAD_REQUEST', 'Passcode not found');
      }
      await updateUserEmailVerified(db, userId, passcode.email);
      return c.redirect('/');
    }
  )
  // Remove user email
  .delete(
    '/user/delete-email',
    zValidator('json', DeleteEmailSchema),
    async (c) => {
      const { db, userId } = c.var;
      const { email } = c.req.valid('json');
      await removeUserEmail(db, userId, email);
      return c.json({});
    }
  )
  // Update user avatar
  .put(
    '/user/update-avatar',
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
      return c.json({});
    }
  )
  // Delete user
  .delete(
    '/user/delete-user',
    zValidator('json', DeleteUserSchema),
    async (c) => {
      const { db, userId } = c.var;
      await deleteUser(db, userId);
      await invalidateUserSessions(userId);
      // setBlankSessionCookie();
      return c.json({});
    }
  )
  // Remove user oauth account
  .delete(
    '/user/delete-oauth-account',
    zValidator('json', DeleteOauthAccountSchema),
    async (c) => {
      const { db, userId } = c.var;
      const { provider } = c.req.valid('json');
      await removeUserOauthAccount(db, userId, provider);
      return c.json({});
    }
  )
  // Set user default project
  .put(
    '/user/update-default-project',
    zValidator('json', ProjectIdSchema),
    authProject('json'),
    async (c) => {
      const { db, userId, projectId } = c.var;
      const newUser = await setUserDefaultProject(db, { userId, projectId });
      if (!newUser) {
        throw new ApiError(
          'INTERNAL_SERVER_ERROR',
          'Failed to set default project'
        );
      }
      const project = await getProject(db, projectId);
      if (!project) {
        throw new ApiError('NOT_FOUND', 'Project not found');
      }
      return c.json({ project });
    }
  )
  // Edit password
  .put(
    '/user/update-password',
    zValidator('json', EditPasswordSchema),
    async (c) => {
      const { db, userId } = c.var;
      const { oldPassword, password } = c.req.valid('json');
      const user = await getUser(db, userId);
      if (!user) {
        throw new ApiError('NOT_FOUND', 'User not found');
      }
      if (user.password) {
        if (!oldPassword) {
          throw new ApiError('BAD_REQUEST', 'Old password is required');
        }

        const validPassword = await isHashValid(user.password, oldPassword);
        if (!validPassword) {
          throw new ApiError('BAD_REQUEST', 'Old password is incorrect');
        }
      }

      await updateUserPassword(db, userId, password);
      return c.json({});
    }
  );

export default user;
