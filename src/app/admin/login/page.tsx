"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:5000/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("admin_token", data.token);
                router.push("/admin/dashboard");
            } else {
                setError(data.error || "登入失敗");
            }
        } catch (err) {
            setError("無法連接伺服器");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
                    <div className="text-center mb-8">
                        <div className="text-5xl mb-4">🔐</div>
                        <h1 className="text-2xl font-bold text-white">管理員登入</h1>
                        <p className="text-white/60 text-sm mt-2">Spiritual AI Advisor 後台管理</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-white/80 text-sm mb-2">帳號</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="請輸入帳號"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-white/80 text-sm mb-2">密碼</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="請輸入密碼"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                        >
                            {loading ? "登入中..." : "登入"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <a href="/" className="text-white/50 hover:text-white/80 text-sm transition-colors">
                            ← 返回首頁
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
