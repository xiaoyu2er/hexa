import { SettingsLayout } from "@/components/layouts/setting-layout";
import { Skeleton } from "@hexa/ui/skeleton";
import { Suspense } from "react";

const SETTINGS_NAVBARS = [
  {
    name: "General",
    href: "/settings",
  },
];

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <SettingsLayout navbars={SETTINGS_NAVBARS}>
      <Suspense
        fallback={
          <div className="">
            <div className="space-y-4">
              <Skeleton className="h-20 w-1/2" />
              <Skeleton className="h-20 w-1/2" />
            </div>
          </div>
        }
      >
        {children}
      </Suspense>
    </SettingsLayout>
  );
}
