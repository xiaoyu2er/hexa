'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@hexa/ui/breadcrumb';
import { useParams, usePathname } from 'next/navigation';

export function AppSidebarBreadcrumb() {
  const pathname = usePathname();
  const { slug } = useParams() as { slug: string };
  const items: Record<string, { name: string; link?: string }[]> = {
    '/user/profile': [
      {
        name: 'User',
      },
      {
        name: 'Profile',
      },
    ],
    '/user/account': [
      {
        name: 'User',
        link: '/user/profile',
      },
      {
        name: 'Account',
      },
    ],
    '/user/organizations': [
      {
        name: 'User',
        link: '/user/profile',
      },
      {
        name: 'Organizations',
      },
    ],
    [`/project/${slug}`]: [
      {
        name: 'Project',
      },
      {
        name: 'Links',
      },
    ],
    [`/project/${slug}/settings`]: [
      {
        name: 'Project',
        link: `/project/${slug}`,
      },
      {
        name: 'Settings',
      },
    ],
  };
  const dreadcrumbItems = items[pathname];
  if (!dreadcrumbItems) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {dreadcrumbItems.map((item, index) => {
          return (
            <>
              <BreadcrumbItem
                className={
                  index === dreadcrumbItems.length - 1 ? '' : 'hidden md:block'
                }
                key={index}
              >
                {item.link ? (
                  <BreadcrumbLink href={item.link}>{item.name}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index !== dreadcrumbItems.length - 1 && (
                <BreadcrumbSeparator className="hidden md:block" />
              )}
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
