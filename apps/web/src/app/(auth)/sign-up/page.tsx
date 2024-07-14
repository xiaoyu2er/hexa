import { cookies } from "next/headers";
import { SignupPage } from "./signup";

export const metadata = {
  title: "Sign Up",
  description: "Signup Page",
};

export default async function () {
  const oauthAccountId = await cookies().get("oauth_account_id")?.value;
  console.log("sign-up", oauthAccountId);
  return (
    <div className="max-w-full md:w-96">
      <SignupPage oauthAccountId={oauthAccountId} />
    </div>
  );
}
