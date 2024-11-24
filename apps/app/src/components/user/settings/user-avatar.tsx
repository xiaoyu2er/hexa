'use client';

import { getAvatarFallbackUrl } from '@/lib/user';
import type { SelectUserType } from '@/server/schema/user';
import { Avatar, AvatarImage } from '@hexa/ui/avatar';
import { cn } from '@hexa/utils';

export function UserAvatar({
  user,
  className,
}: {
  user: Pick<SelectUserType, 'name' | 'avatarUrl'>;
  className?: string;
}) {
  return (
    <Avatar className={cn('h-6 w-6', className)}>
      <AvatarImage
        src={user.avatarUrl ?? getAvatarFallbackUrl(user)}
        alt={user.name}
      />
    </Avatar>
  );
}
