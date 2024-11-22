import type { SelectProjectType } from '@/server/schema/project';

export const getProjectAvatarFallbackUrl = (project: SelectProjectType) => {
  return `https://api.dicebear.com/9.x/icons/svg?seed=${project?.id}`;
};

export const getProjectSlug = (project: SelectProjectType) => {
  return `/project/${project.slug}`;
};
