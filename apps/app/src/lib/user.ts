import type { User } from 'lucia';

export const getAvatarFallbackUrl = (user: User | null) => {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${user?.displayName || user?.name}`;
};
