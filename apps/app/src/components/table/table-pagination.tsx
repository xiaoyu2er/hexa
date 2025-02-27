import { IS_DEVELOPMENT } from '@hexa/env';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from '@hexa/ui/icons';
import type { Table } from '@tanstack/react-table';

import { Button, Select, SelectItem } from '@heroui/react';

interface TablePaginationProps<TData> {
  table: Table<TData>;
}

export function TablePagination<TData>({ table }: TablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="hidden text-muted-foreground text-sm lg:block">
        {table.getFilteredSelectedRowModel().rows.length} of&nbsp;
        {table.getFilteredRowModel().rows.length}&nbsp;row(s) selected.
      </div>
      <div className="lg:hidden" />
      <div className="flex items-center gap-4 lg:gap-8">
        <div className="flex items-center gap-2">
          <p className="whitespace-nowrap text-sm">Rows per page</p>
          <Select
            className="w-[80px]"
            size="sm"
            aria-label="Rows per page"
            selectionMode="single"
            variant="bordered"
            onSelectionChange={(selection) => {
              const value = [...selection][0];
              table.setPageSize(Number(value));
            }}
            selectedKeys={[`${table.getState().pagination.pageSize}`]}
          >
            {(IS_DEVELOPMENT ? [3, 5, 10, 50] : [10, 20, 30, 40, 50]).map(
              (pageSize) => (
                <SelectItem
                  key={`${pageSize}`}
                  aria-label={`${pageSize}`}
                  textValue={`${pageSize}`}
                >
                  {`${pageSize}`}
                </SelectItem>
              )
            )}
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center text-sm">
            Page {table.getState().pagination.pageIndex + 1} of&nbsp;
            {table.getPageCount()}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="bordered"
              size="sm"
              isIconOnly
              className="hidden h-8 w-8 p-0 lg:flex"
              onPress={() => table.setPageIndex(0)}
              isDisabled={!table.getCanPreviousPage()}
              aria-label="Go to first page"
            >
              <ChevronsLeft className="h-4 w-4" strokeWidth={1.5} />
            </Button>
            <Button
              variant="bordered"
              size="sm"
              isIconOnly
              className="h-8 w-8 p-0"
              onPress={() => table.previousPage()}
              isDisabled={!table.getCanPreviousPage()}
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </Button>
            <Button
              variant="bordered"
              size="sm"
              isIconOnly
              className="h-8 w-8 p-0"
              onPress={() => table.nextPage()}
              isDisabled={!table.getCanNextPage()}
              aria-label="Go to next page"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </Button>
            <Button
              variant="bordered"
              size="sm"
              isIconOnly
              className="hidden h-8 w-8 p-0 lg:flex"
              onPress={() => table.setPageIndex(table.getPageCount() - 1)}
              isDisabled={!table.getCanNextPage()}
              aria-label="Go to last page"
            >
              <ChevronsRight className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
