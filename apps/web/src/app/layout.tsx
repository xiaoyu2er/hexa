import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"

import "@hexa/ui/globals.css";
import { cn } from "@hexa/ui/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Hexa",
  description: "Infinite Possibilities with a Single Link",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        "bg-background font-sans antialiased h-screen",
        fontSans.variable
      )}>
        {children}
      </body>
    </html>
  );
}
