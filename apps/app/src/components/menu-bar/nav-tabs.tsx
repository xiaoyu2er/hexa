'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export default function NavTabs() {
  const pathname = usePathname();
  const { slug } = useParams() as { slug?: string };

  if (!slug) {
    return null;
  }

  const tabs = [
    { name: 'Links', href: `/project/${slug}` },
    { name: 'Settings', href: `/project/${slug}/settings` },
  ];

  return (
    <div className="scrollbar-hide mb-[-3px] flex h-12 items-center justify-start space-x-2 overflow-x-auto">
      {tabs.map(({ name, href }) => (
        <Link key={href} href={href} className="relative">
          <div className="m-1 rounded-md px-3 py-2 transition-all duration-75 hover:bg-accent hover:text-accent-foreground">
            <p className="text-sm">{name}</p>
          </div>
          {pathname === href && (
            <div className="absolute bottom-0 w-full px-1.5">
              <div className="h-0.5 bg-gray-900 dark:bg-slate-100" />
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
