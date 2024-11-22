import { ProjectProvider } from '@/components/providers/project-provicer';
import { getProjectWithRoleBySlug } from '@/features/project/store';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

export default async function DashLayout({
  children,
  params: { slug },
}: {
  children: ReactNode;
  params: { slug: string };
}) {
  const { session } = await getSession();
  const project = await getProjectWithRoleBySlug(
    await getDb(),
    slug,
    // @ts-ignore
    session.userId
  );

  if (!project || !project.role) {
    return redirect('/');
  }
  return <ProjectProvider project={project}>{children}</ProjectProvider>;
}
