'use client';

import { TableColumnHeader } from '@/components/table/table-column-header';
import { UserAvatar } from '@/components/user/settings/user-avatar';
import {
  OrgMemberColumnOptions,
  type SelectOrgMemberType,
} from '@/server/schema/org-member';
import { Badge } from '@hexa/ui/badge';
import { Button } from '@hexa/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@hexa/ui/dropdown-menu';
import { MoreHorizontal } from '@hexa/ui/icons';
import type { ColumnDef } from '@tanstack/react-table';
import { capitalize } from 'lodash';

// Helper function to get column label
const getColumnLabel = (columnId: string) =>
  OrgMemberColumnOptions.find((option) => option.value === columnId)?.label ??
  capitalize(columnId);

export const columns: ColumnDef<SelectOrgMemberType>[] = [
  { id: 'search' },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <TableColumnHeader column={column} title={getColumnLabel('user')} />
    ),
    cell: ({ row }) => {
      const member = row.original;
      return (
        <div className="flex items-center gap-3">
          <UserAvatar user={member.user} className="h-8 w-8" />
          <div className="flex flex-col">
            <span className="font-medium">{member.user.name}</span>
            <span className="text-muted-foreground text-sm">
              {member.user.email}
            </span>
          </div>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <TableColumnHeader column={column} title={getColumnLabel('role')} />
    ),
    cell: ({ row }) => {
      const role = row.original.role;
      return <Badge variant="secondary">{capitalize(role)}</Badge>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <TableColumnHeader column={column} title={getColumnLabel('createdAt')} />
    ),
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString();
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const member = row.original;
      const isOwner = member.role === 'OWNER';

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!isOwner && (
                <DropdownMenuItem className="text-destructive">
                  Remove member
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
