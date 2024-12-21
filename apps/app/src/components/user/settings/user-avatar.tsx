'use client';

import { getAvatarFallbackUrl } from '@/lib/user';
import type { SelectUserType } from '@hexa/server/schema/user';
import { Avatar, type AvatarProps } from '@nextui-org/react';
import { cn } from '../../../../../../packages/lib/src';

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
