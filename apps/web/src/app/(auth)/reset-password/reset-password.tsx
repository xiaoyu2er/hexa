"use client";

import { FC, useState } from "react";
import { useStep } from "usehooks-ts";
import { ForgetPasswordCard } from "./forget-password-form";
import { ResetPasswordCard } from "./reset-password-form";
import { VerifyResetPasswordCodeCard } from "./verfiy-code-form";
import { useRouter, useSearchParams } from "next/navigation";

export interface ResetPasswordProps {
  token?: string;
}

export const ResetPassword: FC<ResetPasswordProps> = () => {
  const params = useSearchParams();
  const initToken = params.get("token");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [currentStep, { goToNextStep }] = useStep(3);

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
        <VerifyResetPasswordCodeCard
          email={email}
          onSuccess={({ token }) => {
            goToNextStep();
            setToken(token);
          }}
          onCancel={onCancel}
        />
      )}
      {currentStep === 3 && (
        <ResetPasswordCard
          token={token}
          onSuccess={() => console.log("Reset success")}
          onCancel={onCancel}
        />
      )}
    </div>
  );
};
