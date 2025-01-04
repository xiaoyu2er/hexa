import { Suspense } from 'react';
import { LoginPassword } from './login-password';

export const metadata = {
  title: 'Login',
  description: 'Login Page',
};

export default function () {
  return (
    <Suspense>
      <LoginPassword />
    </Suspense>
  );
}
