import { DeleteWorkspace } from '@/components/workspace-settings/delete-workspace';
import { EditWorkspaceName } from '@/components/workspace-settings/edit-workspace-name';
import { UploadWorkspaceAvatar } from '@/components/workspace-settings/upload-workspace-avatar';
import { WorkspaceId } from '@/components/workspace-settings/workspace-id';

export default async function ({
  params,
}: {
  // https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#good-to-know
  params: Promise<{ owner: string; ws: string }>;
}) {
  const { owner, ws } = await params;
  const slug = `${owner}/${ws}`;
  return (
    <>
      <EditWorkspaceName slug={slug} />
      <UploadWorkspaceAvatar slug={slug} />
      <WorkspaceId slug={slug} />
      <DeleteWorkspace />
    </>
  );
}
