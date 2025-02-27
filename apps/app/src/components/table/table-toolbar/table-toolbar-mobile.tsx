'use client';

import { TableToolbarSearch } from '@/components/table/table-toolbar/table-toolbar-search';
import type { TableToolbarProps } from '@/components/table/table-types';
import { Button } from '@heroui/react';
import { Badge } from '@hexa/ui/badge';
import { X } from '@hexa/ui/icons';

export function TableToolbarMobile<TData>({
  table,
  filterConfigs = [],
  searchPlaceholder = 'Search...',
  children,
  sortOptions = [],
}: TableToolbarProps<TData>) {
  const activeFilters = table.getState().columnFilters;
  const activeSort = table.getState().sorting[0];
  const hasActiveState = activeFilters.length > 0 || activeSort;

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <TableToolbarSearch table={table} placeholder={searchPlaceholder} />
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
              <X className="h-3 w-3" />
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
                  <X className="h-3 w-3" />
                </Badge>
              );
            });
          })}

          {/* Clear All Button */}
          <Button
            variant="light"
            size="sm"
            className="h-7 px-2 text-xs"
            onPress={() => {
              table.resetColumnFilters();
              table.resetSorting();
              table.getColumn('search')?.setFilterValue('');
            }}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
