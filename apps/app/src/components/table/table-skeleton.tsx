import { TableCell, TableRow } from '@hexa/ui/table';
import { Skeleton } from '@nextui-org/react';
import { columns } from '../org/invite/invite-table-data';

export const TableSkeleton = ({ rows }: { rows: number }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          <TableCell colSpan={columns.length}>
            <Skeleton className="h-10 w-full rounded-lg" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
