import { allCompares } from 'contentlayer2/generated';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { DocsToc } from '@/components/docs';
import { MDXContent } from '@/components/mdx-content';
import { siteConfig } from '@/config/site';
import {} from '@/libs/docs/config';
import type { Route } from '@/libs/docs/page';
import { getHeadings } from '@/libs/docs/utils';
import {} from '@/libs/github/constants';
import Balancer from 'react-wrap-balancer';

interface DocPageProps {
  params: {
    slug: string[];
  };
}

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

async function getDocFromParams({ params }: PageProps) {
  const slug = (await params).slug?.join('/') || '';
  const doc = allCompares.find((doc) => doc.slugAsParams === slug);

  if (!doc) {
    null;
  }

  const headings = getHeadings(doc?.body.raw);

  const currentRoute: Route = {
    key: doc?._id,
    title: doc?.title,
    path: `/${doc?._raw?.sourceFilePath}`,
  };

  return { doc, headings, currentRoute };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { doc } = await getDocFromParams({ params });

  if (!doc) {
    return {};
  }

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: 'article',
      url: doc.url,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: doc.title,
      description: doc.description,
      images: [siteConfig.ogImage],
      creator: siteConfig.creator,
    },
  };
}

export async function generateStaticParams(): Promise<
  DocPageProps['params'][]
> {
  return allCompares.map((doc) => ({
    slug: doc.slugAsParams.split('/'),
  }));
}

export default async function DocPage({ params }: PageProps) {
  const { doc, headings } = await getDocFromParams({
    params,
  });

  if (!doc) {
    notFound();
  }

  return (
    <>
      <div className="col-span-12 mt-10 lg:col-span-10 lg:px-16 xl:col-span-8">
        <h1 className="mb-2 font-bold text-6xl">
          <Balancer>{doc.title}</Balancer>
        </h1>
        <div className="prose prose-neutral w-full">
          <MDXContent code={doc.body.code} />
        </div>
      </div>
      {headings && headings.length > 0 && (
        <div className="z-10 mt-12 hidden pl-0 xl:col-span-2 xl:flex">
          <DocsToc headings={headings} />
        </div>
      )}
    </>
  );
}
