'use client';

import { queryOrgsOptions } from '@/lib/queries/orgs';
import { useSuspenseQuery } from '@tanstack/react-query';
import { columns } from './columns';
import { DataTable } from './data-table';

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
