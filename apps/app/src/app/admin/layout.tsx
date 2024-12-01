import { RootLayout, metadata } from '@/components/root-layout';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

export { metadata };
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { session } = await getSession();

  if (!session) {
    return redirect('/login');
  }
  return (
    <RootLayout>
      <div>{children}</div>
    </RootLayout>
  );
}
