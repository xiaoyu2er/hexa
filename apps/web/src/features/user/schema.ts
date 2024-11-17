import {
  cfTurnstileResponse,
  email,
  name,
  password,
} from '@/features/common/schema';
import { userTable } from '@/features/user/table';
import type { Simplify } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// User
export const InsertUserSchema = createInsertSchema(userTable);
export type InsertUserType = z.infer<typeof InsertUserSchema>;
export const SelectUserSchema = createSelectSchema(userTable);
export type SelectUserType = Simplify<z.infer<typeof SelectUserSchema>>;

export const SignupSchema = z.object({
  email,
  password,
  name,
  'cf-turnstile-response': cfTurnstileResponse,
});

export const OauthSignupSchema = z.object({
  oauthAccountId: z.string(),
  // password,
  name,
  'cf-turnstile-response': cfTurnstileResponse,
});

export const TurnstileSchema = z.object({
  'cf-turnstile-response': cfTurnstileResponse,
});

export const LoginPasswordSchema = z.object({
  name: z.string().min(3, 'Please enter a valid username or email'),
  password,
  'cf-turnstile-response': cfTurnstileResponse,
});

export const OnlyEmailSchema = z.object({
  email,
});

export type SignupForm = z.infer<typeof SignupSchema>;
export type OauthSignupInput = z.infer<typeof OauthSignupSchema>;
export type LoginPasswordInput = z.infer<typeof LoginPasswordSchema>;

export type OnlyEmailInput = z.infer<typeof OnlyEmailSchema>;

const displayName = z
  .string()
  // .min(1, "Please enter a name")
  .max(32, 'Name must be less than 32 characters');
// .nullable();

export const UpdateDisplayNameSchema = z.object({
  displayName,
});

export type UpdateDisplayNameInput = z.infer<typeof UpdateDisplayNameSchema>;

export const DELETE_USER_CONFIRMATION = 'confirm delete account';
export const DeleteUserSchema = z.object({
  confirm: z
    .string()
    .refine(
      (v) => v === DELETE_USER_CONFIRMATION,
      "Please type 'confirm delete account' to delete your account."
    ),
});

export type DeleteUserInput = z.infer<typeof DeleteUserSchema>;

export const DeleteOauthAccountSchema = z.object({
  provider: z.enum(['GOOGLE', 'GITHUB']),
});

export type DeleteOauthAccountInput = z.infer<typeof DeleteOauthAccountSchema>;

export const ChangeUserNameSchema = z.object({
  name,
});

export type ChangeUserNameInput = z.infer<typeof ChangeUserNameSchema>;
