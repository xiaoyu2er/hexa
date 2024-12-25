import { allBlogPosts } from 'contentlayer2/generated';
import { compareDesc } from 'date-fns';

import { BlogPostList } from '@/components/blog-post';
import { IS_DEVELOPMENT } from '@hexa/env';

const isDraftVisible = IS_DEVELOPMENT;

export default function Blog() {
  const posts = allBlogPosts
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    ?.filter((post) => {
      if (post.draft && !isDraftVisible) {
        return false;
      }

      return true;
    });

  return (
    <div className="mt-12 w-full lg:px-16">
      <div className="text-center">
        <h1 className="mb-2 font-bold text-4xl">NextUI Latest Updates</h1>
        <h5 className="text-default-500 text-lg">
          All the latest news about NextUI.
        </h5>
      </div>
      <BlogPostList posts={posts} />
    </div>
  );
}
