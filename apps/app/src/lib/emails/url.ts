import { APP_URL } from '@/lib/env';

export const getInviteUrl = (token: string) => {
  return `${APP_URL}/api/invite/${token}`;
};
