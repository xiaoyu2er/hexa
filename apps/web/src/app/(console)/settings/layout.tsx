"use client";

import { SettingsLayout } from "@/components/layouts/setting-layout";
import type { NavTab } from "@/types";
import { SettingsIcon, UserIcon } from "@hexa/ui/icons";

const SETTINGS_NAVBARS: NavTab[] = [
  {
    name: "Profile",
    href: "/settings/profile",
    icon: UserIcon,
  },
  {
    name: "Account",
    href: "/settings/account",
    icon: SettingsIcon,
  },
] as const;

export default function ({ children }: { children: React.ReactNode }) {
  return <SettingsLayout navbars={SETTINGS_NAVBARS}>{children}</SettingsLayout>;
}
