"use client";

import { deleteCookie } from "@/lib/cookie";
import type { OAuthAccountModel } from "@/server/db";
import { useRouter } from "next/navigation";
import { type FC, useEffect } from "react";
import { OAuthSignup } from "./oauth-signup-form";

export interface SignupPageProps {
  oauthAccount: OAuthAccountModel;
}

export const OAuthSignupPage: FC<SignupPageProps> = ({ oauthAccount }) => {
  const router = useRouter();
  useEffect(() => {
    deleteCookie("oauth_account_id");
  }, []);

  return (
    <OAuthSignup
      oauthAccount={oauthAccount}
      onSuccess={() => {
        router.push("/settings");
      }}
      onCancel={() => {
        router.push("/");
      }}
    />
  );
};
