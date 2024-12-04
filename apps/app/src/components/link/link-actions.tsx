'use client';

import type { LinkModalProps } from '@/components/link/link-modal';
import { invalidateProjectLinks } from '@/lib/queries/project';
import type { SelectLinkType } from '@/server/schema/link';
import type { SelectProjectType } from '@/server/schema/project';
import type { NiceModalHandler } from '@ebay/nice-modal-react';
import { Button } from '@hexa/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@hexa/ui/dropdown-menu';
import { MoreVerticalIcon } from '@hexa/ui/icons';

interface LinkActionsProps {
  link: SelectLinkType;
  project: SelectProjectType;
  modal: NiceModalHandler<LinkModalProps>;
  size?: 'sm' | 'default';
}

export function LinkActions({
  link,
  project,
  modal,
  size = 'default',
}: LinkActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={size === 'sm' ? 'h-8 w-8' : 'h-9 w-9'}
        >
          <MoreVerticalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() =>
            modal.show({ project, mode: 'update', link }).then(() => {
              invalidateProjectLinks(project.id);
            })
          }
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
