import { cfTurnstileResponse, token } from '@/features/common/schema';
import { tokenTable } from '@/features/passcode/table';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const PasscodeTypeSchema = z.enum([
  'RESET_PASSWORD',
  'VERIFY_EMAIL',
  'LOGIN_PASSCODE',
  'SIGN_UP',
]);

export type PasscodeType = z.infer<typeof PasscodeTypeSchema>;

// Token
export const InsertTokenSchema = createInsertSchema(tokenTable, {
  type: PasscodeTypeSchema,
});
export type InsertTokenType = z.infer<typeof InsertTokenSchema>;
export const SelectTokenSchema = createSelectSchema(tokenTable, {
  type: PasscodeTypeSchema,
});
export type SelectTokenType = z.infer<typeof SelectTokenSchema>;
export const FindTokenByEmailSchema = InsertTokenSchema.pick({
  tmpUserId: true,
  userId: true,
  email: true,
  type: true,
});
export const FindTokenByTokenSchema = InsertTokenSchema.pick({
  token: true,
  type: true,
});
export type FindTokenByEmailType = z.infer<typeof FindTokenByEmailSchema>;
export type FindTokenByTokenType = z.infer<typeof FindTokenByTokenSchema>;

export const SendPasscodeSchema = InsertTokenSchema.pick({
  email: true,
  type: true,
  tmpUserId: true,
}).extend({
  'cf-turnstile-response': cfTurnstileResponse,
});
export type SendPasscodeType = z.infer<typeof SendPasscodeSchema>;

export const ResendPasscodeSchema = SendPasscodeSchema.omit({
  'cf-turnstile-response': true,
});

export const ResetPasswordSchema = z.object({
  token,
  password: z.string(),
});
export type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;

export const VerifyPassTokenSchema = z.object({
  token,
  type: PasscodeTypeSchema,
});

export const VerifyTokenSchema = SelectTokenSchema.pick({
  code: true,
  token: true,
  email: true,
  type: true,
  tmpUserId: true,
}).partial({
  code: true,
  token: true,
  tmpUserId: true,
});

export const VerifyPasscodeSchema = InsertTokenSchema.pick({
  code: true,
  email: true,
  type: true,
  tmpUserId: true,
});
export type VerifyPasscodeType = z.infer<typeof VerifyPasscodeSchema>;

export type VerifyTokenType = z.infer<typeof VerifyTokenSchema>;
