import { initials } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import type { BasicUserType } from '@hexa/server/schema/user';

export const getAvatarFallbackUrl = (user: BasicUserType) => {
  const avatar = createAvatar(initials, {
    seed: user.name ?? user.email ?? '',
  });
  return avatar.toDataUri();
};

export const getAvatarUrl = (user: BasicUserType) => {
  return user.avatarUrl ?? getAvatarFallbackUrl(user);
};

export const getUserDisplayName = (user: BasicUserType) => {
  return user.name ?? user.email?.split('@')[0];
};
