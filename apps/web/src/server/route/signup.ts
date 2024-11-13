import { IS_DEVELOPMENT, PUBLIC_URL } from '@/lib/env';
import { ApiError } from '@/lib/error/error';
import { invalidateUserSessions, setSession } from '@/lib/session';
import { OauthSignupSchema, SignupSchema } from '@/lib/zod/schemas/auth';
import {
  getOauthAccount,
  updateOauthAccount,
} from '@/server/data-access/account';
import {
  createUser,
  getEmail,
  getUserByUsername,
  getUserEmail,
  updateUserPassword,
} from '@/server/data-access/user';
import { turnstile } from '@/server/middleware/turnstile';
import { updatePasscodeAndSendEmail } from '@/server/serverice/passcode';
import type { Context } from '@/server/types';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

const signup = new Hono<Context>()
  // signup
  .post('/signup', zValidator('json', SignupSchema), turnstile, async (c) => {
    const db = c.get('db');
    const { email, password, username } = c.req.valid('json');
    const emailItem = await getEmail(db, email);

    if (emailItem?.verified) {
      throw new ApiError(
        'FORBIDDEN',
        IS_DEVELOPMENT ? '[dev]Email already exists' : 'Email already exists'
      );
    }

    let user = emailItem?.user;

    if (user) {
      await updateUserPassword(db, user.id, password);
    } else {
      user = await getUserByUsername(db, username);
      if (user) {
        throw new ApiError('FORBIDDEN', 'Username already exists');
      }
      user = await createUser(db, {
        name: null,
        email,
        verified: false,
        password,
        username,
        avatarUrl: null,
      });

      if (!user) {
        throw new ApiError('INTERNAL_SERVER_ERROR', 'Failed to create user');
      }
    }
    const data = await updatePasscodeAndSendEmail(db, {
      userId: user.id,
      email,
      type: 'VERIFY_EMAIL',
      publicUrl: PUBLIC_URL,
    });
    return c.json(data);
  })
  .post(
    '/oauth-signup',
    zValidator('json', OauthSignupSchema),
    turnstile,
    async (c) => {
      const { username, oauthAccountId } = c.req.valid('json');
      const db = c.get('db');
      const oauthAcccount = await getOauthAccount(db, oauthAccountId);
      if (!oauthAcccount) {
        throw new ApiError('NOT_FOUND', 'Oauth account not found');
      }

      const emailItem = await getUserEmail(db, oauthAcccount.email);

      if (emailItem?.verified) {
        throw new ApiError('CONFLICT', 'Email already exists');
      }

      let user = await getUserByUsername(db, username);
      if (user) {
        throw new ApiError('CONFLICT', 'Username already exists');
      }

      user = await createUser(db, {
        email: oauthAcccount.email,
        verified: true,
        // we don't need password for oauth signup
        password: null,
        username,
        avatarUrl: oauthAcccount.avatarUrl,
        name: oauthAcccount.name,
      });

      if (!user) {
        throw new ApiError('INTERNAL_SERVER_ERROR', 'Failed to create user');
      }

      await updateOauthAccount(db, oauthAcccount.id, { userId: user.id });
      await invalidateUserSessions(user.id);
      await setSession(user.id);
      return c.json({});
    }
  );
export default signup;
