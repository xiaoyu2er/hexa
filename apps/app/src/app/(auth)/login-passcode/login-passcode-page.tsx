'use client';

import { VerifyPasscode } from '@/components/auth/verify-passcode';
import {
  $loginPasscodeResendPasscode,
  $loginPasscodeSendPasscode,
  $loginPasscodeVerifyPasscode,
} from '@hexa/server/api';
import { toast } from '@hexa/ui/sonner';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useStep } from 'usehooks-ts';
import { LoginPasscode } from './login-passcode';

export function LoginPasscodePage() {
  const [email, setEmail] = useState('');
  const [passcodeId, setPasscodeId] = useState('');
  const [currentStep, { goToNextStep, reset }] = useStep(2);
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? undefined;
  return (
    <div>
      {currentStep === 1 && (
        <LoginPasscode
          onSendPasscode={(json) => {
            return $loginPasscodeSendPasscode({
              json: {
                ...json,
                next,
              },
            });
          }}
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
              json: {
                ...json,
                next,
              },
            });
          }}
          onResend={(json) => {
            return $loginPasscodeResendPasscode({
              json: {
                ...json,
                next,
              },
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
