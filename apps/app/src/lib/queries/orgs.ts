import { getQueryClient } from '@/components/providers/get-query-client';
import { $getOrgInvites, $getOrgMembers, $getOrgs } from '@/lib/api';
import { queryOptions } from '@tanstack/react-query';
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import { camelCase } from 'lodash';
import { useParams } from 'next/navigation';

export const queryOrgsOptions = queryOptions({
  queryKey: ['orgs'],
  queryFn: $getOrgs,
  staleTime: Number.POSITIVE_INFINITY,
});

export interface TableQuery {
  pagination: PaginationState;
  sorting: SortingState;
  filters: ColumnFiltersState;
}

export const getTableQuery = ({
  pagination,
  sorting,
  filters,
}: TableQuery) => ({
  pageIndex: pagination.pageIndex.toString(),
  pageSize: pagination.pageSize.toString(),
  ...Object.fromEntries(
    sorting.map((sort) => [
      `${camelCase(`sort_${sort.id}`)}`,
      sort.desc ? 'desc' : 'asc',
    ])
  ),
  ...Object.fromEntries(
    filters.map((filter) => [
      filter.id === 'search' ? 'search' : `${camelCase(`filter_${filter.id}`)}`,
      filter.value,
    ])
  ),
});

export const queryOrgMembersOptions = (orgId: string, query: TableQuery) =>
  queryOptions({
    queryKey: ['orgs', orgId, 'members', query],
    queryFn: () =>
      $getOrgMembers({
        param: { orgId },
        query: getTableQuery(query),
      }),
    staleTime: Number.POSITIVE_INFINITY,
  });

export const queryOrgInvitesOptions = (orgId: string, query: TableQuery) =>
  queryOptions({
    queryKey: ['orgs', orgId, 'invites', query],
    queryFn: () =>
      $getOrgInvites({
        param: { orgId },
        query: getTableQuery(query),
      }),
    staleTime: Number.POSITIVE_INFINITY,
  });

export const invalidateOrgInvites = (
  orgId: string,
  pagination?: PaginationState
) => {
  return getQueryClient().invalidateQueries({
    queryKey: pagination
      ? ['orgs', orgId, 'invites', pagination]
      : ['orgs', orgId, 'invites'],
  });
};

export const invalidateOrg = () => {
  const { owner } = useParams() as { owner: string };
  return getQueryClient().invalidateQueries({ queryKey: [`org/${owner}`] });
};
