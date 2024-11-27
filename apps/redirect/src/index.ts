export default {
  async fetch(_request, env, _ctx): Promise<Response> {
    const url = new URL(_request.url);
    const key = `${url.host}${url.pathname}`;
    const redirectUrl = await env.REDIRECT.get(key);
    if (!redirectUrl) {
      return new Response('Not found', { status: 404 });
    }
    try {
      const obj = JSON.parse(redirectUrl);
      return Response.redirect(obj.destUrl);
    } catch (_error) {
      return new Response('Internal server error', { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;
