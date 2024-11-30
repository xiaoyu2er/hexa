import { APP_URL } from '@/lib/env';
import type { Context } from '@/server/route/route-types';
import { Google } from 'arctic';

export const getGoogle = (env: Context['Bindings']) =>
  new Google(
    env.OAUTH_GOOGLE_CLIENT_ID,
    env.OAUTH_GOOGLE_CLIENT_SECRET,
    `${APP_URL}/api/oauth/google/callback`
  );
