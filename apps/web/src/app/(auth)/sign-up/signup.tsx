"use client";

import { FC, useState } from "react";
import { useStep } from "usehooks-ts";
import { Signup } from "./signup-form";
import { VerifyEmail } from "./verify-email-form";
import { useRouter } from "next/navigation";

export interface SignupPageProps {}

export const SignupPage: FC<SignupPageProps> = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [currentStep, { goToNextStep, reset }] = useStep(2);

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
          onSuccess={() => {
            console.log("Signup success");
            // router.push("/dash");
          }}
          onCancel={onCancel}
        />
      )}
    </div>
  );
};
