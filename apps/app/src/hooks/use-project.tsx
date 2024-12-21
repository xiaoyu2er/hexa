import { ProjectContext } from '@/components/providers/project-provicer';
import { invalidateProject, queryProjectOptions } from '@/lib/queries/project';
import type { SelectProjectType } from '@hexa/server/schema/project';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

export const useProject = () => {
  const project = useContext(ProjectContext);

  if (!project) {
    throw new Error('useProject must be used within a ProjectProvider');
  }

  const { data } = useQuery({
    ...queryProjectOptions(project.id),
    initialData: project as SelectProjectType,
  });

  return {
    project: data,
    invalidate: () => invalidateProject(project.id),
  };
};
