'use client';

import { MoonIcon, SunIcon } from '@hexa/ui/icons';
import { useTheme } from 'next-themes';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light" isIconOnly aria-label="Toggle theme">
          <SunIcon className="h-4 w-4 text-neutral-800 dark:hidden dark:text-neutral-200" />
          <MoonIcon className="hidden h-4 w-4 text-neutral-800 dark:block dark:text-neutral-200" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onClick={() => setTheme('light')}>Light</DropdownItem>
        <DropdownItem onClick={() => setTheme('dark')}>Dark</DropdownItem>
        <DropdownItem onClick={() => setTheme('system')}>System</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
