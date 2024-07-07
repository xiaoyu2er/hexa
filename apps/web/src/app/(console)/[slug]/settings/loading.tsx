import { Skeleton } from "@hexa/ui/skeleton";

export default function () {
  return (
    <div className="flex flex-col w-full space-y-4">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-8 w-1/2" />
    </div>
  );
}
