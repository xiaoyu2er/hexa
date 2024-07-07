import { getAvatarFallbackUrl } from "@/lib/user";
import { Avatar, AvatarFallback, AvatarImage } from "@hexa/ui/avatar";
import { cn } from "@hexa/utils";
import { User } from "lucia";

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
        src={user?.avatarUrl!}
        alt={user?.name || "User Profile Picture"}
      />
      <AvatarFallback delayMs={200}>
        <Avatar>
          <AvatarImage
            src={getAvatarFallbackUrl(user)}
            alt={user?.name || "User Fallback Profile Picture"}
          />
        </Avatar>
      </AvatarFallback>
    </Avatar>
  );
}
