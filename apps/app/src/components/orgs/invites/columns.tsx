'use client';
import { DataTableColumnHeader } from '@/components/orgs/invites/data-table-column-header';
import RevokeInvite from '@/components/orgs/invites/revoke-invite';
import { UserAvatar } from '@/components/user/settings/user-avatar';
import { invalidateOrgInvites } from '@/lib/queries/orgs';
import type { QueryInviteType } from '@/server/schema/org-invite';
import { Badge } from '@hexa/ui/badge';
import {} from '@hexa/ui/dropdown-menu';
import type { ColumnDef } from '@tanstack/react-table';
import { capitalize } from 'lodash';

export const columns: ColumnDef<QueryInviteType>[] = [
  { id: 'search' },

  {
    id: 'email',
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invitee" className="ml-2" />
    ),
    cell: ({ row }) => {
      const invite = row.original;
      return <div className="flex items-center gap-2">{invite.email}</div>;
    },

    enableSorting: true,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const invite = row.original;
      return <Badge variant="secondary">{capitalize(invite.role)}</Badge>;
    },
    enableSorting: true,
  },
  {
    accessorKey: 'inviter',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inviter" />
    ),
    cell: ({ row }) => {
      const member = row.original;
      return (
        <div className="flex items-center gap-2">
          <UserAvatar user={member.inviter} className="h-6 w-6" />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {member.inviter.name}
            </span>
            <span className="truncate text-xs">{member.inviter.email}</span>
          </div>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invited At" />
    ),
    cell: ({ row }) => {
      const invite = row.original;
      return <div>{new Date(invite.createdAt).toLocaleString()}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: 'expiresAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expires At" />
    ),
    cell: ({ row }) => {
      const invite = row.original;
      return <div>{new Date(invite.expiresAt).toLocaleString()}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const invite = row.original;
      return <Badge variant="secondary">{capitalize(invite.status)}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const invite = row.original;
      return (
        <div className="flex items-center justify-end gap-2">
          {invite.status === 'PENDING' && (
            <RevokeInvite
              invite={invite}
              onSuccess={() => {
                // table.setPageIndex(0);
                invalidateOrgInvites(invite.orgId, table.getState().pagination);
              }}
            />
          )}
        </div>
      );
    },
  },
];
