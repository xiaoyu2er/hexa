export default {
  async fetch(_request, env, _ctx): Promise<Response> {
    const url = new URL(_request.url);
    const key = `${url.host}${url.pathname}`;
    const redirectUrl = await env.REDIRECT.get(key);
    if (!redirectUrl) {
      return new Response('Not found', { status: 404 });
    }
    const obj = JSON.parse(redirectUrl);
    return Response.redirect(obj.destUrl);
  },
} satisfies ExportedHandler<Env>;
