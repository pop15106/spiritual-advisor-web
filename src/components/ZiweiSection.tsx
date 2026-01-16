"use client";

import { useState } from "react";
import { ziweiApi, ZiweiResponse } from "@/services/api";

const HOURS = [
    { value: 0, label: "子時 (23:00-01:00)" },
    { value: 1, label: "丑時 (01:00-03:00)" },
    { value: 2, label: "寅時 (03:00-05:00)" },
    { value: 3, label: "卯時 (05:00-07:00)" },
    { value: 4, label: "辰時 (07:00-09:00)" },
    { value: 5, label: "巳時 (09:00-11:00)" },
    { value: 6, label: "午時 (11:00-13:00)" },
    { value: 7, label: "未時 (13:00-15:00)" },
    { value: 8, label: "申時 (15:00-17:00)" },
    { value: 9, label: "酉時 (17:00-19:00)" },
    { value: 10, label: "戌時 (19:00-21:00)" },
    { value: 11, label: "亥時 (21:00-23:00)" },
];

export default function ZiweiSection() {
    const [ziweiData, setZiweiData] = useState<ZiweiResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [birthDate, setBirthDate] = useState("1990-01-01");
    const [birthHour, setBirthHour] = useState(3);

    const calculateChart = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await ziweiApi.calculate(birthDate, birthHour);
            setZiweiData(response);
        } catch (err) {
            setError("無法連接後端 API，請確認後端服務已啟動");
            console.error("Ziwei API error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <div className="relative -mx-6 -mt-8 mb-10 overflow-hidden rounded-b-3xl">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1507400492013-162706c8c05e?q=80&w=2159&auto=format&fit=crop"
                        alt="Chinese temple"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-violet-900/90 via-purple-900/80 to-slate-900/95"></div>
                </div>
                <div className="relative z-10 px-8 py-16 text-center">
                    <div className="text-6xl mb-4">💜</div>
                    <h1 className="text-4xl md:text-5xl font-semibold text-white mb-3">紫微斗數</h1>
                    <p className="text-violet-200 text-lg max-w-lg mx-auto">
                        東方最精密的命理系統，解讀您的人生藍圖
                    </p>
                </div>
            </div>

            {/* Birth Data Input */}
            {!ziweiData && (
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-8 border border-violet-200 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-3xl">📅</span>
                        <div>
                            <h3 className="text-lg font-semibold text-violet-900">請輸入您的出生資料</h3>
                            <p className="text-sm text-violet-600">紫微斗數需要準確的出生時間來排命盤</p>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-violet-700 mb-1">出生日期 (國曆)</label>
                            <input
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="w-full bg-white border border-violet-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-violet-700 mb-1">出生時辰</label>
                            <select
                                value={birthHour}
                                onChange={(e) => setBirthHour(Number(e.target.value))}
                                className="w-full bg-white border border-violet-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                            >
                                {HOURS.map((h) => (
                                    <option key={h.value} value={h.value}>{h.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={calculateChart}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium py-3 rounded-xl hover:opacity-90 transition-all shadow-lg disabled:opacity-50"
                    >
                        {loading ? "🔄 計算中..." : "💜 開始排命盤"}
                    </button>
                    {error && <p className="mt-4 text-red-500 text-sm text-center">{error}</p>}
                </div>
            )}

            {ziweiData && (
                <>
                    {/* Main Stars */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-200">
                            <div className="text-3xl mb-3">⭐</div>
                            <h3 className="text-sm font-medium text-violet-600 mb-1">命宮主星</h3>
                            <p className="text-2xl font-bold text-violet-900">{ziweiData.main_star}</p>
                        </div>
                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-200">
                            <div className="text-3xl mb-3">🌟</div>
                            <h3 className="text-sm font-medium text-pink-600 mb-1">命主</h3>
                            <p className="text-2xl font-bold text-pink-900">{ziweiData.mingzhu}</p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                            <div className="text-3xl mb-3">✨</div>
                            <h3 className="text-sm font-medium text-amber-600 mb-1">身主</h3>
                            <p className="text-2xl font-bold text-amber-900">{ziweiData.shenzhu}</p>
                        </div>
                    </div>

                    {/* Twelve Palaces */}
                    <div className="bg-white rounded-2xl border border-violet-100 shadow-lg overflow-hidden mb-8">
                        <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4">
                            <h3 className="text-lg font-medium text-white">🏛️ 十二宮位</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                {Object.entries(ziweiData.palaces).map(([palace, star], idx) => (
                                    <div key={idx} className={`rounded-xl p-3 text-center border ${idx === 0 ? 'bg-violet-100 border-violet-300' : 'bg-slate-50 border-slate-200'}`}>
                                        <div className="text-xs text-slate-500 mb-1">{palace}</div>
                                        <div className={`font-semibold ${idx === 0 ? 'text-violet-700' : 'text-slate-700'}`}>{star}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* AI Interpretation */}
                    <div className="bg-white rounded-2xl border border-violet-100 shadow-lg overflow-hidden mb-8">
                        <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4">
                            <h3 className="text-lg font-medium text-white">🔮 AI 命格解析</h3>
                        </div>
                        <div className="p-6">
                            <div className="prose prose-purple max-w-none text-slate-700">
                                {ziweiData.interpretation?.split('\n').map((line, idx) => {
                                    if (line.startsWith('##') || line.match(/^\d\./)) {
                                        return <h4 key={idx} className="text-lg font-bold text-purple-800 mt-4 mb-2">{line.replace('## ', '').replace(/^\d\.\s*/, '')}</h4>;
                                    } else if (line.trim()) {
                                        return <p key={idx} className="text-slate-600 leading-relaxed mb-2">{line}</p>;
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Calculate Again */}
                    <button
                        onClick={() => setZiweiData(null)}
                        className="w-full bg-slate-100 text-slate-600 font-medium py-3 rounded-xl hover:bg-slate-200 transition-all"
                    >
                        重新計算
                    </button>
                </>
            )}
        </div>
    );
}
