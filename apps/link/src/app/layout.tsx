import { metadata } from '@hexa/ui/metadata';
import { RootLayout } from '@hexa/ui/root-layout';
import type { ReactNode } from 'react';

export { metadata };
export default function ({
  children,
}: {
  children: ReactNode;
}) {
  return <RootLayout>{children}</RootLayout>;
}
