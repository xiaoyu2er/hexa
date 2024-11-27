export default {
  async fetch(request: Request, env: Env, _ctx): Promise<Response> {
    const url = new URL(request.url);

    // Add stats endpoint to view collected data
    if (url.pathname === '/stats') {
      const query = `
        SELECT 
          blob1 as host,
          blob2 as pathname,
          blob3 as result,
          count() as requests
        FROM redirect_events
        WHERE timestamp > NOW() - INTERVAL '1' DAY
        GROUP BY host, pathname, result
        ORDER BY requests DESC
        LIMIT 100
      `;

      const API = `https://api.cloudflare.com/client/v4/accounts/${env.ACCOUNT_ID}/analytics_engine/sql`;
      const response = await fetch(API, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.API_TOKEN}`,
        },
        body: query,
      });

      if (response.status !== 200) {
        return new Response('Analytics query failed', { status: 500 });
      }

      const data = await response.json();
      return new Response(JSON.stringify(data, null, 2), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const key = `${url.host}${url.pathname}`;
    const redirectUrl = await env.REDIRECT.get(key);
    if (!redirectUrl) {
      return new Response('Not found', { status: 404 });
    }
    try {
      const _obj = JSON.parse(redirectUrl);

      // Track the request in Analytics Engine
      env.REDIRECT_ANALYTICS.writeDataPoint({
        blobs: [url.host, url.pathname, redirectUrl ? 'found' : 'not_found'],
        doubles: [1], // Count of requests
        indexes: [key],
      });

      return new Response('ok', { status: 200 });
    } catch (_error) {
      // @ts-ignore
      return new Response(_error?.message ?? 'Internal server error', {
        status: 500,
      });
    }
  },
} satisfies ExportedHandler<Env>;
