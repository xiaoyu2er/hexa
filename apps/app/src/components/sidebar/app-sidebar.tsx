import { AppSidebarContent } from '@/components/sidebar/app-sidebar-content';
import { AppSidebarFooter } from '@/components/sidebar/app-sidebar-footer';
import { AppSidebarHeader } from '@/components/sidebar/app-sidebar-header';
import { Sidebar, SidebarFooter } from '@hexa/ui/sidebar';

export function AppSidebar() {
  return (
    <Sidebar variant="floating" collapsible="icon">
      <AppSidebarHeader />
      <AppSidebarContent />
      <SidebarFooter>
        <AppSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
