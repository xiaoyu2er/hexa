'use client';

import { MenuBar } from '@/components/menu-bar/menu-bar';
import type { ReactNode } from 'react';

export function ConsoleLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      <MenuBar />
      {children}
    </div>
  );
}
