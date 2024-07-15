"use client";

import { FC, useState } from "react";
import { useStep } from "usehooks-ts";
import { Signup } from "./signup-form";
import { VerifyCode } from "@/components/auth/verify-code-form";
import { useRouter } from "next/navigation";
import { verifyEmailByCodeAction } from "@/lib/actions/user";
import { resendVerifyEmailAction } from "@/lib/actions/sign-up";

export interface SignupPageProps {}

export const SignupPage: FC<SignupPageProps> = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [currentStep, { goToNextStep, reset }] = useStep(2);

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
        <VerifyCode
          email={email}
          onVerify={verifyEmailByCodeAction}
          onResend={resendVerifyEmailAction}
          onSuccess={() => {
            console.log("Signup success");
          }}
          onCancel={reset}
        />
      )}
    </div>
  );
};
