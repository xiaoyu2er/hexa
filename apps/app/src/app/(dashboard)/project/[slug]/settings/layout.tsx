'use client';

import { SettingsLayout } from '@/components/layouts/setting-layout';
import type { NavTab } from '@/components/menu-bar/types';
import { SettingsIcon } from '@hexa/ui/icons';
import type { ReactNode } from 'react';

export default async function ProjectSettingsLayout({
  children,
  params,
}: {
  children: ReactNode;
  // https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#good-to-know
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const SETTINGS_NAVBARS: NavTab[] = [
    {
      name: 'General',
      href: `/project/${slug}/settings/profile`,
      icon: SettingsIcon,
    },
  ] as const;

  return <SettingsLayout navbars={SETTINGS_NAVBARS}>{children}</SettingsLayout>;
}
