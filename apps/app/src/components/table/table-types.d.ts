import type { InputProps } from '@nextui-org/react';
import type { Column, Table } from '@tanstack/react-table';
import type { ComponentType, ReactNode } from 'react';

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

export interface TableToolbarProps<TData> {
  table: Table<TData>;
  filterConfigs?: FilterConfig<TData>[];
  searchPlaceholder?: string;
  sortOptions?: SortOption<TData>[];
  children?: ReactNode;
}

export type TableView = 'rows' | 'cards';

export interface TableFacetedFilterProps<TData, TValue> {
  column: Column<TData>;
  title: string;
  options: FilterOption<TValue>[];
}

export interface TableToolbarSearchProps<TData> extends InputProps {
  table: Table<TData>;
}
