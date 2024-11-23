import { Collapsible } from '@hexa/ui/collapsible';

import { BuildingIcon, SettingsIcon, UserIcon } from '@hexa/ui/icons';

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@hexa/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const USER_NAVS = [
  {
    title: 'Profile',
    url: '/user/profile',
    icon: UserIcon,
  },
  {
    title: 'Account',
    url: '/user/account',
    icon: SettingsIcon,
  },
  {
    title: 'Organizations',
    url: '/user/orgs',
    icon: BuildingIcon,
  },
] as const;

export function UserSideBarContent() {
  const pathname = usePathname();
  return (
    <SidebarContent>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup>
          <SidebarGroupLabel>User</SidebarGroupLabel>
          {/* <SidebarGroupAction>
            <Plus /> <span className="sr-only">Add Project</span>
          </SidebarGroupAction> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {USER_NAVS.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={item.url === pathname}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </Collapsible>
    </SidebarContent>
  );
}
