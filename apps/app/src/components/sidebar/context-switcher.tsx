'use client';
import { ProjectAvatar } from '@/components/project/project-avatar';
import { CreateProjectModal } from '@/components/project/project-create-modal';
import { UserAvatar } from '@/components/user/settings/user-avatar';
import { useUser } from '@/hooks/use-user';
import { $updateUserDefaultProject } from '@/lib/api';
import { queryProjectsOptions } from '@/lib/queries/project';
import type { SelectProjectType } from '@/server/schema/project';
import { useModal } from '@ebay/nice-modal-react';
import { Badge } from '@hexa/ui/badge';
import { useScreenSize } from '@hexa/ui/hooks/use-screen-size';
import { CaretSortIcon, PlusCircledIcon } from '@hexa/ui/icons';
import { useSidebar } from '@hexa/ui/sidebar';
import { Skeleton } from '@hexa/ui/skeleton';
import { toast } from '@hexa/ui/sonner';
import { cn } from '@hexa/utils';
import {
  Button,
  Input,
  Listbox,
  ListboxItem,
  ListboxSection,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { type ReactNode, useState } from 'react';
import { useBoolean } from 'usehooks-ts';

export const ListboxWrapper = ({ children }: { children: ReactNode }) => (
  <div className="w-full max-w-[260px] rounded-small border-default-200 border-small px-1 py-2 dark:border-default-100">
    {children}
  </div>
);

export function ContextSwitcher() {
  const { isMobile } = useScreenSize();

  const { slug } = useParams() as { slug: string };
  const { state } = useSidebar();
  const { user } = useUser();

  const {
    data: projects = [],
    refetch,

    isFetched,
  } = useQuery(
    queryProjectsOptions // if not owner, get all accessible projects
  );

  const {
    value: isPopoverOpen,
    setValue: setPopoverOpen,
    setFalse: closePopover,
  } = useBoolean();

  const modal = useModal(CreateProjectModal);
  const selectedProject = projects?.find(
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
      toast.error(`Failed to switch project${err.message}`);
    },
  });

  const projectsByOrg: Record<
    string,
    { name: string; projects: SelectProjectType[] }
  > = projects.reduce(
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
  if (!isFetched) {
    return (
      <Skeleton
        className={cn('w-full', state === 'collapsed' ? 'h-5' : 'h-10')}
      />
    );
  }

  return (
    <>
      <Popover
        isOpen={isPopoverOpen}
        onOpenChange={setPopoverOpen}
        placement={isMobile ? 'bottom' : 'right'}
        radius="sm"
      >
        <PopoverTrigger>
          {state === 'collapsed' && !isMobile ? (
            <div className="flex w-full items-center justify-center">
              {selectedProject ? (
                <ProjectAvatar
                  project={selectedProject}
                  className="size-5 cursor-pointer"
                />
              ) : // biome-ignore lint/nursery/noNestedTernary: <explanation>
              user ? (
                <UserAvatar className="size-5 cursor-pointer" user={user} />
              ) : null}
            </div>
          ) : (
            <Button
              variant="flat"
              radius="sm"
              aria-expanded={isPopoverOpen}
              aria-label="Select a team"
              className={cn('w-full justify-between')}
            >
              {selectedProject ? (
                <>
                  <ProjectAvatar
                    project={selectedProject}
                    className="h-6 w-6"
                  />
                  <span className="w-2/3 overflow-hidden text-ellipsis text-nowrap text-left">
                    {selectedProject.name}
                  </span>
                  <Badge className="!mt-0">Plan</Badge>
                </>
              ) : // biome-ignore lint/nursery/noNestedTernary: <explanation>
              user ? (
                <>
                  <UserAvatar className="h-8 w-8" user={user} />
                  <span className="w-2/3 overflow-hidden text-ellipsis text-nowrap text-left">
                    {`${user.name}`}
                  </span>
                </>
              ) : null}

              <CaretSortIcon className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-72 px-1 pt-2 pb-0">
          <Listbox
            selectionMode="single"
            defaultSelectedKeys={selectedProject ? [selectedProject.id] : []}
            topContent={
              <Input
                type="search"
                placeholder="Search projects..."
                value={searchQuery}
                size="sm"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            }
          >
            {Object.entries(projectsByOrg).map(([orgId, org]) => (
              <ListboxSection key={orgId} title={org.name}>
                <>
                  {org.projects.map((project) => (
                    <ListboxItem
                      key={project.id}
                      onClick={(e) => {
                        e.preventDefault();
                        setUserDefaultProject({
                          json: { projectId: project.id },
                        });
                      }}
                      startContent={
                        <ProjectAvatar
                          project={project}
                          className="mr-2 h-5 w-5 "
                        />
                      }
                    >
                      {project.name}
                    </ListboxItem>
                  ))}
                  <ListboxItem
                    key="create-project"
                    startContent={<PlusCircledIcon className="h-5 w-5" />}
                    onClick={() => {
                      closePopover();
                      modal.show().then(() => {
                        refetch();
                      });
                    }}
                  >
                    Create project
                  </ListboxItem>
                </>
              </ListboxSection>
            ))}
          </Listbox>
        </PopoverContent>
      </Popover>
    </>
  );
}
