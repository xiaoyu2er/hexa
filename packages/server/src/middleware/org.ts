import { checkPermission } from '@hexa/lib';
import { ApiError } from '@hexa/lib';
import type { OrgMemberRoleType } from '@hexa/server/schema/org-member';
import { getOrgWithUserRole } from '@hexa/server/store/org';
import type { ValidTarget } from '@hexa/server/types';
import { createMiddleware } from 'hono/factory';

const authOrg = (
  target: ValidTarget,
  requiredRoles: OrgMemberRoleType[] = ['MEMBER']
) =>
  createMiddleware(async (c, next) => {
    // Get projectId from body or formData
    // @ts-ignore
    const orgId = c.req.valid(target)?.orgId;

    if (!orgId) {
      throw new ApiError('BAD_REQUEST', 'Org ID is required');
    }

    const { db, userId } = c.var;

    const org = await getOrgWithUserRole(db, orgId, userId);

    if (!org) {
      throw new ApiError('NOT_FOUND', 'Org not found');
    }

    if (!org.role) {
      throw new ApiError('FORBIDDEN', 'You are not a member of this org');
    }

    checkPermission(requiredRoles, org.role);

    c.set('org', org);
    c.set('orgId', org.id);

    return next();
  });

export default authOrg;
