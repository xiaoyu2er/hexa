'use client';

import {} from '@/components/orgs/member/member-card';
import { TableCard } from '@/components/table/table-card';
import { TablePagination } from '@/components/table/table-pagination';
import { TableRows } from '@/components/table/table-rows';
import { TableToolbar } from '@/components/table/table-toolbar';
import type {
  FilterConfig,
  SortOption,
  TableView,
} from '@/components/table/table-types';
import { TableViewOptions } from '@/components/table/table-view-options';
import type { TableQuery } from '@/lib/queries/table';
import { useScreenSize } from '@hexa/ui/hooks/use-screen-size';
import {} from '@hexa/ui/table';
import type { RefetchOptions } from '@tanstack/react-query';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type Row,
  type SortingState,
  type Table as TableType,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  type ComponentType,
  type ForwardedRef,
  type ReactNode,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';

export interface TableRef<T> {
  table: TableType<T>;
}

export interface BaseTableProps<T> {
  columns: ColumnDef<T>[];
  useData: (query: TableQuery) => {
    data?: {
      data: T[];
      rowCount: number;
    };
    isFetching: boolean;
    refetch?: (options?: RefetchOptions) => Promise<unknown>;
  };
  Card: ComponentType<{ row: Row<T> }>;
  CardSkeleton: ComponentType;
  CardNoResults?: ComponentType;
  searchPlaceholder: string;
  filterConfigs: FilterConfig<T>[];
  sortOptions: SortOption<T>[];
  actionSlot?: ReactNode;
  showToolbar?: boolean;
  defaultView?: TableView;
  showViewChange?: boolean;
  showHeader?: boolean;
}

// First define the function type that preserves generics
type BaseTableComponent = <T extends object>(
  props: BaseTableProps<T> & { ref?: ForwardedRef<TableRef<T>> }
) => JSX.Element;

// Then create the internal component
const InternalBaseTable = <T extends object>(
  props: BaseTableProps<T>,
  ref: ForwardedRef<TableRef<T>>
) => {
  const {
    columns,
    useData,
    Card,
    CardSkeleton,
    CardNoResults,
    searchPlaceholder,
    filterConfigs,
    sortOptions,
    actionSlot,
    showToolbar = true,
    defaultView = 'rows',
    showViewChange = true,
    showHeader = true,
  } = props;

  const { isMobile } = useScreenSize();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [view, setView] = useState<TableView>(defaultView);
  const {
    data: { data = [], rowCount = 0 } = {},
    isFetching,
  } = useData({ pagination, sorting, filters: columnFilters });

  const table = useReactTable({
    data: data.slice(0, 1),
    rowCount,
    columns: columns,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      columnVisibility,
      pagination,
      sorting,
    },
    debugTable: true,
  });

  useImperativeHandle(ref, () => ({
    table,
  }));

  return (
    <div className="space-y-4">
      {showToolbar && (
        <TableToolbar
          table={table}
          searchPlaceholder={searchPlaceholder}
          filterConfigs={filterConfigs}
          sortOptions={sortOptions}
        >
          {actionSlot}
          <TableViewOptions
            table={table}
            sortOptions={sortOptions}
            filterConfigs={filterConfigs}
            showViewChange={showViewChange}
            view={view}
            onViewChange={setView}
          />
        </TableToolbar>
      )}
      {view === 'cards' || isMobile ? (
        <TableCard
          table={table}
          isFetching={isFetching}
          Card={Card}
          CardSkeleton={CardSkeleton}
          CardNoResults={CardNoResults}
        />
      ) : (
        <TableRows
          table={table}
          isFetching={isFetching}
          showHeader={showHeader}
        />
      )}
      {rowCount > 0 && <TablePagination table={table} />}
    </div>
  );
};

// Finally export with proper typing
export const BaseTable = forwardRef(InternalBaseTable) as BaseTableComponent;

InternalBaseTable.displayName = 'BaseTable';
