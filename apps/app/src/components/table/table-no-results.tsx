import { TableRow } from '@hexa/ui/table';
import { TableCell } from '@hexa/ui/table';
import type { Table as TableType } from '@tanstack/react-table';

interface TableNoResultsProps<TData> {
  table: TableType<TData>;
}

export const TableNoResults = <TData,>({
  table,
}: TableNoResultsProps<TData>) => {
  return (
    <TableRow>
      <TableCell
        colSpan={table.getHeaderGroups()[0]?.headers.length}
        className="h-24 text-center"
      >
        No results.
      </TableCell>
    </TableRow>
  );
};
