import { protectRoute } from '@/lib/check-route-permission';
import type { ReactNode } from 'react';

export async function OnlyAppSite({ children }: { children: ReactNode }) {
  await protectRoute();
  return children;
}
