import {
  getWorkspaceAvatarFallbackName,
  getWorkspaceAvatarFallbackUrl,
} from "@/lib/workspace";
import type { WorkspaceModel } from "@/server/db";
import { Avatar, AvatarFallback, AvatarImage } from "@hexa/ui/avatar";
import { cn } from "@hexa/utils";

export function WorkspaceAvatar({
  workspace,
  className,
}: {
  workspace: WorkspaceModel;
  className: string;
}) {
  return (
    <Avatar className={cn("h-6 w-6", className)}>
      <AvatarImage
        src={workspace?.avatarUrl || getWorkspaceAvatarFallbackUrl(workspace)}
        alt="Workspace Profile Picture"
      />
      <AvatarFallback delayMs={200}>
        {getWorkspaceAvatarFallbackName(workspace)}
      </AvatarFallback>
    </Avatar>
  );
}
