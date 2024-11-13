import { Suspense } from 'react';
import { ResetPasswordPage } from './reset-password-page';

export const metadata = {
  title: 'Reset Password',
  description: 'Reset Password Page',
};

export default function () {
  return (
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  );
}
