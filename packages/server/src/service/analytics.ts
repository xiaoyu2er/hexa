import type { Context } from '@hexa/server/route/route-types';

// Helper function to query Analytics Engine
export async function queryAnalytics(env: Context['Bindings'], query: string) {
  const API = `https://api.cloudflare.com/client/v4/accounts/${env.CF_WAE_ACCOUNT_ID}/analytics_engine/sql`;
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.CF_WAE_API_TOKEN}`,
    },
    body: query,
  });

  if (!res.ok) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error(res.status, res.statusText);
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error();
    // throw new Error('Failed to fetch analytics data');
    return {
      error: res.statusText,
      message: await res.text(),
    };
  }

  return res.json();
}
