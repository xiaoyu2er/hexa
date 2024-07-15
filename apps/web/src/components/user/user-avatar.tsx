import { getAvatarFallbackName, getAvatarFallbackUrl } from "@/lib/user";
import { Avatar, AvatarFallback, AvatarImage } from "@hexa/ui/avatar";
import { cn } from "@hexa/utils";
import type { User } from "lucia";

export function UserAvatar({
  user,
  className,
}: {
  user: User;
  className: string;
}) {
  return (
    <Avatar className={cn("h-6 w-6", className)}>
      <AvatarImage
        src={user?.avatarUrl || getAvatarFallbackUrl(user)}
        alt={user?.name || "User Profile Picture"}
      />
      <AvatarFallback delayMs={200}>
        {getAvatarFallbackName(user)}
      </AvatarFallback>
    </Avatar>
  );
}
