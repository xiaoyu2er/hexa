import { ConsoleLayout } from "@/components/layouts/console-layout";
import type { ReactNode } from "react";

export default function DashLayout({ children }: { children: ReactNode }) {
  return <ConsoleLayout>{children}</ConsoleLayout>;
}
