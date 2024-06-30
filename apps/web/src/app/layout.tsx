import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { Toaster } from "@hexa/ui/toaster";
import { cn } from "@hexa/utils";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/header/header";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
      <body
        className={cn(
          "bg-background font-sans antialiased h-screen",
          fontSans.variable,
        )}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
