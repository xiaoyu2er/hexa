import { MIN_PASSWORD_LENGTH } from "@/lib/const";
import { z } from "zod";

const email = z.string().email("Please enter a valid email");

const password = z
  .string()
  .min(
    MIN_PASSWORD_LENGTH,
    `Your password must contain ${MIN_PASSWORD_LENGTH} or more characters.`,
  )
  .max(255);

const token = z.string().min(1, "Invalid token");
const code = z
  .string()
  .min(6, {
    message: "Your verification code must be 6 characters.",
  })
  .max(6);

export const EmptySchema = z.object({});

export const SignupSchema = z.object({
  email,
  password,
});

const cfTurnstileResponse = z.string().optional();
export const TurnstileSchema = z.object({
  "cf-turnstile-response": cfTurnstileResponse,
});

export const LoginSchema = z.object({
  email,
  password,
  "cf-turnstile-response": cfTurnstileResponse,
});

export const ForgetPasswordSchema = z.object({
  email,
});

export const VerifyResetPasswordCodeSchema = z.object({
  email,
  code,
});

export const ResetPasswordSchema = z.object({
  email,
  token,
  password,
});

// one-time password
export const OTPSchema = z.object({
  code,
});

export type SignupForm = z.infer<typeof SignupSchema>;
export type LoginForm = z.infer<typeof LoginSchema>;
export type ForgetPasswordForm = z.infer<typeof ForgetPasswordSchema>;
export type VerifyResetPasswordCodeForm = z.infer<
  typeof VerifyResetPasswordCodeSchema
>;
export type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;
export type OTPForm = z.infer<typeof OTPSchema>;
