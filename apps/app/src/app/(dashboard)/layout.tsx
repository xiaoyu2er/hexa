import { ConsoleLayout } from '@/components/layouts/console-layout';
import { SessionProvider } from '@/components/providers/session-provider';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

export default async function DashLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { session, user } = await getSession();
  if (!session) {
    return redirect('/login');
  }

  return (
    <SessionProvider user={user} session={session}>
      <ConsoleLayout>{children}</ConsoleLayout>
    </SessionProvider>
  );
}
