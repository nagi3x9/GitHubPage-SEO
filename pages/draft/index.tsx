import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { getLocalPostById, LocalPost } from '@/lib/localPosts';

export default function DraftPage() {
  const router = useRouter();
  const [post, setPost] = useState<LocalPost | null | undefined>(undefined);

  useEffect(() => {
    if (!router.isReady) return;
    const id = typeof router.query.id === 'string' ? router.query.id : '';
    setPost(getLocalPostById(id) ?? null);
  }, [router.isReady, router.query.id]);

  return (
    <Layout>
      <Link href="/">← 記事一覧に戻る</Link>

      {post === undefined && <p>読み込み中...</p>}

      {post === null && (
        <p>
          この下書きは見つかりませんでした。別のブラウザ・別の端末からアクセスした場合、
          localStorage に保存されていないため表示されません。
        </p>
      )}

      {post && (
        <article>
          <span className="badge">下書き(未公開)</span>
          <h1>{post.title}</h1>
          <p className="post-date">{post.date}</p>
          <div className="post-content">
            {post.content.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </article>
      )}
    </Layout>
  );
}
