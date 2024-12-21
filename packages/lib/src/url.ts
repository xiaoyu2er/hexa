import { APP_URL } from '@hexa/env';

export const getInviteUrl = (token: string) => {
  return `${APP_URL}/api/invite/${token}`;
};
