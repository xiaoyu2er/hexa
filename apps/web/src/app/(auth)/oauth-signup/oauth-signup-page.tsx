'use client';

import { deleteCookie } from '@/lib/cookie';
import type { SelectOauthAccountType } from '@/server/db';
import { toast } from '@hexa/ui/sonner';
import { useRouter } from 'next/navigation';
import { type FC, useEffect } from 'react';
import { OauthSignup } from './oauth-signup-form';

export interface SignupPageProps {
  oauthAccount: SelectOauthAccountType;
}

export const OauthSignupPage: FC<SignupPageProps> = ({ oauthAccount }) => {
  const router = useRouter();
  useEffect(() => {
    deleteCookie('oauth_account_id');
  }, []);

  return (
    <OauthSignup
      oauthAccount={oauthAccount}
      onSuccess={() => {
        toast.success('Sign up successful');
      }}
      onCancel={() => {
        router.push('/');
      }}
    />
  );
};
