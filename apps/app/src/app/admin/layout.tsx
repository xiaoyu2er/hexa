import { SessionProvider } from '@/components/providers/session-provider';
import { RootLayout, metadata } from '@/components/root-layout';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppSidebarBreadcrumb } from '@/components/sidebar/app-sidebar-breadcrumb';
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
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { env } = await getCloudflareContext();
  const db = await getDb();
  // set admin org id first
  // npx wrangler kv key put --binding=APP_KV config:admin-org-id org_xx
  // npx wrangler kv key put --binding=APP_KV config:admin-org-id org_xx --local
  const adminOrgId = await env.APP_KV.get('config:admin-org-id');
  if (!adminOrgId) {
    throw new Error('Admin org id not set');
  }

  const { session, user } = await getSession();
  if (!session) {
    return redirect('/login');
  }
  const org = await getOrgMember(db, adminOrgId, user.id);
  if (!org || (org.role !== 'ADMIN' && org.role !== 'OWNER')) {
    return redirect('/');
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
