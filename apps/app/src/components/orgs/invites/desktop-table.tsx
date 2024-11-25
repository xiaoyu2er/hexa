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
import { type Table as TableType, flexRender } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { columns } from './columns';

export const DesktopTable = ({
  table,
  isFetching,
}: { table: TableType<QueryInviteType>; isFetching: boolean }) => {
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
