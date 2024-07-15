"use client";

import { VerifyCode } from "@/components/auth/verify-code-form";
import {
  resendResetPasswordCodeAction,
  verifyResetPasswordCodeAction,
} from "@/lib/actions/reset-password";
import { useRouter, useSearchParams } from "next/navigation";
import { type FC, useState } from "react";
import { useStep } from "usehooks-ts";
import { ForgetPasswordCard } from "./forget-password-form";
import { ResetPasswordCard } from "./reset-password-form";

export interface ResetPasswordProps {
  token?: string;
}

export const ResetPasswordPage: FC<ResetPasswordProps> = () => {
  const params = useSearchParams();
  const initToken = params.get("token");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [currentStep, { goToNextStep, goToPrevStep, reset }] = useStep(3);

  const onCancel = () => {
    router.push("/");
  };

  if (initToken) {
    return (
      <ResetPasswordCard
        token={initToken}
        onSuccess={() => console.log("Reset success")}
        onCancel={onCancel}
      />
    );
  }

  return (
    <div>
      {currentStep === 1 && (
        <ForgetPasswordCard
          email={email}
          onSuccess={({ email }) => {
            setEmail(email);
            goToNextStep();
          }}
          onCancel={onCancel}
        />
      )}
      {currentStep === 2 && (
        <VerifyCode
          email={email}
          onVerify={verifyResetPasswordCodeAction}
          onResend={resendResetPasswordCodeAction}
          onSuccess={({ token }) => {
            goToNextStep();
            setToken(token);
          }}
          onCancel={goToPrevStep}
        />
      )}
      {currentStep === 3 && (
        <ResetPasswordCard
          token={token}
          onSuccess={() => console.log("Reset success")}
          onCancel={reset}
        />
      )}
    </div>
  );
};
