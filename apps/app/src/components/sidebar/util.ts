import type { SidebarGroupItem } from '@/components/sidebar/type';
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
          url: `/project/${slug}`,
          icon: Link2Icon,
        },
        {
          title: 'Analytics',
          url: `/project/${slug}/analytics`,
          icon: ChartBar,
        },
        {
          title: 'Settings',
          url: `/project/${slug}/settings/project`,
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
          url: `/project/${slug}/settings/project`,
          icon: Cog,
        },
      ],
    },
    {
      title: 'Organization',
      subItems: [
        {
          title: 'Settings',
          url: `/project/${slug}/settings/org`,
          icon: BuildingIcon,
        },
        {
          title: 'Domains',
          url: `/project/${slug}/settings/org/domains`,
          icon: GlobeIcon,
        },
        {
          title: 'Members',
          url: `/project/${slug}/settings/org/members`,
          icon: Users,
        },
      ],
    },
    {
      title: 'User',
      subItems: [
        {
          title: 'Profile',
          url: `/project/${slug}/settings/user/profile`,
          icon: User2Icon,
        },
        {
          title: 'Account',
          url: `/project/${slug}/settings/user/account`,
          icon: UserCogIcon,
        },
        {
          title: 'Organizations',
          url: `/project/${slug}/settings/user/orgs`,
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
