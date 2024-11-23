'use client';
import { CreateProjectModal } from '@/components/project/create-project-modal';
import { ProjectAvatar } from '@/components/project/project-avatar';
import { UserAvatar } from '@/components/user/settings/user-avatar';
import { useUser } from '@/hooks/use-user';
import { $updateUserDefaultProject } from '@/lib/api';
import { queryProjectsOptions } from '@/lib/queries/project';
import type { SelectProjectType } from '@/server/schema/project';
import { useModal } from '@ebay/nice-modal-react';
import { Badge } from '@hexa/ui/badge';
import { Button } from '@hexa/ui/button';
import {} from '@hexa/ui/collapsible';
import { CaretSortIcon, CheckIcon, PlusCircledIcon } from '@hexa/ui/icons';
import { Input } from '@hexa/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@hexa/ui/popover';
import { Skeleton } from '@hexa/ui/skeleton';
import { toast } from '@hexa/ui/sonner';
import { cn } from '@hexa/utils';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useBoolean } from 'usehooks-ts';

export function ContextSwitcher() {
  const { slug } = useParams() as { slug: string };
  const { user } = useUser();

  const {
    data: workspaces = [],
    refetch,
    isFetching,
  } = useQuery(
    queryProjectsOptions // if not owner, get all accessible workspaces
  );

  const {
    value: isPopoverOpen,
    setValue: setPopoverOpen,
    setFalse: closePopover,
  } = useBoolean();

  const modal = useModal(CreateProjectModal);
  const selectedProject = workspaces?.find(
    (project) => `${project.slug}` === slug
  );
  const router = useRouter();
  const { mutateAsync: setUserDefaultProject } = useMutation({
    mutationFn: $updateUserDefaultProject,
    onSuccess({ project }) {
      toast.success('Project switched');
      setPopoverOpen(false);
      router.push(`/project/${project.slug}`);
    },
    onError(err) {
      toast.error(`Failed to switch workspace${err.message}`);
    },
  });

  const workspacesByOrg: Record<
    string,
    { name: string; projects: SelectProjectType[] }
  > = workspaces.reduce(
    (acc, project) => {
      const orgId = project.orgId;
      if (!acc[orgId]) {
        acc[orgId] = {
          name: project.org.name,
          projects: [],
        };
      }
      acc[orgId]?.projects.push(project);
      return acc;
    },
    {} as Record<string, { name: string; projects: SelectProjectType[] }>
  );

  const [searchQuery, setSearchQuery] = useState('');
  if (isFetching) {
    return <Skeleton className="h-4 w-[250px]" />;
  }
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
            {selectedProject ? (
              <>
                <ProjectAvatar project={selectedProject} className="h-6 w-6" />
                <span className="w-2/3 overflow-hidden text-ellipsis text-nowrap text-left">
                  {selectedProject.name}
                </span>
                <Badge className="!mt-0">Plan</Badge>
              </>
              // biome-ignore lint/nursery/noNestedTernary: <explanation>
            ) : user ? (
              <>
                <UserAvatar className="h-8 w-8" user={user} />
                <span className="w-2/3 overflow-hidden text-ellipsis text-nowrap text-left">
                  {`${user.name}`}
                </span>
              </>
            ) : null}

            <CaretSortIcon className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0">
          <div className="px-4 py-2">
            <Input
              type="search"
              placeholder="Search workspaces..."
              className="h-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {Object.entries(workspacesByOrg).map(([orgId, org]) => (
            <div key={orgId}>
              <div className="px-4 py-2">
                <p className="font-medium text-muted-foreground text-sm">
                  {org.name}
                </p>
              </div>

              {org.projects.map((project) => (
                <Button
                  key={project.id}
                  variant="ghost"
                  className="h-11 w-full justify-start"
                  asChild
                >
                  <Link
                    href={`/project/${project.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setUserDefaultProject({
                        json: { projectId: project.id },
                      });
                    }}
                  >
                    <ProjectAvatar
                      project={project}
                      className="mr-2 h-5 w-5 "
                    />
                    <span className="w-full shrink overflow-hidden text-ellipsis text-nowrap text-left">
                      {project.name}
                    </span>
                    {project === selectedProject ? (
                      <CheckIcon className={cn('ml-2 h-6 w-6')} />
                    ) : null}
                  </Link>
                </Button>
              ))}
            </div>
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
