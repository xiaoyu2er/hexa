import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const { user } = await validateRequest();
  if (user) {
    return redirect(`/${user.name}/settings/profile`);
  }
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="max-w-full md:w-96">{children}</div>
    </div>
  );
};

export default AuthLayout;
