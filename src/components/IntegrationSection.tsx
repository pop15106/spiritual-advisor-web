"use client";

import { useState } from "react";

const SYSTEMS = [
    { id: "tarot", name: "塔羅", icon: "🃏", color: "from-purple-600 to-violet-600" },
    { id: "bazi", name: "八字", icon: "☯️", color: "from-red-700 to-amber-600" },
    { id: "humandesign", name: "人類圖", icon: "🧬", color: "from-cyan-600 to-teal-600" },
    { id: "astrology", name: "占星", icon: "⭐", color: "from-indigo-600 to-blue-600" },
    { id: "ziwei", name: "紫微", icon: "💜", color: "from-violet-600 to-purple-600" },
];

export default function IntegrationSection() {
    const [selectedSystems, setSelectedSystems] = useState(["tarot", "bazi", "humandesign"]);
    const [question, setQuestion] = useState("");
    const [showResult, setShowResult] = useState(false);

    const toggleSystem = (id: string) => {
        setSelectedSystems((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    return (
        <div>
            {/* Hero Section - Integration Theme: Rainbow Cosmic */}
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
                    <div className="flex justify-center gap-2 mt-6 flex-wrap">
                        {SYSTEMS.map((sys) => (
                            <span key={sys.id} className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-sm text-white/90 border border-white/20">
                                {sys.icon}
                            </span>
                        ))}
                    </div>
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
                            {selectedSystems.includes(sys.id) && <span className="text-xs opacity-80">✓</span>}
                        </button>
                    ))}
                </div>

                <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">您的問題</label>
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="例如：今年適合換工作嗎？我該如何做這個重大決定？"
                    className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
                    rows={3}
                />

                <button
                    onClick={() => setShowResult(true)}
                    disabled={selectedSystems.length < 2}
                    className="mt-6 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-sm font-medium py-4 rounded-full hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    🔮 開始多系統整合分析
                </button>
            </div>

            {showResult && selectedSystems.length >= 2 && (
                <>
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
                            {selectedSystems.includes("bazi") && (
                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
                                    <h4 className="font-medium text-amber-900 flex items-center gap-2 mb-2">☯️ 八字觀點</h4>
                                    <p className="text-sm text-amber-700">甲木日主配丙火流年，有貴人相助之象</p>
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
                                    <p className="text-sm text-indigo-700">摩羯太陽 + 獅子上升，適合領導角色</p>
                                </div>
                            )}
                            {selectedSystems.includes("ziwei") && (
                                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-5 border border-violet-200">
                                    <h4 className="font-medium text-violet-900 flex items-center gap-2 mb-2">💜 紫微觀點</h4>
                                    <p className="text-sm text-violet-700">紫微坐命，具有領導格局，適合擔當重任</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Integrated Analysis */}
                    <div className="bg-white rounded-2xl border border-indigo-100 shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-5">
                            <h3 className="text-xl font-semibold text-white">✨ 東西方智慧整合分析</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm">1</span>
                                    核心訊息
                                </h4>
                                <p className="text-slate-600 leading-relaxed pl-10">
                                    從塔羅的「命運之輪」、八字的「甲木日主」、人類圖的「生產者」類型來看，
                                    您正處於人生的重要轉折點。命運之輪暗示變化即將來臨，而甲木日主代表您具有開拓進取的特質。
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm">2</span>
                                    觀點差異與互補
                                </h4>
                                <ul className="text-sm text-slate-600 space-y-2 pl-10">
                                    {selectedSystems.includes("tarot") && <li className="flex items-center gap-2"><span className="text-purple-500">🃏</span> 塔羅：星星牌顯示希望與療癒</li>}
                                    {selectedSystems.includes("bazi") && <li className="flex items-center gap-2"><span className="text-amber-500">☯️</span> 八字：2026丙午年對您有利</li>}
                                    {selectedSystems.includes("humandesign") && <li className="flex items-center gap-2"><span className="text-cyan-500">🧬</span> 人類圖：等待正確的機會回應</li>}
                                    {selectedSystems.includes("astrology") && <li className="flex items-center gap-2"><span className="text-indigo-500">⭐</span> 占星：土星回歸帶來成熟</li>}
                                    {selectedSystems.includes("ziwei") && <li className="flex items-center gap-2"><span className="text-violet-500">💜</span> 紫微：紫微星帶來領導機會</li>}
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border border-indigo-100">
                                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white text-sm">3</span>
                                    綜合建議
                                </h4>
                                <div className="space-y-4 pl-10">
                                    <div className="flex gap-4">
                                        <span className="text-2xl">🎯</span>
                                        <div>
                                            <strong className="text-slate-900">把握 2026 年機會</strong>
                                            <p className="text-sm text-slate-500 mt-0.5">丙火流年對您有利，適合展開新計畫</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="text-2xl">🔄</span>
                                        <div>
                                            <strong className="text-slate-900">等待而非追求</strong>
                                            <p className="text-sm text-slate-500 mt-0.5">符合生產者策略，讓機會來找您</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="text-2xl">💪</span>
                                        <div>
                                            <strong className="text-slate-900">發揮領導特質</strong>
                                            <p className="text-sm text-slate-500 mt-0.5">紫微命格適合帶領團隊，不要害怕承擔責任</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
