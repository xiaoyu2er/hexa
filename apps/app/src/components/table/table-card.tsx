import {} from '@hexa/ui/card';
import type { Row, Table as TableType } from '@tanstack/react-table';
import type { ComponentType } from 'react';

interface TableCardProps<T> {
  table: TableType<T>;
  isFetching: boolean;
  CardSkeleton: ComponentType;
  Card: ComponentType<{ row: Row<T> }>;
}

export const TableCard = <T,>({
  table,
  isFetching,
  Card,
  CardSkeleton,
}: TableCardProps<T>) => {
  return (
    <div className="space-y-4">
      {isFetching ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        table.getRowModel().rows?.map((row) => <Card key={row.id} row={row} />)
      )}
    </div>
  );
};
