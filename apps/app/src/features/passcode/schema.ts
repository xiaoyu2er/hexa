import { TurnstileSchema } from '@/features/auth/turnstile/schema';
import { passcodeTable } from '@/features/passcode/table';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const PasscodeTypeEnum = z.enum([
  'RESET_PASSWORD',
  'VERIFY_EMAIL',
  'LOGIN_PASSCODE',
  'SIGN_UP',
]);

export const PasscodeTypeSchema = z.object({
  type: PasscodeTypeEnum,
});

export type PasscodeType = z.infer<typeof PasscodeTypeEnum>;

// Token
export const InsertPasscodeSchema = createInsertSchema(passcodeTable, {
  type: PasscodeTypeEnum,
});
export type InsertPasscodeType = z.infer<typeof InsertPasscodeSchema>;
export const SelectedPasscodeSchema = createSelectSchema(passcodeTable, {
  type: PasscodeTypeEnum,
});
export type SelectedPasscodeType = z.infer<typeof SelectedPasscodeSchema>;
export const FindPasscodeByEmailSchema = InsertPasscodeSchema.pick({
  tmpUserId: true,
  userId: true,
  email: true,
  type: true,
});
export type FindPasscodeByEmailType = z.infer<typeof FindPasscodeByEmailSchema>;

export const FindPasscodeByTokenSchema = InsertPasscodeSchema.pick({
  token: true,
  type: true,
});
export type FindPasscodeByTokenType = z.infer<typeof FindPasscodeByTokenSchema>;

export const SendPasscodeSchema = InsertPasscodeSchema.pick({
  email: true,
  type: true,
  tmpUserId: true,
}).merge(TurnstileSchema);
export type SendPasscodeType = z.infer<typeof SendPasscodeSchema>;

export const ResendPasscodeSchema = SendPasscodeSchema.omit({
  'cf-turnstile-response': true,
});

export const token = z.string().min(1, 'Invalid token');
export const TokenSchema = z.object({
  token,
});
export type TokenType = z.infer<typeof TokenSchema>;

export const VerifyPassTokenSchema = z
  .object({})
  .merge(PasscodeTypeSchema)
  .merge(TokenSchema);

export const VerifyTokenSchema = SelectedPasscodeSchema.pick({
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
export type VerifyTokenType = z.infer<typeof VerifyTokenSchema>;

export const VerifyPasscodeSchema = InsertPasscodeSchema.pick({
  code: true,
  email: true,
  type: true,
  tmpUserId: true,
});
export type VerifyPasscodeType = z.infer<typeof VerifyPasscodeSchema>;
