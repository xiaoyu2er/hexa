import '@/styles/globals.css';
import '@/styles/sandpack.css';
import { clsx } from '@nextui-org/shared-utils';
import type { Metadata, Viewport } from 'next';

import { Providers } from './providers';

import { Footer } from '@/components/footer';
import { fonts } from '@/config/fonts';
import { siteConfig } from '@/config/site';
import { SiteBanner } from '@hexa/ui/site-banner';
import { SiteHeader } from '@hexa/ui/site-header';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'React',
    'Next.js',
    'Tailwind CSS',
    'NextUI',
    'React Aria',
    'Server Components',
    'React Components',
    'UI Components',
    'UI Kit',
    'UI Library',
    'UI Framework',
    'UI Design System',
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  twitter: siteConfig.twitter,
  openGraph: siteConfig.openGraph,
  authors: [
    {
      name: 'getnextui',
      url: 'https://x.com/getnextui',
    },
  ],
  creator: 'getnextui',
  alternates: {
    canonical: 'https://nextui.org',
    types: {
      'application/rss+xml': [
        { url: 'https://nextui.org/feed.xml', title: 'NextUI RSS Feed' },
      ],
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { color: '#f4f4f5', media: '(prefers-color-scheme: light)' },
    { color: '#111111', media: '(prefers-color-scheme: dark)' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning dir="ltr" lang="en">
      <head />
      <body
        className={clsx(
          'min-h-screen bg-background font-sans antialiased',
          fonts.sans.variable,
          fonts.mono.variable
        )}
      >
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <div className="relative flex flex-col" id="app-container">
            {/* <ProBanner />
            <Navbar
              mobileRoutes={manifest.mobileRoutes}
              routes={manifest.routes}
            /> */}
            <SiteBanner href={siteConfig.links.github} title="Star on GitHub" />
            <SiteHeader />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
