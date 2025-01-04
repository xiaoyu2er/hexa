import { UserAvatar } from '@/components/user/settings/user-avatar';
import type { SelectOrgMemberType } from '@hexa/server/schema/org-member';
import { Badge } from '@hexa/ui/badge';

import { MoreHorizontal } from '@hexa/ui/icons';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { Skeleton } from '@nextui-org/react';
import type { Row } from '@tanstack/react-table';
import { capitalize } from 'lodash';

export const MemberCardSkeleton = () => {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="mt-1 h-4 w-40" />
          <div className="mt-1 flex items-center gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
      <Skeleton className="h-8 w-8" />
    </div>
  );
};

export const MemberCardWithActions = ({
  row,
}: { row: Row<SelectOrgMemberType> }) => {
  const member = row.original;

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <UserAvatar user={member.user} className="h-10 w-10" />
        <div>
          <div className="font-medium">{member.user.name}</div>
          <div className="text-muted-foreground text-sm">
            {member.user.email}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="secondary">{capitalize(member.role)}</Badge>
            <span className="text-muted-foreground text-sm">
              Joined {new Date(member.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly aria-label="Open menu" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          {member.role !== 'OWNER' ? (
            <DropdownItem key="remove" className="text-destructive">
              Remove member
            </DropdownItem>
          ) : null}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
