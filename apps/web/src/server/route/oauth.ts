import { validateRequest } from "@/lib/auth";
import { ApiError } from "@/lib/error/error";
import { setSession } from "@/lib/session";
import {
  createGoogleAccount,
  getAccountByGoogleId,
} from "@/server/data-access/account";
import type { Context } from "@/server/types";
import type { GoogleUser } from "@/types";
import { GitHub, Google, generateState } from "arctic";
import { generateCodeVerifier } from "arctic";
import { OAuth2RequestError } from "arctic";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";

import { IS_PRODUCTION } from "@/lib/env";
import {
  createGithubAccount,
  getAccountByGithubId,
} from "@/server/data-access/account";
import type { GitHubEmail, GitHubUser } from "@/types";

const oauth = new Hono<Context>()
  // Github OAuth
  .get("/oauth/github", async (c) => {
    const state = generateState();
    const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = c.env;
    const github = new GitHub(
      GITHUB_CLIENT_ID ?? "",
      GITHUB_CLIENT_SECRET ?? "",
    );

    const url = await github.createAuthorizationURL(state, {
      scopes: ["user:email"],
    });

    setCookie(c, "github_oauth_state", state, {
      path: "/",
      secure: IS_PRODUCTION,
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    });

    return c.redirect(url, 302);
  })
  //  Github OAuth callback
  .get("/oauth/github/callback", async (c) => {
    const db = c.get("db");
    const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = c.env;
    const { code, state } = c.req.query();
    const cookieState = getCookie(c, "github_oauth_state") ?? null;
    console.log({
      cookieState,
      state,
    });
    if (!code || !state || !cookieState || state !== cookieState) {
      throw new ApiError("FORBIDDEN", "Invalid state");
    }
    console.log({
      code,
      state,
      cookieState,
    });
    const github = new GitHub(
      GITHUB_CLIENT_ID ?? "",
      GITHUB_CLIENT_SECRET ?? "",
    );
    try {
      const tokens = await github.validateAuthorizationCode(code);
      console.log({ tokens, accessToken: tokens.accessToken });
      const githubUserResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
      const githubUser: GitHubUser = await githubUserResponse.json();
      console.log({ githubUser });
      const emailsResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
      const emails: GitHubEmail[] = await emailsResponse.json();

      const primaryEmail = emails.find((email) => email.primary) ?? null;
      if (!primaryEmail) {
        throw new ApiError("FORBIDDEN", "No primary email address");
      }

      if (!primaryEmail.verified) {
        throw new ApiError("FORBIDDEN", "Unverified email");
      }

      const { user } = await validateRequest();
      // Find existing oauthAccount
      const existingAccount = await getAccountByGithubId(db, githubUser.id);

      if (existingAccount) {
        // If account is already linked to a user, set session and redirect to settings
        if (existingAccount.userId) {
          await setSession(existingAccount.userId);
          return c.redirect("/settings", 302);
        }
      }
      // we don't need the old account, we can just override it
      if (user) {
        // If user is logged in, bind the account, even if it's already linked, update the account
        // it's possible that the user goes to /api/oauth/github
        await createGithubAccount(db, user.id, githubUser);
        return c.redirect("/settings", 302);
      }

      // If user is not logged in, create a new account, but don't set session, we need to redirect to /sign-up
      // We still need user to set a username
      const account = await createGithubAccount(db, null, githubUser);
      if (!account) {
        throw new ApiError("INTERNAL_SERVER_ERROR", "Failed to create account");
      }
      // we pass the new account id to the sign-up page, so we can bind the account to the user later
      setCookie(c, "oauth_account_id", account.id, {
        path: "/",
        secure: IS_PRODUCTION,
        httpOnly: true,
        maxAge: 60, // 1 minutes
        sameSite: "lax",
      });

      return c.redirect("/sign-up");
    } catch (e) {
      console.error("/oauth/github/callback", e);
      // the specific error message depends on the provider
      if (e instanceof OAuth2RequestError) {
        throw new ApiError("BAD_REQUEST", e.message);
      }
      throw new ApiError("INTERNAL_SERVER_ERROR", "Internal server error");
    }
  })
  .get("/oauth/google", async (c) => {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = c.env;
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const publicUrl = new URL(c.req.url).origin;

    const google = new Google(
      GOOGLE_CLIENT_ID ?? "",
      GOOGLE_CLIENT_SECRET ?? "",
      `${publicUrl}/api/oauth/google/callback`,
    );
    const url = await google.createAuthorizationURL(state, codeVerifier, {
      scopes: ["profile", "email"],
    });

    setCookie(c, "google_oauth_state", state, {
      secure: true,
      path: "/",
      httpOnly: true,
      maxAge: 60 * 10, // 10 minutes
    });

    setCookie(c, "google_code_verifier", codeVerifier, {
      secure: true,
      path: "/",
      httpOnly: true,
      maxAge: 60 * 10, // 10 minutes
    });

    return c.redirect(url);
  })
  // Google OAuth callback
  .get("/oauth/google/callback", async (c) => {
    const db = c.get("db");
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = c.env;
    const { code, state } = c.req.query();
    const publickUrl = new URL(c.req.url).origin;
    const storedState = getCookie(c, "google_oauth_state");
    const codeVerifier = getCookie(c, "google_code_verifier");

    if (
      !code ||
      !state ||
      !storedState ||
      state !== storedState ||
      !codeVerifier
    ) {
      return c.json({ error: "Invalid state" }, 400);
    }

    const google = new Google(
      GOOGLE_CLIENT_ID ?? "",
      GOOGLE_CLIENT_SECRET ?? "",
      `${publickUrl}/api/oauth/google/callback`,
    );

    try {
      const tokens = await google.validateAuthorizationCode(code, codeVerifier);
      const response = await fetch(
        "https://openidconnect.googleapis.com/v1/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        },
      );
      const googleUser: GoogleUser = await response.json();

      if (!googleUser.email_verified) {
        return c.json({ error: "Unverified email" }, 400);
      }

      const { user } = await validateRequest();
      const existingAccount = await getAccountByGoogleId(db, googleUser.sub);

      if (existingAccount) {
        // If account is already linked to a user, set session and redirect to settings
        if (existingAccount.userId) {
          await setSession(existingAccount.userId);
          return c.redirect("/settings");
        }
      }

      if (user) {
        // If user is logged in, bind the account, even if it's already linked, update the account
        // it's possible that the user goes to /api/oauth/google
        await createGoogleAccount(db, user.id, googleUser);
        return c.redirect("/settings", 302);
      }

      // If user is not logged in, create a new account, but don't set session, we need to redirect to /sign-up
      // We still need user to set a username
      const account = await createGoogleAccount(db, null, googleUser);
      if (!account) {
        throw new ApiError(
          "INTERNAL_SERVER_ERROR",
          "Failed to create Google account",
        );
      }

      setCookie(c, "oauth_account_id", account.id, {
        path: "/",
        secure: IS_PRODUCTION,
        httpOnly: true,
        maxAge: 60, // 1 minutes
        sameSite: "lax",
      });

      return c.redirect("/sign-up");
    } catch (e) {
      console.error("/oauth/google/callback", e);
      // the specific error message depends on the provider
      if (e instanceof OAuth2RequestError) {
        throw new ApiError("BAD_REQUEST", e.message);
      }
      throw new ApiError("INTERNAL_SERVER_ERROR", "Internal server error");
    }
  });
export default oauth;
