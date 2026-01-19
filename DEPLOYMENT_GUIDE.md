# 🚀 Spiritual AI Advisor - 完整部署指南

要讓您的網站真正上線並正常運作，您需要解決兩個關鍵問題：**後端託管**與**Google 登入設定**。以下是完整的操作步驟。

---

## 1. 解決 Google 登入崩潰問題

這是導致您網站一打開就紅字報錯 (Application Error) 的主因。

### 步驟 A: 取得 Google Client ID
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)。
2. 建立一個新專案 (或選擇現有專案)。
3. 在左側選單選擇 **APIs & Services** > **Credentials** (憑證)。
4. 點擊 **Create Credentials** > **OAuth client ID**。
5. Application type 選擇 **Web application**。
6. 設定 **Authorized JavaScript origins** (非常重要)：
   - 加入您的 Vercel 網址，例如：`https://spiritual-advisor-web.vercel.app`
   - (建議也加入本地開發網址 `http://localhost:3000`)
7. 設定 **Authorized redirect URIs**：
   - 同樣加入您的 Vercel 網址。
8. 建立後，複製生成的 **Client ID** (格式如 `...apps.googleusercontent.com`)。

### 步驟 B: 設定 Vercel 環境變數
1. 進到 Vercel 專案 Dashboard。
2. 點擊 **Settings** > **Environment Variables**。
3. 新增變數：
   - Key: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - Value: (剛剛複製的 ID)
4. **重新部署 (Redeploy)**：到 Deployments 頁面，選擇最新的 commit 點擊 Redeploy，或是推一個新 commit。

> ✅ 完成此步後，您的網站將不再崩潰，且「Google 登入」按鈕可正常彈出。

---

## 2. 解決後端連線問題 (Mixed Content)

這是導致「抽牌無反應」或「連線失敗」的原因。您不能讓 Vercel (公網 HTTPS) 連線到 localhost (私網 HTTP)。

### 推薦方案：將後端部署到 Render (免費且支援 Python)

**Render** 是一個雲端託管平台，可以免費跑 Python Flask 應用。

1. **準備後端程式碼**：
   - 確保您的後端程式碼已上傳到 GitHub (例如在 `spiritual-ai-advisor` repo)。
   - 根目錄要有 `requirements.txt`。
   - 根目錄要有 `api.py`。
   - **新增一個 `Run` 檔案 (可選 但建議)**：
     Render 需要知道如何啟動。建議在專案根目錄確認 `api.py` 最後是否有 `if __name__ == '__main__':` 區塊，且支援 `port=int(os.environ.get("PORT", 5000))`。

2. **註冊 Render**：
   - 前往 [render.com](https://render.com/) 註冊帳號。

3. **建立 Web Service**：
   - 點擊 **New +** > **Web Service**。
   - 連結您的 GitHub Repo (`spiritual-ai-advisor`)。
   - 設定如下：
     - **Name**: `spiritual-api` (或其他)
     - **Runtime**: `Python 3`
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `gunicorn api:app` (建議改用 gunicorn 生產環境伺服器) 或 `python api.py`
     - **Instance Type**: Free

4. **設定 Render 環境變數**：
   - 在 Render 的 Environment 頁面加入：
     - `GOOGLE_API_KEYS`: (您的 Gemini API Keys)
     - `JWT_SECRET`: (任意字串)
     - `PYTHON_VERSION`: `3.9.0` (建議指定版本)

5. **取得後端網址**：
   - 部署成功後，Render 會給您一個網址，例如 `https://spiritual-api.onrender.com`。

---

## 3. 連接前後端

最後一步，告訴 Vercel 前端去連線這個新的 Render 後端。

1. 回到 Vercel Dashboard > **Settings** > **Environment Variables**。
2. 修改 (或新增) `NEXT_PUBLIC_API_URL`：
   - Value: `https://spiritual-api.onrender.com` (您的 Render 網址，注意不要加尾部的 `/`)
3. **再次重新部署 (Redeploy)** Vercel 專案。

---

## 總結

| 問題 | 解決方案 |
|------|----------|
| **網站崩潰** | Vercel 新增 `NEXT_PUBLIC_GOOGLE_CLIENT_ID` |
| **無法連線** | 部署後端到 Render，並在 Vercel 更新 `NEXT_PUBLIC_API_URL` |

### 🚀 替代方案 (僅測試用)

如果您不想部署後端，只想用電腦跑：
1. 安裝及註冊 [ngrok](https://ngrok.com/)。
2. 在終端機執行 `ngrok http 5000` (會產生一個 https 網址轉發到您電腦)。
3. 將該 `https://....ngrok-free.app` 網址填入 Vercel 的 `NEXT_PUBLIC_API_URL`。
4. (缺點：每次關閉電腦或重開 ngrok 網址都會變，不適合長期使用)
