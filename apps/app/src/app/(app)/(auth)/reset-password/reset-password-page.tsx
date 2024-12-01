'use client';

import { VerifyPasscode } from '@/components/auth/verify-passcode';
import {
  $resetPasswordResendPasscode,
  $resetPasswordVerifyPasscode,
} from '@/lib/api';
import { toast } from '@hexa/ui/sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { type FC, useState } from 'react';
import { useStep } from 'usehooks-ts';
import { ForgetPassword } from './forget-password';
import { ResetPassword } from './reset-password';

export interface ResetPasswordProps {
  token?: string;
}

export const ResetPasswordPage: FC<ResetPasswordProps> = () => {
  const initToken = useSearchParams().get('token');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [passcodeId, setPasscodeId] = useState('');
  const [token, setToken] = useState('');
  const [currentStep, { goToNextStep, goToPrevStep, reset }] = useStep(3);

  const onCancel = () => {
    router.push('/');
  };

  if (initToken) {
    return (
      <ResetPassword
        token={initToken}
        onCancel={onCancel}
        onSuccess={() => {
          toast.success('Password reset successful');
        }}
      />
    );
  }

  return (
    <div>
      {currentStep === 1 && (
        <ForgetPassword
          email={email}
          onSuccess={(data) => {
            setEmail(data.email);
            setPasscodeId(data.id);
            goToNextStep();
          }}
          onCancel={onCancel}
        />
      )}
      {currentStep === 2 && (
        <VerifyPasscode
          passcodeId={passcodeId}
          email={email}
          onVerify={(json) => {
            return $resetPasswordVerifyPasscode({
              json,
            });
          }}
          onResend={(json) => {
            return $resetPasswordResendPasscode({
              json,
            });
          }}
          onSuccess={(data: unknown) => {
            goToNextStep();
            setToken((data as { token: string })?.token ?? '');
          }}
          onCancel={goToPrevStep}
        />
      )}
      {currentStep === 3 && (
        <ResetPassword
          token={token}
          onCancel={reset}
          onSuccess={() => {
            toast.success('Password reset successful');
          }}
        />
      )}
    </div>
  );
};
