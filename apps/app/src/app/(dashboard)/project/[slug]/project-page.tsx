'use client';
import { useProject } from '@/components/providers/project-provicer';

export default function ProjectPage() {
  const { project } = useProject();
  return <>Project page {JSON.stringify(project)}</>;
}
