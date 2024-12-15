import {} from '@hexa/ui/card';
import type { Row, Table as TableType } from '@tanstack/react-table';
import type { ComponentType } from 'react';

interface TableCardProps<T> {
  table: TableType<T>;
  isFetching: boolean;
  CardSkeleton?: ComponentType;
  Card: ComponentType<{ row: Row<T> }>;
  CardNoResults?: ComponentType;
}

export const TableCard = <T,>({
  table,
  isFetching,
  Card,
  CardSkeleton,
  CardNoResults,
}: TableCardProps<T>) => {
  const rows = table.getRowModel().rows;

  return (
    <div className="space-y-4">
      {isFetching && CardSkeleton ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : // biome-ignore lint/nursery/noNestedTernary: <explanation>
      rows?.length > 0 ? (
        rows.map((row) => <Card key={row.id} row={row} />)
      ) : (
        CardNoResults && <CardNoResults />
      )}
    </div>
  );
};
