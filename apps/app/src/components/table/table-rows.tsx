import { TableRow } from '@hexa/ui/table';
import { TableCell } from '@hexa/ui/table';

import { type Table as TableType, flexRender } from '@tanstack/react-table';
import type { ReactNode } from 'react';

interface TableBodyProps<TData> {
  table: TableType<TData>;
}

export const TableRows = <TData,>({ table }: TableBodyProps<TData>) => {
  return table.getRowModel().rows?.map((row) => (
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
};
