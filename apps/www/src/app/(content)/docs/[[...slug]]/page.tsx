import type { Metadata } from 'next';

import { Link } from '@heroui/react';
import { allDocs } from 'contentlayer2/generated';
import { notFound } from 'next/navigation';

import { DocsPager, DocsToc } from '@/components/docs';
import { MDXContent } from '@/components/mdx-content';
import { siteConfig } from '@/config/site';
import { CONTENT_PATH, TAG } from '@/libs/docs/config';
import type { Route } from '@/libs/docs/page';
import { getHeadings } from '@/libs/docs/utils';
import { GITHUB_URL, REPO_NAME } from '@/libs/github/constants';

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
  const doc = allDocs.find((doc) => doc.slugAsParams === slug);

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
  return allDocs.map((doc) => ({
    slug: doc.slugAsParams.split('/'),
  }));
}

export default async function DocPage({ params }: PageProps) {
  const { doc, headings, currentRoute } = await getDocFromParams({
    params,
  });

  if (!doc) {
    notFound();
  }

  const editUrl = `${GITHUB_URL}/${REPO_NAME}/edit/${TAG}${CONTENT_PATH}${currentRoute?.path}`;

  return (
    <>
      <div className="col-span-12 mt-10 lg:col-span-10 lg:px-16 xl:col-span-8">
        <div className="prose prose-neutral w-full">
          <MDXContent code={doc.body.code} />
        </div>
        {currentRoute && <DocsPager currentRoute={currentRoute} />}
        <footer>
          <Link isExternal showAnchorIcon href={editUrl} size="sm">
            Edit this page on GitHub
          </Link>
        </footer>
      </div>
      {headings && headings.length > 0 && (
        <div className="z-10 mt-8 hidden pl-0 xl:col-span-2 xl:flex">
          <DocsToc headings={headings} />
        </div>
      )}
    </>
  );
}
