'use client';

import { useDebounce } from '@hexa/ui/hooks/use-debounce';
import { X } from '@hexa/ui/icons';
import { useEffect, useState } from 'react';

import { DataTableFacetedFilter } from '@/components/table/table-faceted-filter';
import type { TableToolbarProps } from '@/components/table/table-types';
import { Button } from '@hexa/ui/button';
import { Input } from '@hexa/ui/input';

export function TableToolbarDesktop<TData>({
  table,
  filterConfigs = [],
  searchPlaceholder = 'Search...',
  children,
}: TableToolbarProps<TData>) {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 1000);
  const isFiltered = table.getState().columnFilters.length > 0;

  useEffect(() => {
    if (value === '') {
      table.getColumn('search')?.setFilterValue('');
    } else {
      table.getColumn('search')?.setFilterValue(debouncedValue);
    }
  }, [debouncedValue, table, value]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={searchPlaceholder}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
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
            variant="ghost"
            onClick={() => {
              setValue('');
              table.resetColumnFilters();
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}
