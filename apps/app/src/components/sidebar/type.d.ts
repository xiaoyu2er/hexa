import type { FC } from 'react';

// nested sidebar item
export interface SidebarNestedItem {
  title: string;
  url: string;
  icon: FC;
}

export interface SidebarGroupItem {
  title: string;
  subItems: SidebarNestedItem[];
}
