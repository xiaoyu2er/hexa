import { SelectOauthAccountSchema } from '@/features/auth/oauth/schema';
import { TurnstileSchema } from '@/features/auth/turnstile/schema';
import { passcodeTable } from '@/features/passcode/table';
import { SelectTmpUserSchema } from '@/features/tmp-user/schema';
import { SelectUserSchema } from '@/features/user/schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { Simplify } from 'type-fest';
import { z } from 'zod';

export const PasscodeTypeEnum = z.enum([
  'RESET_PASSWORD',
  'ADD_EMAIL',
  'LOGIN',
  'SIGN_UP',
  'OAUTH_SIGNUP',
]);

export const PasscodeTypeSchema = z.object({
  type: PasscodeTypeEnum,
});

export type PasscodeType = z.infer<typeof PasscodeTypeEnum>;

export const InsertPasscodeSchema = createInsertSchema(passcodeTable, {
  type: PasscodeTypeEnum,
});
export type InsertPasscodeType = Simplify<z.infer<typeof InsertPasscodeSchema>>;

export const SelectedPasscodeSchema = createSelectSchema(passcodeTable, {
  type: PasscodeTypeEnum,
}).extend({
  user: SelectUserSchema.nullable(),
  tmpUser: SelectTmpUserSchema.extend({
    oauthAccount: SelectOauthAccountSchema.nullable(),
  }).nullable(),
});

export type SelectedPasscodeType = Simplify<
  z.infer<typeof SelectedPasscodeSchema>
>;

export const QueryPasscodeByIdSchema = InsertPasscodeSchema.pick({
  tmpUserId: true,
  userId: true,
  id: true,
  type: true,
});
export type QueryPasscodeByIdType = z.infer<typeof QueryPasscodeByIdSchema>;

export const QueryPasscodeByTokenSchema = InsertPasscodeSchema.pick({
  token: true,
  type: true,
});
export type QueryPasscodeByTokenType = z.infer<
  typeof QueryPasscodeByTokenSchema
>;

export const SendPasscodeSchema = InsertPasscodeSchema.pick({
  email: true,
}).merge(TurnstileSchema);

export type SendPasscodeType = z.infer<typeof SendPasscodeSchema>;

export const ResendPasscodeSchema = SelectedPasscodeSchema.pick({
  id: true,
}).merge(TurnstileSchema);

export type ResendPasscodeType = z.infer<typeof ResendPasscodeSchema>;

export const token = z.string().min(1, 'Invalid token');
export const TokenSchema = z.object({
  token,
});
export type TokenType = z.infer<typeof TokenSchema>;

export const VerifyPassTokenSchema = z
  .object({})
  // .merge(PasscodeTypeSchema)
  .merge(TokenSchema);

export const VerifyTokenSchema = SelectedPasscodeSchema.pick({
  code: true,
  token: true,
  id: true,
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
  id: true,
});
export type VerifyPasscodeType = z.infer<typeof VerifyPasscodeSchema>;

export const VerifyPasscodeOnlyCodeSchema = VerifyPasscodeSchema.pick({
  code: true,
});
export type VerifyPasscodeOnlyCodeType = z.infer<
  typeof VerifyPasscodeOnlyCodeSchema
>;

export const AddPasscodeSchema = InsertPasscodeSchema.pick({
  userId: true,
  tmpUserId: true,
  email: true,
  type: true,
});

export type AddPasscodeType = z.infer<typeof AddPasscodeSchema>;

const UpdatePasscodeSchema = SelectedPasscodeSchema.pick({
  id: true,
});

export type UpdatePasscodeType = z.infer<typeof UpdatePasscodeSchema>;
