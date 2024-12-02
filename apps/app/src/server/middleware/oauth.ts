import { IS_PRODUCTION } from '@/lib/env';
import { ApiError } from '@/lib/error/error';
import { invalidateUserSessions, setSession } from '@/lib/session';
import {
  createOauthAccount,
  getAccountByProviderUser,
  updateOauthAccount,
} from '@/server/store/oauth';
import { createOrg } from '@/server/store/org';
import { createProject, setUserDefaultProject } from '@/server/store/project';
import { createEmail, createUser, getEmail } from '@/server/store/user';
import { createMiddleware } from 'hono/factory';

import { generateProjectSlug } from '@/lib/slug';
import { setCookie } from 'hono/cookie';
import type { ProviderType } from '../schema/oauth';

export const afterOauthCallbackMiddleware = (provider: ProviderType) =>
  createMiddleware(async (c) => {
    const { db, user, providerUser } = c.var;

    if (provider !== 'GITHUB' && provider !== 'GOOGLE') {
      throw new ApiError('BAD_REQUEST', 'Invalid provider');
    }

    if (!providerUser) {
      throw new ApiError('BAD_REQUEST', 'Provider user not found');
    }

    if (user) {
      // existingAccount is not found, but we have a user, so we can bind the account to the user
      // we don't need the old account, we can just override it
      // If user is logged in, bind the account, even if it's already linked, update the account
      // it's possible that the user goes to /api/oauth/github or /api/oauth/google
      await createOauthAccount(db, user.id, provider, providerUser);
      return c.redirect('/');
    }

    // Find existing oauthAccount
    const existingAccount = await getAccountByProviderUser(
      db,
      provider,
      providerUser
    );

    if (existingAccount?.userId && existingAccount.user) {
      await setSession(existingAccount.userId);
      return c.redirect('/');
    }

    // If there is no user, create a new account, but don't set session, we need to redirect to /signup

    const account = await createOauthAccount(db, null, provider, providerUser);

    if (!account) {
      throw new ApiError('INTERNAL_SERVER_ERROR', 'Failed to create account');
    }

    // we pass the new account id to the signup page, so we can bind the account to the user later
    setCookie(c, 'oauth_account_id', account.id, {
      path: '/',
      secure: IS_PRODUCTION,
      httpOnly: true,
      maxAge: 60, // 1 minutes
      sameSite: 'lax',
    });

    return c.redirect('/oauth-signup');
  });

/**
 * Create a user from a tmp user
 * The logic is as follows:
 * 1. Create a user
 * 2. Create an email
 * 3. Update the oauth account
 * 4. Create an org
 * 5. Create a project
 * 6. Set the project as the default project for the user
 */
export const creatUserFromTmpUserMiddleware = createMiddleware(async (c) => {
  const { tmpUser, db } = c.var;

  if (!tmpUser) {
    throw new ApiError('BAD_REQUEST', 'tmp user not found');
  }

  if (!tmpUser.email) {
    throw new ApiError('BAD_REQUEST', 'Email is required');
  }

  const user = await createUser(db, {
    name: tmpUser.name,
  });

  if (!user) {
    throw new ApiError('BAD_REQUEST', 'Failed to create user');
  }

  // create email
  const existingEmail = await getEmail(db, tmpUser.email);
  if (existingEmail) {
    throw new ApiError('BAD_REQUEST', 'This email is taken by another account');
  }

  const email = await createEmail(db, {
    userId: user.id,
    email: tmpUser.email,
    verified: true,
    primary: true,
  });

  if (!email) {
    throw new ApiError('BAD_REQUEST', 'Failed to create email');
  }

  // update oauth account
  if (tmpUser.oauthAccountId) {
    const oauthAccount = await updateOauthAccount(db, tmpUser.oauthAccountId, {
      userId: user.id,
    });
    if (!oauthAccount) {
      throw new ApiError('BAD_REQUEST', 'Failed to update oauth account');
    }
  }

  // create org
  const org = await createOrg(db, {
    name: tmpUser.orgName || `${tmpUser.name}'s Org`,
    userId: user.id,
  });

  if (!org) {
    throw new ApiError('BAD_REQUEST', 'Failed to create org');
  }

  // create project
  const project = await createProject(db, {
    name: `${tmpUser.name}'s project`,
    slug: generateProjectSlug(),
    orgId: org.id,
  });

  const newUser = await setUserDefaultProject(db, {
    userId: user.id,
    projectId: project.id,
  });

  if (!newUser) {
    throw new ApiError(
      'INTERNAL_SERVER_ERROR',
      'Failed to set default project'
    );
  }

  await invalidateUserSessions(user.id);
  await setSession(user.id);
  return c.redirect(`/project/${project.slug}`);
});
