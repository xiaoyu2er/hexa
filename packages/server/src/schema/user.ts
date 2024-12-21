import {
  EmailSchema,
  NameSchema,
  type UpdateAvatarType,
} from '@hexa/server/schema/common';
import { UpdateAvatarSchema } from '@hexa/server/schema/common';
import { TurnstileSchema } from '@hexa/server/schema/turnstile';
import { userTable } from '@hexa/server/table/user';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { Simplify } from 'type-fest';
import { z } from 'zod';

export const UpdateUserAvatarSchema = UpdateAvatarSchema;
export type UpdateUserAvatarType = UpdateAvatarType;

// User
export const InsertUserSchema = createInsertSchema(userTable);
export type InsertUserType = z.infer<typeof InsertUserSchema>;
export const SelectUserSchema = createSelectSchema(userTable).omit({
  password: true,
});
export type SelectUserType = Simplify<z.infer<typeof SelectUserSchema>>;

export const UpdateUserNameSchema = z.object({}).merge(NameSchema);
export type UpdateUserNameType = z.infer<typeof UpdateUserNameSchema>;

export const CheckEmailSchema = z
  .object({})
  .merge(EmailSchema)
  // .merge(PasswordSchema)
  .merge(TurnstileSchema);
export type CheckEmailType = z.infer<typeof CheckEmailSchema>;

export const DELETE_USER_CONFIRMATION = 'Confirm delete account';

export const DeleteUserSchema = z.object({
  confirm: z
    .string({
      message: 'Please type confirmation text',
    })
    .refine(
      (v) => v === DELETE_USER_CONFIRMATION,
      'Please type confirmation text'
    ),
});

export type DeleteUserType = z.infer<typeof DeleteUserSchema>;
