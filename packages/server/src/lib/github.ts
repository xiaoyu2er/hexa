import type { Context } from '@hexa/server/route/route-types';
// @ts-ignore
import { GitHub } from 'arctic';

export const getGitHub = (_env: Context['Bindings']) =>
  new GitHub(
    process.env.OAUTH_GITHUB_CLIENT_ID ?? '',
    process.env.OAUTH_GITHUB_CLIENT_SECRET ?? '',
    null
  );
