import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { getProject } from '@/server/store/project';
import {} from '@hexa/ui/alert-dialog';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const { session, user } = await getSession();
  if (session && user) {
    const project = await getProject(await getDb(), user.defaultProjectId);
    if (project) {
      return redirect(`/project/${project.slug}`);
    }
    // TODO onboarding process
    return redirect('/project/create');
  }
  return redirect('/login');
}
