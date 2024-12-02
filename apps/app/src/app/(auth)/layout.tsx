import { metadata } from '@/components/root-layout';
import { protectRoute } from '@/lib/check-route-permission';
import type { ReactNode } from 'react';

export { metadata };

export default function AuthLayout({ children }: { children: ReactNode }) {
  protectRoute();
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="max-w-full md:w-96">{children}</div>
    </div>
  );
}
