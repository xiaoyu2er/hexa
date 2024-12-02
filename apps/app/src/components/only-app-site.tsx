import { protectRoute } from '@/lib/check-route-permission';
import type { ReactNode } from 'react';

export function OnlyAppSite({ children }: { children: ReactNode }) {
  protectRoute();
  return children;
}
