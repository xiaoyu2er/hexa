import { inter, satoshi } from "@/styles/fonts";
import type { Metadata } from "next";

import { Toaster } from "@hexa/ui/sonner";
import { cn } from "@hexa/utils";
import "./globals.css";
import { Analytics } from "@/components/analytics";
import { Provider as NiceModalProvider } from "@/components/modal";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { QueryClientProvider } from "@/providers/query-client-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";

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
    <html lang="en" suppressHydrationWarning>
      <body className={cn(satoshi.variable, inter.variable)}>
        <QueryClientProvider>
          <NiceModalProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster richColors position="top-center" />
              <TailwindIndicator />
              <Analytics />
              <SpeedInsights />
            </ThemeProvider>
          </NiceModalProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
