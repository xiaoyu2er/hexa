import { AppSidebar } from '@/components/app-sidebar/app-sidebar';
import { getSession } from '@hexa/server/session/index';
import { AppSidebarBreadcrumb } from '@hexa/ui/app-sidebar-breadcrumb';
import { SessionProvider } from '@hexa/ui/session-provider';
import { SidebarInset, SidebarTrigger } from '@hexa/ui/sidebar';
import { SidebarProvider } from '@hexa/ui/sidebar-provider';
import { Divider } from '@nextui-org/react';
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
        <SidebarInset>
          <header className="sticky top-0 z-[1] flex h-16 shrink-0 items-center gap-2 bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <Divider orientation="vertical" className="mr-2 h-4" />
            <AppSidebarBreadcrumb />
          </header>
          <div className="mx-auto grid w-full max-w-screen-xl gap-5 px-3 pt-3 pb-10 lg:px-10">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
