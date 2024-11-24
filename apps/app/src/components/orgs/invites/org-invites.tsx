'use client';
import Loading from '@/app/(dashboard)/user/loading';
import { useProject } from '@/hooks/use-project';
import { queryOrgInvitesOptions } from '@/lib/queries/orgs';
import { useQuery } from '@tanstack/react-query';
import { columns } from './columns';
import { OrgInviteTable } from './org-invite-table';

export const OrgInvites = () => {
  const {
    project: { org },
  } = useProject();

  const { data, isFetching } = useQuery(queryOrgInvitesOptions(org.id));
  if (isFetching || !data) {
    return <Loading />;
  }

  const { data: invites, rowCount } = data;

  return (
    <OrgInviteTable columns={columns} data={invites} rowCount={rowCount} />
  );
};
