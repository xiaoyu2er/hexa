import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { APP_HOST } from './env';

export const isAppHost = (host: string) => {
  return host === APP_HOST;
  // return true;
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
