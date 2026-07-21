export type LocalPost = {
  id: string;
  title: string;
  content: string;
  date: string;
};

const STORAGE_KEY = 'draft-posts';

export function getLocalPosts(): LocalPost[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getLocalPostById(id: string): LocalPost | undefined {
  return getLocalPosts().find((post) => post.id === id);
}

export function saveLocalPost(input: { title: string; content: string }): LocalPost {
  const post: LocalPost = {
    id: Date.now().toString(36),
    title: input.title,
    content: input.content,
    date: new Date().toISOString().slice(0, 10),
  };
  const posts = getLocalPosts();
  posts.unshift(post);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  return post;
}

export function deleteLocalPost(id: string): void {
  const posts = getLocalPosts().filter((post) => post.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}
