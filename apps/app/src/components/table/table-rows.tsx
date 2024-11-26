import { TableCell } from '@hexa/ui/table';

import {} from '@tanstack/react-table';
import type { ComponentType, ReactNode } from 'react';

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@hexa/ui/table';
import { type Table as TableType, flexRender } from '@tanstack/react-table';

import { TableNoResults as DefaultTableNoResults } from './table-no-results';
import { TableSkeleton as DefaultTableSkeleton } from './table-skeleton';

interface TableRowsProps<TData> {
  table: TableType<TData>;
  isFetching: boolean;
  TableSkeleton?: ComponentType<{ rows: number }>;
  TableNoResults?: ComponentType<{ table: TableType<TData> }>;
}

export const TableRows = <TData,>({
  table,
  isFetching,
  TableSkeleton = DefaultTableSkeleton,
  TableNoResults = DefaultTableNoResults,
}: TableRowsProps<TData>) => {
  const loading = <TableSkeleton rows={5} />;

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

  const noResutls = <TableNoResults table={table} />;

  return (
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
  );
};
