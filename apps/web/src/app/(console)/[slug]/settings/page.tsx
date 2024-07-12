import { DeleteWorkspace } from "@/components/workspace-settings/delete-workspace";
import { EditWorkspaceName } from "@/components/workspace-settings/edit-workspace-name";
import { EditWorkspaceSlug } from "@/components/workspace-settings/edit-workspace-slug";
import { UploadWorkspaceAvatar } from "@/components/workspace-settings/upload-workspace-avatar";
import { WorkspaceId } from "@/components/workspace-settings/workspace-id";

export default function ({ params: { slug } }: { params: { slug: string } }) {
  return (
    <>
      <EditWorkspaceName slug={slug} />
      <EditWorkspaceSlug slug={slug} />
      <UploadWorkspaceAvatar slug={slug} />
      <WorkspaceId slug={slug} />
      <DeleteWorkspace />
    </>
  );
}
