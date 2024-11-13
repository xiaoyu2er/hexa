'use client';

import { VerifyPasscode } from '@/components/auth/verify-passcode-form';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type FC, useEffect, useState } from 'react';
import { useStep } from 'usehooks-ts';
import { ForgetPasswordCard } from './forget-password-form';
import { ResetPassword } from './reset-password-form';

export interface ResetPasswordProps {
  token?: string;
}

export const ResetPasswordPage: FC<ResetPasswordProps> = () => {
  const params = useSearchParams();
  // we use initToken to check if the user is coming from email link
  const [initToken] = useState(() => params.get('token'));
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [currentStep, { goToNextStep, goToPrevStep, reset }] = useStep(3);

  const onCancel = () => {
    router.push('/');
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (initToken) {
      // remove token in url
      router.replace(pathname);
    }
  }, []);

  if (initToken) {
    return <ResetPassword token={initToken} onCancel={onCancel} />;
  }

  return (
    <div>
      {currentStep === 1 && (
        <ForgetPasswordCard
          email={email}
          onSuccess={({ email }) => {
            setEmail(email);
            goToNextStep();
          }}
          onCancel={onCancel}
        />
      )}
      {currentStep === 2 && (
        <VerifyPasscode
          email={email}
          type="RESET_PASSWORD"
          onSuccess={({ token }) => {
            goToNextStep();
            setToken(token);
          }}
          onCancel={goToPrevStep}
        />
      )}
      {currentStep === 3 && <ResetPassword token={token} onCancel={reset} />}
    </div>
  );
};
