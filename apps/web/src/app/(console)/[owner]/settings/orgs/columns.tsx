'use client';

import { OrgAvatar } from '@/components/orgs/org-avatar';
import type { SelectUserOrgType } from '@/server/db/schema';
import { Badge } from '@hexa/ui/badge';
import { Button } from '@hexa/ui/button';
import {} from '@hexa/ui/dropdown-menu';
import type { ColumnDef } from '@tanstack/react-table';
import { capitalize } from 'lodash';
import Link from 'next/link';

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
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${org.name}/settings/profile`}>Settings</Link>
          </Button>
          <Button variant="destructive" size="sm">
            Leave
          </Button>
        </div>
      );
    },
  },
];
