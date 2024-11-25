'use client';

import type { TableToolbarMobileProps } from '@/components/table/table-types';
import { Badge } from '@hexa/ui/badge';
import { Button } from '@hexa/ui/button';
import { Checkbox } from '@hexa/ui/checkbox';
import { useDebounce } from '@hexa/ui/hooks/use-debounce';
import { ArrowDown, ArrowUp, Filter, X } from '@hexa/ui/icons';
import { Input } from '@hexa/ui/input';
import { Label } from '@hexa/ui/label';
import { RadioGroup, RadioGroupItem } from '@hexa/ui/radio-group';
import { Separator } from '@hexa/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@hexa/ui/sheet';
import { capitalize } from 'lodash';
import { useEffect, useState } from 'react';

export function TableToolbarMobile<TData>({
  table,
  filterConfigs = [],
  sortOptions,
  searchPlaceholder = 'Search...',
}: TableToolbarMobileProps<TData>) {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 1000);
  const currentSort = table.getState().sorting[0];
  const isFiltered = table.getState().columnFilters.length > 0;
  const isSorted = Boolean(currentSort);

  // Handle search
  useEffect(() => {
    if (value === '') {
      table.getColumn('search')?.setFilterValue('');
    } else {
      table.getColumn('search')?.setFilterValue(debouncedValue);
    }
  }, [debouncedValue, table, value]);

  return (
    <div className="space-y-2">
      {/* Search and Filter Button */}
      <div className="flex gap-2">
        <Input
          placeholder={searchPlaceholder}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="h-10"
        />
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="relative h-10 w-10"
            >
              <Filter className="h-4 w-4" />
              {(isFiltered || isSorted) && (
                <div className="-right-0.5 -top-0.5 absolute h-2 w-2 rounded-full bg-blue-500" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="flex h-[80vh] flex-col">
            <SheetHeader className="pb-3">
              <SheetTitle>Filter & Sort</SheetTitle>
            </SheetHeader>

            {/* Make content scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-3">
                {/* Sort Section */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="font-medium">Sort by</div>
                  </div>
                  <RadioGroup value={currentSort?.id || ''}>
                    {sortOptions.map((option) => (
                      // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                      <div
                        key={String(option.value)}
                        className="flex items-center justify-between py-1.5"
                        onClick={() => {
                          if (currentSort?.id === option.value) {
                            table.setSorting([
                              {
                                id: String(option.value),
                                desc: !currentSort.desc,
                              },
                            ]);
                          } else {
                            table.setSorting([
                              { id: String(option.value), desc: false },
                            ]);
                          }
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={String(option.value)}
                            id={String(option.value)}
                            className="cursor-pointer"
                          />
                          <Label
                            htmlFor={String(option.value)}
                            className="cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                        {currentSort?.id === option.value && (
                          <div className="flex items-center text-muted-foreground">
                            {currentSort.desc ? (
                              <>
                                <ArrowDown className="mr-1 h-4 w-4" />
                                <span className="text-sm">Desc</span>
                              </>
                            ) : (
                              <>
                                <ArrowUp className="mr-1 h-4 w-4" />
                                <span className="text-sm">Asc</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {isSorted && (
                  <>
                    <Separator className="my-3" />
                    <Button
                      variant="outline"
                      onClick={() => table.resetSorting()}
                      className="w-full"
                    >
                      Reset Sort
                      <X className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                )}

                {filterConfigs.length > 0 && <Separator className="my-3" />}

                {/* Filters Section */}
                {filterConfigs.length > 0 && (
                  <div>
                    <div className="mb-1.5 font-medium">Filters</div>
                    {filterConfigs.map((config) => {
                      const column = table.getColumn(String(config.columnId));
                      const columnFilters =
                        (column?.getFilterValue() as string[]) || [];

                      return (
                        <div key={String(config.columnId)} className="mb-3">
                          <Label className="mb-1.5 font-medium text-muted-foreground">
                            {config.label}
                          </Label>
                          <div className="space-y-1.5">
                            {config.options.map((option) => (
                              <div
                                key={String(option.value)}
                                className="flex items-center space-x-2 py-1"
                              >
                                <Checkbox
                                  id={`${String(config.columnId)}-${String(
                                    option.value
                                  )}`}
                                  checked={columnFilters.includes(
                                    String(option.value)
                                  )}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      column?.setFilterValue([
                                        ...columnFilters,
                                        option.value,
                                      ]);
                                    } else {
                                      column?.setFilterValue(
                                        columnFilters.filter(
                                          (value) => value !== option.value
                                        )
                                      );
                                    }
                                  }}
                                />
                                <Label
                                  htmlFor={`${String(config.columnId)}-${String(
                                    option.value
                                  )}`}
                                  className="cursor-pointer font-normal"
                                >
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Sticky reset button at bottom */}
            {isFiltered && (
              <div className="sticky bottom-0 border-t bg-background pt-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setValue('');
                    table.resetColumnFilters();
                  }}
                  className="w-full"
                >
                  Reset Filters
                  <X className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters and Sort Display */}
      {(isFiltered || isSorted) && (
        <div className="flex flex-wrap gap-1">
          {/* Sort Badge */}
          {isSorted && (
            <Badge variant="secondary" className="text-xs">
              Sort:
              {sortOptions.find((opt) => opt.value === currentSort?.id)?.label}
              {currentSort?.desc ? ' (Desc)' : ' (Asc)'}
            </Badge>
          )}
          {/* Filter Badges */}
          {table
            .getState()
            .columnFilters.filter((f) => f.id !== 'search')
            .map((filter) => {
              const values = filter.value as string[];
              const config = filterConfigs.find(
                (c) => String(c.columnId) === filter.id
              );
              return values.map((value) => (
                <Badge
                  key={`${filter.id}-${value}`}
                  variant="secondary"
                  className="text-xs"
                >
                  {config?.label || capitalize(filter.id)}:
                  {config?.options.find((opt) => String(opt.value) === value)
                    ?.label || value}
                </Badge>
              ));
            })}
        </div>
      )}
    </div>
  );
}
