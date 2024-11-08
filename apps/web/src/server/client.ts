import type { AppType } from "@/server/route";
import { type InferResponseType, hc } from "hono/client";

export const client = hc<AppType>("");
const api = client.api;

export const $sendPasscode = api["send-passcode"].$post;
export type SendPasscodeRes = InferResponseType<typeof $sendPasscode>;
export const $rensedPasscode = api["resend-passcode"].$post;
export const $loginPassword = api["login-password"].$post;
export const $verifyPasscode = api["verify-passcode"].$post;
export const $resetPassword = api["reset-password"].$post;
export const $signup = api.signup.$post;
