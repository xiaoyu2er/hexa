import { SessionProvider } from '@/components/providers/session-provider';
import { metadata } from '@/components/root-layout';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppSidebarBreadcrumb } from '@/components/sidebar/app-sidebar-breadcrumb';
import { protectRoute } from '@/lib/check-route-permission';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { getOrgMember } from '@/server/store/org-member';
import { Separator } from '@hexa/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@hexa/ui/sidebar';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

export { metadata };

// export const dynamic = 'force-dynamic';
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  protectRoute();
  const { env } = await getCloudflareContext();
  const db = await getDb();

  if (!env.DEFAULT_ADMIN_ORG_ID) {
    throw new Error('Please set DEFAULT_ADMIN_ORG_ID first');
  }

  const { session, user } = await getSession();
  if (!session) {
    return redirect('/login');
  }
  const org = await getOrgMember(db, env.DEFAULT_ADMIN_ORG_ID, user.id);
  if (!org || (org.role !== 'ADMIN' && org.role !== 'OWNER')) {
    throw new Error('You are not allowed to access this page');
  }

  return (
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
  );
}
