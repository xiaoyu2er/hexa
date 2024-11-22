import { zPasswordString } from '@/server/schema/common';
import { TokenSchema } from '@/server/schema/passcode';
import { z } from 'zod';

export const ResetPasswordSchema = z
  .object({
    password: zPasswordString,
    confirmPassword: zPasswordString,
  })
  .merge(TokenSchema)
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password does not match',
  });

export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;

export const EditPasswordSchema = z
  .object({
    oldPassword: zPasswordString.optional(),
    password: zPasswordString,
    confirmPassword: zPasswordString,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password does not match',
  });

export type EditPasswordType = z.infer<typeof EditPasswordSchema>;
