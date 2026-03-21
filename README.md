# CircleMap

地図上で中心地点を選び、指定した半径距離の円を表示するWebアプリ。

## 機能

- 地図上のクリック・タップで中心地点を指定
- 地名・住所・施設名などで地点を検索（インクリメンタルサーチ）
- 半径距離（km）を入力して円を表示
- 緯度・経度・半径のリアルタイム表示
- PC・スマートフォン対応（レスポンシブ）

## 技術スタック

| 項目 | 採用技術 |
|---|---|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| スタイル | Tailwind CSS |
| 地図 | Google Maps JavaScript API + @vis.gl/react-google-maps |
| 地名検索 | Google Places API（AutocompleteSuggestion） |

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成し、APIキーを設定します。

```bash
cp .env.local.example .env.local
```

```
# .env.local

# Google Maps / Places API キー（必須）
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here

# Google Cloud Console > マップ管理 で作成した Map ID（任意）
# 設定すると AdvancedMarker が有効になる。未設定時は通常の Marker を使用
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your_map_id_here
```

**APIキーの取得方法:**
Google Cloud Console で以下の2つのAPIを有効化し、APIキーを発行してください。
- Google Maps JavaScript API
- Google Places API

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## スクリプト

```bash
npm run dev    # 開発サーバー起動
npm run build  # プロダクションビルド
npm run start  # プロダクションサーバー起動
npm run lint   # ESLint 実行
```

## ディレクトリ構成

```
src/
├── app/
│   ├── layout.tsx        # ルートレイアウト
│   ├── page.tsx          # メインページ（状態管理）
│   └── globals.css
├── components/
│   ├── Header.tsx        # ヘッダー
│   ├── ControlPanel.tsx  # 操作パネル（検索・距離・クリア）
│   ├── PlaceSearch.tsx   # 地名検索ボックス
│   ├── RadiusInput.tsx   # 距離入力欄
│   ├── MapView.tsx       # 地図・マーカー
│   ├── MapCircle.tsx     # 円描画
│   └── InfoPanel.tsx     # 緯度経度・半径表示
├── hooks/
│   ├── usePlaceSearch.ts      # 地名検索ロジック
│   └── useRadiusValidation.ts # 距離バリデーション
├── constants/
│   └── map.ts            # 初期位置・ズームレベル等
└── types/
    └── index.ts          # 共通型定義
```
