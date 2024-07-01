import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function DashLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await validateRequest();
  if (!user) redirect("/login");
  return <div>{children}</div>;
}
