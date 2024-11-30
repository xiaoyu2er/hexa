import type { Context } from '@/server/route/route-types';
import { GitHub } from 'arctic';

export const getGitHub = (env: Context['Bindings']) =>
  new GitHub(env.OAUTH_GITHUB_CLIENT_ID, env.OAUTH_GITHUB_CLIENT_SECRET);
