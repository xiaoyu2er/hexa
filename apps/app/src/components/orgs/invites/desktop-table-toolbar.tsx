'use client';

import { useDebounce } from '@hexa/ui/hooks/use-debounce';
import { X } from '@hexa/ui/icons';
import type { Table } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import { DataTableViewOptions } from '@/components/orgs/invites/data-table-view-options';
import { Button } from '@hexa/ui/button';
import { Input } from '@hexa/ui/input';

import { DataTableFacetedFilter } from '@/components/orgs/invites/data-table-faceted-filter';
import {
  InviteRoleOptions,
  InviteStatusOptions,
} from '@/server/schema/org-invite';

interface DesktopTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DesktopTableToolbar<TData>({
  table,
}: DesktopTableToolbarProps<TData>) {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 1000);
  const isFiltered = table.getState().columnFilters.length > 0;

  useEffect(() => {
    if (value === '') {
      table.getColumn('search')?.setFilterValue('');
    } else {
      table.getColumn('search')?.setFilterValue(debouncedValue);
    }
  }, [debouncedValue, table, value]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search invitee..."
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('role') && (
          <DataTableFacetedFilter
            column={table.getColumn('role')}
            title="Role"
            options={InviteRoleOptions}
          />
        )}
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Status"
            options={InviteStatusOptions}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              setValue('');
              table.resetColumnFilters();
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
