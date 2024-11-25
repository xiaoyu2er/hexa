import { ApiError } from '@/lib/error/error';
import { getSessionMiddleware } from '@/server/middleware/session';
import type { Context } from '@/server/route/route-types';
import { acceptInvite, getInviteByToken } from '@/server/store/org-invite';
import { getUserEmail } from '@/server/store/user';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

const invite = new Hono<Context>()
  // Check if email is already taken
  .get(
    '/invite/:token',
    getSessionMiddleware,
    zValidator('param', z.object({ token: z.string() })),
    async (c) => {
      const { db, userId } = c.var;
      const { token } = c.req.valid('param');
      const invite = await getInviteByToken(db, token);
      if (userId) {
        const email = await getUserEmail(db, userId, invite.email);
        if (email) {
          if (email.verified) {
            // accept invite
            await acceptInvite(db, token, userId);
            return c.redirect('/user/orgs?msg=Invite+accepted');
          }
          throw new ApiError('BAD_REQUEST', 'Email is not verified');
        }
      }

      return c.json({});
    }
  );

export default invite;
