'use client';

import { VerifyPasscode } from '@/components/auth/verify-passcode-form';
import { useRouter } from 'next/navigation';
import { type FC, useState } from 'react';
import { useStep } from 'usehooks-ts';
import { Signup } from './signup-form';

export const SignupPage: FC = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const [currentStep, { goToNextStep, reset }] = useStep(2);

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
            router.push('/');
          }}
        />
      )}
      {currentStep === 2 && (
        <VerifyPasscode
          email={email}
          type="VERIFY_EMAIL"
          onSuccess={() => {
            router.push('/settings');
          }}
          onCancel={reset}
        />
      )}
    </div>
  );
};
