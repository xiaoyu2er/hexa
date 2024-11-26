import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import { camelCase } from 'lodash';

export interface TableQuery {
  pagination: PaginationState;
  sorting: SortingState;
  filters: ColumnFiltersState;
}

export const getTableQuery = ({
  pagination,
  sorting,
  filters,
}: TableQuery) => ({
  pageIndex: pagination.pageIndex.toString(),
  pageSize: pagination.pageSize.toString(),
  ...Object.fromEntries(
    sorting.map((sort) => [
      `${camelCase(`sort_${sort.id}`)}`,
      sort.desc ? 'desc' : 'asc',
    ])
  ),
  ...Object.fromEntries(
    filters.map((filter) => [
      filter.id === 'search' ? 'search' : `${camelCase(`filter_${filter.id}`)}`,
      filter.value,
    ])
  ),
});
