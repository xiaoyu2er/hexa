import { Skeleton } from "@hexa/ui/skeleton";

export default function () {
  return (
    <div className="">
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-10 w-1/2" />
      </div>
    </div>
  );
}
