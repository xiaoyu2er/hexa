'use client';
import {
  InviteCardSkeleton,
  InviteCardWithActions,
} from '@/components/orgs/invites/invite-card';
import { TableCard } from '@/components/table/table-card';
import { TablePagination } from '@/components/table/table-pagination';
import { TableRows } from '@/components/table/table-rows';
import { TableToolbarDesktop } from '@/components/table/table-toolbar-desktop';
import { TableToolbarMobile } from '@/components/table/table-toolbar-mobile';
import type { FilterConfig } from '@/components/table/table-types';
import { useInvites } from '@/hooks/use-invites';
import {
  InviteSortableColumnOptions,
  InviteStatusOptions,
  type QueryInviteType,
} from '@/server/schema/org-invite';
import { OrgRoleOptions } from '@/server/schema/org-member';
import {} from '@hexa/ui/table';
import {
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type Table as TableType,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { columns } from './invite-columns';

export interface OrgInviteTableRef {
  table: TableType<QueryInviteType>;
}

export const OrgInviteTable = forwardRef<OrgInviteTableRef>((_, ref) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const {
    data: { data = [], rowCount = 0 } = {},
    isFetching,
  } = useInvites({ pagination, sorting, filters: columnFilters });

  const table = useReactTable({
    data,
    rowCount,
    columns: columns,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      columnVisibility,
      pagination,
      sorting,
    },
    debugTable: true,
  });

  useImperativeHandle(ref, () => ({
    table,
  }));

  const filterConfigs: FilterConfig<QueryInviteType>[] = [
    {
      columnId: 'role',
      label: 'Role',
      options: OrgRoleOptions,
    },
    {
      columnId: 'status',
      label: 'Status',
      options: InviteStatusOptions,
    },
  ];
  return (
    <>
      <div className="space-y-4 lg:hidden">
        <TableToolbarMobile
          table={table}
          searchPlaceholder="Search invitee..."
          filterConfigs={filterConfigs}
          sortOptions={InviteSortableColumnOptions}
        />
        <TableCard
          table={table}
          isFetching={isFetching}
          Card={InviteCardWithActions}
          CardSkeleton={InviteCardSkeleton}
        />
        <TablePagination table={table} />
      </div>
      <div className="hidden space-y-4 lg:block">
        <TableToolbarDesktop
          table={table}
          searchPlaceholder="Search invitee..."
          filterConfigs={filterConfigs}
          sortOptions={InviteSortableColumnOptions}
        />
        <TableRows table={table} isFetching={isFetching} />
        <TablePagination table={table} />
      </div>
    </>
  );
});

OrgInviteTable.displayName = 'OrgInviteTable';
