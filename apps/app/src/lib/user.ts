import type { BasicUserType } from '@hexa/server/schema/user';

export const getAvatarFallbackUrl = (user: BasicUserType) => {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`;
};

export const getAvatarUrl = (user: BasicUserType) => {
  return user.avatarUrl ?? getAvatarFallbackUrl(user);
};

export const getUserDisplayName = (user: BasicUserType) => {
  return user.name ?? user.email?.split('@')[0];
};
