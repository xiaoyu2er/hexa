import { APP_HOST } from '@/lib/env';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

export const isAppHost = (host: string) => {
  return host === APP_HOST;
};

/**
 * We don't allow custom domains to access routes other than /[slug].
 */
export function protectRoute() {
  const header = headers();
  const host = header.get('host');
  if (!host || !isAppHost(host)) {
    return notFound();
  }
}
