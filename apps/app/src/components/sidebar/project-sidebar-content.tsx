import { Collapsible } from '@hexa/ui/collapsible';

import { Home, Inbox } from '@hexa/ui/icons';

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from '@hexa/ui/sidebar';

import Link from 'next/link';

import { usePathname } from 'next/navigation';

export function ProjectSideBarContent({ slug }: { slug: string }) {
  const pathname = usePathname();
  const PROJECT_NAVS = [
    {
      title: 'Links',
      url: `/project/${slug}`,
      icon: Home,
    },
    {
      title: 'Settings',
      url: `/project/${slug}/settings`,
      icon: Inbox,
    },
  ];
  return (
    <SidebarContent>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup>
          <SidebarGroupLabel>Project</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {PROJECT_NAVS.map((item) => (
                <SidebarMenuButton
                  asChild
                  isActive={item.url === pathname}
                  key={item.url}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </Collapsible>
    </SidebarContent>
  );
}
