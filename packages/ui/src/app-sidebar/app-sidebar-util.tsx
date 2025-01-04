import {
  BookIcon,
  BuildingIcon,
  ChartBar,
  Cog,
  GlobeIcon,
  LifeBuoyIcon,
  Link2Icon,
  SendIcon,
  SettingsIcon,
  User2Icon,
  UserCogIcon,
  Users,
} from '@hexa/ui/icons';
import type { SidebarGroupItem } from './app-sidebar-type';

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
          icon: User2Icon,
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
          url: `/${slug}`,
          icon: Link2Icon,
        },
        {
          title: 'Analytics',
          url: `/${slug}/analytics`,
          icon: ChartBar,
        },
        {
          title: 'Settings',
          url: `/${slug}/settings/project`,
          icon: Cog,
        },
      ],
    },
  ];
};

export const getSettingsSidebarItems = (slug: string): SidebarGroupItem[] => {
  return [
    {
      title: 'Project',
      subItems: [
        {
          title: 'Settings',
          url: `/${slug}/settings/project`,
          icon: Cog,
        },
      ],
    },
    {
      title: 'Organization',
      subItems: [
        {
          title: 'Settings',
          url: `/${slug}/settings/org`,
          icon: BuildingIcon,
        },
        {
          title: 'Domains',
          url: `/${slug}/settings/org/domains`,
          icon: GlobeIcon,
        },
        {
          title: 'Members',
          url: `/${slug}/settings/org/members`,
          icon: Users,
        },
      ],
    },
    {
      title: 'User',
      subItems: [
        {
          title: 'Profile',
          url: `/${slug}/settings/user/profile`,
          icon: User2Icon,
        },
        {
          title: 'Account',
          url: `/${slug}/settings/user/account`,
          icon: UserCogIcon,
        },
        {
          title: 'Organizations',
          url: `/${slug}/settings/user/orgs`,
          icon: BuildingIcon,
        },
      ],
    },
  ];
};

export const getBottomSidebarItems = (): SidebarGroupItem[] => {
  return [
    {
      title: '',
      subItems: [
        {
          title: 'Documentation',
          url: 'https://docs.hexa.im',
          icon: BookIcon,
        },
        {
          title: 'Support',
          url: '#',
          icon: LifeBuoyIcon,
        },
        {
          title: 'Feedback',
          url: '#',
          icon: SendIcon,
        },
      ],
    },
  ];
};
