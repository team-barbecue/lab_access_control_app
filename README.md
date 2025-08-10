# 研究室管理システム - Lab Access Control App

## 概要
研究室の入退室管理を行うWebアプリケーションです。ユーザーの入室・退室記録、座席管理、ログ表示などの機能を提供します。

## 機能
- **入退室管理**: ユーザーIDとコメントを入力して入室・退室を記録
- **座席表示**: 現在の座席状況を視覚的に表示
- **ログ表示**: 入退室履歴の表示
- **クッキー機能**: ユーザーIDとコメントをブラウザに保存
- **リアルタイム更新**: 入退室記録後の即座な状態更新

## 技術スタック
- **フロントエンド**: React.js, Vite
- **バックエンド**: Node.js, Express.js
- **データ保存**: JSONファイル（ファイルベース）
- **スタイリング**: CSS3

## プロジェクト構成
```
lab_access_control_app/
├── frontend/                 # フロントエンド関連ファイル
│   ├── src/                 # ソースコード
│   │   ├── components/      # Reactコンポーネント
│   │   ├── utils/          # ユーティリティ関数
│   │   ├── assets/         # 画像・アイコンファイル
│   │   └── App.jsx         # メインアプリケーション
│   ├── public/             # 静的ファイル
│   ├── package.json        # フロントエンド依存関係
│   └── vite.config.js      # Vite設定
├── backend/                 # バックエンド関連ファイル
│   ├── server.js           # Express.jsサーバー
│   ├── data/               # データファイル
│   └── package.json        # バックエンド依存関係
└── README.md               # このファイル
```

## セットアップ

### 前提条件
- Node.js (v16以上)
- npm または yarn

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd lab_access_control_app
```

### 2. フロントエンドのセットアップ
```bash
cd frontend
npm install
```

### 3. バックエンドのセットアップ
```bash
cd ../backend
npm install
```

## 使用方法

### 開発サーバーの起動

#### フロントエンド（ポート5173）
```bash
cd frontend
npm run dev
```
ブラウザで `http://localhost:5173` にアクセス

#### バックエンド（ポート3001）
```bash
cd backend
npm start
```

### 本番ビルド
```bash
cd frontend
npm run build
```

## 主要なページ

### 1. 部屋ページ（/）
- 現在の座席状況を表示
- 座席をクリックして入退室記録
- 入退室ログの表示

### 2. 入室ページ（/enter）
- ユーザーIDとコメントを入力して入室記録
- クッキーにユーザーIDを保存

### 3. 退室ページ（/exit）
- ユーザーIDとコメントを入力して退室記録
- クッキーにユーザーIDを保存

## API エンドポイント

### ユーザー管理
- `GET /api/users` - 全ユーザー情報の取得
- `POST /api/users/:userID/enter` - 入室記録
- `POST /api/users/:userID/exit` - 退室記録

### ログ管理
- `GET /api/logs` - 入退室ログの取得

## データ構造

### ユーザーデータ（data/users.json）
```json
{
  "userID": "string",
  "userName": "string",
  "isInRoom": "boolean",
  "lastUpdate": "ISO date string"
}
```

### ログデータ（data/logs.json）
```json
{
  "userID": "string",
  "userName": "string",
  "action": "enter|exit",
  "timestamp": "ISO date string",
  "comment": "string|null"
}
```

## クッキー機能

### 保存されるデータ
- `lab_user_id`: ユーザーID（30日間保存）
- `lab_comment`: コメント（30日間保存）

### 自動復元
- ページ読み込み時にクッキーから値を復元
- フォーム入力時にリアルタイムでクッキーに保存

## 開発者向け情報

### コードの構造
- **コンポーネント**: 各機能を独立したReactコンポーネントとして実装
- **状態管理**: React Hooks（useState, useEffect）を使用
- **ルーティング**: カスタムルーティング実装（window.history.pushState）

### カスタマイズ
- 座席数の変更: `backend/server.js`の初期データを編集
- スタイルの変更: 各コンポーネントのCSSファイルを編集
- APIエンドポイントの追加: `backend/server.js`に新しいルートを追加

## トラブルシューティング

### よくある問題
1. **フロントエンドが表示されない**
   - フロントエンドの開発サーバーが起動しているか確認
   - ポート5173が使用可能か確認

2. **APIエラーが発生する**
   - バックエンドサーバーが起動しているか確認
   - ポート3001が使用可能か確認
   - データファイルの権限を確認

3. **クッキーが保存されない**
   - ブラウザのクッキー設定を確認
   - HTTPS環境での動作確認

## 貢献
バグレポートや機能リクエストは、GitHubのIssuesページでお知らせください。

## 更新履歴
- v1.0.0: 初期リリース
- v1.1.0: クッキー機能の追加
- v1.2.0: フォルダ構成のリファクタリング
