import type { User } from 'lucia';

export const getAvatarFallbackUrl = (user: User) => {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`;
};
