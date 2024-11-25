'use client';

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
import type { Table } from '@tanstack/react-table';
import { capitalize } from 'lodash';
import { useEffect, useState } from 'react';

import {
  InviteRoleOptions,
  InviteStatusOptions,
  SortableColumnOptions,
} from '@/server/schema/org-invite';

interface MobileTableToolbarProps<TData> {
  table: Table<TData>;
}

export function MobileTableToolbar<TData>({
  table,
}: MobileTableToolbarProps<TData>) {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 1000);
  const currentSort = table.getState().sorting[0];
  const isFiltered = table.getState().columnFilters.length > 0;
  const isSorted = Boolean(currentSort);

  useEffect(() => {
    if (value === '') {
      table.getColumn('search')?.setFilterValue('');
    } else {
      table.getColumn('search')?.setFilterValue(debouncedValue);
    }
  }, [debouncedValue, table, value]);

  const roleColumn = table.getColumn('role');
  const statusColumn = table.getColumn('status');

  const roleFilters = (roleColumn?.getFilterValue() as string[]) || [];
  const statusFilters = (statusColumn?.getFilterValue() as string[]) || [];

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Search invitee..."
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="h-10"
        />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Filter className="h-4 w-4" />
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
                    {SortableColumnOptions.map((option) => (
                      // biome-ignore lint/nursery/noStaticElementInteractions: <explanation>
                      // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                      <div
                        key={option.value}
                        className="flex items-center justify-between py-1.5"
                        onClick={() => {
                          if (currentSort?.id === option.value) {
                            table.setSorting([
                              { id: option.value, desc: !currentSort.desc },
                            ]);
                          } else {
                            table.setSorting([
                              { id: option.value, desc: false },
                            ]);
                          }
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={option.value}
                            id={option.value}
                            className="cursor-pointer"
                          />
                          <Label
                            htmlFor={option.value}
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

                <Separator className="my-3" />

                {/* Filters Section */}
                <div>
                  <div className="mb-1.5 font-medium">Filters</div>

                  {roleColumn && (
                    <div className="mb-3">
                      <Label className="mb-1.5 font-medium text-muted-foreground">
                        Role
                      </Label>
                      <div className="space-y-1.5">
                        {InviteRoleOptions.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-2 py-1"
                          >
                            <Checkbox
                              id={`role-${option.value}`}
                              checked={roleFilters.includes(option.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  roleColumn.setFilterValue([
                                    ...roleFilters,
                                    option.value,
                                  ]);
                                } else {
                                  roleColumn.setFilterValue(
                                    roleFilters.filter(
                                      (value) => value !== option.value
                                    )
                                  );
                                }
                              }}
                            />
                            <Label
                              htmlFor={`role-${option.value}`}
                              className="cursor-pointer font-normal"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {statusColumn && (
                    <div>
                      <Label className="mb-1.5 font-medium text-muted-foreground">
                        Status
                      </Label>
                      <div className="space-y-1.5">
                        {InviteStatusOptions.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-2 py-1"
                          >
                            <Checkbox
                              id={`status-${option.value}`}
                              checked={statusFilters.includes(option.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  statusColumn.setFilterValue([
                                    ...statusFilters,
                                    option.value,
                                  ]);
                                } else {
                                  statusColumn.setFilterValue(
                                    statusFilters.filter(
                                      (value) => value !== option.value
                                    )
                                  );
                                }
                              }}
                            />
                            <Label
                              htmlFor={`status-${option.value}`}
                              className="cursor-pointer font-normal"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
              {
                SortableColumnOptions.find(
                  (opt) => opt.value === currentSort?.id
                )?.label
              }
              {currentSort?.desc ? ' (Desc)' : ' (Asc)'}
            </Badge>
          )}
          {/* Filter Badges */}
          {table
            .getState()
            .columnFilters.filter((f) => f.id !== 'search')
            .map((filter) => {
              const values = filter.value as string[];
              return values.map((value) => (
                <Badge
                  key={`${filter.id}-${value}`}
                  variant="secondary"
                  className="text-xs"
                >
                  {capitalize(filter.id)}: {value}
                </Badge>
              ));
            })}
        </div>
      )}
    </div>
  );
}
