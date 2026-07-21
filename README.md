# GitHub Pages SSG Blog(デモ)

React(Next.js)+ SSG(静的サイト生成)+ GitHub Pages でブログを作る簡易デモです。

## 前提として:GitHub Pagesでできること・できないこと

- GitHub Pagesは **静的ファイルを配信するだけ** のホスティングです。サーバー処理(DBへの書き込みなど)はできません。
- SSGは記事の内容をビルド時にHTMLへ焼き込む方式なので、**記事を追加・編集したら再ビルド&再デプロイが必要** です。
- ただし GitHub Actions を使えば、`main` ブランチへの `git push` をトリガーに自動でビルド&デプロイできるため、「記事ファイルをコミットして push する」だけで数十秒〜数分後にはサイトに反映されます(`.github/workflows/deploy.yml`)。
- 「管理画面から投稿ボタンを押した瞬間に、GitHubリポジトリへ書き込んで自動反映する」仕組み(Git-based CMS)も技術的には可能ですが、GitHubへの書き込み権限(トークン)を安全に扱う仕組みが別途必要になるため、このデモには含めていません。

## このデモの仕組み

2種類の「記事」を用意しています。

1. **公開記事(SSG)**: `posts/*.md` を Markdown で書く → ビルド時にHTML化 → GitHub Pagesに恒久的に公開される本物の記事。追加するには、ファイルを作成してコミット・プッシュしてください。
2. **下書き(ローカルのみ)**: トップページの「かんたん投稿(下書き)」フォームから投稿すると、ブラウザの `localStorage` に保存され、その場で一覧に反映されます。**ただし自分のブラウザだけに見える下書き** で、他の人やページを再ビルドした後には残りません。「投稿したらすぐ反映される」体験を疑似的に確認するための機能です。

## セットアップ

```bash
npm install
npm run dev
```

`http://localhost:3000` で確認できます。

## 本番ビルド(静的書き出し)

```bash
npm run build
```

`next.config.js` の `output: 'export'` により、`out/` ディレクトリに静的HTMLが出力されます。

## GitHub Pagesへのデプロイ

1. GitHubにリポジトリを作成し、このプロジェクトをpushする
2. リポジトリの Settings → Pages → Source を **GitHub Actions** に設定する
3. `main` ブランチにpushすると `.github/workflows/deploy.yml` が自動実行され、ビルド&デプロイされる

`next.config.js` はリポジトリ名(`GITHUB_REPOSITORY` 環境変数)から自動で `basePath` を計算するので、`https://<user>.github.io/<repo>/` 形式のプロジェクトページであれば追加設定は不要です(`<user>.github.io` というユーザーページ用リポジトリの場合は `basePath` なしになります)。

## 新しい記事を公開する

`posts/` フォルダに Markdown ファイルを追加してコミット・プッシュします。

```markdown
---
title: "記事タイトル"
date: "2026-01-20"
excerpt: "一覧に表示される概要"
---

本文をここに書く。
```

## ディレクトリ構成

```
posts/                 公開記事のMarkdownソース(SSG対象)
lib/posts.ts           Markdownを読み込んでHTML化する処理(ビルド時実行)
lib/localPosts.ts      下書き(localStorage)の読み書き
pages/index.tsx        記事一覧(公開記事+下書きをマージ表示)
pages/posts/[slug].tsx  公開記事の詳細ページ(SSG)
pages/draft/index.tsx   下書きの詳細表示(クライアントのみ)
pages/admin/new.tsx     かんたん投稿フォーム
.github/workflows/deploy.yml  GitHub Actionsによる自動ビルド&デプロイ
```
