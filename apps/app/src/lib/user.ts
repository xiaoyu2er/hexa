import type { SelectUserType } from '@hexa/server/schema/user';

export const getAvatarFallbackUrl = (user: Pick<SelectUserType, 'name'>) => {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`;
};
