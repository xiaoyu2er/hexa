'use client';

import { MoonIcon, SunIcon } from '@hexa/ui/icons';
import { useTheme } from 'next-themes';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  cn,
} from '@heroui/react';

export function ModeToggle({ className }: { className?: string }) {
  const { setTheme } = useTheme();

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          isIconOnly
          size="sm"
          aria-label="Toggle theme"
          className={cn('text-neutral-800 dark:text-neutral-200', className)}
        >
          <SunIcon className="h-4 w-4 dark:hidden " />
          <MoonIcon className="hidden h-4 w-4 dark:block" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key="light" onPress={() => setTheme('light')}>
          Light
        </DropdownItem>
        <DropdownItem key="dark" onPress={() => setTheme('dark')}>
          Dark
        </DropdownItem>
        <DropdownItem key="system" onPress={() => setTheme('system')}>
          System
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
