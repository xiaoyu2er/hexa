import type { Metadata } from "next";
import { inter, satoshi } from "@/styles/fonts";

import { Toaster } from "@hexa/ui/sonner";
import { cn } from "@hexa/utils";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Analytics } from "@/components/analytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { QueryClientProvider } from "@/providers/query-client-provider";

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
      <body className={cn(satoshi.variable, inter.variable)}>
        <QueryClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryClientProvider>

        <Toaster richColors />
        <TailwindIndicator />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
