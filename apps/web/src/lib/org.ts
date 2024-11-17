import type { SelectOrgType } from '@/server/db';

export const getAvatarFallbackUrl = (org: SelectOrgType) => {
  return `https://api.dicebear.com/9.x/icons/svg?seed=${org.name}`;
};
