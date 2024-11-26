'use client';
import RevokeInvite from '@/components/orgs/invite/invite-revoke-button';
import { TableColumnHeader } from '@/components/table/table-column-header';
import { UserAvatar } from '@/components/user/settings/user-avatar';
import { invalidateOrgInvites } from '@/lib/queries/orgs';
import { InviteSortableColumnOptions } from '@/server/schema/org-invite';
import type { QueryInviteType } from '@/server/schema/org-invite';
import { Badge } from '@hexa/ui/badge';
import type { ColumnDef } from '@tanstack/react-table';
import { capitalize } from 'lodash';
import { InviteLink } from './invite-link';

// Helper function to get column label
const getColumnLabel = (columnId: string) =>
  InviteSortableColumnOptions.find((option) => option.value === columnId)
    ?.label ?? capitalize(columnId);

export const columns: ColumnDef<QueryInviteType>[] = [
  { id: 'search' },
  {
    id: 'email',
    accessorKey: 'email',
    header: ({ column }) => (
      <TableColumnHeader column={column} title={getColumnLabel('email')} />
    ),
    cell: ({ row }) => {
      const invite = row.original;
      return <div className="flex items-center gap-2">{invite.email}</div>;
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <TableColumnHeader column={column} title={getColumnLabel('role')} />
    ),
    cell: ({ row }) => {
      const invite = row.original;
      return <Badge variant="secondary">{capitalize(invite.role)}</Badge>;
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'inviter',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Inviter" />
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
      <TableColumnHeader column={column} title={getColumnLabel('createdAt')} />
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
      <TableColumnHeader column={column} title={getColumnLabel('expiresAt')} />
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
      <TableColumnHeader column={column} title={getColumnLabel('status')} />
    ),
    cell: ({ row }) => {
      const invite = row.original;
      return <Badge variant="secondary">{capitalize(invite.status)}</Badge>;
    },
  },
  {
    id: 'invite-link',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Invite Link" />
    ),
    cell: ({ row }) => {
      const invite = row.original;
      return <InviteLink token={invite.token} />;
    },
    enableSorting: false,
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
                invalidateOrgInvites(invite.orgId, {
                  pagination: table.getState().pagination,
                  sorting: table.getState().sorting,
                  filters: table.getState().columnFilters,
                });
              }}
            />
          )}
        </div>
      );
    },
  },
];
