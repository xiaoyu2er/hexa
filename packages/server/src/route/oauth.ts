import {
  afterOauthCallbackMiddleware,
  creatUserFromTmpUserMiddleware,
} from '@hexa/server/middleware/oauth';
import {
  type GitHubUser,
  type GoogleUser,
  OauthSignupSchema,
} from '@hexa/server/schema/oauth';
import { getOauthAccount } from '@hexa/server/store/oauth';

import { APP_URL, IS_PRODUCTION } from '@hexa/env';
import { ApiError } from '@hexa/lib';
import { getGitHub, getGoogle } from '@hexa/server/lib';
import {
  getPasscodeByTokenMiddleware,
  getPasscodeMiddleware,
  resendPasscodeMiddleware,
} from '@hexa/server/middleware/passcode';
import { getSessionMiddleware } from '@hexa/server/middleware/session';
import { turnstileMiddleware } from '@hexa/server/middleware/turnstile';
import {
  ResendPasscodeSchema,
  VerifyPassTokenSchema,
  VerifyPasscodeSchema,
} from '@hexa/server/schema/passcode';
import { addPasscodeAndSendEmail } from '@hexa/server/service/passcode';
import { addTmpUser } from '@hexa/server/store/tmp-user';
import { getEmail } from '@hexa/server/store/user';
import type { Context } from '@hexa/server/types';
// @ts-ignore
import { zValidator } from '@hono/zod-validator';
// @ts-ignore
import { generateCodeVerifier, generateState } from 'arctic';
import { Hono } from 'hono';
import { deleteCookie, setCookie } from 'hono/cookie';
const oauth = new Hono<Context>()
  // ====== Github Oauth ======
  .get('/oauth/github', async (c) => {
    const state = generateState();
    const next = c.req.query('next');
    const redirectUrl = next ?? '/';
    const url = await getGitHub().createAuthorizationURL(state, ['user:email']);

    setCookie(c, 'github_oauth_state', state, {
      path: '/',
      secure: IS_PRODUCTION,
      httpOnly: true,
      maxAge: 60 * 10, // 10 minutes
      sameSite: 'lax',
    });

    setCookie(c, 'github_redirect_url', redirectUrl, {
      path: '/',
      secure: IS_PRODUCTION,
      httpOnly: true,
      maxAge: 60 * 10, // 10 minutes
      sameSite: 'lax',
    });

    return c.redirect(url, 302);
  })
  //  Github Oauth callback
  .get(
    '/oauth/github/callback',
    getSessionMiddleware,
    async (c, next) => {
      const { code, state } = c.req.query();
      const redirectUrl = deleteCookie(c, 'github_redirect_url');
      const cookieState = deleteCookie(c, 'github_oauth_state') ?? null;
      if (!code || !state || !cookieState || state !== cookieState) {
        throw new ApiError('FORBIDDEN', 'Invalid state');
      }

      const tokens = await getGitHub().validateAuthorizationCode(code);

      const githubUserResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${tokens.accessToken()}`,
          'User-Agent': 'hexa.im',
        },
      });

      if (githubUserResponse.status !== 200) {
        throw new Error(
          `status: ${githubUserResponse.status} ${githubUserResponse.statusText}`
        );
      }
      const githubUser: GitHubUser = await githubUserResponse.json();
      // const emailsResponse = await fetch('https://api.github.com/user/emails', {
      //   headers: {
      //     Authorization: `Bearer ${tokens.accessToken()}`,
      //     'User-Agent': 'hexa.im',
      //   },
      // });
      // const emails: GitHubEmail[] = await emailsResponse.json();
      // const isEmailVerified = emails.some(
      //   (email) => email.verified && email.email === githubUser.email
      // );
      // githubUser.email_verified = isEmailVerified;
      c.set('providerUser', githubUser);
      c.set('redirectUrl', redirectUrl ?? '/');
      return next();
    },
    afterOauthCallbackMiddleware('GITHUB')
  )
  // ====== Google Oauth ======
  .get('/oauth/google', async (c) => {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const next = c.req.query('next');
    const redirectUrl = next ?? '/';
    const url = await getGoogle().createAuthorizationURL(state, codeVerifier, [
      'profile',
      'email',
    ]);

    setCookie(c, 'google_oauth_state', state, {
      secure: true,
      path: '/',
      httpOnly: true,
      maxAge: 60 * 10, // 10 minutes
    });

    setCookie(c, 'google_code_verifier', codeVerifier, {
      secure: true,
      path: '/',
      httpOnly: true,
      maxAge: 60 * 10, // 10 minutes
    });

    setCookie(c, 'google_redirect_url', redirectUrl, {
      secure: true,
      path: '/',
      httpOnly: true,
      maxAge: 60 * 10, // 10 minutes
    });

    return c.redirect(url);
  })
  // Google Oauth callback
  .get(
    '/oauth/google/callback',
    getSessionMiddleware,
    async (c, next) => {
      const { code, state } = c.req.query();
      const storedState = deleteCookie(c, 'google_oauth_state');
      const codeVerifier = deleteCookie(c, 'google_code_verifier');
      const redirectUrl = deleteCookie(c, 'google_redirect_url');

      if (
        !code ||
        !state ||
        !storedState ||
        state !== storedState ||
        !codeVerifier
      ) {
        return c.json({ error: 'Invalid state' }, 400);
      }

      const tokens = await getGoogle().validateAuthorizationCode(
        code,
        codeVerifier
      );
      const response = await fetch(
        'https://openidconnect.googleapis.com/v1/userinfo',
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken()}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`status: ${response.status} ${response.statusText}`);
      }

      const googleUser: GoogleUser = await response.json();
      c.set('providerUser', googleUser);
      c.set('redirectUrl', redirectUrl ?? '/');
      return next();
    },
    afterOauthCallbackMiddleware('GOOGLE')
  )
  // ====== Oauth signup ======
  // Oauth signup
  .post(
    '/oauth-signup',
    zValidator('json', OauthSignupSchema),
    turnstileMiddleware(),
    async (c, next) => {
      const db = c.get('db');
      const { email, oauthAccountId } = c.req.valid('json');

      // Check if oauth account exists
      const oauthAcccount = await getOauthAccount(db, oauthAccountId);
      if (!oauthAcccount) {
        throw new ApiError('NOT_FOUND', 'Oauth account not found');
      }

      if (oauthAcccount.userId) {
        // Check if oauth account is already linked to a user
        throw new ApiError(
          'CONFLICT',
          'Oauth account already linked to a user'
        );
      }

      const emailItem = await getEmail(db, email);

      if (emailItem?.verified) {
        throw new ApiError(
          'CONFLICT',
          'This email is taken by another account'
        );
      }

      // If oauth provider user's email is verified, we can create a user directly
      if (oauthAcccount.emailVerified) {
        const tmpUser = {
          id: 'fake-id',
          oauthAccountId,
          email,
          password: null,
        };
        c.set('tmpUser', tmpUser);
        return creatUserFromTmpUserMiddleware({
          nextValidTarget: 'json',
        })(c, next);
      }

      // If Oauth provider user's email is not verified, we need to create a pending registration
      // and send a verification email to the user's email address
      const tmpUser = await addTmpUser(db, {
        email,
        password: null,
        oauthAccountId,
      });

      if (!tmpUser) {
        throw new ApiError('BAD_REQUEST', 'Failed to create tmp user');
      }
      // Send email with passcode
      const data = await addPasscodeAndSendEmail(db, {
        tmpUserId: tmpUser.id,
        email,
        type: 'OAUTH_SIGNUP',
        verifyUrlPrefex: `${APP_URL}/api/oauth-signup/verify-token/`,
      });

      return c.json(data);
    }
  )

  // Oauth signup resend passcode
  .post(
    '/oauth-signup/resend-passcode',
    zValidator('json', ResendPasscodeSchema),
    turnstileMiddleware(),
    resendPasscodeMiddleware(`${APP_URL}/api/oauth-signup/verify-token/`)
  )
  // Oauth signup verify passcode
  .post(
    '/oauth-signup/verify-passcode',
    zValidator('json', VerifyPasscodeSchema),
    getPasscodeMiddleware('json', 'OAUTH_SIGNUP'),
    creatUserFromTmpUserMiddleware({
      nextValidTarget: 'json',
    })
  )
  // Oauth signup verify token
  .get(
    '/oauth-signup/verify-token/:token',
    zValidator('param', VerifyPassTokenSchema),
    getPasscodeByTokenMiddleware({
      tokenValidTarget: 'param',
      passcodeType: 'OAUTH_SIGNUP',
    }),
    creatUserFromTmpUserMiddleware({
      nextValidTarget: 'query',
    })
  );

export default oauth;
