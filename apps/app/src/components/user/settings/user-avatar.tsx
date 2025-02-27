'use client';

import { getAvatarUrl } from '@/lib/user';
import { Avatar, type AvatarProps } from '@heroui/react';
import { cn } from '@hexa/lib';
import type { BasicUserType } from '@hexa/server/schema/user';

export function UserAvatar({
  user,
  className,
  ...props
}: {
  user: BasicUserType;
} & AvatarProps) {
  return (
    <Avatar
      className={cn('shrink-0', className)}
      src={getAvatarUrl(user)}
      name={user.name ?? ''}
      showFallback={false}
      {...props}
    />
  );
}
