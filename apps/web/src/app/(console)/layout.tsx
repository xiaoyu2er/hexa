import { ConsoleLayout } from "@/components/layouts/console-layout";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function DashLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { session } = await validateRequest();
  if (!session) return redirect("/login");
  return <ConsoleLayout>{children}</ConsoleLayout>;
}
