import type { Column, Table } from '@tanstack/react-table';
import type { ComponentType } from 'react';

export interface FilterOption<T> {
  value: T;
  label: string;
  icon?: ComponentType<{ className?: string }>;
}

export interface FilterConfig<TData> {
  columnId: keyof TData;
  label: string;
  options: FilterOption<TData[keyof TData]>[];
}

export interface SortOption<TData> {
  value: keyof TData;
  label: string;
}

interface TableToolbarBaseProps<TData> {
  table: Table<TData>;
  filterConfigs?: FilterConfig<TData>[];
  searchPlaceholder?: string;
  sortOptions: SortOption<TData>[];
}

export type TableView = 'rows' | 'cards';

export interface TableToolbarDesktopProps<TData>
  extends TableToolbarBaseProps<TData> {
  view?: TableView;
  onViewChange?: (view: TableView) => void;
}

export interface TableToolbarMobileProps<TData>
  extends TableToolbarBaseProps<TData> {}

export interface TableFacetedFilterProps<TData, TValue> {
  column: Column<TData>;
  title: string;
  options: FilterOption<TValue>[];
}
