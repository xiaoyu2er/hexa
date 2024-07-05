import { CreateWorkspace } from "@/components/workspaces/create-workspace";
import { WorkspaceList } from "@/components/workspaces/workspace-list";
import { MaxWidth } from "@hexa/ui/max-width";

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
        <div className="py-6 lg:py-10 grid max-w-6xl items-start gap-6 md:grid-cols-[120px_1fr] lg:grid-cols-[180px_1fr]">
          <WorkspaceList />
        </div>
      </MaxWidth>
    </main>
  );
}
