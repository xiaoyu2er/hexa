import {
  IS_DEVELOPMENT,
  NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY,
} from "@hexa/env";
import { TimeSpan } from "oslo";

export const MIN_PASSWORD_LENGTH = IS_DEVELOPMENT ? 3 : 8;

export const RESEND_VERIFY_CODE_TIME_SPAN = IS_DEVELOPMENT
  ? new TimeSpan(3, "s")
  : new TimeSpan(60, "s");

export const VERIFY_CODE_LENGTH = 6;
export const EXIPRE_TIME_SPAN = IS_DEVELOPMENT
  ? new TimeSpan(30, "s") // 30 seconds
  : new TimeSpan(10, "m"); // 10 minutes

export const RESET_PASSWORD_EXPIRE_TIME_SPAN = IS_DEVELOPMENT
  ? new TimeSpan(60, "s")
  : new TimeSpan(15, "m");

// we enable turnstile when we have the site key
// we don't use process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY because client can't access it
export const DISABLE_CLOUDFLARE_TURNSTILE =
  !NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

export const MAX_EMAILS = IS_DEVELOPMENT ? 3 : 5;
