import { getOrgWithUserRole } from '@/features/org/store';
import { ApiError } from '@/lib/error/error';
import type { ContextVariables } from '@/lib/types';

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
