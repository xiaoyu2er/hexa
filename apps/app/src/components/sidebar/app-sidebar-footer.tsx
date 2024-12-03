'use client';

import { $logout } from '@/lib/api';
import { Button } from '@hexa/ui/button';
import { useScreenSize } from '@hexa/ui/hooks/use-screen-size';
import { LogOut, Monitor, Moon, Sun } from '@hexa/ui/icons';
import { SidebarFooter, useSidebar } from '@hexa/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@hexa/ui/tooltip';
import { cn } from '@hexa/utils/cn';
import { useMutation } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

const clsNames =
  'p-1.5 rounded-lg text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400';

export function AppSidebarFooter() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { isMobile } = useScreenSize();
  const { state } = useSidebar();

  const { mutateAsync: execLogout, isPending } = useMutation({
    mutationFn: $logout,
    onSuccess() {
      router.push('/');
    },
  });

  const systemTheme = (
    <Button
      variant="ghost"
      className={clsNames}
      size="icon"
      onClick={() => setTheme('system')}
      aria-label="Toggle theme"
    >
      <Monitor className="h-4 w-4" />
    </Button>
  );

  const lightTheme = (
    <Button
      variant="ghost"
      className={clsNames}
      size="icon"
      onClick={() => setTheme('light')}
    >
      <Sun className="h-4 w-4" />
    </Button>
  );

  const darkTheme = (
    <Button
      variant="ghost"
      className={clsNames}
      size="icon"
      onClick={() => setTheme('dark')}
    >
      <Moon className="h-4 w-4" />
    </Button>
  );

  const logout = (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className={cn(clsNames, 'ml-auto')}
          onClick={() => execLogout({})}
          disabled={isPending}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Logout</TooltipContent>
    </Tooltip>
  );

  return (
    <SidebarFooter className="flex flex-row items-center gap-1.5 p-2">
      {state === 'collapsed' && !isMobile ? (
        theme === 'light' ? (
          darkTheme
        ) : (
          lightTheme
        )
      ) : (
        <>
          {systemTheme}
          {lightTheme}
          {darkTheme}
          {logout}
        </>
      )}
    </SidebarFooter>
  );
}
