import { MIN_PASSWORD_LENGTH } from '@/lib/const';
import { DISABLE_CLOUDFLARE_TURNSTILE } from '@/lib/env';
import { z } from 'zod';

const email = z.string().email('Please enter a valid email');

const password = z
  .string()
  .min(
    MIN_PASSWORD_LENGTH,
    `Please enter a valid password with at least ${MIN_PASSWORD_LENGTH} characters.`
  )
  .max(255);

const token = z.string().min(1, 'Invalid token');
const code = z
  .string()
  .min(6, {
    message: 'Your verification code must be 6 characters.',
  })
  .max(6);

// Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.
export const username = z
  .string()
  .min(3, 'Please enter a valid username')
  .max(40, 'Username must be 3 to 40 characters')
  .refine((username) => isValidUsername(username), {
    message:
      'Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.',
  });

function isValidUsername(username: string) {
  const usernameRegex = /^(?!-)[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*(?<!-)$/;
  return usernameRegex.test(username);
}

// Example usage
// console.log(isValidUsername("valid-username")); // true
// console.log(isValidUsername("-invalid")); // false
// console.log(isValidUsername("invalid-")); // false
// console.log(isValidUsername("in-valid")); // true
// console.log(isValidUsername("validusername")); // true
// console.log(isValidUsername("in--valid")); // false
// console.log(isValidUsername("in-valid-name")); // true

const cfTurnstileResponse = DISABLE_CLOUDFLARE_TURNSTILE
  ? z.nullable(z.string().optional())
  : z.string().min(1, 'Please complete the challenge.');

export const EmptySchema = z.object({});

export const SignupSchema = z.object({
  email,
  password,
  username,
  'cf-turnstile-response': cfTurnstileResponse,
});

export const OauthSignupSchema = z.object({
  oauthAccountId: z.string(),
  // password,
  username,
  'cf-turnstile-response': cfTurnstileResponse,
});

export const TurnstileSchema = z.object({
  'cf-turnstile-response': cfTurnstileResponse,
});

export const LoginPasswordSchema = z.object({
  username: z.string().min(3, 'Please enter a valid username or email'),
  password,
  'cf-turnstile-response': cfTurnstileResponse,
});
const PasscodeType = z.enum([
  'RESET_PASSWORD',
  'VERIFY_EMAIL',
  'LOGIN_PASSCODE',
]);

export const SendPasscodeSchema = z.object({
  email,
  type: PasscodeType,
  'cf-turnstile-response': cfTurnstileResponse,
});

export const ResendPasscodeSchema = SendPasscodeSchema.pick({
  email: true,
  type: true,
});

export const VerifyPasscodeSchema = z.object({
  code,
  email,
  type: PasscodeType,
});

export const VerifyPassTokenSchema = z.object({
  token,
  type: PasscodeType,
});

export const ResetPasswordSchema = z.object({
  token,
  password,
});

export const OnlyEmailSchema = z.object({
  email,
});

export type SignupForm = z.infer<typeof SignupSchema>;
export type OauthSignupInput = z.infer<typeof OauthSignupSchema>;
export type LoginPasswordInput = z.infer<typeof LoginPasswordSchema>;
export type SendPasscodeForm = z.infer<typeof SendPasscodeSchema>;
export type VerifyPasscodeForm = z.infer<typeof VerifyPasscodeSchema>;
export type VerifyResetPasswordCodeForm = z.infer<typeof VerifyPasscodeSchema>;
export type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;
export type OnlyEmailInput = z.infer<typeof OnlyEmailSchema>;
