import { PUBLIC_URL } from '@/lib/env';

export const getInviteUrl = (token: string) => {
  return `${PUBLIC_URL}/api/invite/${token}`;
};
