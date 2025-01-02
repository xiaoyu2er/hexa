import { ApiError } from '@hexa/lib';
import { getSessionMiddleware } from '@hexa/server/middleware/session';
import { acceptInvite, getInviteByToken } from '@hexa/server/store/org-invite';
import { getUserEmail } from '@hexa/server/store/user';
import type { Context } from '@hexa/server/types';
// @ts-ignore
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

const invite = new Hono<Context>()
  // Accept invite
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
      } else {
        return c.redirect(`/login?next=${c.req.url}`);
      }

      return c.json({});
    }
  );

export default invite;
