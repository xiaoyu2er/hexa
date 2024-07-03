import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { Toaster } from "@hexa/ui/sonner";
import { cn } from "@hexa/utils";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "./session-provider";
import { validateRequest } from "@/lib/auth";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Analytics } from "@/components/analytics";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Hexa",
  description: "Infinite Possibilities with a Single Link",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await validateRequest();
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-background font-sans antialiased h-screen",
          fontSans.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider value={session}>{children}</SessionProvider>
        </ThemeProvider>
        <Toaster richColors />
        <TailwindIndicator />
        <Analytics />
      </body>
    </html>
  );
}
