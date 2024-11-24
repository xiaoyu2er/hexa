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
import { Fragment } from 'react';
export const getSidebarBreadcrumb = ({
  slug,
  pathname,
}: { slug: string; pathname: string }) => {
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
    [`/project/${slug}/org`]: [
      {
        name: 'Organization',
      },
      {
        name: 'Settings',
      },
    ],
    [`/project/${slug}/org/members`]: [
      {
        name: 'Organization',
      },
      {
        name: 'Members',
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
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => {
          return (
            <Fragment key={item.name}>
              <BreadcrumbItem>
                {item.link ? (
                  <BreadcrumbLink href={item.link}>{item.name}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index !== breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
