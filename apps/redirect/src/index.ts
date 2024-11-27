export default {
  fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);

    return new Response(
      JSON.stringify({
        request,
        ctx,
        url: {
          href: url.href,
          origin: url.origin,
          protocol: url.protocol,
          host: url.host,
          hostname: url.hostname,
          pathname: url.pathname,
          search: url.search,
          searchParams: [...url.searchParams.entries()],
        },
        cf: request.cf,
        env,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  },
} satisfies ExportedHandler<Env>;
