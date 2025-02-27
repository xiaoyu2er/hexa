import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import { cn } from '@hexa/lib';
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from '@hexa/ui/icons';
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
      <Button
        variant="light"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
      >
        <span>{title}</span>
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
            key="asc"
            onPress={() => column.toggleSorting(false)}
            startContent={<ArrowUp className={iconClass} />}
          >
            Asc
          </DropdownItem>
          <DropdownItem
            key="desc"
            onPress={() => column.toggleSorting(true)}
            startContent={<ArrowDown className={iconClass} />}
          >
            Desc
          </DropdownItem>
          <DropdownItem
            key="clear"
            onPress={() => column.clearSorting()}
            startContent={<ChevronsUpDown className={iconClass} />}
          >
            Clear
          </DropdownItem>

          <DropdownItem
            key="hide"
            onPress={() => column.toggleVisibility(false)}
            startContent={<EyeOff className={iconClass} />}
          >
            Hide
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
