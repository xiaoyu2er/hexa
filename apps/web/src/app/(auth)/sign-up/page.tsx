import { getDB } from "@/server/db";
import { getOAuthAccount } from "@/server/db/data-access/account";
import { cookies } from "next/headers";
import { OAuthSignupPage } from "./oauth-signup-page";
import { SignupPage } from "./signup-page";

export const metadata = {
  title: "Sign Up",
  description: "Signup Page",
};

export default async function () {
  // If we have an OAuth account ID in the cookies, we are in the OAuth flow
  const oauthAccountId = await cookies().get("oauth_account_id")?.value;
  if (oauthAccountId) {
    const db = await getDB();
    const account = await getOAuthAccount(db, oauthAccountId);
    if (account) {
      return <OAuthSignupPage oauthAccount={account} />;
    }
  }

  // Otherwise, we are in the regular signup flow
  return <SignupPage />;
}
