'use client';
import { useProject } from '@/hooks/use-project';

export default function ProjectPage() {
  const { project } = useProject();
  return <div className="text-wrap">Project page {project.name}</div>;
}
