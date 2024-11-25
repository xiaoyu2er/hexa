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
}

export interface TableToolbarDesktopProps<TData>
  extends TableToolbarBaseProps<TData> {}

export interface TableToolbarMobileProps<TData>
  extends TableToolbarBaseProps<TData> {
  sortOptions: SortOption<TData>[];
}

export interface TableFacetedFilterProps<TData, TValue> {
  column: Column<TData>;
  title: string;
  options: FilterOption<TValue>[];
}
