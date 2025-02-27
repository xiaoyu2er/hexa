import { Skeleton } from '@heroui/react';

export function CardSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] rounded-lg" />
        <Skeleton className="h-4 w-[200px] rounded-lg" />
      </div>
    </div>
  );
}
