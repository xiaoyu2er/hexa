import { generateId } from '@hexa/lib';
import { ApiError } from '@hexa/lib';
import { getStorage, sendOrgInviteEmails } from '@hexa/server/lib';
import { isStored } from '@hexa/server/lib';
import authOrg from '@hexa/server/middleware/org';
import { authInvite } from '@hexa/server/middleware/org-invite';
import {
  DeleteOrgSchema,
  InsertOrgSchema,
  LeaveOrgSchema,
  OrgIdSchema,
  UpdateOrgAvatarSchema,
  UpdateOrgNameSchema,
  UpdateOrgSlugSchema,
} from '@hexa/server/schema/org';
import {
  CreateInvitesSchema,
  OrgInviteQuerySchema,
  RevokeInviteSchema,
} from '@hexa/server/schema/org-invite';
import { OrgMemberQuerySchema } from '@hexa/server/schema/org-member';
import {
  assertUserHasOrgRole,
  createOrg,
  deleteOrg,
  getUserOrgs,
  leaveOrg,
  updateOrgAvatar,
  updateOrgName,
  updateOrgSlug,
} from '@hexa/server/store/org';
import {
  createInvites,
  getInvitesByIds,
  getOrgInvites,
  revokeInvite,
} from '@hexa/server/store/org-invite';
import { getOrgMembers } from '@hexa/server/store/org-member';
import {} from '@hexa/server/store/project';
import type { Context } from '@hexa/server/types';
// @ts-ignore
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

const org = new Hono<Context>()
  // Get user's organizations
  .get('/org/all', async (c) => {
    const { db, userId } = c.var;
    const orgs = await getUserOrgs(db, userId);
    return c.json(orgs);
  })
  // Create organization
  .post('/org/create-org', zValidator('json', InsertOrgSchema), async (c) => {
    const { db, userId } = c.var;
    const data = c.req.valid('json');
    const { name, slug } = data;

    // Create org and add creator as owner
    const org = await createOrg(db, {
      name,
      slug,
      userId,
    });

    // const project = await createProject(db, {
    //   name: `${name}'s project`,
    //   slug: generateProjectSlug(),
    //   orgId: org.id,
    // });

    // const projectWithRole = await getProjectWithRole(db, project.id, userId);
    // if (!projectWithRole) {
    //   throw new ApiError(
    //     'INTERNAL_SERVER_ERROR',
    //     'Failed to create organization'
    //   );
    // }
    return c.json({
      org,
    });
  })

  // Update organization name
  .put(
    '/org/update-org-name',
    zValidator('json', UpdateOrgNameSchema),
    authOrg('json'),
    async (c) => {
      const { db, userId, orgId } = c.var;
      const { name } = c.req.valid('json');
      const org = await updateOrgName(db, {
        orgId,
        name,
        userId,
      });
      if (!org) {
        throw new ApiError(
          'INTERNAL_SERVER_ERROR',
          'Failed to update organization name'
        );
      }
      return c.json(org);
    }
  )
  // Update org slug
  .put(
    '/org/update-org-slug',
    zValidator('json', UpdateOrgSlugSchema),
    authOrg('json', ['OWNER', 'ADMIN']),
    async (c) => {
      const { db, orgId } = c.var;
      const { slug } = c.req.valid('json');
      const org = await updateOrgSlug(db, {
        orgId,
        slug,
      });
      return c.json(org);
    }
  )
  // Update organization avatar
  .put(
    '/org/update-org-avatar',
    zValidator('form', UpdateOrgAvatarSchema),
    authOrg('form', ['OWNER', 'ADMIN']),
    async (c) => {
      const { db, org, orgId } = c.var;
      const { image } = c.req.valid('form');
      const { url } = await getStorage().upload(
        `org-avatars/${generateId()}`,
        image
      );
      const newOrg = await updateOrgAvatar(db, {
        orgId,
        avatarUrl: url,
      });
      if (!newOrg) {
        throw new ApiError(
          'INTERNAL_SERVER_ERROR',
          'Failed to update organization avatar'
        );
      }
      c.ctx.waitUntil(
        (async () => {
          if (org.avatarUrl && isStored(org.avatarUrl)) {
            await getStorage().delete(org.avatarUrl);
          }
        })()
      );

      return c.json(newOrg);
    }
  )

  // Delete organization
  .delete(
    '/org/delete-org',
    zValidator('json', DeleteOrgSchema),
    authOrg('json'),
    async (c) => {
      const { db, userId } = c.var;
      const { orgId } = c.req.valid('json');

      // Verify user is owner
      await assertUserHasOrgRole(db, {
        orgId,
        userId,
        requiredRole: ['OWNER'],
      });

      await deleteOrg(db, orgId);
      return c.json({});
    }
  )

  // Get org members
  .get(
    '/org/:orgId/members',
    zValidator('param', OrgIdSchema),
    zValidator('query', OrgMemberQuerySchema),
    authOrg('param'),
    async (c) => {
      const { db, orgId } = c.var;
      const query = c.req.valid('query');
      const members = await getOrgMembers(db, orgId, query);
      return c.json(members);
    }
  )

  // Get org invites
  .get(
    '/org/:orgId/invites',
    zValidator('param', OrgIdSchema),
    zValidator('query', OrgInviteQuerySchema),
    authOrg('param'),
    async (c) => {
      const { db, orgId } = c.var;
      const query = c.req.valid('query');
      const invites = await getOrgInvites(db, orgId, query);
      return c.json(invites);
    }
  )
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

  // // Add member to organization
  // .post('/org/:orgId/members', async (c) => {
  //   const { db, userId } = c.var;
  //   const { orgId } = c.req.param();
  //   const { targetUserId, role } = c.req.valid('json');

  //   await addOrgMember(db, {
  //     orgId,
  //     targetUserId,
  //     role,
  //     currentUserId: userId,
  //   });

  //   return c.json({});
  // })

  // // Update member role
  // .put('/org/:orgId/members/:memberId/role', async (c) => {
  //   const { db, userId } = c.var;
  //   const { orgId, memberId } = c.req.param();
  //   const { role } = c.req.valid('json');

  //   await updateOrgMemberRole(db, {
  //     orgId,
  //     targetUserId: memberId,
  //     newRole: role,
  //     currentUserId: userId,
  //   });

  //   return c.json({});
  // })

  // // Transfer ownership
  // .put('/org/:orgId/transfer-ownership', async (c) => {
  //   const { db, userId } = c.var;
  //   const { orgId } = c.req.param();
  //   const { newOwnerId } = c.req.valid('json');

  //   await transferOrgOwnership(db, {
  //     orgId,
  //     currentOwnerId: userId,
  //     newOwnerId,
  //   });

  //   return c.json({});
  // })

  // Leave organization
  .post(
    '/org/leave-org',
    zValidator('json', LeaveOrgSchema),
    authOrg('json'),
    async (c) => {
      const { db, userId } = c.var;
      const { orgId } = c.req.valid('json');

      await leaveOrg(db, { orgId, userId });
      return c.json({});
    }
  );

export default org;
