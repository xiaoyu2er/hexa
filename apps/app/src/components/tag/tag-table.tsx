'use client';

import { BaseTable, type TableRef } from '@/components/table/base-table';
import {
  TagCardWithActions as Card,
  TagCardSkeleton as CardSkeleton,
} from '@/components/tag/tag-card';
import type { SelectTagType } from '@hexa/server/schema/tag';
import { forwardRef } from 'react';
import {
  columns,
  filterConfigs,
  searchPlaceholder,
  sortOptions,
  useData,
} from './tag-table-data';

export const TagTable = forwardRef<TableRef<SelectTagType>>((_, ref) => {
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

TagTable.displayName = 'TagTable';
