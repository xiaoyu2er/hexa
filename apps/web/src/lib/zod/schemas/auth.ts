import { MIN_PASSWORD_LENGTH } from "@/lib/const";
import { z } from "zod";

const email = z
  .string()
  .email("Please enter a valid email");

const password = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Your password must contain ${MIN_PASSWORD_LENGTH} or more characters.`)
  .max(255);

const token = z
  .string()
  .min(1, "Invalid token")

export const SignupSchema = z.object({
  email,
  password,
});

export type SignupForm = z.infer<typeof SignupSchema>;

export const LoginSchema = z.object({
  email,
  password,
});
export type LoginForm = z.infer<typeof LoginSchema>;

export const ForgotPasswordSchema = z.object({
  email,
});
export type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z.object({
  token,
  password,
});
export type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;


// one-time password
export const OTPSchema = z.object({
  code: z.string().min(6, {
    message: "Your verification code must be 6 characters.",
  }),
});

export type OTPForm = z.infer<typeof OTPSchema>;
