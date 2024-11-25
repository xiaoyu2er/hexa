import { SelectUserSchema } from '@/server/schema/user';
import { orgMemberTable } from '@/server/table/org-member';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const zOrgMemberRoleEnum = z.enum(['OWNER', 'ADMIN', 'MEMBER']);
export type OrgMemberRoleType = z.infer<typeof zOrgMemberRoleEnum>;

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
  role: zOrgMemberRoleEnum,
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
