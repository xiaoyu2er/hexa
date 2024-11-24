import { ProjectProvider } from '@/components/providers/project-provicer';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { getProjectWithRoleBySlug } from '@/server/store/project';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

export default async function ProjectLayout({
  children,
  params: { slug },
}: {
  children: ReactNode;
  params: { slug: string };
}) {
  const { session } = await getSession();

  if (!session) {
    return null;
  }

  const project = await getProjectWithRoleBySlug(
    await getDb(),
    slug,
    session.userId
  );

  if (!project || !project.role) {
    return notFound();
  }
  return <ProjectProvider project={project}>{children}</ProjectProvider>;
}
