'use client';
import { VerifyPasscode } from '@/components/auth/verify-passcode';
import {
  $oauthSignupResendPasscode,
  $oauthSignupVerifyPasscode,
} from '@/lib/api';
import type { SelectOauthAccountType } from '@/server/schema/oauth';
import { toast } from '@hexa/ui/sonner';
import { useRouter } from 'next/navigation';
import { type FC, useState } from 'react';
import { useStep } from 'usehooks-ts';
import { OauthSignup } from './oauth-signup';

export interface SignupPageProps {
  oauthAccount: SelectOauthAccountType;
}

export const OauthSignupPage: FC<SignupPageProps> = ({ oauthAccount }) => {
  const router = useRouter();
  const [passcodeId, setPasscodeId] = useState('');
  const [currentStep, { goToNextStep, reset }] = useStep(3);

  return (
    <>
      {currentStep === 1 && (
        <OauthSignup
          oauthAccount={oauthAccount}
          onSuccess={(data) => {
            // Passcode id
            if ('id' in data) {
              // @ts-ignore
              setPasscodeId(data.id);
              goToNextStep();
            }
          }}
          onCancel={() => {
            router.push('/');
          }}
        />
      )}
      {currentStep === 2 && (
        <VerifyPasscode
          passcodeId={passcodeId}
          email={oauthAccount.email}
          onVerify={(json) => {
            return $oauthSignupVerifyPasscode({
              json,
            });
          }}
          onResend={(json) => {
            return $oauthSignupResendPasscode({
              json,
            });
          }}
          onSuccess={() => {
            toast.success('Sign up successful');
          }}
          onCancel={reset}
        />
      )}
    </>
  );
};
