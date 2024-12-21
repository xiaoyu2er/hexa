'use client';
import { LinkActions } from '@/components/link/link-actions';
import { LinkInfo } from '@/components/link/link-info';
import { LinkModal } from '@/components/link/link-modal';
import type { FilterConfig } from '@/components/table/table-types';
import { useLinks } from '@/hooks/use-links';
import { useProject } from '@/hooks/use-project';
import { useModal } from '@ebay/nice-modal-react';
import {
  LinkColumnOptions,
  LinkSortableColumnOptions,
  type SelectLinkType,
} from '@hexa/server/schema/link';
import type { ColumnDef } from '@tanstack/react-table';
import { capitalize } from 'lodash';

// Helper function to get column label
const _getColumnLabel = (columnId: string) =>
  LinkColumnOptions.find((option) => option.value === columnId)?.label ??
  capitalize(columnId);

export const columns: ColumnDef<SelectLinkType>[] = [
  { id: 'search' },
  {
    id: 'main',
    cell: ({ row }) => (
      <div className="flex items-center justify-between pr-4">
        <LinkInfo
          link={row.original}
          size="sm"
          showClicks={true}
          clicksPosition="right"
        />
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const modal = useModal(LinkModal);
      const { project } = useProject();
      return (
        <div className="flex justify-end">
          <LinkActions
            link={row.original}
            project={project}
            modal={modal}
            size="sm"
          />
        </div>
      );
    },
  },
];

export const searchPlaceholder = 'Search links...';

export const filterConfigs: FilterConfig<SelectLinkType>[] = [
  // {
  //   columnId: 'domain',
  //   label: 'Domain',
  //   options: [
  //     { label: 'All', value: '' },
  //     { label: 'Hexa', value: 'hexa.im' },
  //     { label: 'Google', value: 'google.com' },
  //   ],
  // },
];

export const sortOptions = LinkSortableColumnOptions.map((option) => ({
  label: option.label,
  value: option.value,
}));

export const useData = useLinks;
