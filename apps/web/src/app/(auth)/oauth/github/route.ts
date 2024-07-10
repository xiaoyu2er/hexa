import { github } from "@/lib/auth";
import { generateState } from "arctic";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const state = generateState();
  const url = await github.createAuthorizationURL(state, {
    scopes: ["user:email"],
  });

  cookies().set("github_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  // const url = await getGithubAuthUrl();
  // console.log(url);
  return NextResponse.redirect(url);
}
