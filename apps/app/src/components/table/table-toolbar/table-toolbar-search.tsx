'use client';

import type { TableToolbarSearchProps } from '@/components/table/table-types';
import { useDebounce } from '@hexa/ui/hooks/use-debounce';
import { Input } from '@nextui-org/react';
import { useEffect, useState } from 'react';

export function TableToolbarSearch<TData>({
  table,
  ...props
}: TableToolbarSearchProps<TData>) {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 1000);

  useEffect(() => {
    if (value === '') {
      table.getColumn('search')?.setFilterValue('');
    } else {
      table.getColumn('search')?.setFilterValue(debouncedValue);
    }
  }, [debouncedValue, table, value]);

  return (
    <Input
      value={value}
      size="sm"
      variant="bordered"
      onChange={(event) => setValue(event.target.value)}
      {...props}
    />
  );
}
