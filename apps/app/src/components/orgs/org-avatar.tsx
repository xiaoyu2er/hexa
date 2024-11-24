'use client';

import { getOrgAvatarFallbackUrl } from '@/lib/org';
import type { SelectOrgType } from '@/server/schema/org';
import { Avatar, AvatarImage } from '@hexa/ui/avatar';
import { cn } from '@hexa/utils';

export function OrgAvatar({
  org,
  className,
}: {
  org: SelectOrgType;
  className: string;
}) {
  return (
    <Avatar className={cn('h-6 w-6', className)}>
      <AvatarImage
        src={org?.avatarUrl || getOrgAvatarFallbackUrl(org)}
        alt={org?.name || 'Organization Profile Picture'}
      />
    </Avatar>
  );
}
