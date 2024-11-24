'use client';
import { useProject } from '@/hooks/use-project';
import { queryOrgMembersOptions } from '@/lib/queries/orgs';
import { useQuery } from '@tanstack/react-query';
import { columns } from './columns';
import { OrgMemberTable } from './org-member-table';

export const OrgMembers = () => {
  const {
    project: { org },
  } = useProject();
  const {
    data: { data = [], rowCount = 0 } = {},
  } = useQuery(queryOrgMembersOptions(org.id));
  return <OrgMemberTable columns={columns} data={data} rowCount={rowCount} />;
};
