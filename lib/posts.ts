import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
};

export type Post = PostMeta & {
  contentHtml: string;
};

export function getSortedPostsMeta(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory).filter((name) => name.endsWith('.md'));

  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      excerpt: (data.excerpt as string) ?? '',
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.replace(/\.md$/, ''));
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    excerpt: (data.excerpt as string) ?? '',
    contentHtml,
  };
}
