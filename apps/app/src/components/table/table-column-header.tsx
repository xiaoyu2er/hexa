import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from '@hexa/ui/icons';
import { cn } from '@hexa/utils';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import type { Column } from '@tanstack/react-table';
import type { HTMLAttributes } from 'react';

interface TableColumnHeaderProps<TData, TValue>
  extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function TableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: TableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <Button variant="light" size="sm" className="text-sm">
        {title}
      </Button>
    );
  }

  const iconClass = 'h-3.5 w-3.5 text-muted-foreground/70';
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Dropdown classNames={{ content: 'min-w-[100px]' }}>
        <DropdownTrigger>
          <Button
            variant="light"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown className={iconClass} />
              // biome-ignore lint/nursery/noNestedTernary: <explanation>
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUp className={iconClass} />
            ) : (
              <ChevronsUpDown className={iconClass} />
            )}
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem
            onClick={() => column.toggleSorting(false)}
            startContent={<ArrowUp className={iconClass} />}
          >
            Asc
          </DropdownItem>
          <DropdownItem
            onClick={() => column.toggleSorting(true)}
            startContent={<ArrowDown className={iconClass} />}
          >
            Desc
          </DropdownItem>
          <DropdownItem
            onClick={() => column.clearSorting()}
            startContent={<ChevronsUpDown className={iconClass} />}
          >
            Clear
          </DropdownItem>

          <DropdownItem
            onClick={() => column.toggleVisibility(false)}
            startContent={<EyeOff className={iconClass} />}
          >
            Hide
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
