"use client";

import { VerifyCode } from "@/components/auth/verify-code-form";
import { LoginPassword } from "./login-password-form";
import { useState } from "react";
import { useStep } from "usehooks-ts";
import { LoginPasscode } from "./login-passcode-form";
import {
  loginByCodeAction,
  resendLoginPasscodeAction,
} from "@/lib/actions/login";

export function LoginPage() {
  const [loginType, setLoginType] = useState<"password" | "passcode">(
    "password",
  );
  const [email, setEmail] = useState("");
  const [currentStep, { goToNextStep, reset }] = useStep(2);

  if (loginType === "password") {
    return <LoginPassword onPasscode={() => setLoginType("passcode")} />;
  }

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
          onVerify={loginByCodeAction}
          onResend={resendLoginPasscodeAction}
          onSuccess={() => {
            console.log("Signup success");
          }}
          onCancel={reset}
        />
      )}
    </div>
  );
}
