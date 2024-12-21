import { getDb } from '@hexa/server/db';
import { getSession } from '@hexa/server/session/index';
import { getProject } from '@hexa/server/store/project';
import { redirect } from 'next/navigation';

export default async function HomeLayout() {
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
