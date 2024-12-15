'use client';

import { getAvatarFallbackUrl } from '@/lib/user';
import type { SelectUserType } from '@/server/schema/user';
import { cn } from '@hexa/utils';
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
