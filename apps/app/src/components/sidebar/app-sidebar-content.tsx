import type { SidebarGroupItem } from '@/components/sidebar/type';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@hexa/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@hexa/ui/tooltip';
import Link from 'next/link';

interface AppSidebarContentProps {
  items: SidebarGroupItem[];
  pathname?: string;
}

export function AppSidebarContent({ items, pathname }: AppSidebarContentProps) {
  const { state } = useSidebar();
  return (
    <SidebarContent>
      {items.map((item, index) => {
        return (
          <SidebarGroup key={item.title ?? `${index}`}>
            {item.title && <SidebarGroupLabel>{item.title}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {item.subItems.map((subItem) => {
                  const button = (
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
                  );
                  return (
                    <SidebarMenuItem key={subItem.title}>
                      {state === 'collapsed' ? (
                        <Tooltip>
                          <TooltipTrigger asChild>{button}</TooltipTrigger>
                          <TooltipContent side="right" className="z-[100]">
                            {subItem.title}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        button
                      )}
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
