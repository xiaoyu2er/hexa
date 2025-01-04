import { Suspense } from 'react';
import { SignupPage } from './signup-page';

export const metadata = {
  title: 'Sign Up',
  description: 'Signup Page',
};

export default function () {
  return (
    <Suspense>
      <SignupPage />
    </Suspense>
  );
}
