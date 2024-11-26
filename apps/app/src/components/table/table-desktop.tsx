import { TableNoResults } from '@/components/table/table-no-results';
import { TableRows } from '@/components/table/table-rows';
import { TableSkeleton } from '@/components/table/table-skeleton';

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@hexa/ui/table';
import { type Table as TableType, flexRender } from '@tanstack/react-table';

export const InviteTableDesktop = <TData,>({
  table,
  isFetching,
}: { table: TableType<TData>; isFetching: boolean }) => {
  const loading = <TableSkeleton rows={5} />;

  const rows = <TableRows table={table} />;

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
