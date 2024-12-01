import { RootLayout, metadata } from '@/components/root-layout';
import type { ReactNode } from 'react';

export { metadata };

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <RootLayout>
      {' '}
      <div className="grid min-h-screen place-items-center p-4">
        <div className="max-w-full md:w-96">{children}</div>
      </div>
    </RootLayout>
  );
}
