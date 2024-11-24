'use client';
import { UserAvatar } from '@/components/user/settings/user-avatar';
import type { SelectOrgMemberType } from '@/server/schema/org-memeber';
import { Badge } from '@hexa/ui/badge';
import { Button } from '@hexa/ui/button';
import {} from '@hexa/ui/dropdown-menu';
import type { ColumnDef } from '@tanstack/react-table';
import { capitalize } from 'lodash';

export const columns: ColumnDef<SelectOrgMemberType>[] = [
  {
    id: 'user',
    header: () => <span className="pl-2">User</span>,
    cell: ({ row }) => {
      const member = row.original;
      return (
        <div className="flex items-center gap-2">
          <UserAvatar user={member.user} className="h-6 w-6" />
          {member.user.name}
          <Badge variant="secondary">{capitalize(member.role)}</Badge>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const _org = row.original;
      return (
        <div className="flex items-center justify-end gap-2">
          <Button variant="destructive" size="sm">
            Leave
          </Button>
        </div>
      );
    },
  },
];
