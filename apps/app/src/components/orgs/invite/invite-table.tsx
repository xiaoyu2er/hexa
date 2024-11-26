'use client';
import { BaseTable, type TableRef } from '@/components/table/base-table';
import type { QueryInviteType } from '@/server/schema/org-invite';
import { forwardRef } from 'react';
import {
  InviteCardWithActions as Card,
  InviteCardSkeleton as CardSkeleton,
} from './invite-card';
import {
  columns,
  filterConfigs,
  searchPlaceholder,
  sortOptions,
  useData,
} from './invite-table-data';

export const OrgInviteTable = forwardRef<TableRef<QueryInviteType>>(
  (_, ref) => {
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
      />
    );
  }
);

OrgInviteTable.displayName = 'OrgInviteTable';
