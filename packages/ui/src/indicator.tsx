'use client';

import {
  ADMIN_URL,
  APP_URL,
  IS_PRODUCTION,
  REDIRECT_URL,
  WWW_URL,
} from '@hexa/env';
import { cn } from '@hexa/lib';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function Indicator() {
  const { theme, setTheme } = useTheme();
  const [appName, setAppName] = useState('');

  if (IS_PRODUCTION) {
    return null;
  }

  useEffect(() => {
    const host = window.location.host;

    if (ADMIN_URL.includes(host)) {
      setAppName('Admin');
    } else if (APP_URL.includes(host)) {
      setAppName('App');
    } else if (WWW_URL.includes(host)) {
      setAppName('WWW');
    } else if (REDIRECT_URL.includes(host)) {
      setAppName('Link');
    } else {
      setAppName('Unknown');
    }
  }, []);

  const cls =
    'flex h-6 w-6 x-2 items-center justify-center rounded-full bg-gray-800 font-mono text-white text-xs hover:bg-gray-700';

  return (
    <div className="fixed bottom-14 left-5 z-50 flex flex-col items-start gap-2">
      {/* App Name */}
      {appName && <div className={cn(cls, 'min-w-10')}>{appName}</div>}
      {/* Theme Switcher */}
      <button
        type="button"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className={cls}
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </button>
      {/* Breakpoint Indicator */}
      <div className={cls}>
        <>
          <div className="block sm:hidden">xs</div>
          <div className="hidden sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">
            sm
          </div>
          <div className="hidden md:block lg:hidden xl:hidden 2xl:hidden">
            md
          </div>
          <div className="hidden lg:block xl:hidden 2xl:hidden">lg</div>
          <div className="hidden xl:block 2xl:hidden">xl</div>
          <div className="hidden 2xl:block">2xl</div>
        </>
      </div>
    </div>
  );
}
