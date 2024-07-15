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

export default function ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const navbars = SETTINGS_NAVBARS.map((nav) => {
    return {
      ...nav,
      href: `/${params.slug}${nav.href}`,
    };
  });

  return <SettingsLayout navbars={navbars}>{children}</SettingsLayout>;
}
