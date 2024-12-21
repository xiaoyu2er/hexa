'use client';

import { cn } from '@hexa/lib';
import { $logout } from '@hexa/server/api';
import { useScreenSize } from '@hexa/ui/hooks/use-screen-size';
import { LogOut } from '@hexa/ui/icons';
import { ModeToggle } from '@hexa/ui/mode-toggle';
import { SidebarFooter, useSidebar } from '@hexa/ui/sidebar';
import { Button, Tooltip } from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const clsNames =
  'p-1.5 rounded-lg text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400';

export function AppSidebarFooter() {
  const router = useRouter();
  const { isMobile } = useScreenSize();
  const { state } = useSidebar();

  const { mutateAsync: execLogout, isPending } = useMutation({
    mutationFn: $logout,
    onSuccess() {
      router.push('/');
    },
  });

  const logout = (
    <Tooltip content="Logout" placement="right">
      <Button
        variant="light"
        isIconOnly
        size="sm"
        className={cn(clsNames, 'ml-auto')}
        onPress={() => execLogout({})}
        disabled={isPending}
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </Tooltip>
  );

  const themeSwitch = <ModeToggle className={clsNames} />;

  return (
    <SidebarFooter className="flex flex-row items-center gap-1.5 p-2">
      {state === 'collapsed' && !isMobile ? (
        themeSwitch
      ) : (
        <>
          {themeSwitch}
          {logout}
        </>
      )}
    </SidebarFooter>
  );
}
