import { SessionProvider } from '@/components/providers/session-provider';
import { SidebarProvider } from '@/components/providers/sidebar-provider';
import { RootLayout, metadata } from '@/components/root-layout';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppSidebarBreadcrumb } from '@/components/sidebar/app-sidebar-breadcrumb';
import { getSession } from '@/lib/session';
import { Separator } from '@hexa/ui/separator';
import { SidebarInset, SidebarTrigger } from '@hexa/ui/sidebar';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

export { metadata };
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
    <RootLayout>
      <SessionProvider user={user} session={session}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-background px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <AppSidebarBreadcrumb />
            </header>
            <div className="mx-auto grid w-full max-w-screen-xl gap-5 px-3 pt-3 pb-10 lg:px-10">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </SessionProvider>
    </RootLayout>
  );
}
