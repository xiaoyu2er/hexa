import type { SelectWorkspaceType } from '@/features/workspace/schema';
import { getWorkspaceAvatarFallbackUrl } from '@/lib/workspace';
import { Avatar, AvatarImage } from '@hexa/ui/avatar';
import { cn } from '@hexa/utils';

export function WorkspaceAvatar({
  workspace,
  className,
}: {
  workspace: SelectWorkspaceType;
  className: string;
}) {
  return (
    <Avatar className={cn('h-6 w-6', className)}>
      <AvatarImage
        src={workspace.avatarUrl || getWorkspaceAvatarFallbackUrl(workspace)}
        alt="Workspace Profile Picture"
      />
    </Avatar>
  );
}
