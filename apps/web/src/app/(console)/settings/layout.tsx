import { SettingsLayout } from "@/components/layouts/setting-layout";

const SETTINGS_NAVBARS = [
  {
    name: "General",
    href: "/settings",
  },
];


export default async function ({ children }: { children: React.ReactNode }) {
  return <SettingsLayout navbars={SETTINGS_NAVBARS}>{children}</SettingsLayout>;
}
