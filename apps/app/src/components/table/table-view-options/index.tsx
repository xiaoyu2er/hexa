'use client';
import { useScreenSize } from '@hexa/ui/hooks/use-screen-size';
import type { FilterConfig, SortOption, TableView } from '../table-types';
import { TableViewOptionsButton } from './table-view-options-button';
import { TableViewOptionsContent } from './table-view-options-content';

import {
  Modal,
  ModalContent,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@heroui/react';
import type { Table } from '@tanstack/react-table';
import { useState } from 'react';

interface TableViewOptionsProps<TData> {
  table: Table<TData>;
  sortOptions?: SortOption<TData>[];
  filterConfigs?: FilterConfig<TData>[];
  view?: TableView;
  onViewChange?: (view: TableView) => void;
  showViewChange?: boolean;
}

// Responsive wrapper component
export function TableViewOptions<TData>({
  table,
  sortOptions,
  filterConfigs,
  view,
  onViewChange,
  showViewChange = true,
}: TableViewOptionsProps<TData>) {
  const { isDesktop } = useScreenSize();
  const [isOpen, setIsOpen] = useState(false);

  const hasFiltersOrSort =
    table.getState().columnFilters.length > 0 ||
    table.getState().sorting.length > 0;

  if (isDesktop) {
    return (
      <Popover
        classNames={{
          content: 'w-[320px] p-0',
        }}
      >
        <PopoverTrigger>
          <TableViewOptionsButton hasFiltersOrSort={hasFiltersOrSort} />
        </PopoverTrigger>
        <PopoverContent>
          <TableViewOptionsContent
            table={table}
            sortOptions={sortOptions}
            filterConfigs={filterConfigs}
            showViewChange={showViewChange}
            view={view}
            onViewChange={onViewChange}
            onClose={() => setIsOpen(false)}
            isDesktop={true}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <>
      <TableViewOptionsButton
        hasFiltersOrSort={hasFiltersOrSort}
        onPress={() => {
          setIsOpen(true);
        }}
      />
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader className="border-b px-3 py-3">
            Sort & Filter
          </ModalHeader>
          <div className="flex-1 overflow-y-auto">
            <TableViewOptionsContent
              table={table}
              sortOptions={sortOptions}
              filterConfigs={filterConfigs}
              onClose={() => setIsOpen(false)}
              isDesktop={false}
            />
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
