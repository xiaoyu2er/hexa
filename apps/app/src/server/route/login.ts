import { isHashValid } from '@/lib/crypto';
import { PUBLIC_URL } from '@/lib/env';
import { ApiError } from '@/lib/error/error';
import type { Context } from '@/lib/route-types';
import { setSession } from '@/lib/session';
import { verifyLoginPasscodeMiddleware } from '@/server/middleware/login';
import {
  getPasscodeByTokenMiddleware,
  getPasscodeMiddleware,
  resendPasscodeMiddleware,
} from '@/server/middleware/passcode';
import { turnstileMiddleware } from '@/server/middleware/turnstile';
import { LoginPasswordSchema } from '@/server/schema/login';
import {
  ResendPasscodeSchema,
  SendPasscodeSchema,
  VerifyPassTokenSchema,
  VerifyPasscodeSchema,
} from '@/server/schema/passcode';
import { addPasscodeAndSendEmail } from '@/server/service/passcode';
import { getEmail } from '@/server/store/user';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

const login = new Hono<Context>()
  // ====== Login by password ======
  .post(
    '/login-password',
    zValidator('json', LoginPasswordSchema),
    turnstileMiddleware(),
    async (c) => {
      const { email, password } = c.req.valid('json');
      const db = c.get('db');
      const emailItem = await getEmail(db, email);
      const existingUser = emailItem?.user;

      if (!existingUser) {
        throw new ApiError('FORBIDDEN', 'Incorrect email or password');
      }

      if (!existingUser.password) {
        throw new ApiError(
          'FORBIDDEN',
          'Incorrect email or password'
          // 'Password is not set, please use other login method'
        );
      }

      const validPassword = await isHashValid(existingUser.password, password);

      if (!validPassword) {
        throw new ApiError('FORBIDDEN', 'Incorrect email or password');
      }

      await setSession(existingUser.id);
      return c.redirect('/');
    }
  )
  // ====== Login by passcode ======
  // Login by passcode send passcode
  .post(
    '/login-passcode/send-passcode',
    zValidator('json', SendPasscodeSchema),
    turnstileMiddleware(),
    async (c) => {
      const { email } = c.req.valid('json');
      const db = c.get('db');
      const emailItem = await getEmail(db, email);
      const existingUser = emailItem?.user;

      if (!existingUser) {
        throw new ApiError('FORBIDDEN', 'User not found');
      }

      const data = await addPasscodeAndSendEmail(db, {
        email,
        type: 'LOGIN',
        userId: existingUser.id,
        verifyUrlPrefex: `${PUBLIC_URL}/api/login-token/`,
      });

      return c.json(data);
    }
  )
  // Login by passcode resend passcode
  .post(
    '/login-passcode/resend-passcode',
    zValidator('json', ResendPasscodeSchema),
    turnstileMiddleware(),
    resendPasscodeMiddleware(`${PUBLIC_URL}/api/login-token/`)
  )
  // Login by passcode verify passcode
  .post(
    '/login-passcode/verify-passcode',
    zValidator('json', VerifyPasscodeSchema),
    getPasscodeMiddleware('json', 'LOGIN'),
    verifyLoginPasscodeMiddleware
  )
  // Login by passcode verify token
  .get(
    '/login-token/:token',
    zValidator('param', VerifyPassTokenSchema),
    getPasscodeByTokenMiddleware('param', 'LOGIN'),
    verifyLoginPasscodeMiddleware
  );

export default login;
