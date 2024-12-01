'use client';

import { VerifyPasscode } from '@/components/auth/verify-passcode';
import { $signupResendPasscode, $signupVerifyPasscode } from '@/lib/api';
import { toast } from '@hexa/ui/sonner';
import { useRouter } from 'next/navigation';
import { type FC, useState } from 'react';
import { useStep } from 'usehooks-ts';
import { SignupEmailPassword } from './signup-email-password';
import { SignupUserInfo } from './signup-user-info';

export const SignupPage: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passcodeId, setPasscodeId] = useState('');
  const router = useRouter();
  const [currentStep, { goToNextStep, reset }] = useStep(3);

  return (
    <div>
      {currentStep === 1 && (
        <SignupEmailPassword
          email={email}
          onSuccess={({ email, password }) => {
            setEmail(email);
            setPassword(password);
            goToNextStep();
          }}
          onCancel={() => {
            router.push('/');
          }}
        />
      )}
      {currentStep === 2 && (
        <SignupUserInfo
          email={email}
          password={password}
          onSuccess={({ id }) => {
            setPasscodeId(id);
            goToNextStep();
          }}
        />
      )}
      {currentStep === 3 && (
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
