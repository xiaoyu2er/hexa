'use client';

import { BaseTable, type TableRef } from '@/components/table/base-table';
import {
  UrlCardWithActions as Card,
  UrlCardSkeleton as CardSkeleton,
} from '@/components/url/url-card';
import { CreateUrlModal } from '@/components/url/url-create-modal';
import {
  columns,
  filterConfigs,
  searchPlaceholder,
  sortOptions,
  useData,
} from '@/components/url/url-table-data';
import { useProject } from '@/hooks/use-project';
import { invalidateUrls } from '@/lib/queries/project';
import type { SelectUrlType } from '@/server/schema/url';
import { useModal } from '@ebay/nice-modal-react';
import { Button } from '@hexa/ui/button';
import { useRef } from 'react';

export default function () {
  const ref = useRef<TableRef<SelectUrlType>>(null);
  const modal = useModal(CreateUrlModal);
  const { project } = useProject();
  const create = (
    <Button
      className="mr-2"
      size="sm"
      onClick={() =>
        modal.show(project).then(() => {
          ref.current?.table.setPageIndex(0);
          invalidateUrls(project.id);
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
