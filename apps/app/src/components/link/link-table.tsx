'use client';

import {
  LinkCard as Card,
  LinkCardSkeleton as CardSkeleton,
} from '@/components/link/link-card';
import { LinkModal } from '@/components/link/link-modal';
import {
  columns,
  filterConfigs,
  searchPlaceholder,
  sortOptions,
  useData,
} from '@/components/link/link-table-data';
import { BaseTable, type TableRef } from '@/components/table/base-table';
import { useProject } from '@/hooks/use-project';
import { invalidateProjectLinks } from '@/lib/queries/project';
import type { SelectLinkType } from '@/server/schema/link';
import { useModal } from '@ebay/nice-modal-react';
import { Button } from '@nextui-org/react';
import { useRef } from 'react';

export function LinkTable() {
  const ref = useRef<TableRef<SelectLinkType>>(null);
  const modal = useModal(LinkModal);
  const { project } = useProject();
  const create = (
    <Button
      className="mr-2 shrink-0"
      size="sm"
      color="primary"
      onPress={() =>
        modal.show({ project, mode: 'create' }).then(() => {
          ref.current?.table.setPageIndex(0);
          invalidateProjectLinks(project.id);
        })
      }
    >
      Create Link
    </Button>
  );

  return (
    <BaseTable
      ref={ref}
      columns={columns}
      useData={useData}
      Card={Card}
      searchPlaceholder={searchPlaceholder}
      filterConfigs={filterConfigs}
      sortOptions={sortOptions}
      CardSkeleton={CardSkeleton}
      actionSlot={create}
      showHeader={false}
      defaultView="cards"
    />
  );
}
