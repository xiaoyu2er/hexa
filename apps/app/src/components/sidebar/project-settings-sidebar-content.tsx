import { Cog, Users } from '@hexa/ui/icons';

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

const getProjectSettingsSidebarItems = (slug: string) => {
  return [
    {
      title: 'Project',
      subItems: [
        {
          title: 'Settings',
          url: `/project/${slug}/settings`,
          icon: Cog,
        },
      ],
    },
    {
      title: 'Organization',
      subItems: [
        {
          title: 'Settings',
          url: `/project/${slug}/org`,
          icon: Cog,
        },
        {
          title: 'Members',
          url: `/project/${slug}/org/members`,
          icon: Users,
        },
      ],
    },
  ];
};

export function ProjectSettingsSidebarContent({ slug }: { slug: string }) {
  const pathname = usePathname();
  const items = getProjectSettingsSidebarItems(slug);

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
