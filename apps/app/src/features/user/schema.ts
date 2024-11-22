import { TurnstileSchema } from '@/features/auth/turnstile/schema';
import {
  EmailSchema,
  NameSchema,
  type UpdateAvatarType,
} from '@/features/common/schema';
import { UpdateAvatarSchema } from '@/features/common/schema';
import { userTable } from '@/features/user/table';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { Simplify } from 'type-fest';
import { z } from 'zod';

export const UpdateUserAvatarSchema = UpdateAvatarSchema;
export type UpdateUserAvatarType = UpdateAvatarType;

// User
export const InsertUserSchema = createInsertSchema(userTable);
export type InsertUserType = z.infer<typeof InsertUserSchema>;
export const SelectUserSchema = createSelectSchema(userTable);
export type SelectUserType = Simplify<z.infer<typeof SelectUserSchema>>;

export const UpdateUserNameSchema = z.object({}).merge(NameSchema);
export type UpdateUserNameType = z.infer<typeof UpdateUserNameSchema>;

export const CheckEmailSchema = z
  .object({})
  .merge(EmailSchema)
  // .merge(PasswordSchema)
  .merge(TurnstileSchema);
export type CheckEmailType = z.infer<typeof CheckEmailSchema>;
