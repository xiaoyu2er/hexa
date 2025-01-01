'use client';

import { VerifyPasscode } from '@/components/auth/verify-passcode';
import { $signupResendPasscode, $signupVerifyPasscode } from '@hexa/server/api';
import { toast } from '@hexa/ui/sonner';
import { useRouter } from 'next/navigation';
import { type FC, useState } from 'react';
import { useStep } from 'usehooks-ts';
import { SignupEmailPassword } from './signup-email-password';

export const SignupPage: FC = () => {
  const [email, setEmail] = useState<string | undefined>();
  const [passcodeId, setPasscodeId] = useState<string | undefined>();
  const router = useRouter();
  const [currentStep, { goToNextStep, reset }] = useStep(3);

  return (
    <div>
      {currentStep === 1 && (
        <SignupEmailPassword
          email={email}
          onSuccess={({ id, email }) => {
            setPasscodeId(id);
            setEmail(email);
            goToNextStep();
          }}
          onCancel={() => {
            router.push('/');
          }}
        />
      )}
      {currentStep === 2 && (
        <VerifyPasscode
          passcodeId={passcodeId}
          email={email}
          onVerify={(json) => {
            return $signupVerifyPasscode({
              json,
            });
          }}
          onResend={(json) => {
            return $signupResendPasscode({
              json,
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
