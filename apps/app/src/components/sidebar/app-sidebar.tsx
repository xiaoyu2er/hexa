'use client';

import { AppSidebarFooter } from '@/components/sidebar/app-sidebar-footer';
import { AppSidebarHeader } from '@/components/sidebar/app-sidebar-header';
import { ProjectSideBarContent } from '@/components/sidebar/project-sidebar-content';
import { UserSideBarContent } from '@/components/sidebar/user-sidebar-content';
import { Sidebar, SidebarFooter } from '@hexa/ui/sidebar';
import { usePathname } from 'next/navigation';

export function AppSidebar() {
  const pathname = usePathname();
  const isProject = pathname.startsWith('/project');

  return (
    <Sidebar variant="floating" collapsible="icon">
      <AppSidebarHeader />
      {isProject ? <ProjectSideBarContent /> : <UserSideBarContent />}
      <SidebarFooter>
        <AppSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
