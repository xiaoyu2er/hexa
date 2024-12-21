import { APP_URL } from '@hexa/env';
import type { Context } from '@hexa/server/route/route-types';
// @ts-ignore
import { Google } from 'arctic';

export const getGoogle = (env: Context['Bindings']) =>
  new Google(
    env.OAUTH_GOOGLE_CLIENT_ID,
    env.OAUTH_GOOGLE_CLIENT_SECRET,
    `${APP_URL}/api/oauth/google/callback`
  );
