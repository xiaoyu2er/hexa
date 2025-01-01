import { getProjectSlug } from '@/lib/project';
import { getDb } from '@hexa/server/db';
import { getSession } from '@hexa/server/session/index';
import {
  getLastJoinedOrgsFirstProject,
  getProjectWithRole,
} from '@hexa/server/store/project';
import { redirect } from 'next/navigation';

export default async function HomeLayout() {
  const { session, user } = await getSession();
  if (session && user) {
    if (user.defaultProjectId) {
      try {
        const project = await getProjectWithRole(
          await getDb(),
          user.defaultProjectId,
          user.id
        );
        if (project) {
          return redirect(`/${getProjectSlug(project)}`);
        }
      } catch (_error) {
        // TODO onboarding process
        return redirect('/onboarding');
      }
    } else {
      try {
        const project = await getLastJoinedOrgsFirstProject(
          await getDb(),
          user.id
        );
        if (project) {
          return redirect(`/${getProjectSlug(project)}`);
        }
      } catch (_error) {
        // TODO onboarding process
        return redirect('/onboarding');
      }
    }
  }
  return redirect('/login');
}
