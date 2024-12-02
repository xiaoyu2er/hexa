'use client';
import { CreateDomainModal } from '@/components/domain/create-domain-modal';
import NoDomain from '@/components/domain/no-domain';
import { useModal } from '@/components/modal';
import { BaseTable, type TableRef } from '@/components/table/base-table';
import { useProject } from '@/hooks/use-project';
import { invalidateDomains } from '@/lib/queries/orgs';
import type { QueryDomainType } from '@/server/schema/domain';
import { Button } from '@hexa/ui/button';
import { useRef } from 'react';
import { DomainCard as Card } from './domain-card';
import { DomainCardSkeleton as CardSkeleton } from './domain-card-skeleton';
import {
  columns,
  filterConfigs,
  searchPlaceholder,
  sortOptions,
  useData,
} from './domain-table-data';

export const DomainTable = () => {
  const ref = useRef<TableRef<QueryDomainType>>(null);
  const modal = useModal(CreateDomainModal);
  const { project } = useProject();
  const onClick = () => {
    modal.show(project).then(() => {
      ref.current?.table?.setPageIndex(0);
      invalidateDomains(project.org.id);
    });
  };

  return (
    <BaseTable
      ref={ref}
      columns={columns}
      useData={useData}
      Card={Card}
      CardNoResults={() => (
        <NoDomain slot={<Button onClick={onClick}>Create Domain</Button>} />
      )}
      searchPlaceholder={searchPlaceholder}
      filterConfigs={filterConfigs}
      sortOptions={sortOptions}
      CardSkeleton={CardSkeleton}
      actionSlot={
        <Button size="sm" onClick={onClick}>
          Create Domain
        </Button>
      }
      defaultView="cards"
      showViewChange={false}
    />
  );
};

DomainTable.displayName = 'DomainTable';
