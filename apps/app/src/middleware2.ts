import { ADMIN_URL, APP_URL, WWW_URL } from '@hexa/env';
import { type NextRequest, NextResponse } from 'next/server';
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (proxies for third-party services)
     * 4. Metadata files: favicon.ico, sitemap.xml, robots.txt, manifest.webmanifest, .well-known
     */
    '/((?!api/|_next/|_proxy/|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|.well-known).*)',
  ],
};

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') as string;
  const path = new URL(request.url).pathname;

  if (ADMIN_URL.includes(host)) {
    return NextResponse.rewrite(new URL(`/admin${path}`, request.url));
  }
  if (WWW_URL.includes(host)) {
    return NextResponse.rewrite(new URL(`/www${path}`, request.url));
  }
  if (APP_URL.includes(host)) {
    return NextResponse.rewrite(new URL(`/app${path}`, request.url));
    // return NextResponse.next();
  }
  return NextResponse.next();
}
