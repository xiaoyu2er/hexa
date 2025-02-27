'use client';

import type { LinkModalProps } from '@/components/link/link-modal';
import { invalidateProjectLinks } from '@/lib/queries/project';
import type { NiceModalHandler } from '@ebay/nice-modal-react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import type { SelectLinkType } from '@hexa/server/schema/link';
import type { SelectProjectType } from '@hexa/server/schema/project';
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
    <Dropdown>
      <DropdownTrigger asChild>
        <Button
          variant="light"
          isIconOnly
          className={size === 'sm' ? 'h-8 w-8' : 'h-9 w-9'}
          aria-label="Open menu"
        >
          <MoreVerticalIcon className="h-4 w-4" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem
          key="edit"
          onPress={() =>
            modal.show({ project, mode: 'update', link }).then(() => {
              invalidateProjectLinks(project.id);
            })
          }
        >
          Edit
        </DropdownItem>
        <DropdownItem key="delete" className="text-destructive">
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
