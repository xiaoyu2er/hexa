'use client';

import { SettingsLayout } from '@/components/layouts/setting-layout';
import type { NavTab } from '@/types';
import { SettingsIcon } from '@hexa/ui/icons';
import type { ReactNode } from 'react';

export default async function ({
  children,
  params,
}: {
  children: ReactNode;
  // https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#good-to-know
  params: Promise<{ owner: string; ws: string }>;
}) {
  const { owner, ws } = await params;

  const SETTINGS_NAVBARS: NavTab[] = [
    {
      name: 'General',
      href: `/${owner}/${ws}/settings/profile`,
      icon: SettingsIcon,
    },
  ] as const;

  return <SettingsLayout navbars={SETTINGS_NAVBARS}>{children}</SettingsLayout>;
}
