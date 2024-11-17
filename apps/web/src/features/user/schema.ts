import {
  DisplayNameSchema,
  NameSchema,
  type UpdateAvatarType,
} from '@/features/common/schema';
import { UpdateAvatarSchema } from '@/features/common/schema';
import { userTable } from '@/features/user/table';
import type { Simplify } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const UpdateUserAvatarSchema = UpdateAvatarSchema;
export type UpdateUserAvatarType = UpdateAvatarType;

// User
export const InsertUserSchema = createInsertSchema(userTable);
export type InsertUserType = z.infer<typeof InsertUserSchema>;
export const SelectUserSchema = createSelectSchema(userTable);
export type SelectUserType = Simplify<z.infer<typeof SelectUserSchema>>;

export const UpdateDisplayNameSchema = z.object({}).merge(DisplayNameSchema);
export type UpdateDisplayNameType = z.infer<typeof UpdateDisplayNameSchema>;

export const ChangeUserNameSchema = z.object({}).merge(NameSchema);
export type ChangeUserNameType = z.infer<typeof ChangeUserNameSchema>;
