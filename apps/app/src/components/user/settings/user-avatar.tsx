'use client';

import { getAvatarFallbackUrl } from '@/lib/user';
import { cn } from '@hexa/lib';
import type { SelectUserType } from '@hexa/server/schema/user';
import { Avatar, type AvatarProps } from '@nextui-org/react';

export function UserAvatar({
  user,
  className,
  ...props
}: {
  user: Pick<SelectUserType, 'name' | 'avatarUrl'>;
} & AvatarProps) {
  return (
    <Avatar
      className={cn('shrink-0', className)}
      src={user.avatarUrl ?? getAvatarFallbackUrl(user)}
      name={user.name}
      showFallback={false}
      {...props}
    />
  );
}
