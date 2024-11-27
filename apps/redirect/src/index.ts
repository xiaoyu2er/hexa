export default {
  async fetch(_request, env, _ctx): Promise<Response> {
    return new Response(await env.REDIRECT.get('test'));
  },
} satisfies ExportedHandler<Env>;
