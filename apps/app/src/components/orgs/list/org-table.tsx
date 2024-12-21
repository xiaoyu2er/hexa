'use client';
import { BaseTable, type TableRef } from '@/components/table/base-table';
import { type ReactNode, forwardRef } from 'react';

import type { SelectUserOrgType } from '@hexa/server/schema/org';
import { columns, useData } from './org-table-data';

interface OrgTableProps {
  actionSlot?: ReactNode;
}

export const OrgTable = forwardRef<TableRef<SelectUserOrgType>, OrgTableProps>(
  ({ actionSlot }, ref) => {
    return (
      <BaseTable
        ref={ref}
        columns={columns}
        useData={useData}
        actionSlot={actionSlot}
      />
    );
  }
);

OrgTable.displayName = 'OrgTable';
