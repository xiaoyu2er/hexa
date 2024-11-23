import { ContextSwitcher } from '@/components/sidebar/context-switcher';

import { SidebarHeader, SidebarMenu, SidebarMenuItem } from '@hexa/ui/sidebar';

export function AppSidebarHeader() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <ContextSwitcher />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
