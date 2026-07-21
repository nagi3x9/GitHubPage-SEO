import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { saveLocalPost } from '@/lib/localPosts';

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const post = saveLocalPost({ title, content });
    router.push(`/draft/?id=${post.id}`);
  }

  return (
    <Layout>
      <Link href="/">← 記事一覧に戻る</Link>
      <h1>かんたん投稿(下書き)</h1>
      <p className="hint">
        ここで投稿した内容は、あなたのブラウザの localStorage
        にのみ保存されます。他の人には公開されません。全員に公開する記事にするには、
        <code>posts/</code> フォルダに Markdown ファイルを追加してコミット・プッシュしてください。
      </p>

      <form onSubmit={handleSubmit} className="post-form">
        <label>
          タイトル
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          本文
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            required
          />
        </label>
        <button type="submit">投稿する(下書き保存)</button>
      </form>
    </Layout>
  );
}
