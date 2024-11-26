import { PaginationSchema } from '@/server/schema/common';
import { zSortEnum } from '@/server/schema/common';
import { urlTable } from '@/server/table/url';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { Simplify } from 'type-fest';
import { z } from 'zod';

export const zDomain = z
  .string()
  .regex(/^[a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/, 'Invalid domain');

// Url schemas
export const InsertUrlSchema = createInsertSchema(urlTable, {
  destUrl: z.string().url('Please enter a valid URL'),
  slug: z
    .string({ message: 'Slug is required' })
    .min(1, 'Slug is required')
    .max(100),
  title: z.string().optional(),
  desc: z.string().optional(),
  projectId: z.string(),
  domain: zDomain,
});

export type InsertUrlType = Simplify<z.infer<typeof InsertUrlSchema>>;

export const SelectUrlSchema = createSelectSchema(urlTable, {
  destUrl: z.string().url(),
  slug: z.string(),
  createdAt: z.string().datetime(),
});

export type SelectUrlType = z.infer<typeof SelectUrlSchema>;

export const UrlColumnOptions = [
  { label: 'Title', value: 'title' },
  { label: 'Destination URL', value: 'destUrl' },
  { label: 'Domain', value: 'domain' },
  { label: 'Slug', value: 'slug' },
];

// UI options matching sortable columns
export const UrlSortableColumnOptions = [
  { label: 'Created Date', value: 'createdAt' },
] as const satisfies Array<{
  label: string;
  value: keyof SelectUrlType;
}>;
// Add type for valid sort columns
export const SortableColumns = [
  'createdAt',
  //  'clicks'
] as const;

export type SortableColumn = (typeof SortableColumns)[number];
// Type guard to check if a string is a valid sortable column
export function isSortableColumn(
  column: string | undefined
): column is SortableColumn {
  return (
    column !== undefined && SortableColumns.includes(column as SortableColumn)
  );
}
export const zOrgInviteSortingItem = z
  .string()
  .regex(/^[a-zA-Z]+:(asc|desc)$/, {
    message: 'Sort must be in format: field:(asc|desc)',
  })
  .refine(
    (val) => {
      const [field] = val.split(':');
      return isSortableColumn(field);
    },
    {
      message: `Sort field must be one of: ${SortableColumns.join(', ')}`,
    }
  );

export const UrlSortingSchema = z.object({
  // sortClicks: zSortEnum.optional(),
  sortCreatedAt: zSortEnum.optional(),
});

export type UrlSortingType = z.infer<typeof UrlSortingSchema>;

// Transform function to convert sort params
export function transformSortParams(params: UrlSortingType) {
  return Object.entries(params)
    .filter(([field, sort]) => field.startsWith('sort') && sort !== undefined)
    .map(([field, sort]) => ({
      column:
        field.replace(/^sort/, '').charAt(0).toLowerCase() +
        field.replace(/^sort/, '').slice(1),
      sort,
    }))
    .filter((item): item is { column: SortableColumn; sort: 'asc' | 'desc' } =>
      SortableColumns.includes(item.column as SortableColumn)
    );
}

export const UrlQueryFilterSchema = z.object({
  filterDomain: z
    .union([z.array(zDomain), zDomain])
    .optional()
    .transform((val) =>
      (Array.isArray(val) ? val : [val]).filter(
        (status) => status !== undefined
      )
    ),

  search: z.string().optional(),
});
export type UrlQueryFilterType = Simplify<z.infer<typeof UrlQueryFilterSchema>>;

export const UrlQuerySchema =
  PaginationSchema.merge(UrlQueryFilterSchema).merge(UrlSortingSchema);

export type UrlQueryType = Simplify<z.infer<typeof UrlQuerySchema>>;
