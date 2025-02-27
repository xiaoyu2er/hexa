'use client';

import { Link } from '@heroui/react';
import { ChevronIcon } from '@heroui/shared-icons';
import { useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import type * as React from 'react';

import manifest from '@/config/routes.json';
import { useDocsRoute } from '@/hooks/use-docs-route';
import type { Route } from '@/libs/docs/page';
import { removeFromLast } from '@/utils';

export interface FooterNavProps {
  currentRoute?: Route;
}

export const DocsPager: React.FC<FooterNavProps> = ({ currentRoute }) => {
  const router = useRouter();

  const { prevRoute, nextRoute } = useDocsRoute(manifest.routes, currentRoute);

  const posthog = usePostHog();

  const handlePress = (path: string) => {
    posthog.capture('DocsPager - Click', {
      category: 'docs',
      action: 'click',
      data: path || '',
    });

    router.push(removeFromLast(path || '', '.'));
  };

  return (
    <div className="flex w-full justify-between py-20">
      {prevRoute ? (
        <Link
          isBlock
          className="flex cursor-pointer gap-2"
          color="foreground"
          onPress={() => handlePress(prevRoute.path || '')}
        >
          <ChevronIcon className="text-primary" height={20} width={20} />
          {prevRoute.title}
        </Link>
      ) : (
        <span />
      )}
      {nextRoute && (
        <Link
          isBlock
          className="flex cursor-pointer items-center gap-1"
          color="foreground"
          onPress={() => handlePress(nextRoute.path || '')}
        >
          {nextRoute.title}
          <ChevronIcon
            className="rotate-180 text-primary"
            height={20}
            width={20}
          />
        </Link>
      )}
    </div>
  );
};
