'use client';

import { useProject } from '@/hooks/use-project';
import type { SelectLinkType } from '@/server/schema/link';
import { useModal } from '@ebay/nice-modal-react';
import { SparklesIcon } from '@hexa/ui/icons';
import { Skeleton } from '@hexa/ui/skeleton';
import type { Row } from '@tanstack/react-table';
import { LinkActions } from './link-actions';
import { LinkInfo } from './link-info';
import { LinkModal } from './link-modal';

export function LinkCard({ row }: { row: Row<SelectLinkType> }) {
  const link = row.original;
  const modal = useModal(LinkModal);
  const { project } = useProject();

  return (
    <div className="group flex items-center justify-between rounded-lg border border-gray-100 bg-white p-4 hover:border-gray-200">
      <LinkInfo link={link} showClicks={false} showDate={false} />
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 text-gray-600 text-sm">
          <SparklesIcon className="h-3.5 w-3.5" />
          {link.clicks || 0}
        </div>
        <LinkActions link={link} project={project} modal={modal} />
      </div>
    </div>
  );
}

export function LinkCardSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-4">
      <div className="flex min-w-0 flex-1">
        <div className="flex w-full items-start gap-3">
          {/* Icon skeleton */}
          <Skeleton className="h-10 w-10 flex-shrink-0 rounded-full" />

          <div className="min-w-0 flex-1">
            {/* URL and copy button */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-6 w-6 flex-shrink-0 rounded-md" />
            </div>

            {/* Destination URL */}
            <div className="mt-0.5">
              <Skeleton className="h-4 w-[230px] max-w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Right side: clicks badge and actions */}
      <div className="ml-4 flex flex-shrink-0 items-center gap-3">
        <Skeleton className="h-6 w-6 rounded-md" />
        <Skeleton className="h-6 w-6 rounded-md" />
      </div>
    </div>
  );
}
