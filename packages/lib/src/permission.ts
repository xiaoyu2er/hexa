import { ApiError } from '@hexa/lib';

export const checkPermission = (
  requiredRoles: ('OWNER' | 'ADMIN' | 'MEMBER')[],
  userRole: 'OWNER' | 'ADMIN' | 'MEMBER'
) => {
  const roleHierarchy = { OWNER: 3, ADMIN: 2, MEMBER: 1 };
  const requiredLevel = Math.min(
    ...requiredRoles.map((role) => roleHierarchy[role])
  );
  const userLevel = roleHierarchy[userRole];
  const noPermission = userLevel < requiredLevel;

  if (noPermission) {
    throw new ApiError(
      'FORBIDDEN',
      'You do not have permission to perform this action'
    );
  }
};
