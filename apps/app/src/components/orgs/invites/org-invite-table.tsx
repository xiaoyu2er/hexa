'use client';
import { DesktopTable } from '@/components/orgs/invites/desktop-table';
import { DesktopTableToolbar } from '@/components/orgs/invites/desktop-table-toolbar';
import { MobileTable } from '@/components/orgs/invites/mobile-table';
import { MobileTableToolbar } from '@/components/orgs/invites/mobile-table-toolbar';
import { useInvites } from '@/hooks/use-invites';
import type { QueryInviteType } from '@/server/schema/org-invite';
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
import { columns } from './columns';
import { DataTablePagination } from './data-table-pagination';

export interface OrgInviteTableRef {
  table: TableType<QueryInviteType>;
}

export const OrgInviteTable = forwardRef<OrgInviteTableRef>((_, ref) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const {
    data: {
      data = [],
      metadata = {
        totalCount: 0,
        pageCount: 0,
        currentPage: 0,
        pageSize: 5,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    } = {},
    isFetching,
  } = useInvites(pagination, sorting, columnFilters);

  const table = useReactTable({
    data,
    rowCount: metadata.totalCount,
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
    <>
      <div className="space-y-4 lg:hidden">
        <MobileTableToolbar table={table} />
        <MobileTable table={table} isFetching={isFetching} />
        <DataTablePagination table={table} />
      </div>
      <div className="hidden space-y-4 lg:block">
        <DesktopTableToolbar table={table} />
        <DesktopTable table={table} isFetching={isFetching} />
        <DataTablePagination table={table} />
      </div>
    </>
  );
});

OrgInviteTable.displayName = 'OrgInviteTable';
