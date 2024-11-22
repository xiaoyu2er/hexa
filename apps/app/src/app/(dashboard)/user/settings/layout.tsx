'use client';

import { SettingsLayout } from '@/components/layouts/setting-layout';
import type { NavTab } from '@/components/menu-bar/types';
import { BuildingIcon, SettingsIcon, UserIcon } from '@hexa/ui/icons';
import type { ReactNode } from 'react';

const SETTINGS_NAVBARS: NavTab[] = [
  {
    name: 'Profile',
    href: '/user/settings/profile',
    icon: UserIcon,
  },
  {
    name: 'Account',
    href: '/user/settings/account',
    icon: SettingsIcon,
  },
  {
    name: 'Organizations',
    href: '/user/settings/orgs',
    icon: BuildingIcon,
  },
] as const;

export default function ({ children }: { children: ReactNode }) {
  return <SettingsLayout navbars={SETTINGS_NAVBARS}>{children}</SettingsLayout>;
}
