import { getOrgWithUserRole } from '@/features/org/store';
import { ApiError } from '@/lib/error/error';
import { SelectOwnerSchema } from '@/server/db/schema';
import auth from '@/server/middleware/auth-user';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import type { Context } from '../types';

const owner = new Hono<Context>().get(
  '/owner/:name',
  auth,
  zValidator('param', SelectOwnerSchema.pick({ name: true })),
  async (c) => {
    const { db, user, userId } = c.var;
    const { name } = c.req.valid('param');
    if (user.name === name) {
      return c.json({
        id: userId,
        ownerType: 'USER',
        name: user.name,
        avatarUrl: user.avatarUrl,
        desc: null,
        role: null,
      });
    }
    const org = await getOrgWithUserRole(db, name, userId);
    if (!org) {
      throw new ApiError('NOT_FOUND', 'Organization not found');
    }
    return c.json({
      id: org.id,
      ownerType: 'ORG',
      name: org.name,
      avatarUrl: org.avatarUrl,
      desc: org.desc,
      role: org.role,
    });
  }
);

export default owner;
