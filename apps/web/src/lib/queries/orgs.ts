import { getQueryClient } from '@/components/providers/get-query-client';
import { $getOrgByName, $getOrgs } from '@/lib/api';
import { queryOptions } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export const queryOrgsOptions = queryOptions({
  queryKey: ['orgs'],
  queryFn: $getOrgs,
});

export const queryOrgByNameOptions = (name?: string) =>
  queryOptions({
    queryKey: ['orgs/', name],
    queryFn: name ? () => $getOrgByName({ param: { name } }) : () => null,
  });

export const invalidateOrg = () => {
  const { owner } = useParams() as { owner: string };
  return getQueryClient().invalidateQueries({ queryKey: [`org/${owner}`] });
};
