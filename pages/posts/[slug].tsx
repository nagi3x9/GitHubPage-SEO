import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { getAllPostSlugs, getPostBySlug, Post } from '@/lib/posts';

type Props = {
  post: Post;
};

export default function PostPage({ post }: Props) {
  return (
    <Layout>
      <article>
        <Link href="/">← 記事一覧に戻る</Link>
        <h1>{post.title}</h1>
        <p className="post-date">{post.date}</p>
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllPostSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;
  const post = await getPostBySlug(slug);
  return { props: { post } };
};
