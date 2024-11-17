import type { FC, SVGProps } from 'react';

export interface NavTab {
  name: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  href: string;
}
