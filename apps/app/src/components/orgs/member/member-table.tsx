'use client';

import {
  MemberCardWithActions as Card,
  MemberCardSkeleton as CardSkeleton,
} from '@/components/orgs/member/member-card';
import { BaseTable, type TableRef } from '@/components/table/base-table';
import type { SelectOrgMemberType } from '@/server/schema/org-member';
import { forwardRef } from 'react';
import {
  columns,
  filterConfigs,
  searchPlaceholder,
  sortOptions,
  useData,
} from './member-table-data';

export const OrgMemberTable = forwardRef<TableRef<SelectOrgMemberType>>(
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

OrgMemberTable.displayName = 'OrgMemberTable';
