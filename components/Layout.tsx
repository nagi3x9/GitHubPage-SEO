import Link from 'next/link';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="site">
      <header className="site-header">
        <Link href="/" className="site-title">
          My SSG Blog
        </Link>
        <nav>
          <Link href="/admin/new">かんたん投稿(下書き)</Link>
        </nav>
      </header>
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <p>Next.js (SSG) + GitHub Pages のデモサイトです。</p>
      </footer>
    </div>
  );
}
