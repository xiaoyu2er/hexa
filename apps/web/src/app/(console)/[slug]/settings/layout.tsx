import { SettingsLayout } from "@/components/layouts/setting-layout";

const SETTINGS_NAVBARS = [
  {
    name: "General",
    href: "/settings",
  },
];

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
