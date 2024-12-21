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
import type { SidebarGroupItem } from './app-sidebar-type';

interface AppSidebarContentProps {
  items: SidebarGroupItem[];
  pathname?: string;
}

export function AppSidebarContent({ items, pathname }: AppSidebarContentProps) {
  return (
    <SidebarContent>
      {items.map((item, index) => {
        return (
          <SidebarGroup key={item.title ?? `${index}`}>
            {item.title && <SidebarGroupLabel>{item.title}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {item.subItems.map((subItem) => {
                  return (
                    <SidebarMenuItem key={subItem.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={subItem.url === pathname}
                        tooltip={subItem.title}
                      >
                        <Link href={subItem.url}>
                          <subItem.icon />
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        );
      })}
    </SidebarContent>
  );
}
