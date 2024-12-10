'use client';
import type { FilterConfig } from '@/components/table/table-types';
import { useDomains } from '@/hooks/use-domains';

import type { QueryDomainType } from '@/server/schema/domain';
import type { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<QueryDomainType>[] = [
  { id: 'search' },
  // {
  //   id: 'domain',
  // },
  {
    accessorKey: 'status',
  },

  {
    accessorKey: 'createdAt',
  },
  {
    accessorKey: 'expiresAt',
  },
];

export const filterConfigs: FilterConfig<QueryDomainType>[] = [];

export const useData = useDomains;

export const searchPlaceholder = 'Search domains';

export const sortOptions = [];
