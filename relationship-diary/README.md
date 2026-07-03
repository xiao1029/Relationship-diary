# ふりかえり日記

パートナーとの間に起きた出来事を「事実 → 感じたこと → 気づき」の3段階に分けて記録し、
後から客観的に見返すための日記アプリ（Next.js製 / PWA対応）。

## 特徴

- カレンダーから日付を選んで、その日のページに記録する
- 記録は3つの入力欄のみ：**a. 起きた出来事 / b. 感じたこと / c. 気づいたこと**
- データはスマホのブラウザ内（localStorage）に保存。サーバーには送信されません
- ホーム画面に追加すればアプリのように使えます（PWA）
- オフラインでも起動できます（Service Worker）

## ローカルで動かす

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開くと確認できます。

## Vercelへのデプロイ手順

1. このフォルダをGitHubリポジトリにpushする
   ```bash
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin <あなたのGitHubリポジトリのURL>
   git push -u origin main
   ```
2. [vercel.com](https://vercel.com) にGitHubアカウントでログイン
3. 「Add New... → Project」から、上でpushしたリポジトリを選択
4. 設定はデフォルトのままで「Deploy」をクリック（Next.jsは自動検出されます）
5. 数十秒でデプロイが完了し、`https://（プロジェクト名）.vercel.app` のようなURLが発行されます

## スマホでアプリのように使う（ホーム画面に追加）

**iPhone (Safari)**
1. デプロイしたURLをSafariで開く
2. 共有ボタン（□に↑）をタップ
3. 「ホーム画面に追加」を選択

**Android (Chrome)**
1. デプロイしたURLをChromeで開く
2. 右上のメニュー（︙）をタップ
3. 「アプリをインストール」または「ホーム画面に追加」を選択

ホーム画面のアイコンから起動すると、URLバーのないアプリのような見た目で使えます。

## データについて

現在の実装では、記録はすべて**その端末のブラウザ内**に保存されます（他の端末やブラウザには自動で共有されません）。
そのため、以下のような点にご注意ください。

- ブラウザの「サイトデータを削除」等の操作をすると記録も消えます
- 別のスマホ・別のブラウザで開いても、記録は表示されません
- 大事な記録は、必要に応じて手動でバックアップすることをおすすめします

将来的にパートナーと共有する機能や、クラウド保存（機種変更してもデータが残る）に対応する場合は、
`lib/storage.js` の実装をFirebase/Supabaseなどに差し替える形で拡張できます。

## ディレクトリ構成

```
app/
  page.js              … トップページ（カレンダー）
  day/[date]/page.js   … 日ごとの記録ページ
  layout.js            … 全体レイアウト・PWAメタデータ
  manifest.js          … PWAのmanifest定義
  globals.css          … デザイントークン（色・フォント）
components/
  Calendar.js          … カレンダーのUI
  DayForm.js           … a/b/c入力フォームのUI
  SwRegister.js         … Service Worker登録
lib/
  storage.js           … 記録の保存・読み込み（localStorage）
  dates.js             … 日付の表示・整形ヘルパー
public/
  sw.js                … Service Worker本体
  icons/               … アプリアイコン
```
