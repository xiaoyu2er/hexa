import type { SelectProjectType } from '@/features/project/schema';
import { getProjectAvatarFallbackUrl } from '@/lib/project';
import { Avatar, AvatarImage } from '@hexa/ui/avatar';
import { cn } from '@hexa/utils';

export function ProjectAvatar({
  project,
  className,
}: {
  project: SelectProjectType;
  className: string;
}) {
  return (
    <Avatar className={cn('h-6 w-6', className)}>
      <AvatarImage
        src={project.avatarUrl || getProjectAvatarFallbackUrl(project)}
        alt="Project Profile Picture"
      />
    </Avatar>
  );
}
