'use client';

import { CaretSortIcon, CheckIcon, PlusCircledIcon } from '@hexa/ui/icons';

import { OrgAvatar } from '@/components/orgs/org-avatar';
import { UserAvatar } from '@/components/user-settings/user-avatar';
import { useContext } from '@/lib/queries/context';
import { queryWorkspacesOptions } from '@/lib/queries/workspace';
import { getWorkspaceSlug } from '@/lib/workspace';
import { $updateUserDefaultWorkspace } from '@/server/client';
import type { SelectWorkspaceType } from '@/server/db/schema';
import { useModal } from '@ebay/nice-modal-react';
import { Badge } from '@hexa/ui/badge';
import { Button } from '@hexa/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@hexa/ui/popover';
import { toast } from '@hexa/ui/sonner';
import { cn } from '@hexa/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBoolean } from 'usehooks-ts';
import { CreateWorkspaceModal } from '../workspaces/create-workspace-modal';
import { WorkspaceAvatar } from '../workspaces/workspace-avatar';

export function ContextSwitcher() {
  const { isOrgMode, isUserMode, user, org, slug } = useContext();
  const { data: workspaces, refetch } = useSuspenseQuery(
    queryWorkspacesOptions() // if not owner, get all accessible workspaces
  );

  const {
    value: isPopoverOpen,
    setValue: setPopoverOpen,
    setFalse: closePopover,
  } = useBoolean();

  const modal = useModal(CreateWorkspaceModal);
  const defaultWs = workspaces.find((ws) => getWorkspaceSlug(ws) === slug);
  const router = useRouter();
  const { mutateAsync: setUserDefaultWorkspace } = useMutation({
    mutationFn: $updateUserDefaultWorkspace,
    onSuccess({ ws }) {
      toast.success('Workspace switched');
      setPopoverOpen(false);
      router.push(`/${getWorkspaceSlug(ws as unknown as SelectWorkspaceType)}`);
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
                <WorkspaceAvatar workspace={defaultWs} className="h-6 w-6" />
                <span className="w-2/3 overflow-hidden text-ellipsis text-nowrap text-left">
                  {getWorkspaceSlug(defaultWs)}
                </span>
                <Badge className="!mt-0">Plan</Badge>
              </>
              // biome-ignore lint/nursery/noNestedTernary: <explanation>
            ) : isOrgMode && org ? (
              <>
                <OrgAvatar org={org} className="h-8 w-8" />
                <span className="w-2/3 overflow-hidden text-ellipsis text-nowrap text-left">
                  {org.name}
                </span>
              </>
              // biome-ignore lint/nursery/noNestedTernary: <explanation>
            ) : user ? (
              <>
                <UserAvatar className="h-8 w-8" user={user} />
                <span className="w-2/3 overflow-hidden text-ellipsis text-nowrap text-left">
                  {user.displayName ?? `${user.name}`}
                </span>
              </>
            ) : null}

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
              asChild
            >
              <Link
                href={`/${getWorkspaceSlug(ws)}`}
                onClick={(e) => {
                  e.preventDefault();
                  setUserDefaultWorkspace({ json: { workspaceId: ws.id } });
                }}
              >
                <WorkspaceAvatar workspace={ws} className="mr-2 h-5 w-5 " />
                <span className="w-full shrink overflow-hidden text-ellipsis text-nowrap text-left">
                  {getWorkspaceSlug(ws)}
                </span>
                {getWorkspaceSlug(ws) === slug ? (
                  <CheckIcon className={cn('ml-2 h-6 w-6')} />
                ) : null}
              </Link>
            </Button>
          ))}

          <Button
            variant="ghost"
            className="h-11 w-full"
            onClick={() => {
              closePopover();
              modal.show().then(() => {
                refetch();
              });
            }}
          >
            <PlusCircledIcon className="mr-2 h-6 w-6" />
            <span className="grow text-left">Create workspace</span>
          </Button>
        </PopoverContent>
      </Popover>
    </>
  );
}
