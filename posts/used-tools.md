---
title: "このブログを作るのに使った技術まとめ"
date: "2026-07-21"
excerpt: "React(Next.js)のSSGとGitHub Pagesで、このブログをどう作ったかの技術スタック紹介です。"
---

このブログを作るのに使った技術・ツールをまとめます。

## フレームワーク・言語

- **React / Next.js**(`output: 'export'`): ビルド時に静的HTMLを生成するSSG(Static Site Generation)方式。GitHub Pagesはサーバーを持たない静的ホスティングなので、この静的書き出し機能が欠かせません。
- **TypeScript**: 型チェックのために採用。

## 記事コンテンツの処理

- **gray-matter**: Markdownファイルの先頭にある `title` / `date` / `excerpt` などのメタ情報(frontmatter)を読み取ります。
- **remark / remark-html**: Markdown本文をHTMLへ変換します。

## 下書き機能(かんたん投稿)

トップページの「かんたん投稿(下書き)」フォームは、ライブラリを使わず素のJavaScriptで実装しています。ブラウザの **localStorage API** に投稿内容を保存し、一覧にその場で反映する仕組みです。ただしこれは自分のブラウザだけに見える下書きで、他の人には公開されません。

## スタイル

外部のCSSフレームワーク(Tailwindなど)は使わず、素の **CSS**(`styles/globals.css`)でシンプルに仕上げています。

## CI/CD・ホスティング

- **GitHub Actions**: `main` ブランチへの `push` をトリガーに、`npm ci` → `next build` → デプロイ、という流れを自動実行します。
- **GitHub Pages**: ビルドで生成された静的ファイルの配信先です。

## その他

- **Git / GitHub**: バージョン管理と、このリポジトリ(`nagi3x9/GitHubPage-SEO`)へのpushに使用しています。

外部の有料サービスやデータベースは使わず、無料の範囲で完結する構成にしています。
