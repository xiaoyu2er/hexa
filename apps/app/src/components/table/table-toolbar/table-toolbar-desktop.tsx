'use client';
import { X } from '@hexa/ui/icons';

import { DataTableFacetedFilter } from '@/components/table/table-toolbar/table-faceted-filter';
import { TableToolbarSearch } from '@/components/table/table-toolbar/table-toolbar-search';
import type { TableToolbarProps } from '@/components/table/table-types';
import { Button } from '@nextui-org/react';

export function TableToolbarDesktop<TData>({
  table,
  filterConfigs = [],
  searchPlaceholder = 'Search...',
  children,
}: TableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center space-x-2">
        <TableToolbarSearch
          table={table}
          placeholder={searchPlaceholder}
          className="w-[150px] lg:w-[250px]"
        />
        {filterConfigs.map((config) => {
          const column = table.getColumn(String(config.columnId));
          if (!column) {
            return null;
          }

          return (
            <DataTableFacetedFilter
              key={String(config.columnId)}
              column={column}
              title={config.label}
              options={config.options}
            />
          );
        })}
        {isFiltered && (
          <Button
            variant="light"
            size="sm"
            onClick={() => {
              table.getColumn('search')?.setFilterValue('');
              table.resetColumnFilters();
            }}
            endContent={<X className="h-4 w-4" strokeWidth={1.5} />}
          >
            Reset
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}
