"use client";

import { FC, useState } from "react";
import { useStep } from "usehooks-ts";
import { ForgetPasswordCard } from "./forget-password-form";
import { ResetPasswordCard } from "./reset-password-form";
import { VerifyResetPasswordCodeCard } from "./verfiy-code-form";
import { useRouter } from "next/navigation";

export interface ResetPasswordProps {}

export const ResetPassword: FC<ResetPasswordProps> = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();
  const [currentStep, { goToNextStep, goToPrevStep, reset, setStep }] =
    useStep(3);

  const onCancel = () => {
    setToken("");
    reset();
  };
  return (
    <div>
      {currentStep === 1 && (
        <ForgetPasswordCard
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
          email={email}
          token={token}
          onSuccess={() => console.log("Reset success")}
          onCancel={onCancel}
        />
      )}
    </div>
  );
};
