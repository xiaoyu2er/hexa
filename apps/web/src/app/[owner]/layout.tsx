import { ConsoleLayout } from '@/components/layouts/console-layout';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

export default async function DashLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { session } = await getSession();
  if (!session) {
    return redirect('/login');
  }
  return <ConsoleLayout>{children}</ConsoleLayout>;
}
