"use client";

import { useState } from "react";
import { baziApi, BaziResponse } from "@/services/api";

// Demo 資料已註解，改用 API
/*
const DEMO_BAZI = {
    yearGan: "庚", yearZhi: "午",
    monthGan: "己", monthZhi: "丑",
    dayGan: "甲", dayZhi: "子",
    hourGan: "丙", hourZhi: "寅",
};

const FORTUNE_DATA = [
    { year: 2024, score: 6.5, ganzhi: "甲辰" },
    { year: 2025, score: 7.2, ganzhi: "乙巳" },
    { year: 2026, score: 8.5, ganzhi: "丙午" },
    { year: 2027, score: 7.0, ganzhi: "丁未" },
    { year: 2028, score: 5.5, ganzhi: "戊申" },
    { year: 2029, score: 6.8, ganzhi: "己酉" },
];
*/

const HOUR_MAP: Record<string, number> = {
    "子時 (23-01)": 0, "丑時 (01-03)": 1, "寅時 (03-05)": 2, "卯時 (05-07)": 3,
    "辰時 (07-09)": 4, "巳時 (09-11)": 5, "午時 (11-13)": 6, "未時 (13-15)": 7,
    "申時 (15-17)": 8, "酉時 (17-19)": 9, "戌時 (19-21)": 10, "亥時 (21-23)": 11,
};

export default function BaziSection() {
    const [birthDate, setBirthDate] = useState("1990-01-15");
    const [birthHour, setBirthHour] = useState("寅時 (03-05)");
    const [baziData, setBaziData] = useState<BaziResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getScoreColor = (score: number) => {
        if (score >= 7) return "bg-emerald-500";
        if (score >= 5.5) return "bg-amber-500";
        return "bg-rose-500";
    };

    const calculateBazi = async () => {
        setLoading(true);
        setError(null);
        try {
            const hourIndex = HOUR_MAP[birthHour] ?? 2;
            const response = await baziApi.calculate(birthDate, hourIndex);
            setBaziData(response);
        } catch (err) {
            setError("無法連接後端 API，請確認後端服務已啟動");
            console.error("Bazi API error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Hero Section - Bazi Theme: Traditional Chinese Red & Gold */}
            <div className="relative -mx-6 -mt-8 mb-10 overflow-hidden rounded-b-3xl">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2069&auto=format&fit=crop"
                        alt="Chinese calligraphy"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-red-900/90 via-red-900/85 to-amber-900/95"></div>
                </div>
                <div className="relative z-10 px-8 py-16 text-center">
                    <div className="text-6xl mb-4">☯️</div>
                    <h1 className="text-4xl md:text-5xl font-semibold text-white mb-3">八字命理</h1>
                    <p className="text-amber-200 text-lg max-w-xl mx-auto">
                        源自千年中華智慧，從四柱八字解析您的天命格局
                    </p>
                    <div className="flex justify-center gap-3 mt-6">
                        {["年柱", "月柱", "日柱", "時柱"].map((pillar, idx) => (
                            <span key={idx} className="px-4 py-2 bg-amber-500/20 backdrop-blur-sm rounded-lg text-sm text-amber-100 border border-amber-400/30">
                                {pillar}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Input Form */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-amber-900 mb-2">📅 出生日期 (國曆)</label>
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full bg-white border border-amber-200 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-amber-900 mb-2">⏰ 出生時辰</label>
                        <select
                            value={birthHour}
                            onChange={(e) => setBirthHour(e.target.value)}
                            className="w-full bg-white border border-amber-200 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:border-amber-500 transition-all"
                        >
                            <option value="子時 (23-01)">子時 (23:00-01:00)</option>
                            <option value="丑時 (01-03)">丑時 (01:00-03:00)</option>
                            <option value="寅時 (03-05)">寅時 (03:00-05:00)</option>
                            <option value="卯時 (05-07)">卯時 (05:00-07:00)</option>
                            <option value="辰時 (07-09)">辰時 (07:00-09:00)</option>
                            <option value="巳時 (09-11)">巳時 (09:00-11:00)</option>
                            <option value="午時 (11-13)">午時 (11:00-13:00)</option>
                            <option value="未時 (13-15)">未時 (13:00-15:00)</option>
                            <option value="申時 (15-17)">申時 (15:00-17:00)</option>
                            <option value="酉時 (17-19)">酉時 (17:00-19:00)</option>
                            <option value="戌時 (19-21)">戌時 (19:00-21:00)</option>
                            <option value="亥時 (21-23)">亥時 (21:00-23:00)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-amber-900 mb-2">👤 性別</label>
                        <div className="flex gap-3">
                            <button className="flex-1 py-3 rounded-xl bg-red-700 text-white text-sm font-medium shadow-md">乾造 (男)</button>
                            <button className="flex-1 py-3 rounded-xl bg-white border border-amber-200 text-zinc-600 text-sm font-medium hover:border-amber-400 transition-colors">坤造 (女)</button>
                        </div>
                    </div>
                </div>

                <button
                    onClick={calculateBazi}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-700 to-amber-600 text-white text-sm font-medium py-4 rounded-full hover:from-red-800 hover:to-amber-700 transition-all shadow-lg shadow-amber-200 disabled:opacity-50"
                >
                    {loading ? "🔄 計算中..." : "🔮 排盤分析"}
                </button>

                {error && (
                    <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
                )}
            </div>

            {baziData && (
                <>
                    {/* Four Pillars */}
                    <div className="bg-white rounded-2xl border border-amber-100 shadow-lg overflow-hidden mb-8">
                        <div className="bg-gradient-to-r from-red-700 to-amber-600 px-6 py-4">
                            <h3 className="text-lg font-medium text-white">📜 八字命盤</h3>
                        </div>
                        <div className="p-8">
                            <div className="flex justify-center gap-4">
                                {[
                                    { label: "年柱", gan: baziData.year_gan, zhi: baziData.year_zhi, element: "金" },
                                    { label: "月柱", gan: baziData.month_gan, zhi: baziData.month_zhi, element: "土" },
                                    { label: "日柱", gan: baziData.day_gan, zhi: baziData.day_zhi, highlight: true, element: "木" },
                                    { label: "時柱", gan: baziData.hour_gan, zhi: baziData.hour_zhi, element: "火" },
                                ].map((pillar, idx) => (
                                    <div
                                        key={idx}
                                        className={`text-center p-5 rounded-xl min-w-[90px] border-2 transition-all hover:-translate-y-1 ${pillar.highlight
                                            ? "bg-gradient-to-b from-red-600 to-red-700 text-white border-transparent shadow-lg"
                                            : "bg-gradient-to-b from-amber-50 to-orange-50 text-zinc-900 border-amber-200"
                                            }`}
                                    >
                                        <div className="text-3xl font-bold">{pillar.gan}</div>
                                        <div className="text-3xl font-bold mt-1">{pillar.zhi}</div>
                                        <div className={`text-xs mt-3 font-medium ${pillar.highlight ? "text-amber-200" : "text-amber-700"}`}>
                                            {pillar.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-center text-sm text-zinc-500 mt-6">
                                日主 <span className="text-emerald-600 font-semibold">{baziData.day_master}木</span> · 農曆: {baziData.lunar}
                            </p>
                        </div>
                    </div>

                    {/* Fortune Chart */}
                    <div className="bg-white rounded-2xl border border-amber-100 shadow-lg overflow-hidden mb-8">
                        <div className="bg-gradient-to-r from-red-700 to-amber-600 px-6 py-4">
                            <h3 className="text-lg font-medium text-white">📈 流年運勢走勢</h3>
                        </div>
                        <div className="p-8">
                            <div className="flex items-end justify-between gap-4" style={{ height: "180px" }}>
                                {baziData.liunian.map((item, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center group">
                                        <div className="flex-1 w-full flex items-end">
                                            <div
                                                className={`w-full rounded-t-lg ${getScoreColor(item.score)} transition-all group-hover:opacity-80`}
                                                style={{ height: `${item.score * 10}%` }}
                                            />
                                        </div>
                                        <div className="text-xs text-zinc-600 mt-2 font-medium">{item.year}</div>
                                        <div className="text-xs text-amber-600">{item.ganzhi}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center gap-6 text-xs text-zinc-500 mt-6 pt-4 border-t border-zinc-100">
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> 旺盛 (7-10)</span>
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500"></span> 平穩 (5.5-7)</span>
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500"></span> 低迷 (0-5.5)</span>
                            </div>
                        </div>
                    </div>

                    {/* AI 命理解析 */}
                    <div className="bg-white rounded-2xl border border-amber-100 shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-red-700 to-amber-600 px-6 py-4">
                            <h3 className="text-lg font-medium text-white">🔮 AI 命理解析</h3>
                        </div>
                        <div className="p-6">
                            <div className="prose prose-amber max-w-none text-slate-700">
                                {baziData.interpretation.split('\n').map((line, idx) => {
                                    if (line.startsWith('##')) {
                                        return <h4 key={idx} className="text-lg font-bold text-amber-800 mt-4 mb-2">{line.replace('## ', '')}</h4>;
                                    } else if (line.startsWith('**') || line.match(/^\d\./)) {
                                        return (
                                            <p key={idx} className="mb-2 font-medium" dangerouslySetInnerHTML={{
                                                __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-red-700">$1</strong>')
                                            }} />
                                        );
                                    } else if (line.trim()) {
                                        return <p key={idx} className="text-slate-600 leading-relaxed mb-2">{line}</p>;
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
