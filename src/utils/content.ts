import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import rehypePrism from '@mapbox/rehype-prism';

const root = process.cwd();
const dataDirectory = path.join(root, '_content', 'posts');

export function getSlugs(): string[] {
  return fs.readdirSync(dataDirectory).map((d) => d.replace(/\.mdx$/, ''));
}

export const getAllPosts = (): PostMeta[] => {
  const files = fs.readdirSync(dataDirectory);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const posts = files.reduce((allPosts: any, postSlug: string) => {
    const content = fs.readFileSync(path.join(dataDirectory, postSlug), 'utf-8');
    const { data } = matter(content);

    return [
      {
        ...data,
        slug: postSlug.replace('.mdx', ''),
      },
      ...allPosts,
    ];
  }, []);

  return posts.sort((a: PostMeta, b: PostMeta) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export interface PostProps {
  source: MDXRemoteSerializeResult;
  meta: PostMeta;
}

export const getPostBySlug = async (slug: string): Promise<PostProps> => {
  const source = fs.readFileSync(path.join(dataDirectory, `${slug}.mdx`), 'utf8');

  const { data, content } = matter(source);
  const blogData = data as PostMeta;

  const mdxSource = await serialize(content, {
    scope: data,
    mdxOptions: {
      rehypePlugins: [rehypePrism],
    },
  });

  return {
    source: mdxSource,
    meta: {
      ...blogData,
      slug: slug || '',
    },
  };
};
