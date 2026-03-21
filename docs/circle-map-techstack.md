## 技術スタック

### 1. フレームワーク

| 項目 | 採用技術 |
|------|----------|
| フレームワーク | Next.js (App Router) |
| UIライブラリ | React |
| 言語 | TypeScript |

### 2. 地図

| 項目 | 採用技術 |
|------|----------|
| 地図ライブラリ | Google Maps JavaScript API |
| Reactラッパー | @vis.gl/react-google-maps |

**利用機能**

- 地図表示（Map）
- クリックイベント取得
- マーカー表示（AdvancedMarker ※Map ID必要 / Map ID未設定時は Marker にフォールバック）
- 円描画（`google.maps.Circle` を `useEffect` で直接操作）

### 3. 地名検索

| 項目 | 採用技術 |
|------|----------|
| 検索API | Google Places API（新API: AutocompleteSuggestion / Place） |

**利用機能**

- テキスト入力に対するリアルタイム候補取得（`AutocompleteSuggestion.fetchAutocompleteSuggestions`）
- 候補選択時の緯度経度取得（`Place.fetchFields`）
- セッショントークンによる課金最適化（`AutocompleteSessionToken`）

**インクリメンタルサーチ設定**

- デバウンス: 300ms
- 最小入力文字数: 2文字
- 検索対象地域: 制限なし（全世界）

### 4. 必要なAPIキー

- Google Maps JavaScript API
- Google Places API

両APIは同一のGCPプロジェクトのAPIキーで利用可能。

| 環境変数 | 必須 | 説明 |
|---|---|---|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | 必須 | Google Maps / Places API キー |
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | 任意 | Google Cloud Console で作成した Map ID。設定時に AdvancedMarker が有効になる |

### 5. 対応環境

| 項目 | 内容 |
|------|------|
| デバイス | PC・スマートフォン（タッチ操作対応） |
| ブラウザ | 主要モダンブラウザ（Chrome / Firefox / Safari / Edge 最新版） |
| レイアウト | レスポンシブ対応 |
