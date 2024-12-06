import { PaginationSchema } from '@/server/schema/common';
import { zSortEnum } from '@/server/schema/common';
import { zDomain } from '@/server/schema/domain';
import type { SelectProjectType } from '@/server/schema/project';
import { linkTable } from '@/server/table/link';
import { LinkRuleSchema } from '@hexa/const/rule';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { Simplify } from 'type-fest';
import { z } from 'zod';

// Link schemas
export const InsertLinkSchema = createInsertSchema(linkTable, {
  destUrl: z.string().url('Please enter a valid URL'),
  slug: z
    .string({ message: 'Slug is required' })
    .min(1, 'Slug is required')
    .max(100),
  title: z.string().optional(),
  desc: z.string().optional(),
  projectId: z.string(),
  domain: zDomain,
  rules: z.array(LinkRuleSchema).optional(),
});

export const UpdateLinkSchema = InsertLinkSchema.merge(
  z.object({ id: z.string() })
);

export type InsertLinkType = Simplify<z.infer<typeof InsertLinkSchema>>;
export type UpdateLinkType = Simplify<z.infer<typeof UpdateLinkSchema>>;
export const SelectLinkSchema = createSelectSchema(linkTable, {
  destUrl: z.string().url(),
  slug: z.string(),
  createdAt: z.string().datetime(),
  rules: z.array(LinkRuleSchema),
});

export type SelectLinkType = Simplify<z.infer<typeof SelectLinkSchema>>;
export type SelectLinkWithProjectType = SelectLinkType & {
  project: SelectProjectType;
};
export const LinkColumnOptions = [
  { label: 'Title', value: 'title' },
  { label: 'Destination URL', value: 'destUrl' },
  { label: 'Domain', value: 'domain' },
  { label: 'Slug', value: 'slug' },
];

// UI options matching sortable columns
export const LinkSortableColumnOptions = [
  { label: 'Created Date', value: 'createdAt' },
] as const satisfies Array<{
  label: string;
  value: keyof SelectLinkType;
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

export const LinkSortingSchema = z.object({
  // sortClicks: zSortEnum.optional(),
  sortCreatedAt: zSortEnum.optional(),
});

export type LinkSortingType = z.infer<typeof LinkSortingSchema>;

// Transform function to convert sort params
export function transformSortParams(params: LinkSortingType) {
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

export const LinkQueryFilterSchema = z.object({
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
export type LinkQueryFilterType = Simplify<
  z.infer<typeof LinkQueryFilterSchema>
>;

export const LinkQuerySchema = PaginationSchema.merge(
  LinkQueryFilterSchema
).merge(LinkSortingSchema);

export type LinkQueryType = Simplify<z.infer<typeof LinkQuerySchema>>;
