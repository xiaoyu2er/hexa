import { getQueryClient } from '@/components/providers/get-query-client';
import { $getOrgInvites, $getOrgMembers, $getOrgs } from '@/lib/api';
import { queryOptions } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export const queryOrgsOptions = queryOptions({
  queryKey: ['orgs'],
  queryFn: $getOrgs,
});

export const queryOrgMembersOptions = (orgId: string) =>
  queryOptions({
    queryKey: ['orgs', orgId, 'members'],
    queryFn: () => $getOrgMembers({ param: { orgId } }),
  });

export const queryOrgInvitesOptions = (orgId: string) =>
  queryOptions({
    queryKey: ['orgs', orgId, 'invites'],
    queryFn: () => $getOrgInvites({ param: { orgId } }),
  });

export const invalidateOrg = () => {
  const { owner } = useParams() as { owner: string };
  return getQueryClient().invalidateQueries({ queryKey: [`org/${owner}`] });
};
