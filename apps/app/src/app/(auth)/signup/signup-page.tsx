'use client';

import { VerifyPasscode } from '@/components/auth/verify-passcode';
import {
  $signupResendPasscode,
  $signupSendPasscode,
  $signupVerifyPasscode,
} from '@hexa/server/api';
import { toast } from '@hexa/ui/sonner';
import { useSearchParams } from 'next/navigation';
import { type FC, useState } from 'react';
import { useStep } from 'usehooks-ts';
import { SignupEmailPassword } from './signup-email-password';

export const SignupPage: FC = () => {
  const [email, setEmail] = useState<string | undefined>();
  const [passcodeId, setPasscodeId] = useState<string | undefined>();
  const [currentStep, { goToNextStep, reset }] = useStep(3);
  const next = useSearchParams().get('next') ?? undefined;

  return (
    <div>
      {currentStep === 1 && (
        <SignupEmailPassword
          email={email}
          onSignup={(json) => {
            return $signupSendPasscode({ json: { ...json, next } });
          }}
          onSuccess={({ id, email }) => {
            setPasscodeId(id);
            setEmail(email);
            goToNextStep();
          }}
        />
      )}
      {currentStep === 2 && (
        <VerifyPasscode
          passcodeId={passcodeId}
          email={email}
          onVerify={(json) => {
            return $signupVerifyPasscode({
              json: { ...json, next },
            });
          }}
          onResend={(json) => {
            return $signupResendPasscode({
              json: { ...json, next },
            });
          }}
          onSuccess={() => {
            toast.success('Sign up successful');
          }}
          onCancel={reset}
        />
      )}
    </div>
  );
};
