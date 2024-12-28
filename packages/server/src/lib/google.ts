import { APP_URL } from '@hexa/env';
// @ts-ignore
import { Google } from 'arctic';

export const getGoogle = () =>
  new Google(
    process.env.OAUTH_GOOGLE_CLIENT_ID ?? '',
    process.env.OAUTH_GOOGLE_CLIENT_SECRET ?? '',
    `${APP_URL}/api/oauth/google/callback`
  );
