import { ProjectProvider } from '@/components/providers/project-provicer';
import { getDb } from '@hexa/server/db';
import { getSession } from '@hexa/server/session';
import { getProjectWithRoleBySlug } from '@hexa/server/store/project';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

export default async function ProjectLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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
