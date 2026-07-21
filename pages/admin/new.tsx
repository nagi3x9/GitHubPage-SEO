import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { saveLocalPost } from '@/lib/localPosts';
import { CAN_PUBLISH_TO_GITHUB, publishPostToGitHub } from '@/lib/publish';

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);

  function handleSaveDraft(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const post = saveLocalPost({ title, content });
    router.push(`/draft/?id=${post.id}`);
  }

  async function handlePublish() {
    if (!title.trim() || !content.trim()) return;
    setPublishing(true);
    setPublishError(null);
    try {
      const { slug } = await publishPostToGitHub({ title, content });
      setPublishedSlug(slug);
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : String(err));
    } finally {
      setPublishing(false);
    }
  }

  return (
    <Layout>
      <Link href="/">← 記事一覧に戻る</Link>
      <h1>かんたん投稿</h1>
      <p className="hint">
        「下書き保存」はあなたのブラウザの localStorage にのみ保存され、他の人には公開されません。
      </p>

      {CAN_PUBLISH_TO_GITHUB && (
        <p className="hint">
          ⚠️ デモ用機能:「GitHubへ本当に投稿する」は、書き込み権限を持つトークンをこのページのJavaScriptに直接埋め込んでいます。
          ログイン機構のない検証用の実装のため、このサイトを見た人は誰でもこのトークンを使ってリポジトリに書き込めます。
        </p>
      )}

      <form className="post-form">
        <label>
          タイトル
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
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
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button type="submit" onClick={handleSaveDraft}>
            下書き保存(ローカルのみ)
          </button>
          {CAN_PUBLISH_TO_GITHUB && (
            <button type="button" onClick={handlePublish} disabled={publishing}>
              {publishing ? '投稿中...' : 'GitHubへ本当に投稿する'}
            </button>
          )}
        </div>
      </form>

      {publishError && <p className="hint">エラー: {publishError}</p>}

      {publishedSlug && (
        <div className="draft-section">
          <p>
            GitHubへコミットしました。GitHub Actionsのビルドが完了すると(通常1〜2分)、本番サイトに反映されます。
          </p>
          <p>
            公開後のURL:{' '}
            <code>
              /posts/{publishedSlug}/
            </code>
          </p>
        </div>
      )}
    </Layout>
  );
}
