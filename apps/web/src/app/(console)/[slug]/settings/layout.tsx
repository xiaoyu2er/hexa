"use client";

import { SettingsLayout } from "@/components/layouts/setting-layout";
import type { NavTab } from "@/types";
import { SettingsIcon } from "@hexa/ui/icons";

const SETTINGS_NAVBARS: NavTab[] = [
  {
    name: "General",
    href: "/settings",
    icon: SettingsIcon,
  },
] as const;

export default async function ({
  children,
  params,
}: {
  children: React.ReactNode;
  // https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#good-to-know
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const navbars = SETTINGS_NAVBARS.map((nav) => {
    return {
      ...nav,
      href: `/${slug}${nav.href}`,
    };
  });

  return <SettingsLayout navbars={navbars}>{children}</SettingsLayout>;
}
