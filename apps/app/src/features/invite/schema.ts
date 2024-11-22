import { inviteTable } from '@/features/invite/table';
import { OrgMemberRoleSchema } from '@/features/org-member/schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { Simplify } from 'type-fest';
import { z } from 'zod';

export const InviteStatusSchema = z.enum(['PENDING', 'ACCEPTED']);
export type InviteStatus = z.infer<typeof InviteStatusSchema>;

export const InsertInviteSchema = createInsertSchema(inviteTable, {
  role: OrgMemberRoleSchema,
  status: InviteStatusSchema,
});
export type InsertInviteType = Simplify<z.infer<typeof InsertInviteSchema>>;
export const SelectInviteSchema = createSelectSchema(inviteTable);
export type SelectInviteType = z.infer<typeof SelectInviteSchema>;
