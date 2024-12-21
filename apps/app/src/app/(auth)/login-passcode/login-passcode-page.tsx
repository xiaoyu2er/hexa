'use client';

import { VerifyPasscode } from '@/components/auth/verify-passcode';
import {
  $loginPasscodeResendPasscode,
  $loginPasscodeVerifyPasscode,
} from '@hexa/server/api';
import { toast } from '@hexa/ui/sonner';
import { useState } from 'react';
import { useStep } from 'usehooks-ts';
import { LoginPasscode } from './login-passcode';

export function LoginPasscodePage() {
  const [email, setEmail] = useState('');
  const [passcodeId, setPasscodeId] = useState('');
  const [currentStep, { goToNextStep, reset }] = useStep(2);

  return (
    <div>
      {currentStep === 1 && (
        <LoginPasscode
          // @ts-ignore
          onSuccess={({ id, email }) => {
            setEmail(email);
            setPasscodeId(id);
            goToNextStep();
          }}
        />
      )}
      {currentStep === 2 && (
        <VerifyPasscode
          passcodeId={passcodeId}
          email={email}
          onVerify={(json) => {
            return $loginPasscodeVerifyPasscode({
              json,
            });
          }}
          onResend={(json) => {
            return $loginPasscodeResendPasscode({
              json,
            });
          }}
          onSuccess={() => {
            toast.success('Login successful');
          }}
          onCancel={reset}
        />
      )}
    </div>
  );
}
