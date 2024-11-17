'use client';

import { VerifyPasscode } from '@/components/auth/verify-passcode-form';
import { toast } from '@hexa/ui/sonner';
import { useRouter } from 'next/navigation';
import { type FC, useState } from 'react';
import { useStep } from 'usehooks-ts';
import { Signup } from './signup-form';

export const SignupPage: FC = () => {
  const [email, setEmail] = useState('');
  const [tmpUserId, setTmpUserId] = useState<string | null | undefined>(null);
  const router = useRouter();
  const [currentStep, { goToNextStep, reset }] = useStep(2);

  return (
    <div>
      {currentStep === 1 && (
        <Signup
          email={email}
          onSuccess={({ email, tmpUserId }) => {
            setEmail(email);
            setTmpUserId(tmpUserId);
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
          tmpUserId={tmpUserId}
          type="SIGN_UP"
          onSuccess={() => {
            toast.success('Sign up successful');
          }}
          onCancel={reset}
        />
      )}
    </div>
  );
};
