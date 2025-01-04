import { sendOrgInviteEmails } from '@hexa/server/lib';
import authOrg from '@hexa/server/middleware/org';
import { authInvite } from '@hexa/server/middleware/org-invite';
import { getSessionMiddleware } from '@hexa/server/middleware/session';
import {
  CreateInvitesSchema,
  RevokeInviteSchema,
} from '@hexa/server/schema/org-invite';
import {
  acceptInvite,
  createInvites,
  getInvitesByIds,
  revokeInvite,
} from '@hexa/server/store/org-invite';
import type { Context } from '@hexa/server/types';
// @ts-ignore
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

const invite = new Hono<Context>()
  .post(
    '/org/create-invites',
    zValidator('json', CreateInvitesSchema),
    authOrg('json'),
    async (c) => {
      const { db, orgId, userId: inviterId } = c.var;
      const { invites } = c.req.valid('json');

      // Create invites
      const insertedInvites = await createInvites(db, {
        orgId,
        inviterId,
        invites,
      });

      // Get full details
      const invitesWithDetails = await getInvitesByIds(
        db,
        insertedInvites.map((invite) => invite.id)
      );

      const emails = await sendOrgInviteEmails(invitesWithDetails);

      return c.json(emails);
    }
  )
  // Revoke invite
  .put(
    '/org/revoke-invite',
    zValidator('json', RevokeInviteSchema),
    authInvite('json'),
    async (c) => {
      const { db, invite } = c.var;
      await revokeInvite(db, invite.id);
      return c.json({});
    }
  )
  // Accept invite
  .get(
    '/invite/:token',
    getSessionMiddleware,
    zValidator('param', z.object({ token: z.string() })),
    async (c) => {
      const { db, userId } = c.var;
      const { token } = c.req.valid('param');
      if (userId) {
        // accept invite
        await acceptInvite(db, token, userId);
        return c.redirect('/');
      }
      return c.redirect(`/login?next=${c.req.url}`);
    }
  );

export default invite;
