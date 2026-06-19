# LABwork

**English | [日本語](#labwork-日本語版)**

LABwork is a job application tracker for organizing companies, roles, statuses, interview notes, and job-search progress in one focused workspace.

The project is built as a full-stack web app with a Flask backend, SQLite database, and a custom HTML/CSS/JavaScript frontend. It is designed to be simple, fast, readable, and useful during an active job search.

Live site: https://labwork.online  
Repository: https://github.com/LBSaka/LABwork

---

## Current Status

LABwork is currently in MVP demo mode.

The core application tracking flow is live:

- User signup and login
- Demo login
- Create job applications
- View saved applications
- Edit existing applications
- Delete applications
- Archive applications
- Store application data in SQLite
- Search applications by company or position
- Filter applications by status
- Sort applications by table headers
- Track interview-specific details for applications marked as applied
- Store notes for each application
- Profile / settings page
- Japanese / English UI mode
- Light / dark theme mode
- High-contrast cyber-style UI with sharp corners and cyan accents
- Responsive layout for desktop and mobile

The goal of the MVP is to prove the core product loop: a user can log in, track real applications, update their status, and review progress from a clean interface.

---

## Features

### Application Tracking

Users can save job application entries with:

- Company name
- Position
- Status
- Date applied
- Status detail
- Interview round
- Interview date
- Notes

Supported statuses:

- Not Yet Applied
- Applied
- Rejected
- Accepted

When an application is marked as `Applied`, additional status details become available, including interview-related states.

---

### Search, Filter, and Sort

The applications dashboard supports:

- Searching by company or position
- Filtering by application status
- Sorting by company
- Sorting by position
- Sorting by status
- Sorting by date applied

This makes the dashboard usable even as the number of tracked applications grows.

---

### Authentication

LABwork includes a working account system:

- Signup
- Login
- Logout
- Current-user display
- Demo account login

The demo login allows users to try the app without creating an account.

---

### Japanese Mode

LABwork includes a frontend Japanese / English toggle.

Japanese mode currently translates the main user interface, including:

- Navigation
- Landing page text
- Login text
- Application dashboard controls
- Status labels
- Form labels
- Buttons
- Profile/settings page text
- Alerts and confirmation messages where handled by frontend JavaScript

Internal database values remain stable in English-style codes such as `Applied`, `Rejected`, and `NYA`, while the UI displays translated labels. This keeps backend logic simple while allowing the frontend to support multiple languages.

---

### Dark Mode

LABwork includes a light / dark theme toggle using `localStorage`.

The current visual direction is:

- Pitch black and pure white where practical
- High-visibility contrast
- Sharp corners
- Chunky outlines
- Mint-cyan cyber accents
- No rounded corporate card styling

Theme and language preferences persist locally in the browser.

---

## Tech Stack

### Frontend

- HTML
- CSS
- JavaScript
- LocalStorage for local UI preferences

### Backend

- Python
- Flask
- SQLite
- Gunicorn for deployment

### Tools / Deployment

- Git / GitHub
- Render
- Custom domain: `labwork.online`

---

## Project Structure

```txt
LABwork/
├── backend/
│   └── app.py
├── frontend/
│   ├── static/
│   │   ├── account.js
│   │   ├── auth.js
│   │   ├── homepage.js
│   │   ├── profile.js
│   │   ├── settings.js
│   │   └── styles.css
│   └── templates/
│       ├── applications.html
│       ├── index.html
│       ├── profile.html
│       └── signup.html
├── requirements.txt
└── README.md
```

---

## Running Locally

From the project root:

```bash
python backend/app.py
```

Then open:

```txt
http://127.0.0.1:5000/
```

If dependencies are missing:

```bash
pip install -r requirements.txt
python backend/app.py
```

Optional virtual environment setup:

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python backend/app.py
```

On Windows PowerShell:

```powershell
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
python backend/app.py
```

---

## Render Start Command

For deployment on Render:

```bash
gunicorn backend.app:app --bind 0.0.0.0:$PORT
```

---

## Environment Notes

LABwork currently uses SQLite.

For local development, SQLite is simple and effective. For production use, persistence depends on the deployment environment and storage configuration. A future production version may migrate to PostgreSQL or another managed database if stronger long-term persistence is needed.

---

## In Progress / Planned Features

The following features are not fully complete yet and are planned for future versions:

### Resume Storage

Planned feature for storing resumes per user and attaching them to applications.

Possible future behavior:

- Upload multiple resumes
- Label resumes by target role
- Attach a resume version to an application
- Track which resume was used for each company

---

### Email Reminders

Planned feature for follow-up reminders.

Possible future behavior:

- Remind users to follow up after a certain number of days
- Remind users before interviews
- Remind users about application deadlines
- Send email notifications or display reminder alerts in-app

---

### Account Deletion Backend

The profile page includes a danger-zone UI, but full backend account deletion is still in progress.

Planned behavior:

- Delete user account
- Delete associated applications
- Confirm destructive action safely

---

### Persistent User Settings Across Devices

Language and theme settings currently use browser `localStorage`.

Future versions may store preferences on the user account, allowing settings to follow the user across devices.

---

### Chrome Extension

A browser extension is planned as a future companion tool.

Possible future behavior:

- Save job postings from external websites
- Autofill application fields from a job listing
- Send listing data into the LABwork dashboard

---

### Statistics / Progress Visualization

Planned feature for visual job-search stats.

Possible future behavior:

- Application status breakdown
- Interview conversion rate
- Rejection / acceptance counts
- Timeline of applications
- Progress visualization for active job search

---

### Production Database Upgrade

SQLite is currently being used for MVP development.

A future production version may use PostgreSQL for stronger hosted persistence, safer concurrent usage, and easier scaling.

---

## MVP Philosophy

LABwork is intentionally built around a small but complete core loop:

1. Log in
2. Add an application
3. Track status
4. Update notes and interview details
5. Search, filter, and review progress

The current goal is not to include every possible job-search feature. The goal is to make the essential workflow real, deployed, and usable.

---

## Current Demo Scope

The current deployed version is suitable for demonstrating:

- Full-stack CRUD development
- Authentication flow
- Database-backed application data
- Frontend state management
- Search/filter/sort behavior
- Bilingual UI support
- Theme switching
- Responsive UI design
- Practical product thinking around a real user workflow

---

## License

No license has been selected yet.


---

# LABwork 日本語版

**[English](#labwork) | 日本語**

LABworkは、就職活動における応募企業、職種、選考状況、面接メモ、進捗をひとつの画面で整理するための求人応募管理アプリです。

Flaskバックエンド、SQLiteデータベース、HTML/CSS/JavaScriptによるカスタムフロントエンドで構築したフルスタックWebアプリです。実際の就職活動で使いやすいように、シンプルさ、読みやすさ、操作の速さを重視しています。

公開サイト: https://labwork.online  
リポジトリ: https://github.com/LBSaka/LABwork

---

## 現在の状態

LABworkは現在、MVPデモ版です。

現在、主な応募管理フローは動作しています。

- ユーザー登録・ログイン
- デモログイン
- 求人応募データの作成
- 保存済み応募データの表示
- 応募データの編集
- 応募データの削除
- 応募データのアーカイブ
- SQLiteによるデータ保存
- 会社名・職種による検索
- ステータスによる絞り込み
- テーブルヘッダーによる並び替え
- 応募済みステータスに対する面接情報の管理
- 応募ごとのメモ保存
- プロフィール / 設定ページ
- 日本語 / 英語UI切り替え
- ライト / ダークテーマ切り替え
- シャープな角、ミントシアン系アクセント、高コントラストUI
- デスクトップ・モバイル対応レイアウト

MVPの目的は、ユーザーがログインし、実際の応募情報を登録し、ステータスを更新し、進捗を確認できるという基本的なプロダクト体験を成立させることです。

---

## 機能

### 応募管理

ユーザーは以下の情報を求人応募データとして保存できます。

- 会社名
- 職種
- ステータス
- 応募日
- ステータス詳細
- 面接回数
- 面接日
- メモ

対応しているステータス:

- 未応募
- 応募済み
- 不採用
- 内定

ステータスが `Applied` の場合、面接予定などの追加ステータス詳細を管理できます。

---

### 検索・絞り込み・並び替え

応募一覧画面では、以下の操作ができます。

- 会社名または職種による検索
- 応募ステータスによる絞り込み
- 会社名順の並び替え
- 職種順の並び替え
- ステータス順の並び替え
- 応募日順の並び替え

応募数が増えても、一覧を管理しやすいようにしています。

---

### 認証機能

LABworkにはアカウント機能があります。

- 新規登録
- ログイン
- ログアウト
- 現在ログイン中のユーザー表示
- デモアカウントログイン

デモログインにより、アカウントを作成しなくてもアプリを試すことができます。

---

### 日本語モード

LABworkには、日本語 / 英語を切り替えるフロントエンド機能があります。

現在、日本語モードでは主に以下のUIを翻訳しています。

- ナビゲーション
- ランディングページのテキスト
- ログイン関連テキスト
- 応募一覧の操作UI
- ステータス表示
- フォームラベル
- ボタン
- プロフィール / 設定ページ
- フロントエンドJavaScriptで処理しているアラートや確認メッセージ

データベース内部の値は、`Applied`、`Rejected`、`NYA` などの安定した英語系コードのまま保持し、画面表示のみ翻訳しています。これにより、バックエンドのロジックをシンプルに保ちながら、多言語UIを実現しています。

---

### ダークモード

LABworkには、`localStorage` を使ったライト / ダークテーマ切り替えがあります。

現在のデザイン方針:

- 可能な限り黒と白を中心にした高コントラスト
- 視認性重視
- 角丸なし
- 太めのアウトライン
- ミントシアン系のサイバー風アクセント
- 一般的な企業風カードUIではなく、よりシャープな見た目

テーマと言語の設定は、ブラウザ内にローカル保存されます。

---

## 技術スタック

### フロントエンド

- HTML
- CSS
- JavaScript
- UI設定保存用のLocalStorage

### バックエンド

- Python
- Flask
- SQLite
- Gunicorn

### ツール / デプロイ

- Git / GitHub
- Render
- カスタムドメイン: `labwork.online`

---

## プロジェクト構成

```txt
LABwork/
├── backend/
│   └── app.py
├── frontend/
│   ├── static/
│   │   ├── account.js
│   │   ├── auth.js
│   │   ├── homepage.js
│   │   ├── profile.js
│   │   ├── settings.js
│   │   └── styles.css
│   └── templates/
│       ├── applications.html
│       ├── index.html
│       ├── profile.html
│       └── signup.html
├── requirements.txt
└── README.md
```

---

## ローカルでの実行方法

プロジェクトのルートディレクトリで以下を実行します。

```bash
python backend/app.py
```

その後、ブラウザで以下を開きます。

```txt
http://127.0.0.1:5000/
```

依存関係が不足している場合:

```bash
pip install -r requirements.txt
python backend/app.py
```

仮想環境を使う場合:

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python backend/app.py
```

Windows PowerShellの場合:

```powershell
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
python backend/app.py
```

---

## Renderの起動コマンド

Renderでデプロイする場合:

```bash
gunicorn backend.app:app --bind 0.0.0.0:$PORT
```

---

## 環境メモ

LABworkは現在SQLiteを使用しています。

ローカル開発ではSQLiteはシンプルで扱いやすい選択です。本番運用では、デプロイ環境やストレージ設定によって永続性が変わります。将来的には、より強い永続性が必要になった場合、PostgreSQLなどのマネージドデータベースへ移行する可能性があります。

---

## 開発中 / 今後追加予定の機能

以下の機能はまだ完全には実装されておらず、今後のバージョンで追加予定です。

### 履歴書保存

ユーザーごとに履歴書を保存し、応募情報に紐づける機能を予定しています。

将来的な動作例:

- 複数の履歴書をアップロード
- 目的職種ごとに履歴書を分類
- 応募データに使用した履歴書を紐づけ
- どの企業にどの履歴書を使ったかを記録

---

### メールリマインダー

フォローアップや面接予定を忘れないためのリマインダー機能を予定しています。

将来的な動作例:

- 一定日数後のフォローアップ通知
- 面接前のリマインダー
- 応募締切の通知
- メール通知またはアプリ内通知

---

### アカウント削除バックエンド

プロフィールページには危険操作エリアのUIがありますが、完全なアカウント削除機能はまだ開発中です。

予定している動作:

- ユーザーアカウントの削除
- 関連する応募データの削除
- 安全な確認フロー

---

### 端末をまたいだ設定保存

現在、言語とテーマ設定はブラウザの `localStorage` に保存しています。

将来的には、ユーザーアカウントに設定を保存し、別端末でも同じ設定を使えるようにする予定です。

---

### Chrome拡張機能

将来的に、LABworkの補助ツールとしてブラウザ拡張機能を開発する予定です。

将来的な動作例:

- 外部求人サイトから求人情報を保存
- 求人情報から応募フォーム項目を自動入力
- LABworkの応募一覧へ求人情報を送信

---

### 統計 / 進捗可視化

就職活動の進捗を可視化する機能を予定しています。

将来的な動作例:

- 応募ステータスの内訳
- 面接への進行率
- 不採用 / 内定数
- 応募タイムライン
- 就職活動の進捗グラフ

---

### 本番用データベースへの移行

現在はMVP開発用にSQLiteを使用しています。

将来的には、より強い永続性、同時利用、安全なスケーリングのためにPostgreSQLへ移行する可能性があります。

---

## MVPの考え方

LABworkは、以下の小さくても完結した基本フローを重視して開発しています。

1. ログインする
2. 応募情報を追加する
3. ステータスを管理する
4. メモや面接情報を更新する
5. 検索・絞り込み・並び替えで進捗を確認する

現在の目標は、就職活動に関するすべての機能を入れることではありません。まずは、重要なワークフローを実際に動作する形でデプロイし、使える状態にすることを目指しています。

---

## 現在のデモ範囲

現在のデプロイ版では、以下を示すことができます。

- フルスタックCRUD開発
- 認証フロー
- データベース連携
- フロントエンド状態管理
- 検索・絞り込み・並び替え
- 日英バイリンガルUI
- テーマ切り替え
- レスポンシブUI
- 実際のユーザーワークフローに基づいたプロダクト設計

---

## ライセンス

現在、ライセンスは未設定です。

