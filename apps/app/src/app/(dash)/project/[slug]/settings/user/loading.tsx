import { Skeleton } from '@nextui-org/skeleton';

export default function () {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-1/2 rounded-lg" />
      <Skeleton className="h-10 w-1/2 rounded-lg" />
    </div>
  );
}
