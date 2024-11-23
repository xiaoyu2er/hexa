'use client';
import { useProject } from '@/hooks/use-project';

export default function ProjectPage() {
  const { project } = useProject();
  return <>Project page {JSON.stringify(project)}</>;
}
