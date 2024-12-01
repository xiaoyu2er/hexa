import { getDataPoint } from '@/lib/analytics';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

export default async function Page({ params }: { params: { slug: string } }) {
  const { env, ctx, cf } = await getCloudflareContext();
  const header = await headers();
  const host = header.get('host');
  const slug = params.slug;
  const key = `${host}/${slug}`;

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
    return notFound();
  }

  ctx.waitUntil(
    (async () => {
      const dataPoint = await getDataPoint(link, {
        headers: header,
        cf: cf,
        url: `${host}/${slug}`,
      });
      env.REDIRECT_ANALYTICS?.writeDataPoint(dataPoint);
      // for (let i = 0; i < 200; i++) {
      //   const dataPoint = await getRandomDataPoint();
      //   logDataPoint(dataPoint);
      //   env.REDIRECT_ANALYTICS?.writeDataPoint(dataPoint);
      // }
    })()
  );
  return redirect(link.destUrl);
}
