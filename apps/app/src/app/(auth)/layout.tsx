import { metadata } from '@/components/root-layout';
import { protectRoute } from '@/lib/check-route-permission';
import type { ReactNode } from 'react';

export { metadata };

export default async function AuthLayout({
  children,
}: { children: ReactNode }) {
  await protectRoute();
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="max-w-full md:w-96">{children}</div>
    </div>
  );
}
