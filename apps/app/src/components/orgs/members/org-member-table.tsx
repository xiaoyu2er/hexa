'use client';

import {
  MemberCardSkeleton,
  MemberCardWithActions,
} from '@/components/orgs/members/member-mobile-card';
import { InviteTableDesktop } from '@/components/table/table-desktop';
import { TableMobile } from '@/components/table/table-mobile';
import { TablePagination } from '@/components/table/table-pagination';
import { TableToolbarDesktop } from '@/components/table/table-toolbar-desktop';
import { TableToolbarMobile } from '@/components/table/table-toolbar-mobile';
import type { FilterConfig } from '@/components/table/table-types';
import { useMembers } from '@/hooks/use-members';
import {
  OrgMemberSortableColumnOptions,
  OrgRoleOptions,
  type SelectOrgMemberType,
} from '@/server/schema/org-member';
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
import { columns } from './member-columns';

export interface OrgMemberTableRef {
  table: TableType<SelectOrgMemberType>;
}

export const OrgMemberTable = forwardRef<OrgMemberTableRef>((_, ref) => {
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
  } = useMembers({ pagination, sorting, filters: columnFilters });

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

  const filterConfigs: FilterConfig<SelectOrgMemberType>[] = [
    {
      columnId: 'role',
      label: 'Role',
      options: OrgRoleOptions,
    },
  ];
  return (
    <>
      <div className="space-y-4 lg:hidden">
        <TableToolbarMobile
          table={table}
          searchPlaceholder="Search invitee..."
          filterConfigs={filterConfigs}
          sortOptions={OrgMemberSortableColumnOptions}
        />
        <TableMobile
          table={table}
          isFetching={isFetching}
          MobileCard={MemberCardWithActions}
          MobileCardSkeleton={MemberCardSkeleton}
        />
        <TablePagination table={table} />
      </div>
      <div className="hidden space-y-4 lg:block">
        <TableToolbarDesktop
          table={table}
          searchPlaceholder="Search invitee..."
          filterConfigs={filterConfigs}
          sortOptions={OrgMemberSortableColumnOptions}
        />
        <InviteTableDesktop table={table} isFetching={isFetching} />
        <TablePagination table={table} />
      </div>
    </>
  );
});

OrgMemberTable.displayName = 'OrgInviteTable';
