import { getDataPoint, getRandomDataPoint, logDataPoint } from './analytics';

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/') {
      return Response.redirect(env.HOME_URL, 302);
    }

    // Regular redirect logic with enhanced logging
    const key = `${url.host}${url.pathname}`;
    const link = (await env.REDIRECT.get(key, { type: 'json' })) as {
      destUrl: string;
      domain: string;
      slug: string;
      id: string;
      projectId: string;
      project: {
        orgId: string;
      };
    };

    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log('link', link);
    if (!link) {
      // serve 404.html
      return env.ASSETS.fetch(request);
    }

    _ctx.waitUntil(
      (async () => {
        // const dataPoint = await getDataPoint(link, request);
        for (let i = 0; i < 200; i++) {
          const dataPoint = await getRandomDataPoint();
          logDataPoint(dataPoint);
          env.REDIRECT_ANALYTICS.writeDataPoint(dataPoint);
        }
      })()
    );

    return Response.json({
      link,
      dataPoint: await getDataPoint(link, request),
    });
    // return Response.redirect(link.destUrl, 302);
  },
} satisfies ExportedHandler<Env>;
