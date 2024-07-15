"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { OAuthSignup } from "./oauth-signup-form";
import { OAuthAccountModel } from "@/lib/db";

export interface SignupPageProps {
  oauthAccount: OAuthAccountModel;
}

export const OAuthSignupPage: FC<SignupPageProps> = ({ oauthAccount }) => {
  const router = useRouter();

  return (
    <OAuthSignup
      oauthAccount={oauthAccount}
      onSuccess={() => {
        console.log("Signup success");
      }}
      onCancel={() => {
        router.push("/");
      }}
    />
  );
};
