export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_XYZ =
  process.env.NODE_ENV === 'production' && process.env.IS_XYZ === 'true';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const NEXT_PUBLIC_APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
export const NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;
export const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
// we enable turnstile when we have the site key
// we don't use process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY because client can't access it
export const DISABLE_CLOUDFLARE_TURNSTILE =
  !NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

export const NEXT_PUBLIC_STORAGE_BASE_URL =
  process.env.NEXT_PUBLIC_STORAGE_BASE_URL;

export const NEXT_PUBLIC_STORAGE_ENDPOINT =
  process.env.NEXT_PUBLIC_STORAGE_ENDPOINT;

export const PUBLIC_URL =
  (process.env.NODE_ENV === 'development'
    ? process.env.__NEXT_PRIVATE_ORIGIN
    : process.env.NEXT_PUBLIC_URL) ?? '';
