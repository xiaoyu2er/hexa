import { WorkspaceModel } from "@/lib/db";
import { getWorkspaceAvatarFallbackUrl } from "@/lib/workspace";
import { Avatar, AvatarImage, AvatarFallback } from "@hexa/ui/avatar";
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
        src={workspace?.avatarUrl!}
        alt="Workspace Profile Picture"
      />
      <AvatarFallback delayMs={200}>
        <Avatar>
          <AvatarImage
            src={getWorkspaceAvatarFallbackUrl(workspace)}
            alt={workspace?.name || "WS"}
          />
        </Avatar>
      </AvatarFallback>
    </Avatar>
  );
}
