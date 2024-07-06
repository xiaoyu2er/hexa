import { TimeSpan } from "oslo";
// APP
export const APP_TITLE = "Hexa";
// AUTH
export const MIN_PASSWORD_LENGTH =
  process.env.NODE_ENV === "development" ? 3 : 8;

export const RESEND_VERIFY_CODE_TIME_SPAN =
  process.env.NODE_ENV === "development"
    ? new TimeSpan(3, "s")
    : new TimeSpan(60, "s");

export const VERIFY_CODE_LENGTH = 6;
export const EXIPRE_TIME_SPAN =
  process.env.NODE_ENV === "development"
    ? new TimeSpan(30, "s") // 30 seconds
    : new TimeSpan(10, "m"); // 10 minutes

export const RESET_PASSWORD_EXPIRE_TIME_SPAN =
  process.env.NODE_ENV === "development"
    ? new TimeSpan(60, "s")
    : new TimeSpan(15, "m");

/**
 * @see https://vercel.com/docs/projects/environment-variables/system-environment-variables
 */
export const PUBLIC_URL =
  process.env.NODE_ENV === "development"
    ? process.env.__NEXT_PRIVATE_ORIGIN
    : `https://${
        process.env.VERCEL_ENV === "production"
          ? process.env.VERCEL_PROJECT_PRODUCTION_URL
          : process.env.VERCEL_BRANCH_URL
      }`;

// we enable turnstile when we have the site key
// we don't use process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY because client can't access it
export const DISABLE_CLOUDFLARE_TURNSTILE =
  !process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;
