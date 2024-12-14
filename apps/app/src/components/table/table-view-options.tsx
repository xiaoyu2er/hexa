'use client';
import type {
  FilterConfig,
  SortOption,
  TableView,
} from '@/components/table/table-types';
import { useScreenSize } from '@hexa/ui/hooks/use-screen-size';
import {
  ArrowDown,
  ArrowUp,
  LayoutGrid,
  LayoutList,
  Settings2,
  X,
} from '@hexa/ui/icons';

import {
  Badge,
  Button,
  Checkbox,
  CheckboxGroup,
  Modal,
  ModalContent,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Tab,
  Tabs,
} from '@nextui-org/react';
import type { Table } from '@tanstack/react-table';
import { type ComponentProps, forwardRef, useState } from 'react';

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
  showViewChange?: boolean;
}

interface TableViewOptionsContentProps<TData> {
  table: Table<TData>;
  sortOptions: SortOption<TData>[];
  filterConfigs?: FilterConfig<TData>[];
  view?: TableView;
  onViewChange?: (view: TableView) => void;
  onClose?: () => void;
  isDesktop?: boolean;
  showViewChange?: boolean;
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
  showViewChange = true,
}: TableViewOptionsContentProps<TData>) {
  const currentSort = table.getState().sorting[0];
  const visibleColumns = table
    .getAllColumns()
    .filter((column) => column.getIsVisible())
    .map((column) => column.id);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-1 flex-col gap-3 p-3">
        {/* View Toggle - Desktop Only */}
        {isDesktop && showViewChange && (
          <Tabs
            selectedKey={view}
            onSelectionChange={(value) => onViewChange?.(value as TableView)}
            classNames={{
              base: 'w-full',
              tabList: 'w-full',
            }}
          >
            <Tab
              key="cards"
              className="flex w-full items-center gap-2"
              title={
                <div className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  Cards
                </div>
              }
            />
            <Tab
              key="rows"
              className="flex w-full items-center gap-2"
              title={
                <div className="flex items-center gap-2">
                  <LayoutList className="h-4 w-4" />
                  Rows
                </div>
              }
            />
          </Tabs>
        )}

        {/* Sorting section - Always visible */}
        <Select
          size="sm"
          label="Order by"
          labelPlacement="outside"
          placeholder="Select column"
          aria-label="Order by"
          variant="bordered"
          selectedKeys={
            currentSort?.id ? new Set([currentSort.id]) : new Set([])
          }
          endContent={
            currentSort?.id && (
              <>
                <button
                  type="button"
                  aria-label={
                    currentSort.desc ? 'Sort Descending' : 'Sort Ascending'
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
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
                    <ArrowDown className="h-3 w-3" />
                  ) : (
                    <ArrowUp className="h-3 w-3" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    table.resetSorting();
                  }}
                  aria-label="Clear sort"
                >
                  <X className="h-3 w-3" />
                </button>
              </>
            )
          }
          onSelectionChange={(selection) => {
            const value = [...selection][0] as string;

            if (value) {
              table.setSorting([
                {
                  id: value,
                  desc: currentSort?.id === value ? currentSort.desc : true,
                },
              ]);
            } else {
              table.resetSorting();
            }
          }}
        >
          {sortOptions.map((option) => (
            <SelectItem key={String(option.value)}>{option.label}</SelectItem>
          ))}
        </Select>

        {/* Filters section - Always visible */}
        {filterConfigs.map((config) => {
          const column = table.getColumn(String(config.columnId));
          if (!column) {
            return null;
          }

          const selectedValues = (column?.getFilterValue() as string[]) ?? [];

          return (
            <div key={config.columnId as string}>
              <Select
                variant="bordered"
                labelPlacement="outside"
                size="sm"
                aria-label={`Filter by ${config.label}`}
                selectionMode="multiple"
                label={`Filter by ${config.label}`}
                onSelectionChange={(selection) => {
                  const values = [...selection] as string[];
                  column?.setFilterValue(values.length ? values : undefined);
                }}
                selectedKeys={
                  selectedValues ? new Set(selectedValues) : new Set([])
                }
                placeholder="Select options..."
                className="w-full"
                endContent={
                  selectedValues.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        column?.setFilterValue(undefined);
                      }}
                      aria-label={`Clear filter for ${config.label}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )
                }
              >
                {config.options.map((option) => (
                  <SelectItem key={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          );
        })}

        {/* Display Properties - Desktop Only */}
        {isDesktop && (
          <CheckboxGroup
            size="sm"
            classNames={{
              label: 'text-foreground text-tiny',
            }}
            label="Display Properties"
            value={visibleColumns}
            onValueChange={(value) => {
              for (const column of table.getAllColumns()) {
                column.toggleVisibility(value.includes(column.id));
              }
            }}
          >
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== 'undefined' &&
                  column.getCanHide()
              )
              .map((column) => (
                <Checkbox value={column.id} key={column.id} size="sm">
                  {getColumnLabel(sortOptions, column.id)}
                </Checkbox>
              ))}
          </CheckboxGroup>
        )}
      </div>

      {/* Reset & Default - Show on both mobile and desktop */}
      <div className="sticky bottom-0 border-t bg-background p-3">
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onPress={() => {
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
          <Button color="primary" size="sm" onPress={onClose}>
            Set as default
          </Button>
        </div>
      </div>
    </div>
  );
}

export const TableViewOptionsButton = forwardRef<
  HTMLButtonElement,
  {
    hasFiltersOrSort: boolean;
  } & ComponentProps<typeof Button>
>(({ hasFiltersOrSort, ...props }, ref) => {
  const { isMobile } = useScreenSize();

  return (
    <Badge content="" color="primary" isInvisible={!hasFiltersOrSort}>
      <Button
        ref={ref}
        variant="bordered"
        size="sm"
        isIconOnly={isMobile}
        startContent={<Settings2 className="h-4 w-4" />}
        className="relative ml-auto flex items-center gap-2"
        {...props}
      >
        {!isMobile && <span>Display</span>}
      </Button>
    </Badge>
  );
});

// Responsive wrapper component
export function TableViewOptions<TData>({
  table,
  sortOptions,
  filterConfigs,
  view,
  onViewChange,
  showViewChange = true,
}: TableViewOptionsProps<TData>) {
  const { isMobile } = useScreenSize();
  const [isOpen, setIsOpen] = useState(false);

  const hasFiltersOrSort =
    table.getState().columnFilters.length > 0 ||
    table.getState().sorting.length > 0;

  // Separate desktop and mobile components
  if (!isMobile) {
    return (
      <Popover
        classNames={{
          content: 'w-[320px] p-0',
        }}
      >
        <PopoverTrigger>
          <TableViewOptionsButton hasFiltersOrSort={hasFiltersOrSort} />
        </PopoverTrigger>
        <PopoverContent>
          <TableViewOptionsContent
            table={table}
            sortOptions={sortOptions}
            filterConfigs={filterConfigs}
            showViewChange={showViewChange}
            view={view}
            onViewChange={onViewChange}
            onClose={() => setIsOpen(false)}
            isDesktop={true}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <>
      <TableViewOptionsButton
        hasFiltersOrSort={hasFiltersOrSort}
        onPress={() => setIsOpen(true)}
      />
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader className="border-b px-3 py-3">
            Sort & Filter
          </ModalHeader>
          <div className="flex-1 overflow-y-auto">
            <TableViewOptionsContent
              table={table}
              sortOptions={sortOptions}
              filterConfigs={filterConfigs}
              onClose={() => setIsOpen(false)}
              isDesktop={false}
            />
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
