import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET() {
  // Retrieve the bindings defined in wrangler.toml
  const { env } = await getCloudflareContext();
  return new Response(env.hello);
}

export async function POST(request: Request) {
  const text = await request.text();
  return new Response(`Hello post-World! body=${text}`);
}
