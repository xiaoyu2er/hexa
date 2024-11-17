import { CreateWorkspace } from '@/components/workspaces/create-workspace';
import { WorkspaceList } from '@/components/workspaces/workspace-list';
import { CardSkeleton } from '@hexa/ui/card-skeleton';
import { MaxWidth } from '@hexa/ui/max-width';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function () {
  return (
    <main className="min-h-[calc(100vh-16px)]">
      <div className="flex h-36 items-center border-b">
        <MaxWidth>
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-3xl">Workspaces</h1>
            <CreateWorkspace />
          </div>
        </MaxWidth>
      </div>

      <MaxWidth>
        <div className="max-w-6xl py-6 lg:py-10">
          <Suspense
            fallback={
              <div className="flex flex-wrap gap-5">
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
