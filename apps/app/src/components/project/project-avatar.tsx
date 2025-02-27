import { getProjectAvatarFallbackUrl } from '@/lib/project';
import { Avatar, type AvatarProps, cn } from '@heroui/react';
import type { SelectProjectType } from '@hexa/server/schema/project';

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
      name={project.name || project.slug}
      className={cn('shrink-0', className)}
      showFallback={false}
      {...props}
    />
  );
}
