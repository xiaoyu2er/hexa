'use client';

import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Link,
} from '@heroui/react';
import type { BlogPost } from 'contentlayer2/generated';
import { format, parseISO } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import NextLink from 'next/link';
import { usePostHog } from 'posthog-js/react';
import Balancer from 'react-wrap-balancer';

import { useIsMounted } from '@/hooks/use-is-mounted';

const BlogPostCard = (post: BlogPost) => {
  const isMounted = useIsMounted();

  const posthog = usePostHog();

  const handlePress = () => {
    posthog.capture('BlogPostCard - Selection', {
      name: post.title,
      action: 'click',
      category: 'blog',
      data: post.url ?? '',
    });
  };

  return (
    <AnimatePresence>
      {isMounted && (
        <motion.article
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          initial={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            disableRipple
            isBlurred
            as={NextLink}
            className="h-full border-transparent bg-white/5 p-2 text-start backdrop-blur-lg backdrop-saturate-[1.8] dark:bg-default-400/10"
            href={post.url}
            isPressable={!!post.url}
            onPress={handlePress}
          >
            <CardHeader>
              <Link
                as={NextLink}
                className="font-semibold "
                href={post.url}
                underline="hover"
                onPress={handlePress}
              >
                <Balancer>{post.title}</Balancer>
              </Link>
            </CardHeader>
            <CardBody className="px-2 pt-0 pb-1">
              <Image className="mb-4" src={post.image} />
              <p className="w-full font-normal text-default-600">
                {post.description}
              </p>
            </CardBody>
            <CardFooter className="flex items-center justify-between">
              <time
                className="block text-default-500 text-small"
                dateTime={post.date}
              >
                {format(parseISO(post.date), 'LLLL d, yyyy')}{' '}
                {post?.draft && ' (Draft)'}
              </time>
              <Avatar size="sm" src={post.author?.avatar} />
            </CardFooter>
          </Card>
        </motion.article>
      )}
    </AnimatePresence>
  );
};

export const BlogPostList = ({ posts }: { posts: BlogPost[] }) => {
  return (
    <div className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
      {posts.map((post, idx) => (
        <BlogPostCard key={idx} {...post} />
      ))}
    </div>
  );
};
