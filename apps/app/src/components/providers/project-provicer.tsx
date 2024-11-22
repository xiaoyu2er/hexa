'use client';

import type { SelectProjectType } from '@/features/project/schema';
import {
  invalidateProject,
  queryProjectOptions,
} from '@/lib/queries/workspace';
import { useQuery } from '@tanstack/react-query';
import { type FC, type ReactNode, createContext, useContext } from 'react';

const ProjectContext = createContext<SelectProjectType | null>(null);

export const ProjectProvider: FC<{
  children: ReactNode;
  project: SelectProjectType;
}> = ({ children, project }) => {
  return (
    <ProjectContext.Provider value={project}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const project = useContext(ProjectContext);
  if (!project) {
    throw new Error('Project context not found');
  }
  const { data } = useQuery({
    ...queryProjectOptions(project.id),
    initialData: project,
  });

  return {
    project: data,
    invalidate: () => invalidateProject(project.id),
  };
};
