import { SessionProvider } from '@/components/providers/session-provider';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppSidebarBreadcrumb } from '@/components/sidebar/app-sidebar-breadcrumb';
import { getSession } from '@/lib/session';
import {} from '@hexa/ui/breadcrumb';
import { Separator } from '@hexa/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@hexa/ui/sidebar';
import { redirect } from 'next/navigation';
import type { CSSProperties, ReactNode } from 'react';

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
      <SidebarProvider
        style={
          {
            '--sidebar-width': '16rem',
          } as CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <AppSidebarBreadcrumb />
          </header>
          {/* fullscreen fallback */}
          {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div> */}
          {children}
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
