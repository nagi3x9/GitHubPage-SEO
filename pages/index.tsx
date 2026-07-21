import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import { getSortedPostsMeta, PostMeta } from '@/lib/posts';
import { getLocalPosts, LocalPost } from '@/lib/localPosts';

type Props = {
  posts: PostMeta[];
};

export default function Home({ posts }: Props) {
  const [localPosts, setLocalPosts] = useState<LocalPost[]>([]);

  useEffect(() => {
    setLocalPosts(getLocalPosts());
  }, []);

  return (
    <Layout>
      <h1>記事一覧</h1>

      {localPosts.length > 0 && (
        <section className="draft-section">
          <h2>下書き(あなたのブラウザだけに表示されています)</h2>
          <ul className="post-list">
            {localPosts.map((post) => (
              <li key={post.id} className="post-item">
                <span className="badge">下書き</span>
                <Link href={`/draft/?id=${post.id}`}>{post.title}</Link>
                <span className="post-date">{post.date}</span>
              </li>
            ))}
          </ul>
          <p className="hint">
            この下書きは、あなたが今見ているブラウザの localStorage
            に保存されているだけで、他の人には見えません。全員に公開するには、内容を
            <code>posts/</code> フォルダの Markdown ファイルとしてリポジトリにコミット・プッシュし、
            GitHub Actions によるビルド&再デプロイを行う必要があります。
          </p>
        </section>
      )}

      <section>
        <h2>公開済みの記事(SSGでビルド済み)</h2>
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.slug} className="post-item">
              <Link href={`/posts/${post.slug}/`}>{post.title}</Link>
              <span className="post-date">{post.date}</span>
              <p className="excerpt">{post.excerpt}</p>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      posts: getSortedPostsMeta(),
    },
  };
};
