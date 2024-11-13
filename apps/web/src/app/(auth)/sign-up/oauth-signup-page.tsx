'use client';

import { deleteCookie } from '@/lib/cookie';

import type { OauthAccountModel } from '@/server/db';
import { useRouter } from 'next/navigation';
import { type FC, useEffect } from 'react';
import { OauthSignup } from './oauth-signup-form';

export interface SignupPageProps {
  oauthAccount: OauthAccountModel;
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
        router.push('/settings');
      }}
      onCancel={() => {
        router.push('/');
      }}
    />
  );
};
