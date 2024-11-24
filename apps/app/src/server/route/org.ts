import { generateId } from '@/lib/crypto';
import { ApiError } from '@/lib/error/error';
import { generateProjectSlug } from '@/lib/slug';
import { isStored, storage } from '@/lib/storage';
import authOrg from '@/server/middleware/org';
import { assertAuthMiddleware } from '@/server/middleware/user';
import type { Context } from '@/server/route/route-types';
import {
  DeleteOrgSchema,
  InsertOrgSchema,
  OrgIdSchema,
  UpdateOrgAvatarSchema,
  UpdateOrgNameSchema,
} from '@/server/schema/org';
import { CreateInvitesSchema } from '@/server/schema/org-invite';
import {
  assertUserHasOrgRole,
  createOrg,
  deleteOrg,
  getUserOrgs,
  leaveOrg,
  updateOrg,
  updateOrgAvatar,
  updateOrgName,
} from '@/server/store/org';
import { createInvites, getOrgInvites } from '@/server/store/org-invite';
import { getOrgMembers } from '@/server/store/org-member';
import { createProject, getProjectWithRole } from '@/server/store/project';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

const org = new Hono<Context>()
  .use('/org/*', assertAuthMiddleware)
  // Get user's organizations
  .get('/org/all', async (c) => {
    const { db, userId } = c.var;
    const orgs = await getUserOrgs(db, userId);
    return c.json(orgs);
  })

  // Create organization
  .post('/org', zValidator('json', InsertOrgSchema), async (c) => {
    const { db, userId } = c.var;
    const data = c.req.valid('json');
    const { name, desc } = data;

    // Create org and add creator as owner
    const org = await createOrg(db, {
      name,
      desc,
      userId,
    });

    const project = await createProject(db, {
      name: `${name}'s project`,
      slug: generateProjectSlug(),
      orgId: org.id,
    });

    const projectWithRole = await getProjectWithRole(db, project.id, userId);
    if (!projectWithRole) {
      throw new ApiError(
        'INTERNAL_SERVER_ERROR',
        'Failed to create organization'
      );
    }
    return c.json(projectWithRole);
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
  // Update organization avatar
  .put(
    '/org/update-org-avatar',
    zValidator('form', UpdateOrgAvatarSchema),
    authOrg('form', ['OWNER', 'ADMIN']),
    async (c) => {
      const { db, org, orgId } = c.var;
      const { image } = c.req.valid('form');
      const { url } = await storage.upload(
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
            await storage.delete(org.avatarUrl);
          }
        })()
      );

      return c.json(newOrg);
    }
  )

  // Update organization
  .put('/org/:orgId', zValidator('json', InsertOrgSchema), async (c) => {
    const { db, userId } = c.var;
    const { orgId } = c.req.param();
    const data = c.req.valid('json');

    // Verify user is owner/admin
    await assertUserHasOrgRole(db, {
      orgId,
      userId,
      requiredRole: ['OWNER', 'ADMIN'],
    });

    const updatedOrg = await updateOrg(db, orgId, data);
    return c.json(updatedOrg);
  })

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
    authOrg('param'),
    async (c) => {
      const { db, orgId } = c.var;
      const members = await getOrgMembers(db, orgId);
      return c.json(members);
    }
  )

  // Get org invites
  .get(
    '/org/:orgId/invites',
    zValidator('param', OrgIdSchema),
    authOrg('param'),
    async (c) => {
      const { db, orgId } = c.var;
      const invites = await getOrgInvites(db, orgId);
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
      const newInvites = await createInvites(db, {
        orgId,
        inviterId,
        invites,
      });
      return c.json(newInvites);
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
  .post('/org/:orgId/leave', async (c) => {
    const { db, userId } = c.var;
    const { orgId } = c.req.param();

    await leaveOrg(db, { orgId, userId });
    return c.json({});
  });

export default org;
