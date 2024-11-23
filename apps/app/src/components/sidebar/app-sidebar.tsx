'use client';

import { AppSidebarFooter } from '@/components/sidebar/app-sidebar-footer';
import { AppSidebarHeader } from '@/components/sidebar/app-sidebar-header';
import { ProjectSideBarContent } from '@/components/sidebar/project-sidebar-content';
import { UserSideBarContent } from '@/components/sidebar/user-sidebar-content';
import { Sidebar, SidebarFooter } from '@hexa/ui/sidebar';
import { useParams } from 'next/navigation';

export function AppSidebar() {
  const { slug } = useParams() as { slug: string };

  return (
    <Sidebar variant="floating" collapsible="icon">
      <AppSidebarHeader />
      {slug ? <ProjectSideBarContent slug={slug} /> : <UserSideBarContent />}
      <SidebarFooter>
        <AppSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
