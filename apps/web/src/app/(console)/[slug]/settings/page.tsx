import { DeleteWorkspace } from "@/components/workspace-settings/delete-workspace";
import { EditWorkspaceName } from "@/components/workspace-settings/edit-workspace-name";
import { EditWorkspaceSlug } from "@/components/workspace-settings/edit-workspace-slug";
import { UploadWorkspaceAvatar } from "@/components/workspace-settings/upload-workspace-avatar";
import { WorkspaceId } from "@/components/workspace-settings/workspace-id";
import { getWorkspaceBySlug } from "@/lib/db/data-access/workspace";

export default async function ({ params }: { params: { slug: string } }) {
  const ws = await getWorkspaceBySlug(params.slug);
  return (
    <>
      <EditWorkspaceName ws={ws!} />
      <EditWorkspaceSlug ws={ws!} />
      <UploadWorkspaceAvatar ws={ws!} />
      <WorkspaceId ws={ws!} />
      <DeleteWorkspace ws={ws!} />
    </>
  );
}
