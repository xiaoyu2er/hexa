import { getProjectSlug } from '@/lib/project';
import { getDb } from '@hexa/server/db';
import { getSession } from '@hexa/server/session/index';
import {
  getLastJoinedOrgsFirstProject,
  getProjectWithRole,
} from '@hexa/server/store/project';
import { redirect } from 'next/navigation';

export default async function () {
  const { session, user } = await getSession();
  if (session && user) {
    if (user.defaultProjectId) {
      const project = await getProjectWithRole(await getDb(), {
        projectId: user.defaultProjectId,
        userId: user.id,
      });
      if (project) {
        return redirect(`/${getProjectSlug(project)}`);
      }
      return redirect('/onboarding');
    }
    const project = await getLastJoinedOrgsFirstProject(await getDb(), user.id);

    if (project) {
      return redirect(`/${getProjectSlug(project)}`);
    }
    return redirect('/onboarding');
  }

  return redirect('/login');
}
