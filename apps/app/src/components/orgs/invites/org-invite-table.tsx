'use client';
import { DataTableToolbar } from '@/components/orgs/invites/data-table-toolbar';
import { useInvites } from '@/hooks/use-invites';
import type { QueryInviteType } from '@/server/schema/org-invite';
import { Skeleton } from '@hexa/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@hexa/ui/table';
import {
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type Table as TableType,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  type ReactNode,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
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

  const loading = (
    <>
      {[0].map((i) => (
        <TableRow key={i}>
          <TableCell colSpan={columns.length}>
            <Skeleton className="h-10 w-full" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  const rows = table.getRowModel().rows?.map((row) => (
    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {
            flexRender(
              cell.column.columnDef.cell,
              cell.getContext()
            ) as ReactNode
          }
        </TableCell>
      ))}
    </TableRow>
  ));

  const noResutls = (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isFetching
              ? loading
              : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                table.getRowModel().rows?.length
                ? rows
                : noResutls}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
});

OrgInviteTable.displayName = 'OrgInviteTable';
