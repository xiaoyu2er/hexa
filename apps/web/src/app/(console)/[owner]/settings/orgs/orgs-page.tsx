'use client';

import { columns } from '@/app/(console)/[owner]/settings/orgs/columns';
import { DataTable } from '@/app/(console)/[owner]/settings/orgs/data-table';
import { queryOrgsOptions } from '@/lib/queries/orgs';
import { useSuspenseQuery } from '@tanstack/react-query';

export const OrgPage = () => {
  const {
    data: { data, rowCount },
  } = useSuspenseQuery(queryOrgsOptions);
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} rowCount={rowCount} />
    </div>
  );
};
