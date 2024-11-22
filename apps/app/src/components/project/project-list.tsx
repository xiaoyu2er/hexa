'use client';

import { queryProjectsOptions } from '@/lib/queries/workspace';
import { CardSkeleton } from '@hexa/ui/card-skeleton';
import { useQuery } from '@tanstack/react-query';
import NoProject from './no-project';
import { ProjectCard } from './project-card';

export const ProjectList = () => {
  const { data: projects = [], isFetching } = useQuery(queryProjectsOptions);

  if (isFetching) {
    return (
      <div className="flex flex-wrap gap-5">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <>
      {projects.length > 0 ? (
        <div className="flex flex-wrap gap-5">
          {projects.map((w) => {
            return <ProjectCard key={w.id} project={w} />;
          })}
        </div>
      ) : (
        <NoProject />
      )}
    </>
  );
};
