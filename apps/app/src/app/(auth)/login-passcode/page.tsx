import { Suspense } from 'react';
import { LoginPasscodePage } from './login-passcode-page';

export const metadata = {
  title: 'Login',
  description: 'Login Page',
};

export default function () {
  return (
    <Suspense>
      <LoginPasscodePage />
    </Suspense>
  );
}
