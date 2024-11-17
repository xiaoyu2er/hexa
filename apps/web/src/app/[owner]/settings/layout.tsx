'use client';

import { SettingsLayout } from '@/components/layouts/setting-layout';
import type { NavTab } from '@/types';
import { BuildingIcon, SettingsIcon, UserIcon } from '@hexa/ui/icons';
import type { ReactNode } from 'react';

export default async function ({
  children,
  params,
}: { children: ReactNode; params: Promise<{ owner: string }> }) {
  const { owner } = await params;

  const SETTINGS_NAVBARS: NavTab[] = [
    {
      name: 'Profile',
      href: `/${owner}/settings/profile`,
      icon: UserIcon,
    },
    {
      name: 'Account',
      href: `/${owner}/settings/account`,
      icon: SettingsIcon,
    },
    {
      name: 'Organizations',
      href: `/${owner}/settings/orgs`,
      icon: BuildingIcon,
    },
  ] as const;

  return <SettingsLayout navbars={SETTINGS_NAVBARS}>{children}</SettingsLayout>;
}
