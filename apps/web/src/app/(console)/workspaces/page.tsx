import { CreateWorkspace } from "@/components/workspaces/create-workspace";
import { WorkspaceList } from "@/components/workspaces/workspace-list";
import { MaxWidth } from "@hexa/ui/max-width";
import { Suspense } from "react";
import { CardSkeleton } from "@hexa/ui/card-skeleton";

export const dynamic = "force-dynamic";

export default function () {
  return (
    <main className="min-h-[calc(100vh-16px)]">
      <div className="flex h-36 items-center border-b">
        <MaxWidth>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold">Workspaces</h1>
            <CreateWorkspace />
          </div>
        </MaxWidth>
      </div>

      <MaxWidth>
        <div className="py-6 lg:py-10 max-w-6xl">
          <Suspense
            fallback={
              <div className="flex gap-5 flex-wrap">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            }
          >
            <WorkspaceList />
          </Suspense>
        </div>
      </MaxWidth>
    </main>
  );
}
