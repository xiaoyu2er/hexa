import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { ConsoleLayout } from "@/components/layouts/console-layout";

export default async function DashLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  return <ConsoleLayout>{children}</ConsoleLayout>;
}
