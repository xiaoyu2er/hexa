import { zPassword } from '@hexa/server/schema/common';
import { TokenSchema } from '@hexa/server/schema/passcode';
import { z } from 'zod';

export const ResetPasswordSchema = z
  .object({
    password: zPassword,
    confirmPassword: zPassword,
  })
  .merge(TokenSchema)
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password does not match',
  });

export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;

export const EditPasswordSchema = z
  .object({
    oldPassword: zPassword.optional(),
    password: zPassword,
    confirmPassword: zPassword,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password does not match',
  });

export type EditPasswordType = z.infer<typeof EditPasswordSchema>;
