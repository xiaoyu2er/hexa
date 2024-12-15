'use client';

import type { TableToolbarProps } from '@/components/table/table-types';
import { Badge } from '@hexa/ui/badge';
import { Button } from '@hexa/ui/button';
import { useDebounce } from '@hexa/ui/hooks/use-debounce';
import { X } from '@hexa/ui/icons';
import { Input } from '@hexa/ui/input';
import { useEffect, useState } from 'react';

export function TableToolbarMobile<TData>({
  table,
  filterConfigs = [],
  searchPlaceholder = 'Search...',
  children,
  sortOptions = [],
}: TableToolbarProps<TData>) {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 1000);
  const activeFilters = table.getState().columnFilters;
  const activeSort = table.getState().sorting[0];
  const hasActiveState = activeFilters.length > 0 || activeSort;

  useEffect(() => {
    if (value === '') {
      table.getColumn('search')?.setFilterValue('');
    } else {
      table.getColumn('search')?.setFilterValue(debouncedValue);
    }
  }, [debouncedValue, table, value]);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder={searchPlaceholder}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="h-8"
        />
        {children}
      </div>

      {/* Active State Display */}
      {hasActiveState && (
        <div className="flex flex-wrap gap-1">
          {/* Sort Badge */}
          {activeSort && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <span className="text-xs">
                {(() => {
                  const option = sortOptions.find(
                    (opt) => opt.value === activeSort.id
                  );
                  return `Sort: ${option?.label} ${activeSort.desc ? '↓' : '↑'}`;
                })()}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => {
                  table.resetSorting();
                }}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear sort</span>
              </Button>
            </Badge>
          )}

          {/* Filter Badges */}
          {activeFilters.map((filter) => {
            // Skip search filter from badges
            if (filter.id === 'search') {
              return null;
            }

            const config = filterConfigs.find(
              (config) => config.columnId === filter.id
            );
            if (!config) {
              return null;
            }

            const values = filter.value as string[];
            return values.map((value) => {
              const option = config.options.find(
                (opt) => String(opt.value) === value
              );
              if (!option) {
                return null;
              }

              return (
                <Badge
                  key={`${filter.id}-${value}`}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <span className="text-xs">
                    {config.label}: {option.label}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => {
                      const newValues = values.filter((v) => v !== value);
                      const column = table.getColumn(filter.id);
                      column?.setFilterValue(
                        newValues.length ? newValues : undefined
                      );
                    }}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove filter</span>
                  </Button>
                </Badge>
              );
            });
          })}

          {/* Clear All Button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => {
              table.resetColumnFilters();
              table.resetSorting();
            }}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
