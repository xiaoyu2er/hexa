'use client';

import { BaseTable, type TableRef } from '@/components/table/base-table';
import {
  UrlCardWithActions as Card,
  UrlCardSkeleton as CardSkeleton,
} from '@/components/url/url-card';

import type { SelectUrlType } from '@/server/schema/url';
import { forwardRef } from 'react';
import {
  columns,
  filterConfigs,
  searchPlaceholder,
  sortOptions,
  useData,
} from './url-table-data';

export const UrlTable = forwardRef<TableRef<SelectUrlType>>((_, ref) => {
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
});

UrlTable.displayName = 'UrlTable';
