// @ts-ignore
import { GitHub } from 'arctic';

export const getGitHub = () =>
  new GitHub(
    process.env.OAUTH_GITHUB_CLIENT_ID ?? '',
    process.env.OAUTH_GITHUB_CLIENT_SECRET ?? '',
    null
  );
