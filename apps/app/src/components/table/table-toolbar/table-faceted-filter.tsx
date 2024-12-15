import { PlusCircle } from '@hexa/ui/icons';

import type { TableFacetedFilterProps } from '@/components/table/table-types';
import { Badge } from '@hexa/ui/badge';

import {
  Button,
  Divider,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: TableFacetedFilterProps<TData, TValue>) {
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button variant="bordered" size="sm" className="h-8 border-dashed">
          <PlusCircle className="h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Divider orientation="vertical" className="mx-2 h-3" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) =>
                      selectedValues.has(String(option.value))
                    )
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={String(option.value)}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Listbox
          aria-label="Filter"
          selectionMode="multiple"
          onSelectionChange={(keys) => {
            const filterValues = Array.from(keys);
            column?.setFilterValue(
              filterValues.length ? filterValues : undefined
            );
          }}
          selectedKeys={selectedValues}
        >
          {options.map((option) => {
            return (
              <ListboxItem key={String(option.value)}>
                {option.label}
              </ListboxItem>
            );
          })}
        </Listbox>
      </PopoverContent>
    </Popover>
  );
}
