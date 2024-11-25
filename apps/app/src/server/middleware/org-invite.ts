import { ApiError } from '@/lib/error/error';
import type { ValidTarget } from '@/server/route/route-types';
import { getOrgInvite } from '@/server/store/org-invite';
import { createMiddleware } from 'hono/factory';

export const authInvite = (target: ValidTarget) =>
  createMiddleware(async (c, next) => {
    // @ts-ignore
    const { inviteId, orgId } = c.req.valid(target);

    if (!inviteId) {
      throw new ApiError('BAD_REQUEST', 'Invite ID is required');
    }
    if (!orgId) {
      throw new ApiError('BAD_REQUEST', 'Org ID is required');
    }

    const { db } = c.var;
    const invite = await getOrgInvite(db, { inviteId, orgId });
    c.set('invite', invite);
    return next();
  });
