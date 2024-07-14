"use client";

import { FC, useState } from "react";
import { useStep } from "usehooks-ts";
import { Signup } from "./signup-form";
import { VerifyEmail } from "@/components/auth/verify-email-form";
import { useRouter } from "next/navigation";
import { verifyEmailByCodeAction } from "@/lib/actions/user";
import { OAuthSignup } from "./oauth-signup-form";

export interface SignupPageProps {
  oauthAccountId?: string;
}

export const SignupPage: FC<SignupPageProps> = ({ oauthAccountId }) => {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [currentStep, { goToNextStep, reset }] = useStep(2);

  if (oauthAccountId) {
    return (
      <OAuthSignup
        oauthAccountId={oauthAccountId}
        onSuccess={() => {
          console.log("Signup success");
        }}
        onCancel={() => {
          router.push("/");
        }}
      />
    );
  }

  const onCancel = () => {
    reset();
  };
  return (
    <div>
      {currentStep === 1 && (
        <Signup
          email={email}
          onSuccess={({ email }) => {
            setEmail(email);
            goToNextStep();
          }}
          onCancel={() => {
            router.push("/");
          }}
        />
      )}
      {currentStep === 2 && (
        <VerifyEmail
          email={email}
          onVerify={verifyEmailByCodeAction}
          onSuccess={() => {
            console.log("Signup success");
          }}
          onCancel={onCancel}
        />
      )}
    </div>
  );
};
