import type { SelectProjectType } from '@hexa/server/schema/project';

export const getProjectAvatarFallbackUrl = (project: SelectProjectType) => {
  return `https://api.dicebear.com/9.x/icons/svg?seed=${project?.id}`;
};

export const getProjectSlug = (project: {
  org: { slug: string };
  slug: string;
}) => {
  return `${project.org.slug}/${project.slug}`;
};
