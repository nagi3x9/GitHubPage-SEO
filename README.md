# GitHub Pages SSG Blog(デモ)

React(Next.js)+ SSG(静的サイト生成)+ GitHub Pages でブログを作る簡易デモです。

## 前提として:GitHub Pagesでできること・できないこと

- GitHub Pagesは **静的ファイルを配信するだけ** のホスティングです。サーバー処理(DBへの書き込みなど)はできません。
- SSGは記事の内容をビルド時にHTMLへ焼き込む方式なので、**記事を追加・編集したら再ビルド&再デプロイが必要** です。
- ただし GitHub Actions を使えば、`main` ブランチへの `git push` をトリガーに自動でビルド&デプロイできるため、「記事ファイルをコミットして push する」だけで数十秒〜数分後にはサイトに反映されます(`.github/workflows/deploy.yml`)。
- 「管理画面から投稿ボタンを押した瞬間に、GitHubリポジトリへ書き込んで自動反映する」仕組み(Git-based CMS)も実装しています(下記「本番で本当に投稿を反映する機能について」参照)。ただしログイン機構がないデモ実装のため、書き込み用トークンがブラウザのJavaScriptに埋め込まれ、サイトを見た人なら誰でもリポジトリに書き込める状態になる点に注意してください。

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

## 本番で本当に投稿を反映する機能について(デモ・要注意)

`/admin/new` の「GitHubへ本当に投稿する」ボタンは、ブラウザから直接 GitHub Contents API を呼び出して `posts/` にコミットします(`lib/publish.ts`)。コミットされると `.github/workflows/deploy.yml` が起動し、実際に本番サイトへ反映されます。

有効にするには、リポジトリに以下のシークレットを登録してください。

1. GitHubでトークンを発行: Settings(自分のアカウント) → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token
   - Repository access: Only select repositories → このリポジトリのみ選択
   - Permissions → Repository permissions → Contents: Read and write
   - Expiration: 短め(例: 7日)を推奨
2. このリポジトリの Settings → Secrets and variables → Actions → New repository secret
   - Name: `BLOG_PUBLISH_TOKEN`
   - Value: 発行したトークン
3. `main` に push するとワークフローがこのシークレットをビルド時に埋め込み、本番サイトでボタンが有効になります

**注意**: この方式は書き込み権限を持つトークンを公開JavaScriptに埋め込むため、サイトを見た人は誰でもそのトークンを取り出してリポジトリに書き込めます。デモ・検証用途に留め、本番運用する場合はログイン・認可を挟むGit-based CMS(Decap CMSなど)への置き換えを推奨します。不要になったらトークンは失効(revoke)してください。

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
