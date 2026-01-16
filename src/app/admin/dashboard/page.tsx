"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UsageSummary {
    total: number;
    today: number;
    this_month: number;
    by_feature: Record<string, { total: number; today: number; this_month: number }>;
}

const FEATURE_NAMES: Record<string, string> = {
    tarot: "🃏 塔羅牌",
    bazi: "☯️ 八字命理",
    astrology: "⭐ 西洋占星",
    humandesign: "🧬 人類圖",
    ziwei: "💜 紫微斗數",
    integration: "✨ 多系統整合",
};

export default function AdminDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [apiKeyData, setApiKeyData] = useState<{ db_key_masked: string, env_keys: { key: string, full: string }[] } | null>(null);
    const [newApiKey, setNewApiKey] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [usageSummary, setUsageSummary] = useState<UsageSummary | null>(null);
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState<"overview" | "apikey" | "password">("overview");
    const router = useRouter();

    const getToken = () => localStorage.getItem("admin_token");

    const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
        const token = getToken();
        const headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
        return fetch(url, { ...options, headers });
    };

    const verifyAndLoad = async () => {
        try {
            const verifyRes = await fetchWithAuth("http://localhost:5000/api/admin/verify");
            if (!verifyRes.ok) {
                router.push("/admin/login");
                return;
            }

            // Load API key
            const keyRes = await fetchWithAuth("http://localhost:5000/api/admin/api-key");
            const keyData = await keyRes.json();
            if (keyData.success) {
                setApiKeyData(keyData);
            }

            // Load usage summary
            const usageRes = await fetchWithAuth("http://localhost:5000/api/admin/usage/summary");
            const usageData = await usageRes.json();
            if (usageData.success) {
                setUsageSummary(usageData.summary);
            }

            setLoading(false);
        } catch (err) {
            router.push("/admin/login");
        }
    };

    useEffect(() => {
        verifyAndLoad();
    }, []);

    const updateApiKey = async () => {
        if (!newApiKey.trim()) {
            setMessage("請輸入新的 API Key");
            return;
        }

        const res = await fetchWithAuth("http://localhost:5000/api/admin/api-key", {
            method: "PUT",
            body: JSON.stringify({ api_key: newApiKey }),
        });
        const data = await res.json();

        if (data.success) {
            // Reload API key data
            const keyRes = await fetchWithAuth("http://localhost:5000/api/admin/api-key");
            const keyData = await keyRes.json();
            if (keyData.success) setApiKeyData(keyData);

            setNewApiKey("");
            setMessage("✅ API Key 更新成功！");
        } else {
            setMessage("❌ " + data.error);
        }
    };

    const updatePassword = async () => {
        if (newPassword.length < 6) {
            setMessage("密碼長度至少 6 位");
            return;
        }

        const res = await fetchWithAuth("http://localhost:5000/api/admin/password", {
            method: "PUT",
            body: JSON.stringify({ new_password: newPassword }),
        });
        const data = await res.json();

        if (data.success) {
            setNewPassword("");
            setMessage("✅ 密碼更新成功！");
        } else {
            setMessage("❌ " + data.error);
        }
    };

    const logout = () => {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">載入中...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">🔧 管理後台</h1>
                        <p className="text-white/60">Spiritual AI Advisor</p>
                    </div>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                        登出
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {[
                        { id: "overview", label: "📊 使用量統計" },
                        { id: "apikey", label: "🔑 API Key" },
                        { id: "password", label: "🔐 修改密碼" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id as typeof activeTab);
                                setMessage("");
                            }}
                            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id
                                ? "bg-purple-600 text-white"
                                : "bg-white/10 text-white/70 hover:bg-white/20"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Message */}
                {message && (
                    <div className="mb-4 p-3 bg-white/10 border border-white/20 rounded-lg text-white">
                        {message}
                    </div>
                )}

                {/* Overview Tab */}
                {activeTab === "overview" && usageSummary && (
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                                <div className="text-white/60 text-sm mb-1">總使用次數</div>
                                <div className="text-4xl font-bold text-white">{usageSummary.total}</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                                <div className="text-white/60 text-sm mb-1">今日使用</div>
                                <div className="text-4xl font-bold text-green-400">{usageSummary.today}</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                                <div className="text-white/60 text-sm mb-1">本月使用</div>
                                <div className="text-4xl font-bold text-blue-400">{usageSummary.this_month}</div>
                            </div>
                        </div>

                        {/* Feature Breakdown */}
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-semibold text-white mb-4">各功能使用量</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(usageSummary.by_feature).map(([feature, stats]) => (
                                    <div
                                        key={feature}
                                        className="bg-white/5 rounded-xl p-4 border border-white/10"
                                    >
                                        <div className="text-lg font-medium text-white mb-2">
                                            {FEATURE_NAMES[feature] || feature}
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            <div>
                                                <div className="text-white/50">總計</div>
                                                <div className="text-white font-bold">{stats.total}</div>
                                            </div>
                                            <div>
                                                <div className="text-white/50">今日</div>
                                                <div className="text-green-400 font-bold">{stats.today}</div>
                                            </div>
                                            <div>
                                                <div className="text-white/50">本月</div>
                                                <div className="text-blue-400 font-bold">{stats.this_month}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* API Key Tab */}
                {activeTab === "apikey" && (
                    <div className="space-y-6">
                        {/* Env Keys */}
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-semibold text-white mb-4">📁 設定檔 API Keys (.env)</h3>
                            <div className="space-y-3">
                                {(apiKeyData?.env_keys || []).map((item: { key: string, full: string }, idx: number) => (
                                    <div key={idx} className="flex items-center gap-3 bg-white/5 rounded-lg p-3 border border-white/10">
                                        <span className="text-purple-400 font-bold">Key {idx + 1}</span>
                                        <code className="flex-1 text-white/80 font-mono text-sm">{item.key}</code>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(item.full);
                                                setMessage(`✅ Key ${idx + 1} 已複製到剪貼簿`);
                                            }}
                                            className="px-3 py-1 bg-purple-600/50 text-white text-sm rounded hover:bg-purple-600 transition-colors"
                                        >
                                            複製
                                        </button>
                                    </div>
                                ))}
                                {!(apiKeyData?.env_keys?.length) && (
                                    <div className="text-white/50 text-center py-4">尚無設定 API Key</div>
                                )}
                            </div>
                            <p className="text-white/50 text-sm mt-4">
                                💡 這些是從 `.env` 檔案讀取的 API Keys。如需修改，請編輯 `.env` 檔案中的 `GOOGLE_API_KEYS` 變數。
                            </p>
                        </div>

                        {/* DB Key */}
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-semibold text-white mb-4">💾 資料庫 API Key</h3>
                            <div className="mb-4">
                                <label className="block text-white/70 text-sm mb-2">目前儲存的 Key</label>
                                <div className="bg-white/5 rounded-lg p-3 text-white font-mono">
                                    {apiKeyData?.db_key_masked || "未設定"}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-white/70 text-sm mb-2">設定新的 API Key（將覆蓋資料庫中的 Key）</label>
                                <input
                                    type="text"
                                    value={newApiKey}
                                    onChange={(e) => setNewApiKey(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="AIza..."
                                />
                            </div>
                            <button
                                onClick={updateApiKey}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                更新 API Key
                            </button>
                        </div>
                    </div>
                )}

                {/* Password Tab */}
                {activeTab === "password" && (
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                        <h3 className="text-xl font-semibold text-white mb-4">修改密碼</h3>
                        <div className="mb-4">
                            <label className="block text-white/70 text-sm mb-2">新密碼（至少 6 位）</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="請輸入新密碼"
                            />
                        </div>
                        <button
                            onClick={updatePassword}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            更新密碼
                        </button>
                    </div>
                )}

                {/* Back to Home */}
                <div className="mt-8 text-center">
                    <a href="/" className="text-white/50 hover:text-white/80 transition-colors">
                        ← 返回首頁
                    </a>
                </div>
            </div>
        </div>
    );
}
