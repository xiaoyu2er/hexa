export default {
  async fetch(request: Request, env: Env, _ctx): Promise<Response> {
    const url = new URL(request.url);

    // Add test endpoint to write sample data
    if (url.pathname === '/test-analytics') {
      try {
        await env.REDIRECT_ANALYTICS.writeDataPoint({
          blobs: ['test-host.com', '/test-path', 'test-result'],
          doubles: [1],
          indexes: ['test-key'],
        });
        return new Response('Test data point written successfully');
      } catch (error) {
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.error('Failed to write test data:', error);
        // @ts-ignore
        return new Response(`Failed to write test data: ${error.message}`, {
          status: 500,
        });
      }
    }

    // Modify stats endpoint to look back further and add more logging
    if (url.pathname === '/stats') {
      const query = `
        SELECT 
          blob1 as host,
          blob2 as pathname,
          blob3 as result,
          COUNT() as requests
        FROM redirect_events
        WHERE timestamp > NOW() - INTERVAL '7' DAY
        GROUP BY host, pathname, result
        ORDER BY requests DESC
        LIMIT 100
      `;

      const API = `https://api.cloudflare.com/client/v4/accounts/${env.ACCOUNT_ID}/analytics_engine/sql`;
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.log('Querying analytics:', API);

      const response = await fetch(API, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.API_TOKEN}`,
        },
        body: query,
      });

      if (response.status !== 200) {
        const errorText = await response.text();
        return new Response(`Analytics query failed: ${errorText}`, {
          status: 500,
        });
      }

      const data = await response.json();
      return new Response(JSON.stringify(data, null, 2), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Regular redirect logic with enhanced logging
    const key = `${url.host}${url.pathname}`;
    const redirectUrl = await env.REDIRECT.get(key);

    try {
      await env.REDIRECT_ANALYTICS.writeDataPoint({
        blobs: [url.host, url.pathname, redirectUrl ? 'found' : 'not_found'],
        doubles: [1],
        indexes: [key],
      });
    } catch (_analyticsError) {}

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
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error(_error);
      // @ts-ignore
      return new Response(_error?.message ?? 'Internal server error', {
        status: 500,
      });
    }
  },
} satisfies ExportedHandler<Env>;
