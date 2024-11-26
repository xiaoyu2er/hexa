'use client';

import { TableCard } from '@/components/table/table-card';
import { TablePagination } from '@/components/table/table-pagination';
import { TableRows } from '@/components/table/table-rows';
import { TableToolbarDesktop } from '@/components/table/table-toolbar-desktop';
import { TableToolbarMobile } from '@/components/table/table-toolbar-mobile';
import type { FilterConfig, TableView } from '@/components/table/table-types';
import { UrlCardSkeleton, UrlCardWithActions } from '@/components/url/url-card';
import { useUrls } from '@/hooks/use-urls';
import {
  type SelectUrlType,
  UrlSortableColumnOptions,
} from '@/server/schema/url';
import {} from '@hexa/ui/table';
import {
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type Table as TableType,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { columns } from './url-columns';

export interface UrlTableRef {
  table: TableType<SelectUrlType>;
}

export const UrlTable = forwardRef<UrlTableRef>((_, ref) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [view, setView] = useState<TableView>('rows');
  const {
    data: { data = [], rowCount = 0 } = {},
    isFetching,
  } = useUrls({ pagination, sorting, filters: columnFilters });

  const table = useReactTable({
    data,
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

  const filterConfigs: FilterConfig<SelectUrlType>[] = [
    {
      columnId: 'domain',
      label: 'Domain',
      options: [
        { label: 'All', value: '' },
        { label: 'Hexa', value: 'hexa.im' },
        { label: 'Google', value: 'google.com' },
      ],
    },
  ];
  return (
    <>
      <div className="space-y-4 lg:hidden">
        <TableToolbarMobile
          table={table}
          searchPlaceholder="Search invitee..."
          filterConfigs={filterConfigs}
          sortOptions={UrlSortableColumnOptions}
        />
        <TableCard
          table={table}
          isFetching={isFetching}
          Card={UrlCardWithActions}
          CardSkeleton={UrlCardSkeleton}
        />
        <TablePagination table={table} />
      </div>
      <div className="hidden space-y-4 lg:block">
        <TableToolbarDesktop
          table={table}
          searchPlaceholder="Search invitee..."
          filterConfigs={filterConfigs}
          sortOptions={UrlSortableColumnOptions}
          view={view}
          onViewChange={setView}
        />
        {view === 'rows' ? (
          <TableRows table={table} isFetching={isFetching} />
        ) : (
          <TableCard
            table={table}
            isFetching={isFetching}
            Card={UrlCardWithActions}
            CardSkeleton={UrlCardSkeleton}
          />
        )}
        <TablePagination table={table} />
      </div>
    </>
  );
});

UrlTable.displayName = 'UrlTable';
