import type { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="max-w-full md:w-96">{children}</div>
    </div>
  );
};

export default AuthLayout;
