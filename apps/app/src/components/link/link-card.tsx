'use client';

import { useProject } from '@/hooks/use-project';
import type { SelectLinkType } from '@/server/schema/link';
import { useModal } from '@ebay/nice-modal-react';
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
    <div className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-[filter] hover:drop-shadow-card-hover">
      <LinkInfo
        link={link}
        showClicks={true}
        clicksPosition="right"
        showDate={true}
        variant="badge"
      />
      <LinkActions link={link} project={project} modal={modal} />
    </div>
  );
}

export function LinkCardSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-1 items-center gap-3">
        {/* Icon skeleton */}
        <Skeleton className="h-10 w-10 rounded-full" />

        <div className="flex-1">
          {/* URL and copy button */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-6 w-6 rounded-md" />
          </div>

          {/* Destination URL and date */}
          <div className="mt-1 flex items-center gap-2">
            <Skeleton className="h-4 w-60" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>

      {/* Right side: clicks badge and actions */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-20 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
}
