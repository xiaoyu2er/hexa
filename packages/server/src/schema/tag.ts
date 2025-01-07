
import { PaginationSchema } from '@hexa/server/schema/common';
import { zSortEnum } from '@hexa/server/schema/common';
import { zDomain } from '@hexa/server/schema/domain';
import type { SelectProjectType } from '@hexa/server/schema/project';
import { tagTable } from '@hexa/server/table/tag';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { Simplify } from 'type-fest';
import { z } from 'zod';


// Tag schemas
export const InsertTagSchema = createInsertSchema(tagTable);

export const UpdateTagSchema = InsertTagSchema.merge(
  z.object({ id: z.string() })
);

export type InsertTagType = Simplify<z.infer<typeof InsertTagSchema>>;
export type UpdateTagType = Simplify<z.infer<typeof UpdateTagSchema>>;
export const SelectTagSchema = createSelectSchema(tagTable, {
  name: z.string(),
  createdAt: z.string().datetime(),
});

export type SelectTagType = Simplify<z.infer<typeof SelectTagSchema>>;
export type SelectTagWithProjectType = SelectTagType & {
  project: SelectProjectType;
};

// Add type for valid sort columns
export const SortableColumns = [
  'createdAt',
  //  'clicks'
] as const;

// UI options matching sortable columns
export const TagSortableColumnOptions = [
  { label: 'Tag', value: 'name' },
] as const satisfies Array<{
  label: string;
  value: keyof SelectTagType;
}>;

export const TagColumnOptions = TagSortableColumnOptions;
export type SortableColumn = (typeof SortableColumns)[number];
// Type guard to check if a string is a valid sortable column
export function isSortableColumn(
  column: string | undefined
): column is SortableColumn {
  return (
    column !== undefined && SortableColumns.includes(column as SortableColumn)
  );
}

export const TagSortingSchema = z.object({
  // sortClicks: zSortEnum.optional(),
  sortCreatedAt: zSortEnum.optional(),
});

export type TagSortingType = z.infer<typeof TagSortingSchema>;

const SORT_REGEX = /^sort/;
// Transform function to convert sort params
export function transformSortParams(params: TagSortingType) {
  return Object.entries(params)
    .filter(([field, sort]) => field.startsWith('sort') && sort !== undefined)
    .map(([field, sort]) => ({
      column:
        field.replace(SORT_REGEX, '').charAt(0).toLowerCase() +
        field.replace(SORT_REGEX, '').slice(1),
      sort,
    }))
    .filter((item): item is { column: SortableColumn; sort: 'asc' | 'desc' } =>
      SortableColumns.includes(item.column as SortableColumn)
    );
}

export const TagQueryFilterSchema = z.object({
  search: z.string().optional(),
});

export type TagQueryFilterType = Simplify<
  z.infer<typeof TagQueryFilterSchema>
>;

export const TagQuerySchema = PaginationSchema.merge(
  TagQueryFilterSchema
).merge(TagSortingSchema);

export type TagQueryType = Simplify<z.infer<typeof TagQuerySchema>>;
