import { SettingsLayout } from "@/components/layouts/setting-layout";

const SETTINGS_NAVBARS = [
  {
    name: "Profile",
    href: "/settings/profile",
  },
  {
    name: "Account",
    href: "/settings/account",
  },
];

export default async function ({ children }: { children: React.ReactNode }) {
  return <SettingsLayout navbars={SETTINGS_NAVBARS}>{children}</SettingsLayout>;
}
