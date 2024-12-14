'use client';

import { IS_PRODUCTION } from '@/lib/env';
import { useTheme } from 'next-themes';

export function TailwindIndicator() {
  const { theme, setTheme } = useTheme();

  if (IS_PRODUCTION) {
    return null;
  }

  return (
    <div className="fixed bottom-2 left-2 z-50 flex gap-2">
      {/* Theme Switcher */}
      <button
        type="button"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="flex h-6 items-center justify-center rounded-full bg-gray-800 px-3 font-mono text-white text-xs hover:bg-gray-700"
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </button>

      {/* Breakpoint Indicator */}
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-white text-xs">
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
