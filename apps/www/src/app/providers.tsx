'use client';

import type { ReactNode } from 'react';

import { HeroUIProvider } from '@heroui/react';
import type { ThemeProviderProps } from 'next-themes';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect } from 'react';

import { __PROD__ } from '@/utils';

export interface ProvidersProps {
  children: ReactNode;
  themeProps?: ThemeProviderProps;
}

const ProviderWrapper = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    // Initialize PostHog only once when the app starts
    if (
      typeof window !== 'undefined' &&
      __PROD__ &&
      !posthog.isFeatureEnabled('capture')
    ) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '', {
        api_host: '/ingest',
        person_profiles: 'identified_only',
        ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      });
    }
  }, []);

  if (__PROD__) {
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
  }

  return children;
};

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <ProviderWrapper>
      <HeroUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </HeroUIProvider>
    </ProviderWrapper>
  );
}
