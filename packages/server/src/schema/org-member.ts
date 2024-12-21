import { PaginationSchema, zSortEnum } from '@hexa/server/schema/common';
import { SelectUserSchema } from '@hexa/server/schema/user';
import { orgMemberTable } from '@hexa/server/table/org-member';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const zOrgMemberRole = z.enum(['OWNER', 'ADMIN', 'MEMBER']);
export type OrgMemberRoleType = z.infer<typeof zOrgMemberRole>;

export const OrgRoleOptions = [
  {
    label: 'Member',
    value: 'MEMBER',
  },
  {
    label: 'Admin',
    value: 'ADMIN',
  },
  {
    label: 'Owner',
    value: 'OWNER',
  },
];

// Org Member
export const InsertOrgMemberSchema = createInsertSchema(orgMemberTable);
export type InsertOrgMemberType = z.infer<typeof InsertOrgMemberSchema>;

export const SelectOrgMemberSchema = createSelectSchema(orgMemberTable, {
  role: zOrgMemberRole,
  createdAt: z.string().datetime(),
}).extend({
  user: SelectUserSchema.pick({
    id: true,
    name: true,
    avatarUrl: true,
  }).extend({
    email: z.string().nullable(),
  }),
});
export type SelectOrgMemberType = z.infer<typeof SelectOrgMemberSchema>;

// Define columns that exist directly in orgMemberTable
export const DirectTableColumns = ['createdAt', 'role'] as const;
export type DirectTableColumn = (typeof DirectTableColumns)[number];

// All sortable columns including related tables
export const SortableColumns = [
  ...DirectTableColumns,
  // 'name', // from user table
  // 'email', // from email table
] as const;

export type SortableColumn = (typeof SortableColumns)[number];

// UI options matching sortable columns
export const OrgMemberSortableColumnOptions = [
  { label: 'Join Date', value: 'createdAt' },
  // { label: 'Name', value: 'name' },
  // { label: 'Email', value: 'email' },
  { label: 'Role', value: 'role' },
] as const satisfies Array<{
  label: string;
  value: keyof SelectOrgMemberType;
}>;

export const OrgMemberColumnOptions = OrgMemberSortableColumnOptions;

// Type guard for direct table columns
export function isDirectTableColumn(
  column: string
): column is DirectTableColumn {
  return DirectTableColumns.includes(column as DirectTableColumn);
}

// Type guard for sortable columns
export function isSortableColumn(
  column: string | undefined
): column is SortableColumn {
  return (
    column !== undefined && SortableColumns.includes(column as SortableColumn)
  );
}

// Sorting item validation
export const zOrgMemberSortingItem = z
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

// Sorting schema with individual sort fields
export const OrgMemberSortingSchema = z.object({
  sortName: zSortEnum.optional(),
  sortRole: zSortEnum.optional(),
  sortCreatedAt: zSortEnum.optional(),
  sortEmail: zSortEnum.optional(),
});

export type OrgMemberSortingType = z.infer<typeof OrgMemberSortingSchema>;

// Transform function to convert sort params
export function transformSortParams(params: OrgMemberSortingType) {
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

// Query filter schema
export const OrgMemberQueryFilterSchema = z.object({
  filterRole: z
    .union([z.array(zOrgMemberRole), zOrgMemberRole])
    .optional()
    .transform((val) =>
      (Array.isArray(val) ? val : [val]).filter((role) => role !== undefined)
    ),
  search: z.string().optional(),
});

export type OrgMemberQueryFilterType = z.infer<
  typeof OrgMemberQueryFilterSchema
>;

// Combined query schema
export const OrgMemberQuerySchema = PaginationSchema.merge(
  OrgMemberQueryFilterSchema
).merge(OrgMemberSortingSchema);

export type OrgMemberQueryType = z.infer<typeof OrgMemberQuerySchema>;
