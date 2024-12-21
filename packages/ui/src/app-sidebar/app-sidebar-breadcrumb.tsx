'use client';

import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/react';
import { useParams, usePathname } from 'next/navigation';

export const getSidebarBreadcrumb = ({
  slug,
  pathname,
}: { slug: string; pathname: string }) => {
  const items: Record<string, { name: string; link?: string }[]> = {
    [`/project/${slug}`]: [
      {
        name: 'Project',
      },
      {
        name: 'Links',
      },
    ],
    [`/project/${slug}/analytics`]: [
      {
        name: 'Project',
        link: `/project/${slug}`,
      },
      {
        name: 'Analytics',
      },
    ],
    [`/project/${slug}/settings/user/profile`]: [
      {
        name: 'User',
      },
      {
        name: 'Profile',
      },
    ],
    [`/project/${slug}/settings/user/account`]: [
      {
        name: 'User',
        link: `/project/${slug}/settings/user/profile`,
      },
      {
        name: 'Account',
      },
    ],
    [`/project/${slug}/settings/user/organizations`]: [
      {
        name: 'User',
        link: `/project/${slug}/settings/user/profile`,
      },
      {
        name: 'Organizations',
      },
    ],

    [`/project/${slug}/settings/project`]: [
      {
        name: 'Project',
        link: `/project/${slug}`,
      },
      {
        name: 'Settings',
      },
    ],
    [`/project/${slug}/settings/org`]: [
      {
        name: 'Organization',
      },
      {
        name: 'Settings',
      },
    ],
    [`/project/${slug}/settings/org/members`]: [
      {
        name: 'Organization',
        link: `/project/${slug}/settings/org`,
      },
      {
        name: 'Members',
      },
    ],
    [`/project/${slug}/settings/org/domains`]: [
      {
        name: 'Organization',
        link: `/project/${slug}/settings/org`,
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
