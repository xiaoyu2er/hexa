'use client';

import { AppSidebarContent } from '@/components/sidebar/app-sidebar-content';
import { AppSidebarFooter } from '@/components/sidebar/app-sidebar-footer';
import { ContextSwitcher } from '@/components/sidebar/context-switcher';
import type { SidebarGroupItem } from '@/components/sidebar/type';
import {
  getAdminSidebarItems,
  getProjectSettingsSidebarItems,
  getProjectSidebarItems,
  getUserSidebarItems,
} from '@/components/sidebar/util';
import { ArrowLeft } from '@hexa/ui/icons';
import {} from '@hexa/ui/icons';
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@hexa/ui/sidebar';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export function AppSidebar() {
  const { slug } = useParams() as { slug: string };
  const pathname = usePathname();
  const isProjectSettingsSidebar = pathname.startsWith(`/project/${slug}/`);
  const isAdminSidebar = pathname.startsWith('/admin');

  let sidebarItems: SidebarGroupItem[] = [];

  if (isProjectSettingsSidebar) {
    sidebarItems = getProjectSettingsSidebarItems(slug);
  } else if (isAdminSidebar) {
    sidebarItems = getAdminSidebarItems();
  } else if (slug) {
    sidebarItems = getProjectSidebarItems(slug);
  } else {
    sidebarItems = getUserSidebarItems();
  }

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {isProjectSettingsSidebar || isAdminSidebar ? (
              <SidebarMenuButton asChild>
                <Link href="/">
                  <ArrowLeft />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            ) : (
              <ContextSwitcher />
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <AppSidebarContent items={sidebarItems} pathname={pathname} />
      <SidebarFooter>
        <AppSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
