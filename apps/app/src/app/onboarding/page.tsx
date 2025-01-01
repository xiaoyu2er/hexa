import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import { getProjectSlug } from '@/lib/project';
import { getDb } from '@hexa/server/db';
import { getSession } from '@hexa/server/session';
import { getUserOrgs } from '@hexa/server/store/org';
import { getOrgProjects } from '@hexa/server/store/project';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const { session, user } = await getSession();
  if (!session || !user) {
    redirect('/login');
  }

  const db = await getDb();
  const orgs = await getUserOrgs(db, user.id);

  if (orgs.rowCount > 0) {
    // First try to find an org where user is owner
    const ownedOrg = orgs.data.find((org) => org.role === 'OWNER');

    if (ownedOrg) {
      // Check if owned org has projects
      const projects = await getOrgProjects(db, ownedOrg.id);
      if (projects[0]) {
        // Redirect to first project
        redirect(`/${getProjectSlug(projects[0])}`);
      }
      // No projects, continue to project creation with owned org
      return (
        <OnboardingFlow
          steps={['project', 'invite'] as const}
          initialOrg={ownedOrg}
        />
      );
    }

    // If no owned org, check member orgs
    for (const org of orgs.data) {
      const projects = await getOrgProjects(db, org.id);
      if (projects[0]) {
        // Redirect to first project found
        redirect(`/${getProjectSlug(projects[0])}`);
      }
    }

    // Use first org if no owned org found
    return (
      <OnboardingFlow
        steps={['project', 'invite'] as const}
        initialOrg={orgs.data[0]}
      />
    );
  }

  // No orgs found, start fresh onboarding
  return (
    <OnboardingFlow steps={['welcome', 'org', 'project', 'invite'] as const} />
  );
}
