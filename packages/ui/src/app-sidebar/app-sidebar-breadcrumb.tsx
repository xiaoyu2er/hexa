'use client';

import { BreadcrumbItem, Breadcrumbs } from '@heroui/react';
import { useParams, usePathname } from 'next/navigation';

export const getSidebarBreadcrumb = ({
  slug,
  pathname,
}: { slug: string; pathname: string }) => {
  const items: Record<string, { name: string; link?: string }[]> = {
    [`/${slug}`]: [
      {
        name: 'Project',
      },
      {
        name: 'Links',
      },
    ],
    [`/${slug}/analytics`]: [
      {
        name: 'Project',
        link: `/${slug}`,
      },
      {
        name: 'Analytics',
      },
    ],
    [`/${slug}/settings/user/profile`]: [
      {
        name: 'User',
      },
      {
        name: 'Profile',
      },
    ],
    [`/${slug}/settings/user/account`]: [
      {
        name: 'User',
        link: `/${slug}/settings/user/profile`,
      },
      {
        name: 'Account',
      },
    ],
    [`/${slug}/settings/user/organizations`]: [
      {
        name: 'User',
        link: `/${slug}/settings/user/profile`,
      },
      {
        name: 'Organizations',
      },
    ],

    [`/${slug}/settings/project`]: [
      {
        name: 'Project',
        link: `/${slug}`,
      },
      {
        name: 'Settings',
      },
    ],
    [`/${slug}/settings/org`]: [
      {
        name: 'Organization',
      },
      {
        name: 'Settings',
      },
    ],
    [`/${slug}/settings/org/members`]: [
      {
        name: 'Organization',
        link: `/${slug}/settings/org`,
      },
      {
        name: 'Members',
      },
    ],
    [`/${slug}/settings/org/domains`]: [
      {
        name: 'Organization',
        link: `/${slug}/settings/org`,
      },
      {
        name: 'Domains',
      },
    ],
  };
  const breadcrumbs = items[pathname];
  if (!breadcrumbs) {
    return null;
  }
  return breadcrumbs;
};

export function AppSidebarBreadcrumb() {
  const pathname = usePathname();
  const { slug } = useParams() as { slug: string };
  const breadcrumbs = getSidebarBreadcrumb({ slug, pathname });
  if (!breadcrumbs) {
    return null;
  }

  return (
    <Breadcrumbs>
      {breadcrumbs.map((item, index) => {
        return (
          <BreadcrumbItem key={index} href={item.link}>
            {item.name}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumbs>
  );
}
