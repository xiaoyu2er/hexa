import { SessionProvider } from '@/components/providers/session-provider';
import { SidebarProvider } from '@/components/providers/sidebar-provider';
import { metadata } from '@/components/root-layout';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppSidebarBreadcrumb } from '@/components/sidebar/app-sidebar-breadcrumb';
import { protectRoute } from '@/lib/check-route-permission';
import { getSession } from '@/lib/session';
import { SidebarInset, SidebarTrigger } from '@hexa/ui/sidebar';
import { Divider } from '@nextui-org/react';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

export { metadata };
export default async function DashLayout({
  children,
}: {
  children: ReactNode;
}) {
  protectRoute();
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
