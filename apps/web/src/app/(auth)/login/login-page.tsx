"use client";

import { VerifyCode } from "@/components/auth/verify-code-form";
import { client } from "@/lib/queries";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStep } from "usehooks-ts";
import { LoginPasscode } from "./login-passcode-form";
import { LoginPassword } from "./login-password-form";

export function LoginPage() {
  const [loginType, setLoginType] = useState<"password" | "passcode">(
    "password",
  );
  const [email, setEmail] = useState("");
  const [currentStep, { goToNextStep, reset }] = useStep(2);
  const router = useRouter();
  const verifyCode = client["verify-login-passcode"].$post;
  const resendCode = client["resend-passcode"].$post;

  if (loginType === "password") {
    return <LoginPassword onPasscode={() => setLoginType("passcode")} />;
  }

  if (loginType === "passcode") {
    return (
      <div>
        {currentStep === 1 && (
          <LoginPasscode
            onPassword={() => {
              setLoginType("password");
            }}
            onSuccess={({ email }) => {
              setEmail(email);
              goToNextStep();
            }}
          />
        )}
        {currentStep === 2 && (
          <VerifyCode
            email={email}
            onVerify={verifyCode}
            onResend={resendCode}
            onSuccess={() => {
              router.push("/settings");
            }}
            onCancel={reset}
          />
        )}
      </div>
    );
  }

  return null;
}
