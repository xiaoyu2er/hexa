import { getQueryClient } from '@/components/providers/get-query-client';
import {
  $getDomains,
  $getOrgInvites,
  $getOrgMembers,
  $getOrgs,
} from '@/lib/api';
import { type TableQuery, getTableQuery } from '@/lib/queries/table';
import { queryOptions } from '@tanstack/react-query';

import { useParams } from 'next/navigation';

export const queryOrgsOptions = queryOptions({
  queryKey: ['orgs'],
  queryFn: $getOrgs,
  staleTime: Number.POSITIVE_INFINITY,
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

export const invalidateOrgInvites = (orgId: string, query?: TableQuery) => {
  return getQueryClient().invalidateQueries({
    queryKey: query
      ? ['orgs', orgId, 'invites', query]
      : ['orgs', orgId, 'invites'],
  });
};

export const invalidateOrg = () => {
  const { owner } = useParams() as { owner: string };
  return getQueryClient().invalidateQueries({ queryKey: [`org/${owner}`] });
};

export const queryDomainsOptions = (orgId: string, query: TableQuery) =>
  queryOptions({
    queryKey: ['orgs', orgId, 'domains', query],
    queryFn: () =>
      $getDomains({ param: { orgId }, query: getTableQuery(query) }),
    staleTime: Number.POSITIVE_INFINITY,
  });

export const invalidateDomains = (orgId: string, query?: TableQuery) => {
  return getQueryClient().invalidateQueries({
    queryKey: query
      ? ['orgs', orgId, 'domains', query]
      : ['orgs', orgId, 'domains'],
  });
};
