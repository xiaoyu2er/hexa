import type { Metadata } from 'next';

import { Link, User } from '@heroui/react';
import { allBlogPosts } from 'contentlayer2/generated';
import { format, parseISO } from 'date-fns';
import NextLink from 'next/link';
import { notFound } from 'next/navigation';
import { Balancer } from 'react-wrap-balancer';

import { MDXContent } from '@/components/mdx-content';
import { siteConfig } from '@/config/site';
import { IS_DEVELOPMENT } from '@hexa/env';

import type { Route } from '@/libs/docs/page';

import { ChevronRightIcon } from '@hexa/ui/icons';

interface BlogPostProps {
  params: {
    slug: string;
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

const isDraftVisible = IS_DEVELOPMENT;

async function getBlogPostFromParams({ params }: BlogPostProps) {
  const slug = (await params).slug || '';
  const post = allBlogPosts.find((post) => post.slugAsParams === slug);

  if (!post) {
    null;
  }

  const currentRoute: Route = {
    key: post?._id,
    title: post?.title,
    path: `/${post?._raw?.sourceFilePath}`,
  };

  return { post, currentRoute };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { post } = await getBlogPostFromParams({ params: await params });

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: post.url,
      images: [
        {
          url: post.imageAsParams || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: post.title || siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [siteConfig.ogImage],
      creator: siteConfig.creator,
    },
  };
}

export async function generateStaticParams(): Promise<
  BlogPostProps['params'][]
> {
  return allBlogPosts.map((doc) => ({
    slug: doc.slugAsParams,
  }));
}

export default async function DocPage({ params }: PageProps) {
  const { post } = await getBlogPostFromParams({ params: await params });

  if (!post || (post.draft && !isDraftVisible)) {
    notFound();
  }

  return (
    <div className="prose prose-neutral mt-12 flex w-full flex-col items-center justify-start">
      <div className="w-full max-w-4xl">
        <Link
          isBlock
          as={NextLink}
          className="-ml-3 mb-8 text-default-500 hover:text-default-900"
          color="foreground"
          href="/blog"
          size="sm"
        >
          <ChevronRightIcon className="mr-1 inline-block h-15 w-15 rotate-180" />
          Back to blog
        </Link>

        <time
          className="mb-2 block text-default-500 text-small"
          dateTime={post.date}
        >
          {format(parseISO(post.date), 'LLLL d, yyyy')}
        </time>
        <div className="mb-3 flex w-full flex-col items-start">
          <User
            isExternal
            as={Link}
            avatarProps={{
              className: 'w-9 h-9 text-large',
              src: post.author?.avatar,
            }}
            className="hover:opacity-100"
            classNames={{
              base: '-ml-2 px-2 py-1.5 hover:bg-default-100 dark:hover:bg-default-50 cursor-pointer transition-colors',
              name: 'text-foreground',
            }}
            description={post.author?.username}
            href={post.author?.link}
            name={post.author?.name}
          />
        </div>
        <h1 className="mb-2 font-bold text-4xl">
          <Balancer>{post.title}</Balancer>
          <strong className="text-default-300">
            {post?.draft && ' (Draft)'}
          </strong>
        </h1>
        <MDXContent code={post.body.code} />
      </div>
    </div>
  );
}
