# 🔮 Spiritual Advisor Web (靈性顧問網站)

一個整合多種占卜系統的現代化靈性諮詢平台，提供塔羅牌、八字命理、人類圖、西洋占星與紫微斗數的綜合分析。

![Next.js](https://img.shields.io/badge/Next.js-15.x-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwindcss)

## ✨ 功能特色

- 🃏 **塔羅牌占卜** - 22張大阿爾克納牌的專業解讀
- 📅 **八字命理** - 根據出生時辰計算四柱八字與流年運勢
- 🧬 **人類圖分析** - 精準計算64閘門、通道與能量中心
- ⭐ **西洋占星** - 行星位置、相位與星盤分析
- 🌙 **紫微斗數** - 十二宮位與主星分析
- 🔗 **綜合分析** - AI 整合所有系統的智慧解讀
- 🎨 **視覺強化** - 星座行星符號化、動態載入提示與精美卡片介面
- 🔧 **後台管理** - 內建管理員儀表板，可查看使用數據與管理 API Key

## 🚀 快速開始

### 前置需求

- Node.js 18+ 
- npm 或 yarn
- 後端 API 服務 (見 [spiritual-ai-advisor](https://github.com/pop15106/spiritual-ai-advisor))

### 安裝步驟

```bash
# 複製專案
git clone https://github.com/pop15106/spiritual-advisor-web.git
cd spiritual-advisor-web

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

在瀏覽器開啟 [http://localhost:3000](http://localhost:3000) 即可使用。

### 環境設定

建立 `.env.local` 檔案：

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 後台管理

訪問 [http://localhost:3000/admin/login](http://localhost:3000/admin/login) 進入管理員登入頁面。
預設帳號：`admin` / `admin123`

## 📁 專案結構

```
spiritual-advisor-web/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── admin/        # 管理員後台
│   │   └── page.tsx      # 主頁面
│   ├── components/       # React 元件
│   │   ├── IntegrationSection.tsx # 綜合分析與視覺整合
│   │   ├── TarotSection.tsx
│   │   ├── BaziSection.tsx
│   │   ├── HumanDesignSection.tsx
│   │   ├── AstrologySection.tsx
│   │   └── ZiweiSection.tsx
│   └── services/         # API 服務
│       └── api.ts
├── public/               # 靜態資源
└── package.json
```

## 🔧 相關專案

- **後端 API**: [spiritual-ai-advisor](https://github.com/pop15106/spiritual-ai-advisor) - Python Flask API 服務

## 📝 授權

MIT License

## 👤 作者

- GitHub: [@pop15106](https://github.com/pop15106)
