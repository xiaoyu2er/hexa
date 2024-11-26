'use client';
import type {
  FilterConfig,
  SortOption,
  TableView,
} from '@/components/table/table-types';
import { Button } from '@hexa/ui/button';
import { Checkbox } from '@hexa/ui/checkbox';
import {} from '@hexa/ui/command';
import { useMediaQuery } from '@hexa/ui/hooks/use-media-query';
import {
  ArrowDown,
  ArrowUp,
  LayoutGrid,
  LayoutList,
  Settings2,
  X,
} from '@hexa/ui/icons';
import {} from '@hexa/ui/icons';
import { Label } from '@hexa/ui/label';
import { MultiSelect } from '@hexa/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@hexa/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@hexa/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@hexa/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from '@hexa/ui/tabs';
import type { Table } from '@tanstack/react-table';
import { useState } from 'react';

// Helper function to get column label
function getColumnLabel<TData>(options: SortOption<TData>[], columnId: string) {
  // First check for sortable columns
  const sortableOption = options.find((option) => option.value === columnId);
  if (sortableOption) {
    return sortableOption.label;
  }

  return columnId;
}

interface TableViewOptionsProps<TData> {
  table: Table<TData>;
  sortOptions: SortOption<TData>[];
  filterConfigs?: FilterConfig<TData>[];
  view?: TableView;
  onViewChange?: (view: TableView) => void;
}

interface TableViewOptionsContentProps<TData> {
  table: Table<TData>;
  sortOptions: SortOption<TData>[];
  filterConfigs?: FilterConfig<TData>[];
  view?: TableView;
  onViewChange?: (view: TableView) => void;
  onClose?: () => void;
  isDesktop?: boolean;
}

// Shared content component
function TableViewOptionsContent<TData>({
  table,
  sortOptions,
  filterConfigs = [],
  view,
  onViewChange,
  onClose,
  isDesktop,
}: TableViewOptionsContentProps<TData>) {
  const currentSort = table.getState().sorting[0];

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        {/* View Toggle - Desktop Only */}
        {isDesktop && (
          <div className="border-b">
            <div className="p-3">
              <Tabs
                value={view}
                onValueChange={(value) => onViewChange?.(value as TableView)}
                className="w-full"
              >
                <TabsList className="w-full">
                  <TabsTrigger
                    value="cards"
                    className="flex w-full items-center gap-2"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    Cards
                  </TabsTrigger>
                  <TabsTrigger
                    value="rows"
                    className="flex w-full items-center gap-2"
                  >
                    <LayoutList className="h-4 w-4" />
                    Rows
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        )}

        {/* Sorting section - Always visible */}
        <div className="border-b">
          <div className="p-3">
            <div className="mb-2 font-medium">Ordering</div>
            <div className="relative">
              <Select
                value={currentSort?.id || ''}
                onValueChange={(value) => {
                  if (value) {
                    table.setSorting([
                      {
                        id: value,
                        desc:
                          currentSort?.id === value ? currentSort.desc : true,
                      },
                    ]);
                  } else {
                    table.resetSorting();
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem
                      key={String(option.value)}
                      value={String(option.value)}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="absolute top-0 right-8 flex h-full items-center gap-1.5">
                {currentSort?.id && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => {
                        table.setSorting([
                          {
                            id: currentSort.id,
                            desc: !currentSort.desc,
                          },
                        ]);
                      }}
                      title={
                        currentSort.desc ? 'Sort Descending' : 'Sort Ascending'
                      }
                    >
                      {currentSort.desc ? (
                        <div className="flex items-center gap-1">
                          <ArrowDown className="h-4 w-4" />
                          {/* Optional: Add text for more clarity */}
                          {/* <span className="text-xs">DESC</span> */}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <ArrowUp className="h-4 w-4" />
                          {/* Optional: Add text for more clarity */}
                          {/* <span className="text-xs">ASC</span> */}
                        </div>
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => table.resetSorting()}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear sort</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters section - Always visible */}
        <div className="border-b">
          <div className="p-3">
            <div className="mb-2 font-medium">Filters</div>
            <div className="space-y-3">
              {filterConfigs.map((config) => {
                const column = table.getColumn(String(config.columnId));
                if (!column) {
                  return null;
                }

                const selectedValues =
                  (column?.getFilterValue() as string[]) ?? [];

                return (
                  <div key={config.columnId as string}>
                    <div className="mb-1.5 text-muted-foreground text-sm">
                      {config.label}
                    </div>
                    <MultiSelect
                      options={config.options.map((option) => ({
                        value: String(option.value),
                        label: option.label,
                      }))}
                      onValueChange={(values) => {
                        column?.setFilterValue(
                          values.length ? values : undefined
                        );
                      }}
                      defaultValue={selectedValues}
                      placeholder="Select options..."
                      variant="default"
                      maxCount={3}
                      className="w-full"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Display Properties - Desktop Only */}
        {isDesktop && (
          <div className="border-b">
            <div className="p-3">
              <h4 className="mb-2 font-medium">Display Properties</h4>
              <div className="grid gap-1.5">
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== 'undefined' &&
                      column.getCanHide()
                  )
                  .map((column) => (
                    <div key={column.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                        id={column.id}
                      />
                      <Label
                        className="font-normal text-sm"
                        htmlFor={column.id}
                      >
                        {getColumnLabel(sortOptions, column.id)}
                      </Label>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reset & Default - Show on both mobile and desktop */}
      <div className="sticky bottom-0 border-t bg-background p-3">
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (isDesktop) {
                for (const column of table.getAllColumns()) {
                  column.toggleVisibility(true);
                }
              }
              table.resetSorting();
              table.resetColumnFilters();
              onClose?.();
            }}
          >
            Reset
          </Button>
          <Button variant="default" size="sm" onClick={onClose}>
            Set as default
          </Button>
        </div>
      </div>
    </div>
  );
}

// Responsive wrapper component
export function TableViewOptions<TData>({
  table,
  sortOptions,
  filterConfigs,
  view,
  onViewChange,
}: TableViewOptionsProps<TData>) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [isOpen, setIsOpen] = useState(false);

  const hasFiltersOrSort =
    table.getState().columnFilters.length > 0 ||
    table.getState().sorting.length > 0;

  // Separate desktop and mobile components
  if (isDesktop) {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="relative ml-auto flex h-8 items-center gap-2"
          >
            <Settings2 className="h-4 w-4" />
            <span>Display</span>
            {hasFiltersOrSort && (
              <div className="-right-0.5 -top-0.5 absolute h-2 w-2 rounded-full bg-blue-500" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-[320px] p-0"
          style={{ maxHeight: 'calc(100vh - 120px)' }}
        >
          <div className="flex max-h-full flex-col">
            <div className="flex-1 overflow-y-auto">
              <TableViewOptionsContent
                table={table}
                sortOptions={sortOptions}
                filterConfigs={filterConfigs}
                view={view}
                onViewChange={onViewChange}
                onClose={() => setIsOpen(false)}
                isDesktop={true}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-10 w-10">
          <Settings2 className="h-4 w-4" />
          {hasFiltersOrSort && (
            <div className="-right-0.5 -top-0.5 absolute h-2 w-2 rounded-full bg-blue-500" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="flex h-[65vh] flex-col p-0">
        <SheetHeader className="border-b px-3 py-3">
          <SheetTitle>Sort & Filter</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          <TableViewOptionsContent
            table={table}
            sortOptions={sortOptions}
            filterConfigs={filterConfigs}
            onClose={() => setIsOpen(false)}
            isDesktop={false}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
