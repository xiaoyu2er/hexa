import { useSession } from '@/components/providers/session-provider';
import { queryOrgByNameOptions } from '@/lib/queries/orgs';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export const useMode = () => {
  const { owner } = useParams() as { owner: string };
  const { user } = useSession();
  const isOrgMode = owner !== user.name;
  return {
    isOrgMode,
    isUserMode: !isOrgMode,
  };
};

export const useContext = () => {
  const { isOrgMode, isUserMode } = useMode();
  const { user } = useSession();
  const { owner, project } = useParams() as { owner: string; project: string };
  const slug = `${owner}/${project}`;

  const { data: org } = useSuspenseQuery(
    queryOrgByNameOptions(isOrgMode ? owner : undefined)
  );
  return {
    org,
    user,
    isOrgMode,
    isUserMode,
    slug,
  };
};
