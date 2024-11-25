import {
  MobileCardSkeleton,
  MobileCardWithActions,
} from '@/components/orgs/invites/mobile-card';
import type { QueryInviteType } from '@/server/schema/org-invite';
import {} from '@hexa/ui/card';
import type { Table as TableType } from '@tanstack/react-table';

export const MobileTable = ({
  table,
  isFetching,
}: { table: TableType<QueryInviteType>; isFetching: boolean }) => {
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
          .rows?.map((row) => <MobileCardWithActions key={row.id} row={row} />)
      )}
    </div>
  );
};
