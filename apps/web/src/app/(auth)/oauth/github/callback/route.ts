import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { github } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getAccountByGithubId } from "@/db/data-access/account";
import { GitHubEmail, GitHubUser } from "@/types";
import {
  createUserByGithubAccount,
  uploadUserProfile,
} from "@/db/use-cases/user";
import { setSession } from "@/lib/session";
import { waitUntil } from "@vercel/functions";
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

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
        { status: 400 }
      );
    }

    if (!primaryEmail.verified) {
      return NextResponse.json({ error: "Unverified email" }, { status: 400 });
    }

    const existingAccount = await getAccountByGithubId(githubUser.id);

    if (existingAccount) {
      await setSession(existingAccount.userId);
      waitUntil(
        uploadUserProfile(
          existingAccount.user.id,
          existingAccount.user.avatarUrl
        )
      );

      return new Response(null, {
        status: 302,
        headers: { Location: "/" },
      });
    }

    const user = await createUserByGithubAccount(githubUser);
    waitUntil(uploadUserProfile(user.id, user.avatarUrl));

    await setSession(user.id);
    return new Response(null, {
      status: 302,
      headers: { Location: "/" },
    });
  } catch (e) {
    console.error("/oauth/github/callback", e);
    if (e instanceof OAuth2RequestError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
