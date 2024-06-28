import { TimeSpan } from "oslo";
// APP
export const APP_TITLE = "Hexa";
// AUTH
export const MIN_PASSWORD_LENGTH =
  process.env.NODE_ENV === "development" ? 3 : 8;
export const RESEND_VERIFICATION_CODE_SECONDS =
  process.env.NODE_ENV === "development" ? 3 : 60;
export const RESEND_VERIFICATION_CODE_MILLSECONDS =
  RESEND_VERIFICATION_CODE_SECONDS * 1000;
export const VERIFY_CODE_LENGTH = 6;
export const EXIPRE_TIME_SPAN =
  process.env.NODE_ENV === "development"
    ? new TimeSpan(30, "s") // 1 mi
    : new TimeSpan(10, "m"); // 10 minutes

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
