import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import { getProjectSlug } from '@/lib/project';
import { getDb } from '@hexa/server/db';
import { getSession } from '@hexa/server/session';
import { getUserOrgs } from '@hexa/server/store/org';
import {
  getLastJoinedOrgsFirstProject,
  getProjectWithRole,
} from '@hexa/server/store/project';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const { session, user } = await getSession();
  if (!session || !user) {
    redirect('/login');
  }

  const db = await getDb();
  // Check if user has a default project
  if (user.defaultProjectId) {
    const project = await getProjectWithRole(await getDb(), {
      projectId: user.defaultProjectId,
      userId: user.id,
    });
    if (project) {
      return redirect(`/${getProjectSlug(project)}`);
    }
  }

  // If no default project, check last joined orgs first project
  const project = await getLastJoinedOrgsFirstProject(await getDb(), user.id);
  if (project) {
    return redirect(`/${getProjectSlug(project)}`);
  }

  // If no project found, check user orgs
  const orgs = await getUserOrgs(db, user.id);

  if (orgs.rowCount > 0) {
    // First try to find an org where user is owner
    const ownedOrg = orgs.data.find((org) => org.role === 'OWNER');

    if (ownedOrg) {
      return (
        <OnboardingFlow
          steps={['project', 'invite'] as const}
          initialOrg={ownedOrg}
        />
      );
    }
  }

  // No orgs found, start fresh onboarding
  return (
    <OnboardingFlow steps={['welcome', 'org', 'project', 'invite'] as const} />
  );
}
