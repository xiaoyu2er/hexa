'use client';

import { CaretSortIcon, CheckIcon, PlusCircledIcon } from '@hexa/ui/icons';

import { Button } from '@hexa/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@hexa/ui/popover';
import { cn } from '@hexa/utils';

import { useSession } from '@/components/providers/session-provider';
import { UserAvatar } from '@/components/user/user-avatar';
import { queryWorkspacesOptions } from '@/lib/queries/workspace';
import { $updateUserDefaultWorkspace } from '@/server/client';
import type { WorkspaceModel } from '@/server/db';
import { Badge } from '@hexa/ui/badge';
import { Dialog } from '@hexa/ui/responsive-dialog';
import { toast } from '@hexa/ui/sonner';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useBoolean } from 'usehooks-ts';
import { CreateWorkspaceForm } from './create-workspace-form';
import { WorkspaceAvatar } from './workspace-avatar';

export function WorkspaceSwitcher() {
  const { slug } = useParams() as { slug?: string };
  const { data: workspaces } = useSuspenseQuery(queryWorkspacesOptions);
  const { user } = useSession();
  const {
    value: isPopoverOpen,
    setValue: setPopoverOpen,
    setFalse: closePopover,
  } = useBoolean();

  const {
    value: isDialogOpen,
    setValue: setDialogOpen,
    setFalse: closeDialog,
    setTrue: openDialog,
  } = useBoolean();

  const defaultWs = workspaces.find((ws) => ws.slug === slug);
  const router = useRouter();
  const { mutateAsync: setUserDefaultWorkspace } = useMutation({
    mutationFn: $updateUserDefaultWorkspace,
    onSuccess({ slug }) {
      toast.success('Workspace switched');
      setPopoverOpen(false);
      router.push(`/${slug}`);
    },
    onError(err) {
      toast.error(`Failed to switch workspace${err.message}`);
    },
  });
  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            // role="combobox"
            aria-expanded={isPopoverOpen}
            aria-label="Select a team"
            className={cn('h-10 max-w-72 justify-between gap-3 border-0')}
          >
            {defaultWs ? (
              <>
                <WorkspaceAvatar
                  workspace={defaultWs as WorkspaceModel}
                  className="h-8 w-8"
                />
                <span className="w-2/3 overflow-hidden text-ellipsis text-nowrap text-left">
                  {defaultWs.name}
                </span>

                <Badge className="!mt-0">Plan</Badge>
              </>
            ) : (
              <>
                <UserAvatar className="h-8 w-8" user={user} />
                <span className="w-2/3 overflow-hidden text-ellipsis text-nowrap text-left">
                  {user.name}
                </span>
              </>
            )}
            <CaretSortIcon className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0">
          <div className="flex items-center justify-between space-y-2 p-4">
            <p className="text-muted-foreground text-sm">My workspaces</p>

            <Button
              size="sm"
              variant="outline"
              asChild
              onClick={closePopover}
              className="!mt-0 !h-7"
            >
              <Link href="/workspaces">View All</Link>
            </Button>
          </div>

          {workspaces.map((ws) => (
            <Button
              key={ws.id}
              variant="ghost"
              className="h-11 w-full justify-start"
              onClick={() => {
                setUserDefaultWorkspace({ json: { workspaceId: ws.id } });
              }}
            >
              <WorkspaceAvatar workspace={ws} className="mr-2 h-6 w-6 " />
              <span className="w-full shrink overflow-hidden text-ellipsis text-nowrap text-left">
                {ws.name}
              </span>

              {ws.slug === slug ? (
                <CheckIcon className={cn('ml-2 h-6 w-6')} />
              ) : null}
            </Button>
          ))}

          <Button
            variant="ghost"
            className="h-11 w-full"
            onClick={() => {
              closePopover();
              openDialog();
            }}
          >
            <PlusCircledIcon className="mr-2 h-6 w-6" />
            <span className="grow text-left">Create workspace</span>
          </Button>
        </PopoverContent>
      </Popover>
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <CreateWorkspaceForm onSuccess={closeDialog} />
      </Dialog>
    </>
  );
}
