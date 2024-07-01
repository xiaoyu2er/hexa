import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { google } from "@/lib/auth";
import { setSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { GoogleUser } from "@/types";
import { getAccountByGoogleId } from "@/db/data-access/account";
import {
  createUserByGoogleAccount,
  uploadUserProfile,
} from "@/db/use-cases/user";
import { waitUntil } from "@vercel/functions";

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

    const existingAccount = await getAccountByGoogleId(googleUser.sub);
    if (existingAccount) {
      await setSession(existingAccount.userId);
      if (existingAccount) {
        await setSession(existingAccount.userId);
        return new Response(null, {
          status: 302,
          headers: {
            Location: "/",
          },
        });
      }
    }

    const user = await createUserByGoogleAccount(googleUser);
    waitUntil(uploadUserProfile(user.id, user.avatarUrl));
    await setSession(user.id);
    return new Response(null, {
      status: 302,
      headers: { Location: "/" },
    });
  } catch (e) {
    console.error("/oauth/google/callback", e);
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
