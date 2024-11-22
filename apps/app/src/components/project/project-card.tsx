'use client';

import type { SelectProjectType } from '@/features/project/schema';
import { Badge } from '@hexa/ui/badge';
import { Card, CardContent, CardDescription, CardHeader } from '@hexa/ui/card';
import { BarChart2Icon, GlobeIcon, Link2Icon } from '@hexa/ui/icons';
import Link from 'next/link';
import { ProjectAvatar } from './project-avatar';

export function ProjectCard({ project }: { project: SelectProjectType }) {
  const { name } = project;
  return (
    <Card className="grow md:max-w-1/3 md:grow-0">
      <Link href={`/project/${project.slug}`}>
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="items-top flex flex-shrink-0 flex-row gap-2">
            <ProjectAvatar project={project} className="h-6 w-6" />
            <CardDescription>{name}</CardDescription>
          </div>
          <Badge
            className="!mt-0"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Plan
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 text-muted-foreground text-xs">
            <div className="flex items-center">
              <GlobeIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />1
              Domain
            </div>
            <div className="flex items-center">
              <Link2Icon className="mr-1 h-3 w-3" />
              20k Links
            </div>
            <div className="flex items-center">
              <BarChart2Icon className="mr-1 h-3 w-3" />
              10k Views
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
