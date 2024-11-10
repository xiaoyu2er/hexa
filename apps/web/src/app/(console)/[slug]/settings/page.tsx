import { DeleteWorkspace } from "@/components/workspace-settings/delete-workspace";
import { EditWorkspaceName } from "@/components/workspace-settings/edit-workspace-name";
import { EditWorkspaceSlug } from "@/components/workspace-settings/edit-workspace-slug";
import { UploadWorkspaceAvatar } from "@/components/workspace-settings/upload-workspace-avatar";
import { WorkspaceId } from "@/components/workspace-settings/workspace-id";

export default async function ({
  params,
}: {
  // https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#good-to-know
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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
