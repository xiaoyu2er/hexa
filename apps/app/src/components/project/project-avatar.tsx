import { getProjectAvatarFallbackUrl } from '@/lib/project';
import type { SelectProjectType } from '@/server/schema/project';
import { Avatar, type AvatarProps, cn } from '@nextui-org/react';

export type ProjectAvatarProps = {
  project: SelectProjectType;
} & AvatarProps;

export function ProjectAvatar({
  project,
  className,
  ...props
}: ProjectAvatarProps) {
  return (
    <Avatar
      src={project.avatarUrl || getProjectAvatarFallbackUrl(project)}
      name={project.name || 'Project Profile Picture'}
      className={cn('shrink-0', className)}
      showFallback={false}
      {...props}
    />
  );
}
