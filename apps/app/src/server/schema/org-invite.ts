import { zEmailString } from '@/server/schema/common';
import { zOrgMemberRoleEnum } from '@/server/schema/org-memeber';
import { orgInviteTable } from '@/server/table/org-invite';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { Simplify } from 'type-fest';
import { z } from 'zod';
import { SelectUserSchema } from './user';

export const zInviteStatusEnum = z.enum(['PENDING', 'ACCEPTED', 'REVOKED']);
export type InviteStatusType = z.infer<typeof zInviteStatusEnum>;

export const InsertInviteSchema = createInsertSchema(orgInviteTable, {
  role: zOrgMemberRoleEnum,
  status: zInviteStatusEnum,
  email: zEmailString,
});
export type InsertInviteType = Simplify<z.infer<typeof InsertInviteSchema>>;

export const SelectInviteSchema = createSelectSchema(orgInviteTable, {
  role: zOrgMemberRoleEnum,
  status: zInviteStatusEnum,
  email: zEmailString,
  expiresAt: z.string().datetime(),
  createdAt: z.string().datetime(),
}).extend({
  inviter: SelectUserSchema.pick({
    id: true,
    name: true,
    avatarUrl: true,
  }).extend({
    email: z.string().nullable(),
  }),
});
export type SelectInviteType = z.infer<typeof SelectInviteSchema>;

export const CreateInvitesSchema = z.object({
  orgId: z.string(),
  invites: z.array(
    z.object({
      email: zEmailString,
      role: zOrgMemberRoleEnum,
    })
  ),
});

export type CreateInvitesType = Simplify<z.infer<typeof CreateInvitesSchema>>;
