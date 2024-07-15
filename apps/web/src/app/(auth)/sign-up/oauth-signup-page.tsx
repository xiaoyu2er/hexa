"use client";

import type { OAuthAccountModel } from "@/lib/db";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { OAuthSignup } from "./oauth-signup-form";

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
