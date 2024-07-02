import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { Toaster } from "@hexa/ui/toaster";
import { cn } from "@hexa/utils";
import "./globals.css";
import { SessionProvider } from "./session-provider";
import { ThemeProvider } from "next-themes";
import { validateRequest } from "@/lib/auth";

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
          fontSans.variable
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
        <Toaster />
      </body>
    </html>
  );
}
