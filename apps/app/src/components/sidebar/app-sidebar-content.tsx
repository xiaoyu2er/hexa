import type { SidebarGroupItem } from '@/components/sidebar/type';
import {} from '@hexa/ui/icons';

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

interface AppSidebarContentProps {
  items: SidebarGroupItem[];
  pathname: string;
}

export function AppSidebarContent({ items, pathname }: AppSidebarContentProps) {
  return (
    <SidebarContent>
      {items.map((item) => {
        return (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.subItems.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={subItem.url === pathname}
                      key={subItem.url}
                    >
                      <Link href={subItem.url}>
                        <subItem.icon />
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        );
      })}
    </SidebarContent>
  );
}
