'use client';
import { useUser } from '@/hooks/use-user';
import { $logout } from '@/lib/api';
import { Button } from '@hexa/ui/button';
import { LogOut, Monitor, Moon, Sun } from '@hexa/ui/icons';
import { SidebarFooter, useSidebar } from '@hexa/ui/sidebar';
import { cn } from '@hexa/utils/cn';
import { useMutation } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

const clsNames =
  'p-1.5 rounded-lg text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400';
export function AppSidebarFooter() {
  const { user } = useUser();
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();

  const { mutateAsync: execLogout, isPending } = useMutation({
    mutationFn: $logout,
    onSuccess() {
      router.push('/');
    },
  });

  return (
    <SidebarFooter className="flex flex-row items-center gap-1.5 p-2">
      <Button
        variant="ghost"
        className={clsNames}
        size="icon"
        onClick={() => setTheme('system')}
        aria-label="Toggle theme"
      >
        <Monitor className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        className={clsNames}
        size="icon"
        onClick={() => setTheme('light')}
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        className={clsNames}
        onClick={() => setTheme('dark')}
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        className={cn(clsNames, 'ml-auto')}
        onClick={() => execLogout({})}
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </SidebarFooter>
  );
}
