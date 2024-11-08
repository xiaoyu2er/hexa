import { github, validateRequest } from "@/lib/auth";
import { setSession } from "@/lib/session";
import {
  createGithubAccount,
  getAccountByGithubId,
} from "@/server/data-access/account";
import { getDB } from "@/server/db";
import type { GitHubEmail, GitHubUser } from "@/types";
import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  const db = await getDB();
  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();

    console.log(githubUser);

    const emailsResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const emails: GitHubEmail[] = await emailsResponse.json();

    const primaryEmail = emails.find((email) => email.primary) ?? null;
    if (!primaryEmail) {
      return NextResponse.json(
        { error: "No primary email address" },
        { status: 400 },
      );
    }

    if (!primaryEmail.verified) {
      return NextResponse.json({ error: "Unverified email" }, { status: 400 });
    }

    const { user } = await validateRequest();
    // Find existing oauthAccount
    const db = await getDB();
    const existingAccount = await getAccountByGithubId(db, githubUser.id);

    if (existingAccount) {
      // If account is already linked to a user, set session and redirect to settings
      if (existingAccount.userId) {
        await setSession(existingAccount.userId);
        return new Response(null, {
          status: 302,
          headers: { Location: "/settings" },
        });
      }
    }
    // we don't need the old account, we can just override it
    if (user) {
      // If user is logged in, bind the account, even if it's already linked, update the account
      // it's possible that the user goes to /oauth/github
      await createGithubAccount(db, user.id, githubUser);
      return new Response(null, {
        status: 302,
        headers: { Location: "/settings" },
      });
    }

    // If user is not logged in, create a new account, but don't set session, we need to redirect to /sign-up
    // We still need user to set a username
    const account = await createGithubAccount(db, null, githubUser);
    if (!account) {
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 },
      );
    }
    // we pass the new account id to the sign-up page, so we can bind the account to the user later
    cookies().set("oauth_account_id", account.id, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      // 1 minutes
      maxAge: 1 * 10,
      sameSite: "lax",
    });

    return new Response(null, {
      status: 302,
      headers: { Location: "/sign-up" },
    });
  } catch (e) {
    console.error("/oauth/github/callback", e);
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
