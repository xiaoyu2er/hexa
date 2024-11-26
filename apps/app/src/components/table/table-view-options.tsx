'use client';
import type { SortOption } from '@/components/table/table-types';
import { Button } from '@hexa/ui/button';
import { DropdownMenuTrigger } from '@hexa/ui/dropdown-menu';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@hexa/ui/dropdown-menu';
import { Settings2 } from '@hexa/ui/icons';
import type { Table } from '@tanstack/react-table';

// Helper function to get column label
function getColumnLabel<TData>(options: SortOption<TData>[], columnId: string) {
  // First check for sortable columns
  const sortableOption = options.find((option) => option.value === columnId);
  if (sortableOption) {
    return sortableOption.label;
  }

  return columnId;
}

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  sortOptions: SortOption<TData>[];
}

export function DataTableViewOptions<TData>({
  table,
  sortOptions = [],
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <Settings2 strokeWidth={1.5} size={16} className="mr-2" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== 'undefined' && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {getColumnLabel(sortOptions, column.id)}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
