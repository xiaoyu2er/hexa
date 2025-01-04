import { ApiError } from '@hexa/lib';
import type { ProviderType } from '@hexa/server/schema/oauth';
import { setSession } from '@hexa/server/session';
import {
  createOauthAccount,
  getAccountByProviderUser,
  updateOauthAccount,
} from '@hexa/server/store/oauth';
import {} from '@hexa/server/store/project';
import { createEmail, createUser, getEmail } from '@hexa/server/store/user';
import type { ValidTarget } from '@hexa/server/types';
import { createMiddleware } from 'hono/factory';

export const afterOauthCallbackMiddleware = (provider: ProviderType) =>
  createMiddleware(async (c) => {
    const { db, user, providerUser, redirectUrl } = c.var;

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
      return c.redirect(redirectUrl);
    }

    // Find existing oauthAccount
    const existingAccount = await getAccountByProviderUser(
      db,
      provider,
      providerUser
    );

    // If the account is already linked to a user, set the session and redirect to home
    if (existingAccount?.userId && existingAccount.user) {
      await setSession(existingAccount.userId);
      return c.redirect(redirectUrl);
    }

    // If there is no user, create a new account, create a new user, and set the session
    const account = await createOauthAccount(db, null, provider, providerUser);
    if (!account) {
      throw new ApiError('INTERNAL_SERVER_ERROR', 'Failed to create account');
    }

    const newUser = await createUser(db, {});
    if (!newUser) {
      throw new ApiError('INTERNAL_SERVER_ERROR', 'Failed to create user');
    }

    // bind the account to the user
    await updateOauthAccount(db, account.id, { userId: newUser.id });

    // set the session
    await setSession(newUser.id);

    // we pass the new account id to the signup page, so we can bind the account to the user later
    // setCookie(c, 'oauth_account_id', account.id, {
    //   path: '/',
    //   secure: IS_PRODUCTION,
    //   httpOnly: true,
    //   maxAge: 60, // 1 minutes
    //   sameSite: 'lax',
    // });
    return c.redirect(redirectUrl);
  });

/**
 * Create a user from a tmp user
 * The logic is as follows:
 * 1. Create a user
 * 2. Create an email
 * 3. Update the oauth account
 */
export const creatUserFromTmpUserMiddleware = ({
  nextValidTarget,
}: {
  nextValidTarget: ValidTarget;
}) =>
  createMiddleware(async (c) => {
    const { tmpUser, db } = c.var;
    // @ts-ignore
    const { next } = c.req.valid(nextValidTarget) ?? {};
    const redirectUrl = next ?? '/';
    if (!tmpUser) {
      throw new ApiError('BAD_REQUEST', 'tmp user not found');
    }

    if (!tmpUser.email) {
      throw new ApiError('BAD_REQUEST', 'Email is required');
    }

    const user = await createUser(db, {
      password: tmpUser.password,
    });

    if (!user) {
      throw new ApiError('BAD_REQUEST', 'Failed to create user');
    }

    // create email
    const existingEmail = await getEmail(db, tmpUser.email);
    if (existingEmail) {
      throw new ApiError(
        'BAD_REQUEST',
        'This email is taken by another account'
      );
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
      const oauthAccount = await updateOauthAccount(
        db,
        tmpUser.oauthAccountId,
        {
          userId: user.id,
        }
      );
      if (!oauthAccount) {
        throw new ApiError('BAD_REQUEST', 'Failed to update oauth account');
      }
    }

    await setSession(user.id);
    return c.redirect(redirectUrl);
  });
