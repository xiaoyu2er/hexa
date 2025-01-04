import {
  PaginationSchema,
  zEmail,
  zSortEnum,
} from '@hexa/server/schema/common';
import { SelectOrgSchema } from '@hexa/server/schema/org';
import { zOrgMemberRole } from '@hexa/server/schema/org-member';
import { orgInviteTable } from '@hexa/server/table/org-invite';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { Simplify } from 'type-fest';
import { z } from 'zod';
import { BasicUserSchema, SelectUserSchema } from './user';

export const zInviteStatus = z.enum([
  'PENDING',
  'ACCEPTED',
  'REVOKED',
  'REJECTED',
  'EXPIRED',
]);
export type InviteStatusType = z.infer<typeof zInviteStatus>;

export const InviteStatusOptions = [
  {
    label: 'Pending',
    value: 'PENDING',
  },
  {
    label: 'Expired',
    value: 'EXPIRED',
  },
  {
    label: 'Revoked',
    value: 'REVOKED',
  },
  {
    label: 'Rejected',
    value: 'REJECTED',
  },
  {
    label: 'Accepted',
    value: 'ACCEPTED',
  },
];

export const InviteSortableColumnOptions = [
  { label: 'Expires', value: 'expiresAt' },
  { label: 'Created', value: 'createdAt' },
  { label: 'Name', value: 'name' },
  { label: 'Email', value: 'email' },
  { label: 'Role', value: 'role' },
  { label: 'Status', value: 'status' },
] as const satisfies Array<{
  label: string;
  value: keyof QueryInviteType;
}>;

export type InviteSortableColumn =
  (typeof InviteSortableColumnOptions)[number]['value'];

export const InsertInviteSchema = createInsertSchema(orgInviteTable, {
  role: zOrgMemberRole,
  status: zInviteStatus,
  email: zEmail,
});
export type InsertInviteType = Simplify<z.infer<typeof InsertInviteSchema>>;

export const SelectInviteSchema = createSelectSchema(orgInviteTable, {
  role: zOrgMemberRole,
  status: zInviteStatus,
  expiresAt: z.string().datetime(),
  createdAt: z.string().datetime(),
}).extend({
  inviter: SelectUserSchema,
  org: SelectOrgSchema,
});
export type SelectInviteType = Simplify<z.infer<typeof SelectInviteSchema>>;

export const QueryInviteSchema = createSelectSchema(orgInviteTable, {
  role: zOrgMemberRole,
  status: zInviteStatus,
  email: zEmail,
  expiresAt: z.string().datetime(),
  createdAt: z.string().datetime(),
}).extend({
  inviter: BasicUserSchema,
  org: SelectOrgSchema,
});
export type QueryInviteType = Simplify<z.infer<typeof QueryInviteSchema>>;

export const CreateInvitesSchema = z.object({
  orgId: z.string(),
  invites: z.array(
    z.object({
      email: zEmail,
      role: zOrgMemberRole,
    })
  ),
});
export type CreateInvitesType = Simplify<z.infer<typeof CreateInvitesSchema>>;

export const RevokeInviteSchema = z.object({
  inviteId: z.string(),
  orgId: z.string(),
});
export type RevokeInviteType = Simplify<z.infer<typeof RevokeInviteSchema>>;

// Add type for valid sort columns
export const SortableColumns = [
  'createdAt',
  'expiresAt',
  'status',
  'email',
  'role',
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

export const OrgInviteSortingSchema = z.object({
  sortStatus: zSortEnum.optional(),
  sortRole: zSortEnum.optional(),
  sortCreatedAt: zSortEnum.optional(),
  sortExpiresAt: zSortEnum.optional(),
  sortEmail: zSortEnum.optional(),
});

export type OrgInviteSortingType = z.infer<typeof OrgInviteSortingSchema>;

const SORT_REGEX = /^sort/;
// Transform function to convert sort params
export function transformSortParams(params: OrgInviteSortingType) {
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

export const OrgInviteQueryFilterSchema = z.object({
  filterStatus: z
    .union([z.array(zInviteStatus), zInviteStatus])
    .optional()
    .transform((val) =>
      (Array.isArray(val) ? val : [val]).filter(
        (status) => status !== undefined
      )
    ),
  filterRole: z
    .union([z.array(zOrgMemberRole), zOrgMemberRole])
    .optional()
    .transform((val) =>
      (Array.isArray(val) ? val : [val]).filter((role) => role !== undefined)
    ),
  search: z.string().optional(),
});
export type OrgInviteQueryFilterType = Simplify<
  z.infer<typeof OrgInviteQueryFilterSchema>
>;

export const OrgInviteQuerySchema = PaginationSchema.merge(
  OrgInviteQueryFilterSchema
).merge(OrgInviteSortingSchema);

export type OrgInviteQueryType = Simplify<z.infer<typeof OrgInviteQuerySchema>>;
