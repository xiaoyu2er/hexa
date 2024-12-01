'use client';

import { ChevronRight } from '@hexa/ui/icons';
import Link from 'next/link';

interface SiteBannerProps {
  href?: string;
  title?: string;
}
export function SiteBanner({ href, title }: SiteBannerProps) {
  if (!href || !title) {
    return null;
  }
  return (
    <div className="group relative top-0 bg-indigo-600 py-3 text-white transition-all duration-300 md:py-0">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-12 md:flex-row">
        <Link
          href={href}
          target="_blank"
          className="inline-flex text-xs leading-normal md:text-sm"
        >
          ✨ <span className="ml-1 font-[580] dark:font-[550]">{title}</span>
          <ChevronRight className="mt-[3px] ml-1 hidden size-4 transition-all duration-300 ease-out group-hover:translate-x-1 lg:inline-block" />
        </Link>
      </div>
      <hr className="absolute bottom-0 m-0 h-px w-full bg-neutral-200/30" />
    </div>
  );
}
