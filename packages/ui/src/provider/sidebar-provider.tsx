'use client';

import { SidebarProvider as SidebarProviderBase } from '@hexa/ui/sidebar';
import type { CSSProperties, ReactNode } from 'react';

export function SidebarProvider({ children }: { children: ReactNode }) {
  return (
    <SidebarProviderBase
      style={
        {
          '--sidebar-width': '16rem',
        } as CSSProperties
      }
    >
      {children}
    </SidebarProviderBase>
  );
}
