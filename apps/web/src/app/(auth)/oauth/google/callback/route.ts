import { google, validateRequest } from "@/lib/auth";
import {
  createGoogleAccount,
  getAccountByGoogleId,
} from "@/lib/db/data-access/account";
import { setSession } from "@/lib/session";
import type { GoogleUser } from "@/types";
import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookies().get("google_code_verifier")?.value ?? null;

  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !codeVerifier
  ) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

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
      return NextResponse.json({ error: "Unverified email" }, { status: 400 });
    }

    const { user } = await validateRequest();
    const existingAccount = await getAccountByGoogleId(googleUser.sub);

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

    if (user) {
      // If user is logged in, bind the account, even if it's already linked, update the account
      // it's possible that the user goes to /oauth/google
      await createGoogleAccount(user.id, googleUser);
      return new Response(null, {
        status: 302,
        headers: { Location: "/settings" },
      });
    }

    // If user is not logged in, create a new account, but don't set session, we need to redirect to /sign-up
    // We still need user to set a username
    const account = await createGoogleAccount(null, googleUser);
    if (!account) {
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 },
      );
    }

    console.log("createGoogleAccount", account);
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
    console.error("/oauth/google/callback", e);
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
