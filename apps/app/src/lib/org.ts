import type { SelectOrgType } from '@/server/schema/org';

export const getAvatarFallbackUrl = (org: SelectOrgType) => {
  return `https://api.dicebear.com/9.x/icons/svg?seed=${org.name}`;
};
