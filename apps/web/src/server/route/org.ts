import { ApiError } from '@/lib/error/error';
import {} from '@/lib/storage';
import {
  addOrgMember,
  assertUserHasOrgRole,
  createOrg,
  deleteOrg,
  getOrgByName,
  getUserOrgs,
  leaveOrg,
  transferOrgOwnership,
  updateOrg,
  updateOrgMemberRole,
} from '@/server/data-access/org';
import { InsertOrgSchema } from '@/server/db/schema';
import auth from '@/server/middleware/auth-user';
import type { Context } from '@/server/types';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

const org = new Hono<Context>()
  .use('/org/*', auth)
  // Get user's organizations
  .get('/org/all', async (c) => {
    const { db, userId } = c.var;
    const orgs = await getUserOrgs(db, userId);
    return c.json(orgs);
  })
  .get(
    '/org/:name',
    zValidator('param', z.object({ name: z.string() })),
    async (c) => {
      const { db } = c.var;
      const { name } = c.req.param();
      const org = await getOrgByName(db, name);
      if (!org) {
        throw new ApiError('NOT_FOUND', 'Organization not found');
      }
      return c.json(org);
    }
  )

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

    return c.json(org);
  })

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
  .delete('/org/:orgId', async (c) => {
    const { db, userId } = c.var;
    const { orgId } = c.req.param();

    // Verify user is owner
    await assertUserHasOrgRole(db, {
      orgId,
      userId,
      requiredRole: ['OWNER'],
    });

    await deleteOrg(db, orgId);
    return c.json({});
  })

  // Add member to organization
  .post('/org/:orgId/members', async (c) => {
    const { db, userId } = c.var;
    const { orgId } = c.req.param();
    const { targetUserId, role } = c.req.valid('json');

    await addOrgMember(db, {
      orgId,
      targetUserId,
      role,
      currentUserId: userId,
    });

    return c.json({});
  })

  // Update member role
  .put('/org/:orgId/members/:memberId/role', async (c) => {
    const { db, userId } = c.var;
    const { orgId, memberId } = c.req.param();
    const { role } = c.req.valid('json');

    await updateOrgMemberRole(db, {
      orgId,
      targetUserId: memberId,
      newRole: role,
      currentUserId: userId,
    });

    return c.json({});
  })

  // Transfer ownership
  .put('/org/:orgId/transfer-ownership', async (c) => {
    const { db, userId } = c.var;
    const { orgId } = c.req.param();
    const { newOwnerId } = c.req.valid('json');

    await transferOrgOwnership(db, {
      orgId,
      currentOwnerId: userId,
      newOwnerId,
    });

    return c.json({});
  })

  // Leave organization
  .post('/org/:orgId/leave', async (c) => {
    const { db, userId } = c.var;
    const { orgId } = c.req.param();

    await leaveOrg(db, { orgId, userId });
    return c.json({});
  });

export default org;
