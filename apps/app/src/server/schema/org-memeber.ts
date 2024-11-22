import { orgMemberTable } from '@/server/table/org-member';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const OrgMemberRoleSchema = z.enum(['OWNER', 'ADMIN', 'MEMBER']);
export type OrgMemberRole = z.infer<typeof OrgMemberRoleSchema>;

// Org Member
export const InsertOrgMemberSchema = createInsertSchema(orgMemberTable);
export type InsertOrgMemberType = z.infer<typeof InsertOrgMemberSchema>;
export const SelectOrgMemberSchema = createSelectSchema(orgMemberTable);
export type SelectOrgMemberType = z.infer<typeof SelectOrgMemberSchema>;
