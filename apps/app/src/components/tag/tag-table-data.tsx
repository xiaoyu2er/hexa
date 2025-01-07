'use client';

import { TableColumnHeader } from '@/components/table/table-column-header';
import type { FilterConfig } from '@/components/table/table-types';
import { useTags } from '@/hooks/use-tags';
import {} from '@hexa/server/schema/org-member';
import {
  type SelectTagType,
  TagColumnOptions,
  TagSortableColumnOptions,
} from '@hexa/server/schema/tag';

import { MoreHorizontal } from '@hexa/ui/icons';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import type { ColumnDef } from '@tanstack/react-table';
import { capitalize } from 'lodash';

// Helper function to get column label
const getColumnLabel = (columnId: string) =>
  TagColumnOptions.find((option) => option.value === columnId)?.label ??
  capitalize(columnId);

export const columns: ColumnDef<SelectTagType>[] = [
  { id: 'search' },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <TableColumnHeader column={column} title={getColumnLabel('name')} />
    ),
    cell: ({ row }) => {
      const tag = row.original;
      return tag.name;
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const tag = row.original;
      return (
        <div className="flex justify-end">
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                aria-label="Open menu"
                variant="light"
                size="sm"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key="edit" color="danger" className="text-danger">
                Edit
              </DropdownItem>
              <DropdownItem key="delete" color="danger" className="text-danger">
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    },
  },
];

export const filterConfigs: FilterConfig<SelectTagType>[] = [];
export const sortOptions = TagSortableColumnOptions;
export const searchPlaceholder = 'Search tags';
export const useData = useTags;
