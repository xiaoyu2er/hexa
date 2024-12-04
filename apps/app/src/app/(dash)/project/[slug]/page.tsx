'use client';

import {
  LinkCardWithActions as Card,
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
import { Button } from '@hexa/ui/button';
import { useRef } from 'react';

export default function () {
  const ref = useRef<TableRef<SelectLinkType>>(null);
  const modal = useModal(LinkModal);
  const { project } = useProject();
  const create = (
    <Button
      className="mr-2"
      size="sm"
      onClick={() =>
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
    <>
      <div>
        <h2 className="font-bold text-2xl tracking-tight">Links</h2>
        <p className="text-muted-foreground">Manage your Links here.</p>
      </div>
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
      />
    </>
  );
}
