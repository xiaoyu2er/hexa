import { AppSidebar } from '@/components/app-sidebar';
import { APP_URL } from '@hexa/env';
import { getSession } from '@hexa/server/session';
import { AppSidebarBreadcrumb } from '@hexa/ui/app-sidebar-breadcrumb';
import { SessionProvider } from '@hexa/ui/session-provider';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@hexa/ui/sidebar';
import { Divider } from '@nextui-org/react';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

// export const dynamic = 'force-dynamic';
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // const { env } = await getCloudflareContext();
  // const db = await getDb();

  // if (!env.DEFAULT_ADMIN_ORG_ID) {
  //   throw new Error('Please set DEFAULT_ADMIN_ORG_ID first');
  // }

  const { session, user } = await getSession();
  if (!session) {
    return redirect(`${APP_URL}/login`);
  }
  // const org = await getOrgMember(db, env.DEFAULT_ADMIN_ORG_ID, user.id);
  // if (!org || (org.role !== 'ADMIN' && org.role !== 'OWNER')) {
  //   throw new Error('You are not allowed to access this page');
  // }

  return (
    <SessionProvider user={user} session={session}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-background px-4">
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
