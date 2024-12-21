'use client';

import {} from '@/lib/queries/project';
import type { SelectProjectType } from '@hexa/server/schema/project';
import { type FC, type ReactNode, createContext } from 'react';

export const ProjectContext = createContext<SelectProjectType | null>(null);

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
