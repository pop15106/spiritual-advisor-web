"use client";

import { useState } from "react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (apiKey: string) => void;
}

export default function ApiKeyModal({ isOpen, onClose, onSubmit }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!apiKey.trim()) {
      setError("請輸入 API Key");
      return;
    }

    setIsValidating(true);

    try {
      const response = await fetch("http://localhost:5000/api/validate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        // 儲存到 localStorage
        localStorage.setItem("user_api_key", apiKey.trim());
        onSubmit(apiKey.trim());
      } else {
        setError(data.error || "驗證失敗");
      }
    } catch {
      setError("無法連接到伺服器");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-zinc-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">✨</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">啟動 AI 靈性導師</h2>
              <p className="text-zinc-400 text-xs">連結 Google Gemini 智慧核心，開啟深度對話</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-5">
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Google Gemini API 金鑰
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all text-sm bg-zinc-50"
                disabled={isValidating}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 text-xs font-medium"
              >
                {showKey ? "隱藏" : "顯示"}
              </button>
            </div>

            {error && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <span>⚠️</span> {error}
              </p>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4 mb-5">
            <p className="text-xs text-zinc-600 leading-relaxed">
              <span className="font-semibold text-zinc-700">如何獲取專屬金鑰？</span><br />
              1. 前往{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline font-medium"
              >
                Google AI Studio
              </a><br />
              2. 登入 Google 帳號<br />
              3. 點擊「Create API Key」建立金鑰
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-zinc-200 text-zinc-600 text-sm font-medium rounded-xl hover:bg-zinc-50 transition-colors"
              disabled={isValidating}
            >
              暫不開啟
            </button>
            <button
              type="submit"
              disabled={isValidating || !apiKey.trim()}
              className="flex-1 px-4 py-3 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isValidating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  驗證中...
                </>
              ) : (
                "啟動連結"
              )}
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-zinc-400 mt-4">
            您的金鑰僅儲存於本地裝置，保障隱私安全
          </p>
        </form>
      </div>
    </div>
  );
}
