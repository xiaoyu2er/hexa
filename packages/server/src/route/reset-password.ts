import { APP_URL } from '@hexa/env';
import { ApiError } from '@hexa/lib';
import {
  getPasscodeByTokenMiddleware,
  getPasscodeMiddleware,
  resendPasscodeMiddleware,
} from '@hexa/server/middleware/passcode';
import { turnstileMiddleware } from '@hexa/server/middleware/turnstile';
import {
  ResendPasscodeSchema,
  SendPasscodeSchema,
  VerifyPasscodeSchema,
} from '@hexa/server/schema/passcode';
import { ResetPasswordSchema } from '@hexa/server/schema/reset-password';
import { addPasscodeAndSendEmail } from '@hexa/server/service/passcode';
import { invalidateUserSessions, setSession } from '@hexa/server/session';
import {
  findPasscodeByToken,
  verifyPasscode,
} from '@hexa/server/store/passcode';
import { getEmail, updateUserPassword } from '@hexa/server/store/user';
import type { Context } from '@hexa/server/types';
// @ts-ignore
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

const resetPassword = new Hono<Context>()
  // ====== Reset password ======
  // Reset password send passcode
  .post(
    '/reset-password/send-passcode',
    zValidator('json', SendPasscodeSchema),
    turnstileMiddleware(),
    async (c) => {
      const db = c.get('db');
      // @ts-ignore
      const { email, next } = c.req.valid('json');
      const emailItem = await getEmail(db, email);
      if (!emailItem || !emailItem.userId) {
        throw new ApiError('CONFLICT', 'Email not found');
      }
      const data = await addPasscodeAndSendEmail(db, {
        email,
        userId: emailItem.userId,
        type: 'RESET_PASSWORD',
        verifyUrlPrefex: `${APP_URL}/reset-password?token=`,
        verifyUrlSuffix: next ? `&next=${next}` : '',
      });
      return c.json(data);
    }
  )
  // Reset password resend passcode
  .post(
    '/reset-password/resend-passcode',
    zValidator('json', ResendPasscodeSchema),
    turnstileMiddleware(),
    resendPasscodeMiddleware(`${APP_URL}/reset-password?token=`)
  )
  // Reset password verify passcode
  .post(
    '/reset-password/verify-passcode',
    zValidator('json', VerifyPasscodeSchema),
    getPasscodeMiddleware('json', 'RESET_PASSWORD'),
    (c) => {
      const passcode = c.get('passcode');
      if (!passcode) {
        throw new ApiError('CONFLICT', 'Invalid passcode');
      }
      return c.json({ token: passcode.token });
    }
  )
  // Reset password
  .post(
    '/reset-password',
    zValidator('json', ResetPasswordSchema),
    getPasscodeByTokenMiddleware({
      tokenValidTarget: 'json',
      passcodeType: 'RESET_PASSWORD',
    }),
    async (c) => {
      const db = c.get('db');
      const { token, password, next } = c.req.valid('json');
      const redirectUrl = next ?? '/';
      const passcode = await findPasscodeByToken(db, {
        token,
        type: 'RESET_PASSWORD',
      });

      if (!passcode || !passcode.userId) {
        throw new ApiError('CONFLICT', 'Invalid token');
      }

      await verifyPasscode(db, {
        token,
        type: 'RESET_PASSWORD',
        id: passcode.id,
      });

      // update the password
      await updateUserPassword(db, passcode.userId, password);
      // invalidate all sessions & update a new sssion
      await invalidateUserSessions(passcode.userId);
      await setSession(passcode.userId);

      return c.redirect(redirectUrl);
    }
  );

export default resetPassword;
