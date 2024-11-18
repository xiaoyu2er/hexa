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
  const { owner, ws } = useParams() as { owner: string; ws: string };
  const slug = `${owner}/${ws}`;

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
