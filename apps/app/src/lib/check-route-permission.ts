import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { APP_HOST } from './env';

export const getHost = async () => {
  const header = await headers();
  return header.get('host');
};

export const isAppHost = (host: string) => {
  return host === APP_HOST;
  // return true;
};

/**
 * We don't allow custom domains to access routes other than /[slug].
 */
export async function protectRoute() {
  const host = await getHost();
  if (!host || !isAppHost(host)) {
    return notFound();
  }
}
