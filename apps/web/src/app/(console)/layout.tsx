import { ConsoleLayout } from "@/components/layouts/console-layout";
import { validateRequest } from "@/lib/auth";
import { SessionProvider } from "@/providers/session-provider";
import type { ReactNode } from "react";

export default async function DashLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await validateRequest();
  return (
    <SessionProvider value={session}>
      <ConsoleLayout>{children}</ConsoleLayout>
    </SessionProvider>
  );
}
