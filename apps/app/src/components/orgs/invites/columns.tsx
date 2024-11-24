'use client';
import { UserAvatar } from '@/components/user/settings/user-avatar';
import type { SelectInviteType } from '@/server/schema/org-invite';
import { Badge } from '@hexa/ui/badge';
import { Button } from '@hexa/ui/button';
import {} from '@hexa/ui/dropdown-menu';
import type { ColumnDef } from '@tanstack/react-table';
import { capitalize } from 'lodash';

export const columns: ColumnDef<SelectInviteType>[] = [
  {
    id: 'invitee',
    header: () => <span className="pl-2">Invitee</span>,
    cell: ({ row }) => {
      const member = row.original;
      return (
        <div className="flex items-center gap-2">
          {member.email}
          <Badge variant="secondary">{capitalize(member.role)}</Badge>
        </div>
      );
    },
  },
  {
    id: 'inviter',
    header: () => <span className="pl-2">Inviter</span>,
    cell: ({ row }) => {
      const member = row.original;
      return (
        <div className="flex items-center gap-2">
          <UserAvatar user={member.inviter} className="h-6 w-6" />
          {member.inviter.name}
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: () => <span className="pl-2">Created At</span>,
    cell: ({ row }) => {
      const invite = row.original;
      return <div>{new Date(invite.createdAt).toLocaleString()}</div>;
    },
  },
  {
    accessorKey: 'expiresAt',
    header: () => <span className="pl-2">Expires At</span>,
    cell: ({ row }) => {
      const invite = row.original;
      return <div>{new Date(invite.expiresAt).toLocaleString()}</div>;
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
