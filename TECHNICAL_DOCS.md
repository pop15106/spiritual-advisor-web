# 🎨 Spiritual Advisor Web - 前端技術文件

本文檔詳細說明前端專案的架構、元件設計與資料流向。

---

## 1. 系統架構 (System Architecture)

本專案使用 **Next.js 15 (App Router)** 構建，採用現代化的 React Server Components (RSC) 與 Client Components 混合架構。

```mermaid
graph TD
    Page[Root Page (page.tsx)] --> Layout[Root Layout]
    Page --> Integration[IntegrationSection (Client)]
    
    subgraph "System Components"
        Integration --> Tarot[TarotSection]
        Integration --> Bazi[BaziSection]
        Integration --> HD[HumanDesignSection]
        Integration --> Astro[AstrologySection]
        Integration --> Ziwei[ZiweiSection]
    end
    
    subgraph "Admin Module"
        AdminLogin[Login Page]
        AdminDash[Dashboard Page]
    end
    
    Integration --> |Events| API[API Service (Axios/Fetch)]
    AdminDash --> |Auth| JWT[JWT Token Storage]
```

---

## 2. 技術堆疊 (Technology Stack)

- **核心框架**: Next.js 15.1
- **語言**: TypeScript 5.x
- **樣式系統**: Tailwind CSS 3.4 (Utility-first)
- **UI 元件**: 自定義 React Components (無依賴外部 UI 庫，純 CSS 實作)
- **圖標庫**: `lucide-react`
- **以及處理**: `dangerouslySetInnerHTML` (用於 AI 生成 HTML 內容的渲染)

---

## 3. 目錄結構 (Directory Structure)

```
src/
├── app/                  # App Router 頁面
│   ├── admin/            # 後台管理模組
│   │   ├── login/        # 登入頁 (page.tsx)
│   │   └── dashboard/    # 儀表板 (page.tsx)
│   ├── globals.css       # 全域樣式與 Tailwind 指令
│   ├── layout.tsx        # 根佈局
│   └── page.tsx          # 應用主頁面
├── components/           # 功能元件
│   ├── IntegrationSection.tsx # 核心整合介面 (整合所有系統)
│   ├── TarotSection.tsx  # 塔羅牌介面
│   ├── BaziSection.tsx   # 八字命理介面
│   ├── HumanDesignSection.tsx # 人類圖介面
│   ├── AstrologySection.tsx   # 占星介面
│   └── ZiweiSection.tsx  # 紫微斗數介面
└── services/             # API 整合
    └── api.ts            # 所有與後端通訊的函數
```

---

## 4. 核心元件說明 (Key Components)

### `IntegrationSection.tsx`
這是整個應用的**主要控制器**。
- **職責**: 
  - 管理使用者輸入 (出生資料)
  - 控制系統選擇 (Checkbox 狀態)
  - 協調各個子元件的顯示與隱藏
  - 發送最終的「綜合分析」請求給後端
  - 渲染 AI 分析結果 (包含 Markdown 樣式、卡片特效、行星符號處理)

### `ZiweiSection.tsx` (紫微斗數)
- **功能**: 輸入出生時間，顯示紫微命盤。
- **邏輯**: 處理農曆轉換請求，接收後端回傳的十二宮資料並繪製宮位圖。

### `AstrologySection.tsx` (西洋占星)
- **功能**: 顯示個人星盤資訊。
- **特色**: 使用 `dangerouslySetInnerHTML` 渲染帶有行星符號 `addPlanetSymbols` 的內容。

### `TarotSection.tsx` (塔羅牌)
- **功能**: 實現每日一抽或牌陣抽牌。
- **視覺**: 支援卡片翻轉動畫與牌面展示。

---

## 5. 後台管理模組 (Admin Module)

位於 `/admin` 路徑下，獨立於主應用流程。

### `/admin/login`
- 簡單的帳號密碼表單。
- 登入成功後將 JWT Token 存入 `localStorage` (`admin_token`)。

### `/admin/dashboard`
- **使用量統計**: 讀取後端 `/api/admin/usage/summary`，顯示圖表數據。
- **API Key 管理**: 
  - 顯示 `.env` 中的 Key (唯讀)。
  - 更新資料庫中的動態 Key。
  - 使用 Clipboard API 實現複製功能。
- **權限控制**: `useEffect` 中檢查 Token 有效性，無效則導回登入頁。

---

## 6. 資料流與狀態管理 (Data Flow)

1. **狀態提升 (Lifting State Up)**:
   由於各系統需要共享出生資料給「綜合分析」，因此主要的 `birthDate`, `birthTime`, `gender` 等狀態都提升至 `IntegrationSection` 或透過 Context 傳遞 (目前主要在 IntegrationSection 集中管理)。

2. **API 請求**:
   所有後端請求封裝在 `src/services/api.ts`。
   - `analyzeIntegration`: 發送綜合分析請求。
   - `fetchTarotData`, `calculateBazi`, etc.: 個別系統計算。

3. **樣式處理**:
   - 使用 CSS Modules 或 Tailwind Classes 實現玻璃擬態 (Glassmorphism)。
   - 動態生成的內容 (AI 回覆) 透過自定義的 HTML 解析器加上樣式（如行星符號 `<span class="bg-yellow-100...">☉</span>`）。

---

## 7. 環境變數

- `NEXT_PUBLIC_API_URL`: 指向後端 API 地址 (預設 `http://localhost:5000`)。
