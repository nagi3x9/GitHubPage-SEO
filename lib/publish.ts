export const GITHUB_OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER;
export const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
export const GITHUB_BRANCH = process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main';
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

export const CAN_PUBLISH_TO_GITHUB = Boolean(GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO);

function slugify(title: string): string {
  const ascii = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${ascii || 'post'}-${Date.now().toString(36)}`;
}

function toBase64(text: string): string {
  return btoa(unescape(encodeURIComponent(text)));
}

export async function publishPostToGitHub(input: { title: string; content: string }): Promise<{ slug: string }> {
  if (!CAN_PUBLISH_TO_GITHUB) {
    throw new Error('この機能はローカル環境(.env.local にトークン設定済み)でのみ利用できます。');
  }

  const slug = slugify(input.title);
  const date = new Date().toISOString().slice(0, 10);
  const excerpt = input.content.replace(/\s+/g, ' ').slice(0, 60);
  const frontmatter = [
    '---',
    `title: "${input.title.replace(/"/g, '\\"')}"`,
    `date: "${date}"`,
    `excerpt: "${excerpt.replace(/"/g, '\\"')}"`,
    '---',
    '',
    input.content,
    '',
  ].join('\n');

  const path = `posts/${slug}.md`;

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        message: `記事を追加: ${input.title}`,
        content: toBase64(frontmatter),
        branch: GITHUB_BRANCH,
      }),
    }
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `GitHubへの投稿に失敗しました (HTTP ${res.status})`);
  }

  return { slug };
}
