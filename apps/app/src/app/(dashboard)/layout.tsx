import { SessionProvider } from '@/components/providers/session-provider';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { getSession } from '@/lib/session';
import { SidebarProvider, SidebarTrigger } from '@hexa/ui/sidebar';
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
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
      {/* <ConsoleLayout>{children}</ConsoleLayout> */}
    </SessionProvider>
  );
}
