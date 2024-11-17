import { getOauthAccount } from '@/features/auth/oauth/store';
import { getDb } from '@/server/db/index';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { OauthSignupPage } from './oauth-signup-page';

export const metadata = {
  title: 'Sign Up',
  description: 'Signup Page',
};

export default async function () {
  // If we have an Oauth account ID in the cookies, we are in the Oauth flow
  const oauthAccountId = (await cookies()).get('oauth_account_id')?.value;
  if (oauthAccountId) {
    const db = await getDb();
    const account = await getOauthAccount(db, oauthAccountId);
    if (account) {
      return <OauthSignupPage oauthAccount={account} />;
    }
  }

  redirect('/sign-up');
}
