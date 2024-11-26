'use client';

import { TableColumnHeader } from '@/components/table/table-column-header';
import type { FilterConfig } from '@/components/table/table-types';
import { useUrls } from '@/hooks/use-urls';
import {} from '@/server/schema/org-member';
import {
  type SelectUrlType,
  UrlColumnOptions,
  UrlSortableColumnOptions,
} from '@/server/schema/url';
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
  UrlColumnOptions.find((option) => option.value === columnId)?.label ??
  capitalize(columnId);

export const columns: ColumnDef<SelectUrlType>[] = [
  { id: 'search' },

  {
    accessorKey: 'title',
    header: ({ column }) => (
      <TableColumnHeader column={column} title={getColumnLabel('title')} />
    ),
  },
  {
    accessorKey: 'destUrl',
    header: ({ column }) => (
      <TableColumnHeader column={column} title={getColumnLabel('destUrl')} />
    ),
  },
  {
    accessorKey: 'domain',
    header: ({ column }) => (
      <TableColumnHeader column={column} title={getColumnLabel('domain')} />
    ),
  },
  {
    accessorKey: 'slug',
    header: ({ column }) => (
      <TableColumnHeader column={column} title={getColumnLabel('slug')} />
    ),
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
              (<DropdownMenuItem className="">Edit</DropdownMenuItem>)
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export const useData = useUrls;
export const filterConfigs: FilterConfig<SelectUrlType>[] = [
  {
    columnId: 'domain',
    label: 'Domain',
    options: [
      { label: 'All', value: '' },
      { label: 'Hexa', value: 'hexa.im' },
      { label: 'Google', value: 'google.com' },
    ],
  },
];
export const searchPlaceholder = 'Search url...';
export const sortOptions = UrlSortableColumnOptions;
