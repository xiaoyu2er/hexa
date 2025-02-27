import { Skeleton } from '@heroui/react';

export default function () {
  return (
    <div className="flex w-full flex-col space-y-4">
      <Skeleton className="h-8 w-1/2 rounded-lg" />
      <Skeleton className="h-8 w-1/2 rounded-lg" />
    </div>
  );
}
