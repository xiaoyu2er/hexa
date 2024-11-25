import { useProject } from '@/hooks/use-project';
import { queryOrgInvitesOptions } from '@/lib/queries/orgs';
import { useQuery } from '@tanstack/react-query';
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';

export const useInvites = (
  pagination: PaginationState,
  sorting: SortingState,
  filters: ColumnFiltersState
) => {
  const {
    project: { org },
  } = useProject();

  const { data, isFetching, refetch } = useQuery(
    queryOrgInvitesOptions(org.id, pagination, sorting, filters)
  );

  return { data, isFetching, refetch };
};
