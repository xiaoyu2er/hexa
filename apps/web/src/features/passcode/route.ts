import { turnstile } from '@/features/auth/turnstile/middleware';
import {
  ResendPasscodeSchema,
  SendPasscodeSchema,
  VerifyPassTokenSchema,
  VerifyPasscodeSchema,
} from '@/features/passcode/schema';
import { updatePasscodeAndSendEmail } from '@/features/passcode/service';
import {
  getTokenByToken,
  verifyDBTokenByCode,
} from '@/features/passcode/store';
import {
  createUser,
  createUserEmail,
  getUserEmail,
  updateUserEmailVerified,
} from '@/features/user/store';
import { IS_DEVELOPMENT, PUBLIC_URL } from '@/lib/env';
import { ApiError } from '@/lib/error/error';
import { invalidateUserSessions, setSession } from '@/lib/session';
import type { Context } from '@/server/types';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

const passcode = new Hono<Context>()
  // Send passcode
  .post(
    '/send-passcode',
    zValidator('json', SendPasscodeSchema),
    turnstile,
    async (c) => {
      const db = c.get('db');
      const { email, type } = c.req.valid('json');
      switch (type) {
        case 'SIGN_UP':
          break;
        case 'RESET_PASSWORD':
          break;
        case 'VERIFY_EMAIL':
          break;
        case 'LOGIN_PASSCODE': {
          const emailItem = await getUserEmail(db, email);
          if (!emailItem) {
            throw new ApiError('BAD_REQUEST', 'user not found');
          }
          break;
        }
        default:
          throw new ApiError('BAD_REQUEST', 'Unexpected type');
      }
      const data = await updatePasscodeAndSendEmail(db, {
        email,
        type,
        publicUrl: PUBLIC_URL,
      });
      return c.json(data);
    }
  )
  // Resend passcode
  .post(
    '/resend-passcode',
    zValidator('json', ResendPasscodeSchema),
    async (c) => {
      const db = c.get('db');
      const { email, type, tmpUserId } = c.req.valid('json');
      const data = await updatePasscodeAndSendEmail(db, {
        email,
        type,
        tmpUserId,
        publicUrl: PUBLIC_URL,
      });
      return c.json(data);
    }
  )
  // Verify passcode
  .post(
    '/verify-passcode',
    zValidator('json', VerifyPasscodeSchema),
    async (c) => {
      const db = c.get('db');
      const { email, code, type, tmpUserId } = c.req.valid('json');
      const isResetPassword = type === 'RESET_PASSWORD';
      const tokenItem = await verifyDBTokenByCode(db, {
        code,
        email,
        type,
        tmpUserId,
        deleteRow: !isResetPassword,
      });

      switch (type) {
        case 'SIGN_UP': {
          const tmpUser = tokenItem?.tmpUser;
          if (!tmpUser) {
            throw new ApiError('BAD_REQUEST', 'tmp user not found');
          }

          const user = await createUser(db, {
            name: tmpUser.name,
            password: tmpUser.password,
          });
          if (!user) {
            throw new ApiError('BAD_REQUEST', 'Failed to create user');
          }
          // add email
          await createUserEmail(db, {
            email: tmpUser.email,
            userId: user.id,
            verified: true,
            primary: true,
          });
          await invalidateUserSessions(user.id);
          await setSession(user.id);
          return c.redirect(`/${user.name}/settings/profile`);
        }
        case 'RESET_PASSWORD': {
          return c.json({ token: tokenItem.token });
        }
        case 'VERIFY_EMAIL': {
          // verify email
          const tmpUser = tokenItem?.tmpUser;
          if (!tmpUser) {
            throw new ApiError('BAD_REQUEST', 'tmp user not found');
          }
          await updateUserEmailVerified(db, tmpUser.id, email);
          return c.redirect(`/${tmpUser.name}/settings/profile`);
        }
        case 'LOGIN_PASSCODE': {
          const emailItem = await getUserEmail(db, email);
          if (!emailItem) {
            throw new ApiError('BAD_REQUEST', 'user not found');
          }
          await invalidateUserSessions(emailItem.user.id);
          await setSession(emailItem.user.id);
          return c.redirect(`/${emailItem.user.name}/settings/profile`);
        }
        default:
          throw new ApiError('BAD_REQUEST', 'Unexpected type');
      }
    }
  )
  // Login by verify token sent to email
  .get(
    '/verify-token',
    zValidator('query', VerifyPassTokenSchema),
    async (c) => {
      const db = c.get('db');
      const { token, type } = c.req.valid('query');

      const tokenItem = await getTokenByToken(db, { token, type });
      if (!tokenItem) {
        throw new ApiError(
          'FORBIDDEN',
          IS_DEVELOPMENT
            ? '[dev]Code is not found'
            : 'Code is invalid or expired'
        );
      }
      const isResetPassword = type === 'RESET_PASSWORD';

      await verifyDBTokenByCode(db, {
        email: tokenItem.email,
        token,
        type: tokenItem.type,
        deleteRow: !isResetPassword,
      });

      if (type === 'RESET_PASSWORD') {
        return c.redirect(`/reset-password?token=${tokenItem.token}`);
      }

      if (tokenItem.userId && tokenItem.user) {
        await invalidateUserSessions(tokenItem.userId);
        await setSession(tokenItem.userId);
        return c.redirect(`/${tokenItem.user.name}/settings/profile`);
      }

      throw new ApiError('BAD_REQUEST', 'Unexpected token');
    }
  );
export default passcode;
