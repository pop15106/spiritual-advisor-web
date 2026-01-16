"use client";

import { useState } from "react";
import { integrationApi, IntegrationResponse, baziApi, BaziResponse } from "@/services/api";

const SYSTEMS = [
    { id: "tarot", name: "塔羅", icon: "🃏", color: "from-purple-600 to-violet-600", needsBirthData: false },
    { id: "bazi", name: "八字", icon: "☯️", color: "from-red-700 to-amber-600", needsBirthData: true },
    { id: "humandesign", name: "人類圖", icon: "🧬", color: "from-cyan-600 to-teal-600", needsBirthData: true },
    { id: "astrology", name: "占星", icon: "⭐", color: "from-indigo-600 to-blue-600", needsBirthData: true },
    { id: "ziwei", name: "紫微", icon: "💜", color: "from-violet-600 to-purple-600", needsBirthData: true },
];

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

export default function IntegrationSection() {
    const [selectedSystems, setSelectedSystems] = useState(["tarot", "bazi", "humandesign"]);
    const [question, setQuestion] = useState("");
    const [birthDate, setBirthDate] = useState("1990-01-01");
    const [birthHour, setBirthHour] = useState(3);
    const [result, setResult] = useState<IntegrationResponse | null>(null);
    const [baziData, setBaziData] = useState<BaziResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggleSystem = (id: string) => {
        setSelectedSystems((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    // Check if any selected system needs birth data
    const needsBirthData = selectedSystems.some(
        sysId => SYSTEMS.find(s => s.id === sysId)?.needsBirthData
    );

    const analyzeIntegration = async () => {
        if (selectedSystems.length < 2) return;

        setLoading(true);
        setError(null);

        try {
            // If needs birth data, first calculate bazi to get the chart
            let baziResult: BaziResponse | null = null;
            if (needsBirthData) {
                baziResult = await baziApi.calculate(birthDate, birthHour);
                setBaziData(baziResult);
            }

            // Build enriched question with birth data context
            let enrichedQuestion = question || "今年適合換工作嗎？";
            if (baziResult && baziResult.success) {
                enrichedQuestion += `\n\n[用戶命盤資料]\n`;
                enrichedQuestion += `八字：${baziResult.year_gan}${baziResult.year_zhi} ${baziResult.month_gan}${baziResult.month_zhi} ${baziResult.day_gan}${baziResult.day_zhi} ${baziResult.hour_gan}${baziResult.hour_zhi}\n`;
                enrichedQuestion += `日主：${baziResult.day_master}\n`;
                enrichedQuestion += `農曆：${baziResult.lunar}`;
            }

            const response = await integrationApi.analyze(enrichedQuestion);
            setResult(response);
        } catch (err) {
            setError("無法連接後端 API，請確認後端服務已啟動");
            console.error("Integration API error:", err);
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
                        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                        alt="Earth from space"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-indigo-900/80 to-purple-900/95"></div>
                </div>
                <div className="relative z-10 px-8 py-16 text-center">
                    <div className="text-6xl mb-4">🌐</div>
                    <h1 className="text-4xl md:text-5xl font-semibold text-white mb-3">多系統整合分析</h1>
                    <p className="text-indigo-200 text-lg max-w-xl mx-auto">
                        融合東西方五大命理智慧，AI 給出最全面的綜合建議
                    </p>
                </div>
            </div>

            {/* System Selection */}
            <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl p-8 border border-indigo-100 mb-8">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">選擇分析系統 (至少2個)</h3>
                <div className="flex flex-wrap gap-3 mb-6">
                    {SYSTEMS.map((sys) => (
                        <button
                            key={sys.id}
                            onClick={() => toggleSystem(sys.id)}
                            className={`px-5 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${selectedSystems.includes(sys.id)
                                ? `bg-gradient-to-r ${sys.color} text-white shadow-lg`
                                : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
                                }`}
                        >
                            <span className="text-lg">{sys.icon}</span>
                            <span>{sys.name}</span>
                            {sys.needsBirthData && <span className="text-xs opacity-60">📅</span>}
                            {selectedSystems.includes(sys.id) && <span className="text-xs opacity-80">✓</span>}
                        </button>
                    ))}
                </div>

                {/* Birth Data Input - Only show if needed */}
                {needsBirthData && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl">📅</span>
                            <h4 className="font-semibold text-amber-800">請輸入出生資料</h4>
                            <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                                八字、人類圖、占星、紫微需要
                            </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-amber-700 mb-1">出生日期 (國曆)</label>
                                <input
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    className="w-full bg-white border border-amber-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-amber-700 mb-1">出生時辰</label>
                                <select
                                    value={birthHour}
                                    onChange={(e) => setBirthHour(Number(e.target.value))}
                                    className="w-full bg-white border border-amber-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                                >
                                    {HOURS.map((h) => (
                                        <option key={h.value} value={h.value}>{h.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">您的問題</label>
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="例如：今年適合換工作嗎？我該如何做這個重大決定？"
                    className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
                    rows={3}
                />

                <button
                    onClick={analyzeIntegration}
                    disabled={selectedSystems.length < 2 || loading}
                    className="mt-6 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-sm font-medium py-4 rounded-full hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "🔄 分析中..." : "🔮 開始多系統整合分析"}
                </button>

                {error && (
                    <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
                )}
            </div>

            {result && (
                <>
                    {/* Birth Chart Summary (if available) */}
                    {baziData && baziData.success && (
                        <div className="mb-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                            <h3 className="text-lg font-medium text-amber-900 mb-4">📋 您的命盤資料</h3>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="bg-white rounded-lg px-4 py-2 border border-amber-200">
                                    <span className="text-amber-600">八字：</span>
                                    <span className="font-semibold text-amber-900">
                                        {baziData.year_gan}{baziData.year_zhi} {baziData.month_gan}{baziData.month_zhi} {baziData.day_gan}{baziData.day_zhi} {baziData.hour_gan}{baziData.hour_zhi}
                                    </span>
                                </div>
                                <div className="bg-white rounded-lg px-4 py-2 border border-amber-200">
                                    <span className="text-amber-600">日主：</span>
                                    <span className="font-semibold text-red-600">{baziData.day_master}</span>
                                </div>
                                <div className="bg-white rounded-lg px-4 py-2 border border-amber-200">
                                    <span className="text-amber-600">農曆：</span>
                                    <span className="font-semibold text-amber-900">{baziData.lunar}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Individual Results */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-slate-900 mb-4">📊 各系統觀點</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            {selectedSystems.includes("tarot") && (
                                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-200">
                                    <h4 className="font-medium text-purple-900 flex items-center gap-2 mb-2">🃏 塔羅觀點</h4>
                                    <p className="text-sm text-purple-700">命運之輪 + 星星 + 戰車：變化中有希望，但需調整方向</p>
                                </div>
                            )}
                            {selectedSystems.includes("bazi") && baziData && (
                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
                                    <h4 className="font-medium text-amber-900 flex items-center gap-2 mb-2">☯️ 八字觀點</h4>
                                    <p className="text-sm text-amber-700">{baziData.day_master}日主，{baziData.lunar}</p>
                                </div>
                            )}
                            {selectedSystems.includes("humandesign") && (
                                <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-5 border border-cyan-200">
                                    <h4 className="font-medium text-cyan-900 flex items-center gap-2 mb-2">🧬 人類圖觀點</h4>
                                    <p className="text-sm text-cyan-700">生產者應「等待回應」，不宜主動發起</p>
                                </div>
                            )}
                            {selectedSystems.includes("astrology") && (
                                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-200">
                                    <h4 className="font-medium text-indigo-900 flex items-center gap-2 mb-2">⭐ 占星觀點</h4>
                                    <p className="text-sm text-indigo-700">根據星盤分析您的運勢趨勢</p>
                                </div>
                            )}
                            {selectedSystems.includes("ziwei") && (
                                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-5 border border-violet-200">
                                    <h4 className="font-medium text-violet-900 flex items-center gap-2 mb-2">💜 紫微觀點</h4>
                                    <p className="text-sm text-violet-700">紫微斗數命盤分析</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Integrated Analysis */}
                    <div className="bg-white rounded-2xl border border-indigo-100 shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-5">
                            <h3 className="text-xl font-semibold text-white">✨ 東西方智慧整合分析</h3>
                            {result.source === "gemini" && (
                                <span className="inline-block mt-2 px-2 py-0.5 bg-white/20 rounded text-xs text-white/80">
                                    由 Gemini AI 生成
                                </span>
                            )}
                        </div>
                        <div className="p-6">
                            <div className="prose prose-slate max-w-none">
                                {result.analysis.split('\n').map((line, idx) => {
                                    if (line.startsWith('## ')) {
                                        return <h2 key={idx} className="text-xl font-bold text-slate-900 mt-6 mb-3">{line.replace('## ', '')}</h2>;
                                    } else if (line.startsWith('- **')) {
                                        return (
                                            <div key={idx} className="flex items-start gap-2 my-2">
                                                <span className="text-indigo-500 mt-1">•</span>
                                                <span className="text-slate-600" dangerouslySetInnerHTML={{
                                                    __html: line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>')
                                                }} />
                                            </div>
                                        );
                                    } else if (line.match(/^\d\./)) {
                                        return (
                                            <div key={idx} className="flex items-start gap-3 my-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                                                <span className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center shrink-0">{line.match(/^\d/)?.[0]}</span>
                                                <span className="text-slate-700" dangerouslySetInnerHTML={{
                                                    __html: line.replace(/^\d\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                }} />
                                            </div>
                                        );
                                    } else if (line.trim()) {
                                        return <p key={idx} className="text-slate-600 leading-relaxed my-2">{line}</p>;
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
