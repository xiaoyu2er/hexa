import {} from '@hexa/ui/card';
import type { Row, Table as TableType } from '@tanstack/react-table';
import type { ComponentType } from 'react';

interface TableMobileProps<T> {
  table: TableType<T>;
  isFetching: boolean;
  MobileCardSkeleton: ComponentType;
  MobileCard: ComponentType<{ row: Row<T> }>;
}

export const TableMobile = <T,>({
  table,
  isFetching,
  MobileCard,
  MobileCardSkeleton,
}: TableMobileProps<T>) => {
  return (
    <div className="space-y-4">
      {isFetching ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <MobileCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        table
          .getRowModel()
          .rows?.map((row) => <MobileCard key={row.id} row={row} />)
      )}
    </div>
  );
};
