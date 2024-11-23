'use client';

import { useModal } from '@/components/modal';
import { CreateOrgModal } from '@/components/orgs/create-org-modal';
import { CreateProjectModal } from '@/components/project/create-project-modal';
import { queryOrgsOptions } from '@/lib/queries/orgs';
import { invalidateProjectsQuery } from '@/lib/queries/project';
import { Button } from '@hexa/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@hexa/ui/dropdown-menu';
import { BookMarkedIcon, BuildingIcon, CirclePlus } from '@hexa/ui/icons';
import { useQuery } from '@tanstack/react-query';

export function New() {
  const modal = useModal(CreateProjectModal);
  const modalOrg = useModal(CreateOrgModal);

  const { refetch: refetchOrgs } = useQuery(queryOrgsOptions);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <CirclePlus strokeWidth={1.5} size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={() => modal.show().then(() => invalidateProjectsQuery())}
        >
          <BookMarkedIcon className="h-4 w-4" /> New Project
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={() => modalOrg.show().then(() => refetchOrgs())}
        >
          <BuildingIcon className="h-4 w-4" /> New Organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
