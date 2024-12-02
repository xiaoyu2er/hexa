import type { SidebarGroupItem } from '@/components/sidebar/type';
import {
  BuildingIcon,
  ChartBar,
  Cog,
  Home,
  Inbox,
  SettingsIcon,
  UserIcon,
  Users,
} from '@hexa/ui/icons';

export const getAdminSidebarItems = (): SidebarGroupItem[] => {
  const ADMIN_NAVS = [
    {
      title: 'Global',
      subItems: [
        {
          title: 'Stats',
          url: '/admin',
          icon: ChartBar,
        },

        {
          title: 'Config',
          url: '/admin/config',
          icon: SettingsIcon,
        },
      ],
    },

    {
      title: 'Customer',
      subItems: [
        {
          title: 'Organizations',
          url: '/admin/orgs',
          icon: BuildingIcon,
        },
        {
          title: 'Links',
          url: '/admin/links',
          icon: BuildingIcon,
        },
        {
          title: 'Users',
          url: '/admin/users',
          icon: UserIcon,
        },
      ],
    },
  ];

  return ADMIN_NAVS;
};

export const getProjectSidebarItems = (slug: string): SidebarGroupItem[] => {
  return [
    {
      title: 'Project',
      subItems: [
        {
          title: 'Links',
          url: `/project/${slug}`,
          icon: Home,
        },
        {
          title: 'Analytics',
          url: `/project/${slug}/analytics`,
          icon: ChartBar,
        },
        {
          title: 'Settings',
          url: `/project/${slug}/settings`,
          icon: Inbox,
        },
      ],
    },
  ];
};

export const getUserSidebarItems = (): SidebarGroupItem[] => {
  const USER_NAVS = [
    {
      title: 'User',
      subItems: [
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
      ],
    },
  ];

  return USER_NAVS;
};

export const getProjectSettingsSidebarItems = (
  slug: string
): SidebarGroupItem[] => {
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
          title: 'Domains',
          url: `/project/${slug}/org/domains`,
          icon: BuildingIcon,
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
