import { APP_URL } from '@hexa/env';
import { isHashValid } from '@hexa/lib';
import { ApiError } from '@hexa/lib';
import { verifyLoginPasscodeMiddleware } from '@hexa/server/middleware/login';
import {
  getPasscodeByTokenMiddleware,
  getPasscodeMiddleware,
  resendPasscodeMiddleware,
} from '@hexa/server/middleware/passcode';
import { turnstileMiddleware } from '@hexa/server/middleware/turnstile';
import { zNextSchema } from '@hexa/server/schema/common';
import { LoginPasswordSchema } from '@hexa/server/schema/login';
import {
  ResendPasscodeSchema,
  SendPasscodeSchema,
  VerifyPassTokenSchema,
  VerifyPasscodeSchema,
} from '@hexa/server/schema/passcode';
import { addPasscodeAndSendEmail } from '@hexa/server/service/passcode';
import { setSession } from '@hexa/server/session';
import { getEmail } from '@hexa/server/store/user';
import type { Context } from '@hexa/server/types';
// @ts-ignore
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

const login = new Hono<Context>()
  // ====== Login by password ======
  .post(
    '/login-password',
    zValidator('json', LoginPasswordSchema),
    turnstileMiddleware(),
    async (c) => {
      const { email, password, next } = c.req.valid('json');
      const redirectUrl = next ?? '/';
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
      return c.redirect(redirectUrl);
    }
  )
  // ====== Login by passcode ======
  // Login by passcode send passcode
  .post(
    '/login-passcode/send-passcode',
    zValidator('json', SendPasscodeSchema),
    turnstileMiddleware(),
    async (c) => {
      const { email, next } = c.req.valid('json');
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
        verifyUrlPrefex: `${APP_URL}/api/login-token/`,
        verifyUrlSuffix: next ? `?next=${next}` : undefined,
      });

      return c.json(data);
    }
  )
  // Login by passcode resend passcode
  .post(
    '/login-passcode/resend-passcode',
    zValidator('json', ResendPasscodeSchema),
    turnstileMiddleware(),
    resendPasscodeMiddleware(`${APP_URL}/api/login-token/`)
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
    zValidator('query', zNextSchema),
    getPasscodeByTokenMiddleware('param', 'LOGIN'),
    verifyLoginPasscodeMiddleware
  );

export default login;
