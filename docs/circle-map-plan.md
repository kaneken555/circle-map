# CircleMap 実装計画書

**作成日**: 2026-03-21

---

## 1. プロジェクト初期設定手順

### 1.1 Next.js プロジェクト作成

```bash
npx create-next-app@latest circle-map \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

### 1.2 必要パッケージのインストール

```bash
npm install @vis.gl/react-google-maps
```

| パッケージ | 用途 |
|---|---|
| `@vis.gl/react-google-maps` | Google Maps の React ラッパー（Map / AdvancedMarker / useMap 等） |

### 1.3 環境変数設定

プロジェクトルートに `.env.local` を作成する:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
# AdvancedMarker を使う場合は Map ID も設定する
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your_map_id_here
```

- `.env.local` は `.gitignore` に含まれていることを確認する
- `.env.local.example` をリポジトリに含め、必要なキー名を明示する

### 1.4 Google Cloud Console 設定

- Google Maps JavaScript API を有効化
- Google Places API を有効化
- 両 API は同一の API キーで利用可能
- 本番環境では HTTP リファラー制限を設定する

---

## 2. ディレクトリ構成

```
circle-map/
├── .env.local                         # 環境変数（gitignore 対象）
├── .env.local.example                 # 環境変数テンプレート
├── docs/                              # 仕様書・計画書
├── public/
└── src/
    ├── app/
    │   ├── layout.tsx                 # ルートレイアウト（メタデータ等）
    │   ├── page.tsx                   # エントリーポイント（メインページ）
    │   └── globals.css                # グローバルスタイル
    ├── components/
    │   ├── Header.tsx                 # ヘッダー領域
    │   ├── ControlPanel.tsx           # 操作パネル領域（検索・距離・クリア）
    │   ├── PlaceSearch.tsx            # 地名検索ボックス + 候補一覧
    │   ├── RadiusInput.tsx            # 距離入力欄 + バリデーションエラー表示
    │   ├── MapView.tsx                # 地図領域（Map / Marker を統合）
    │   ├── MapCircle.tsx              # 円描画（google.maps.Circle を直接操作）
    │   └── InfoPanel.tsx              # 情報表示領域（緯度・経度・半径）
    ├── hooks/
    │   ├── usePlaceSearch.ts          # 地名検索ロジック（デバウンス・API 呼び出し）
    │   └── useRadiusValidation.ts     # 距離入力バリデーションロジック
    ├── types/
    │   └── index.ts                   # 共通型定義
    └── constants/
        └── map.ts                     # 地図定数（初期位置・ズームレベル等）
```

---

## 3. 実装フェーズ

### フェーズ 1: プロジェクト基盤構築

**目標**: アプリが起動し、基本レイアウトが表示される状態にする。

| # | タスク |
|---|---|
| 1-1 | Next.js プロジェクト作成・パッケージインストール |
| 1-2 | 環境変数設定（`.env.local` / `.env.local.example`） |
| 1-3 | 定数ファイル作成（`src/constants/map.ts`）：初期中心座標（東京）・ズームレベル 12 |
| 1-4 | 共通型定義作成（`src/types/index.ts`）：`LatLng`・`PlaceCandidate` 等 |
| 1-5 | ルートレイアウト（`app/layout.tsx`）：メタデータ・フォント設定 |
| 1-6 | グローバル CSS 設定（Tailwind ベース） |
| 1-7 | ページファイル（`app/page.tsx`）の骨格作成 |

---

### フェーズ 2: 地図表示

**目標**: 地図が初期位置（東京・ズーム 12）で表示され、クリックで中心地点を取得できる。

| # | タスク |
|---|---|
| 2-1 | `APIProvider`（`@vis.gl/react-google-maps`）を `page.tsx` に配置し、API キーを注入 |
| 2-2 | `MapView.tsx` を実装：`<Map>` コンポーネントで初期位置・ズームを設定 |
| 2-3 | 地図クリックイベント（`onClick`）を実装し、`LatLng` を親へ通知 |
| 2-4 | `page.tsx` に `centerPoint` state を配置し、地図クリックで更新されることを確認 |

---

### フェーズ 3: マーカー・円の表示

**目標**: 中心地点が設定されたときマーカーが、有効な距離が設定されたときに円が表示される。

| # | タスク |
|---|---|
| 3-1 | `MapView.tsx` に `AdvancedMarker` を追加：`centerPoint` が存在するときのみ表示 |
| 3-2 | `MapView.tsx` に `Circle` を追加：`centerPoint` と有効な `radius` が揃ったときのみ表示 |
| 3-3 | 円の半径は km 単位をメートルへ変換（`radiusKm * 1000`）して渡す |

---

### フェーズ 4: 距離入力とバリデーション

**目標**: 距離入力欄でリアルタイムバリデーションが動作し、エラー時に円が非表示になる。

| # | タスク |
|---|---|
| 4-1 | `useRadiusValidation.ts` フック実装：onChange 検証・エラーメッセージ生成 |
| 4-2 | バリデーションルール実装：数値チェック・0.1 以上・200 以下・小数 2 桁まで |
| 4-3 | 初回未入力時はエラー非表示（`isDirty` フラグで制御） |
| 4-4 | `RadiusInput.tsx` 実装：入力欄・「km」ラベル・エラーメッセージ表示 |
| 4-5 | `page.tsx` の `radiusKm` state と `isRadiusValid` を管理し、`MapView` へ渡す |

---

### フェーズ 5: 地名検索

**目標**: インクリメンタルサーチが動作し、候補選択で地図が移動・中心地点が更新される。

| # | タスク |
|---|---|
| 5-1 | `usePlaceSearch.ts` フック実装：入力値を受け取り、デバウンス 300ms・最小 2 文字で Places API を呼び出す |
| 5-2 | Places Autocomplete API の呼び出し実装 |
| 5-3 | API エラー時のエラーメッセージ管理 |
| 5-4 | `PlaceSearch.tsx` 実装：テキスト入力・候補一覧表示・選択ハンドラー |
| 5-5 | 候補選択時の処理：緯度経度取得・地図中心移動（ズーム維持）・検索ボックスに地点名表示・`centerPoint` state 更新 |
| 5-6 | 候補なし時のメッセージ表示 |

---

### フェーズ 6: クリアボタン

**目標**: クリアボタンで全状態が初期化され、地図が東京に戻る。

| # | タスク |
|---|---|
| 6-1 | `ControlPanel.tsx` にクリアボタンを追加 |
| 6-2 | クリアハンドラー実装：全 state をリセット |
| 6-3 | 地図を初期位置（東京・ズーム 12）へ戻す処理（`useMap` の `panTo` + `setZoom`） |

---

### フェーズ 7: 情報表示領域

**目標**: 緯度・経度・半径が正しい形式で表示される。

| # | タスク |
|---|---|
| 7-1 | `InfoPanel.tsx` 実装：緯度・経度（小数 6 桁）・半径（km）を表示 |
| 7-2 | `centerPoint` が未設定時は空欄またはプレースホルダ表示 |
| 7-3 | バリデーションエラー時は半径表示を非表示にする |

---

### フェーズ 8: レスポンシブ対応・仕上げ

**目標**: PC・スマートフォン両対応の UI を完成させる。

| # | タスク |
|---|---|
| 8-1 | PC レイアウト実装：左サイドバー（操作パネル）＋右側地図（横並び） |
| 8-2 | スマホレイアウト実装：上部に地図（vh50%）→ 下部に操作パネル・情報表示（スクロール可） |
| 8-3 | 地図領域の高さをビューポートに応じて調整（PC: 100vh / スマホ: 50vh） |
| 8-4 | 検索候補一覧がソフトキーボードと重ならないよう入力欄直下に表示 |
| 8-5 | タッチ操作の動作確認（地図タップ・検索候補タップ） |
| 8-6 | `Header.tsx` 実装：アプリ名・説明文の表示 |
| 8-7 | 全体の動作確認・エッジケーステスト |

---

## 4. コンポーネント設計

### 4.1 コンポーネント一覧と責務

| コンポーネント | 責務 |
|---|---|
| `app/page.tsx` | アプリ全体の状態保持。子コンポーネントへ props とコールバックを配布するルートオーケストレーター |
| `Header` | アプリ名・説明文の静的表示のみ。状態なし |
| `ControlPanel` | `PlaceSearch`・`RadiusInput`・クリアボタンを並べるレイアウトコンテナ |
| `PlaceSearch` | 地名検索テキスト入力と候補一覧の表示。`usePlaceSearch` フックを利用。選択時に親へ `LatLng` と地点名を通知 |
| `RadiusInput` | 距離の数値入力欄と「km」ラベル。`useRadiusValidation` フックを利用。入力値とバリデーション状態を親へ通知 |
| `MapView` | `<Map>`・`<AdvancedMarker>` または `<Marker>` を統合した地図描画コンポーネント。地図クリック時に親へ `LatLng` を通知。Map ID が設定されている場合は AdvancedMarker を使用 |
| `MapCircle` | `google.maps.Circle` を `useEffect` で直接操作して円を描画。`@vis.gl/react-google-maps` に Circle コンポーネントが存在しないため独自実装 |
| `InfoPanel` | `centerPoint` と `validRadiusKm` を受け取り、緯度・経度・半径を整形して表示 |

### 4.2 コンポーネント階層

```
page.tsx
├── Header
├── ControlPanel
│   ├── PlaceSearch       ← usePlaceSearch フック使用
│   ├── RadiusInput       ← useRadiusValidation フック使用
│   └── クリアボタン（ControlPanel 内に直接実装）
├── MapView               ← useMap フック使用
│   └── MapCircle         ← google.maps.Circle を直接操作
└── InfoPanel
```

---

## 5. 状態管理設計

### 5.1 state 一覧（`page.tsx` で管理）

| state 名 | 型 | 初期値 | 説明 |
|---|---|---|---|
| `centerPoint` | `{ lat: number; lng: number } \| null` | `null` | 中心地点の緯度経度 |
| `radiusInput` | `string` | `""` | 距離入力欄の生文字列（バリデーション前） |
| `validRadiusKm` | `number \| null` | `null` | バリデーション通過後の半径（km）。無効時は `null` |
| `searchText` | `string` | `""` | 地名検索ボックスの表示文字列 |
| `radiusError` | `string` | `""` | 距離バリデーションエラーメッセージ |
| `searchError` | `string` | `""` | 地名検索 API エラーメッセージ |
| `isRadiusDirty` | `boolean` | `false` | 距離入力欄が一度でも変更されたか（初期エラー非表示制御） |

### 5.2 カスタムフック内の state

| フック | 管理する state | 説明 |
|---|---|---|
| `usePlaceSearch` | `candidates: PlaceCandidate[]`・`isLoading: boolean` | API 候補一覧と通信中フラグ。フック内でデバウンスタイマーも管理 |
| `useRadiusValidation` | なし | 入力値を受け取りエラーメッセージと有効値を返す純粋関数スタイル |

### 5.3 state 更新フロー

```
[地図クリック]
  → MapView.onClick → page.setCenterPoint(latLng)

[地名検索選択]
  → PlaceSearch.onSelect(latLng, name)
  → page.setCenterPoint(latLng)
  → page.setSearchText(name)
  → MapView.panTo(latLng)  ← useMap 経由（ズーム維持）

[距離入力変更]
  → RadiusInput.onChange(value)
  → useRadiusValidation(value) → { error, validValue }
  → page.setRadiusInput(value)
  → page.setRadiusError(error)
  → page.setValidRadiusKm(validValue)
  → page.setIsRadiusDirty(true)

[クリアボタン]
  → 全 state をリセット
  → MapView.panTo(TOKYO) + setZoom(PC: 13 / スマホ: 12) ← useMap 経由
```

### 5.4 円・マーカーの表示条件

| 要素 | 表示条件 |
|---|---|
| `AdvancedMarker` / `Marker` | `centerPoint !== null`（Map ID あり: AdvancedMarker / なし: Marker） |
| `MapCircle`（`google.maps.Circle`） | `centerPoint !== null && validRadiusKm !== null` |
| 情報表示（緯度・経度） | `centerPoint !== null` |
| 情報表示（半径） | `validRadiusKm !== null` |

---

## 6. 主要な実装上の注意点

### 6.1 Places API の呼び出し方法

`useMapsLibrary("places")` で Places ライブラリをロードし、新しい Places API を使う。

- 候補取得: `google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions()`
- 座標取得: `new google.maps.places.Place({ id })` → `place.fetchFields({ fields: ["location"] })`
- 課金最適化: `AutocompleteSessionToken` を発行し、検索〜選択を1セッションとして扱う。選択後に新しいトークンを発行する。

旧 API（`AutocompleteService` / `PlacesService`）は 2025年3月以降の新規利用者には提供されないため使用しない。

### 6.2 デバウンス実装

`usePlaceSearch` 内で `useEffect` と `setTimeout` / `clearTimeout` を組み合わせてデバウンス 300ms を実装する。入力が 2 文字未満のときは API を呼び出さずに候補一覧をクリアする。

### 6.3 地図の参照取得

`useMap` フック（`@vis.gl/react-google-maps` 提供）を `MapView` 内で呼び出し、`map.panTo()` / `map.setZoom()` で地図を制御する。

### 6.4 バリデーションの桁数チェック

小数 2 桁チェックは正規表現 `/^\d+(\.\d{1,2})?$/` で検証する。`parseFloat` で数値変換後に範囲チェックを行う。

### 6.5 `APIProvider` の配置

`<APIProvider>` は `app/page.tsx` 直下に配置し、クライアントコンポーネント境界を明確にする（`"use client"` が必要なため）。
