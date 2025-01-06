import { icons } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import type { SelectProjectType } from '@hexa/server/schema/project';

export const getProjectAvatarFallbackUrl = (project: SelectProjectType) => {
  const avatar = createAvatar(icons, {
    seed: project.id,
  });
  return avatar.toDataUri();
};

export const getProjectSlug = (project: {
  org: { slug: string };
  slug: string;
}) => {
  return `${project.org.slug}/${project.slug}`;
};
