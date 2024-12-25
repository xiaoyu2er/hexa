import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from 'contentlayer2/source-files';
import RawPlugin from 'esbuild-plugin-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import pluginCodeBlock from './plugins/code-block';

/** @type {import('contentlayer2/source-files').ComputedFields} */
const computedFields = {
  slug: {
    type: 'string',
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
  slugAsParams: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.split('/').slice(1).join('/'),
  },
  url: { type: 'string', resolve: (doc) => `/${doc._raw.flattenedPath}` },
};

const AuthorProperties = defineNestedType(() => ({
  name: 'AuthorProperties',
  fields: {
    name: { type: 'string', required: true },
    link: { type: 'string', required: false },
    avatar: { type: 'string', required: false },
    username: { type: 'string', required: false },
  },
}));

export const Doc = defineDocumentType(() => ({
  name: 'Doc',
  filePathPattern: 'docs/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: false },
    date: { type: 'date', required: false },
  },
  computedFields,
}));

export const Legal = defineDocumentType(() => ({
  name: 'Legal',
  filePathPattern: 'legal/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: false },
    date: { type: 'date', required: false },
  },
  computedFields,
}));

export const Help = defineDocumentType(() => ({
  name: 'Help',
  filePathPattern: 'help/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: false },
    date: { type: 'date', required: false },
  },
  computedFields,
}));

export const Compare = defineDocumentType(() => ({
  name: 'Compare',
  filePathPattern: 'compare/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: false },
    date: { type: 'date', required: false },
  },
  computedFields,
}));

export const BlogPost = defineDocumentType(() => ({
  name: 'BlogPost',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    date: { type: 'date', required: true },
    draft: { type: 'boolean', required: false },
    tags: { type: 'list', of: { type: 'string' }, required: false },
    author: { type: 'nested', of: AuthorProperties, required: false },
    image: { type: 'string', required: false },
  },
  computedFields: {
    ...computedFields,
    // Date format June 22nd 2023
    formattedDate: {
      type: 'string',
      resolve: (doc) => {
        const date = new Date(doc.date);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
      },
    },
    // add https://nextui.org to the image path
    imageAsParams: {
      type: 'string',
      resolve: (doc) => {
        const image = doc.image;
        if (image) {
          return `https://nextui.org${image}`;
        }
      },
    },
  },
}));

export default makeSource({
  contentDirPath: './content',
  documentTypes: [Doc, Legal, BlogPost, Help, Compare],
  mdx: {
    remarkPlugins: [remarkGfm, pluginCodeBlock],
    esbuildOptions(options) {
      options.plugins ||= [];
      options.plugins.unshift(RawPlugin());

      return options;
    },
    rehypePlugins: [
      rehypeSlug,
      () => (tree) => {
        visit(tree, 'element', (node) => {
          if (node.tagName === 'code' && node.data && node.data.meta) {
            node.properties.meta = node.data.meta;
          }
        });
      },
    ],
  },
});
