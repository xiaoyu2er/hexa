import { ApiError } from '@/lib/error/error';
import { invalidateUserSessions, setSession } from '@/lib/session';
import {
  getTokenByToken,
  verifyDBTokenByCode,
} from '@/server/data-access/token';
import { updateUserPassword } from '@/server/data-access/user';
import { ResetPasswordSchema } from '@/server/db/schema';
import type { Context } from '@/server/types';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

const resetPassword = new Hono<Context>()
  // Reset password
  .post(
    '/reset-password',
    zValidator('json', ResetPasswordSchema),
    async (c) => {
      const db = c.get('db');
      const { token, password } = c.req.valid('json');
      const tokenRow = await getTokenByToken(db, {
        token,
        type: 'RESET_PASSWORD',
      });

      if (!tokenRow?.userId) {
        throw new ApiError('CONFLICT', 'Invalid token');
      }
      await verifyDBTokenByCode(db, {
        // userId: tokenRow.userId,
        token,
        type: 'RESET_PASSWORD',
        deleteRow: true,
        email: tokenRow.email,
      });

      // update the password
      await updateUserPassword(db, tokenRow.userId, password);

      // invalidate all sessions & update a new sssion
      await invalidateUserSessions(tokenRow.userId);
      await setSession(tokenRow.userId);

      return c.json({});
    }
  );

export default resetPassword;
