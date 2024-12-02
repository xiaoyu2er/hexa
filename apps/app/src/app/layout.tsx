import { RootLayout, metadata } from '@/components/root-layout';
import type { ReactNode } from 'react';

export { metadata };
export default function ({
  children,
}: {
  children: ReactNode;
}) {
  return <RootLayout>{children}</RootLayout>;
}
