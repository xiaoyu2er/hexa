'use client';

import { AppSidebarFooter } from '@/components/sidebar/app-sidebar-footer';
import { ContextSwitcher } from '@/components/sidebar/context-switcher';
import { ProjectSettingsSidebarContent } from '@/components/sidebar/project-settings-sidebar-content';
import { ProjectSideBarContent } from '@/components/sidebar/project-sidebar-content';
import { UserSideBarContent } from '@/components/sidebar/user-sidebar-content';
import { ArrowLeft } from '@hexa/ui/icons';
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@hexa/ui/sidebar';
import {} from 'motion/react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export function AppSidebar() {
  const { slug } = useParams() as { slug: string };
  const pathname = usePathname();
  const isProjectSettingsSidebar = pathname.includes(`/project/${slug}/`);

  return (
    <Sidebar variant="floating" collapsible="icon">
      {isProjectSettingsSidebar && (
        <>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/project/${slug}`}>
                    <ArrowLeft />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <ProjectSettingsSidebarContent slug={slug} />

          <SidebarFooter>
            <AppSidebarFooter />
          </SidebarFooter>
        </>
      )}

      {!isProjectSettingsSidebar && (
        <>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <ContextSwitcher />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          {slug ? (
            <ProjectSideBarContent slug={slug} />
          ) : (
            <UserSideBarContent />
          )}
          <SidebarFooter>
            <AppSidebarFooter />
          </SidebarFooter>
        </>
      )}
    </Sidebar>
  );
}
