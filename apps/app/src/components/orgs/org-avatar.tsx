'use client';

import { getOrgAvatarFallbackUrl } from '@/lib/org';
import type { SelectOrgType } from '@/server/schema/org';

import { cn } from '@hexa/utils';
import { Avatar, type AvatarProps } from '@nextui-org/react';

export function OrgAvatar({
  org,
  className,
  ...props
}: {
  org: SelectOrgType;
} & AvatarProps) {
  return (
    <Avatar
      className={cn('shrink-0', className)}
      name={org?.name || 'Organization Profile Picture'}
      src={org?.avatarUrl || getOrgAvatarFallbackUrl(org)}
      showFallback={false}
      {...props}
    />
  );
}
