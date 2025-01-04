'use client';
import { BaseTable, type TableRef } from '@/components/table/base-table';
import type { QueryInviteType } from '@hexa/server/schema/org-invite';
import type { FC, ReactNode, Ref } from 'react';
import {
  InviteCard as Card,
  InviteCardSkeleton as CardSkeleton,
} from './invite-card';
import {
  columns,
  filterConfigs,
  searchPlaceholder,
  sortOptions,
  useData,
} from './invite-table-data';

interface OrgInviteTableProps {
  actionSlot?: ReactNode;
  ref: Ref<TableRef<QueryInviteType>>;
}

export const OrgInviteTable: FC<OrgInviteTableProps> = ({
  actionSlot,
  ref,
}) => {
  return (
    <BaseTable
      ref={ref}
      columns={columns}
      useData={useData}
      Card={Card}
      searchPlaceholder={searchPlaceholder}
      filterConfigs={filterConfigs}
      sortOptions={sortOptions}
      CardSkeleton={CardSkeleton}
      actionSlot={actionSlot}
    />
  );
};

OrgInviteTable.displayName = 'OrgInviteTable';
