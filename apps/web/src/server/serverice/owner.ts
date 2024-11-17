import { ApiError } from '@/lib/error/error';
import { getOrgWithUserRole } from '@/server/data-access/org';
import type { ContextVariables } from '@/server/types';

export const getOwner = async ({
  user,
  db,
  userId,
  name,
}: ContextVariables & { name: string }) => {
  if (user.name === name) {
    return {
      id: userId,
      ownerType: 'USER',
      name: user.name,
      avatarUrl: user.avatarUrl,
      desc: null,
      role: null,
    };
  }
  const org = await getOrgWithUserRole(db, name, userId);
  if (!org) {
    throw new ApiError('NOT_FOUND', 'Organization not found');
  }
  return org;
};
