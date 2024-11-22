import { PUBLIC_URL } from '@/lib/env';
import { ApiError } from '@/lib/error/error';
import type { Context } from '@/lib/route-types';
import { invalidateUserSessions, setSession } from '@/lib/session';
import {
  getPasscodeByTokenMiddleware,
  getPasscodeMiddleware,
  resendPasscodeMiddleware,
} from '@/server/middleware/passcode';
import { turnstileMiddleware } from '@/server/middleware/turnstile';
import {
  ResendPasscodeSchema,
  SendPasscodeSchema,
  VerifyPasscodeSchema,
} from '@/server/schema/passcode';
import { ResetPasswordSchema } from '@/server/schema/reset-password';
import { addPasscodeAndSendEmail } from '@/server/service/passcode';
import { findPasscodeByToken, verifyPasscode } from '@/server/store/passcode';
import { getEmail, updateUserPassword } from '@/server/store/user';
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
      const { email } = c.req.valid('json');
      const emailItem = await getEmail(db, email);
      if (!emailItem || !emailItem.userId) {
        throw new ApiError('CONFLICT', 'Email not found');
      }
      const data = await addPasscodeAndSendEmail(db, {
        email,
        userId: emailItem.userId,
        type: 'RESET_PASSWORD',
        verifyUrlPrefex: `${PUBLIC_URL}/reset-password?token=`,
      });
      return c.json(data);
    }
  )
  // Reset password resend passcode
  .post(
    '/reset-password/resend-passcode',
    zValidator('json', ResendPasscodeSchema),
    turnstileMiddleware(),
    resendPasscodeMiddleware(`${PUBLIC_URL}/reset-password?token=`)
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
    getPasscodeByTokenMiddleware('json', 'RESET_PASSWORD'),
    async (c) => {
      const db = c.get('db');
      const { token, password } = c.req.valid('json');
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

      return c.redirect('/');
    }
  );

export default resetPassword;
