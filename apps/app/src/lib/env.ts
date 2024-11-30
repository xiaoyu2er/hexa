export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? '';
export const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? '';
export const WWW_URL = process.env.NEXT_PUBLIC_WWW_URL ?? '';
export const REDIRECT_URL = process.env.NEXT_PUBLIC_REDIRECT_URL ?? '';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = !IS_PRODUCTION;

export const NEXT_PUBLIC_APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;

export const NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

export const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// we enable turnstile when we have the site key
// we don't use process.env.CF_TURNSTILE_SECRET_KEY because client can't access it
export const DISABLE_CLOUDFLARE_TURNSTILE =
  !NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

export const NEXT_PUBLIC_STORAGE_BASE_URL =
  process.env.NEXT_PUBLIC_STORAGE_BASE_URL;

export const NEXT_PUBLIC_STORAGE_ENDPOINT =
  process.env.NEXT_PUBLIC_STORAGE_ENDPOINT;
