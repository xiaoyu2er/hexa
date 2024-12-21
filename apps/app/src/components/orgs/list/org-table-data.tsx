'use client';

import { LeaveOrg } from '@/components/orgs/list/leave-org';
import { OrgAvatar } from '@/components/orgs/org-avatar';
import { useOrgs } from '@/hooks/use-orgs';
import type { SelectUserOrgType } from '@hexa/server/schema/org';
import { Badge } from '@hexa/ui/badge';
import { Button } from '@nextui-org/react';
import type { ColumnDef } from '@tanstack/react-table';
import { capitalize } from 'lodash';

export const columns: ColumnDef<SelectUserOrgType>[] = [
  {
    accessorKey: 'name',
    cell: ({ row }) => {
      const org = row.original;
      return (
        <div className="flex items-center gap-2">
          <OrgAvatar org={row.original} className="h-6 w-6" />
          {org.name}
          <Badge variant="secondary">{capitalize(org.role)}</Badge>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const org = row.original;
      return (
        <div className="flex items-center justify-end gap-2">
          <Button variant="bordered" size="sm">
            Settings
          </Button>
          <LeaveOrg orgId={org.id} onSuccess={() => {}} />
        </div>
      );
    },
  },
];

export const useData = useOrgs;
