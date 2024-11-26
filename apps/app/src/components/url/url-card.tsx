import type { SelectUrlType } from '@/server/schema/url';
import {} from '@hexa/ui/dropdown-menu';
import { Skeleton } from '@hexa/ui/skeleton';
import type { Row } from '@tanstack/react-table';

export const UrlCardSkeleton = () => {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="mt-1 h-4 w-40" />
          <div className="mt-1 flex items-center gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
      <Skeleton className="h-8 w-8" />
    </div>
  );
};

export const UrlCardWithActions = ({ row }: { row: Row<SelectUrlType> }) => {
  const url = row.original;

  return url.destUrl;
};
