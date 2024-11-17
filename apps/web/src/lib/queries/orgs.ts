import { $getOrgByName, $getOrgs } from '@/lib/api';
import { queryOptions } from '@tanstack/react-query';

export const queryOrgsOptions = queryOptions({
  queryKey: ['orgs'],
  queryFn: $getOrgs,
});

export const queryOrgByNameOptions = (name?: string) =>
  queryOptions({
    queryKey: ['orgs/', name],
    queryFn: name ? () => $getOrgByName({ param: { name } }) : () => null,
  });
