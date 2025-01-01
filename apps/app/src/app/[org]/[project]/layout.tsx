import { AppSidebar } from '@/components/app-sidebar/app-sidebar';
import { ProjectProvider } from '@/components/providers/project-provicer';
import { getDb } from '@hexa/server/db';
import { getSession } from '@hexa/server/session';
import { getProjectWithRoleBySlug } from '@hexa/server/store/project';
import { AppSidebarBreadcrumb } from '@hexa/ui/app-sidebar-breadcrumb';
import { notFound, redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { SessionProvider } from '@hexa/ui/session-provider';
import { SidebarInset, SidebarTrigger } from '@hexa/ui/sidebar';
import { SidebarProvider } from '@hexa/ui/sidebar-provider';
import { Divider } from '@nextui-org/react';

export default async function ProjectLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ project: string; org: string }>;
}) {
  const { project: projectSlug, org: orgSlug } = await params;

  const { session, user } = await getSession();

  if (!session) {
    return redirect('/login');
  }

  const project = await getProjectWithRoleBySlug(
    await getDb(),
    projectSlug,
    orgSlug,
    session.userId
  );

  if (!project || !project.role) {
    return notFound();
  }

  return (
    <SessionProvider user={user} session={session}>
      <ProjectProvider project={project}>
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
      </ProjectProvider>
    </SessionProvider>
  );
}
