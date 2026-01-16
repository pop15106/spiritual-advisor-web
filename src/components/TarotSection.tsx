"use client";

import { useState, useEffect } from "react";
import { tarotApi, TarotCard } from "@/services/api";

// Demo 資料已註解，改用 API
/*
const MAJOR_ARCANA = [
    { name: "愚者", id: "ar00" }, { name: "魔術師", id: "ar01" }, { name: "女祭司", id: "ar02" },
    { name: "皇后", id: "ar03" }, { name: "皇帝", id: "ar04" }, { name: "教皇", id: "ar05" },
    { name: "戀人", id: "ar06" }, { name: "戰車", id: "ar07" }, { name: "力量", id: "ar08" },
    { name: "隱士", id: "ar09" }, { name: "命運之輪", id: "ar10" }, { name: "正義", id: "ar11" },
    { name: "倒吊人", id: "ar12" }, { name: "死神", id: "ar13" }, { name: "節制", id: "ar14" },
    { name: "惡魔", id: "ar15" }, { name: "高塔", id: "ar16" }, { name: "星星", id: "ar17" },
    { name: "月亮", id: "ar18" }, { name: "太陽", id: "ar19" }, { name: "審判", id: "ar20" },
    { name: "世界", id: "ar21" },
];
*/

export default function TarotSection() {
    const [question, setQuestion] = useState("");
    const [cards, setCards] = useState<TarotCard[]>([]);
    const [positions, setPositions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const drawCards = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await tarotApi.draw(3);
            setCards(response.cards);
            setPositions(response.positions);
        } catch (err) {
            setError("無法連接後端 API，請確認後端服務已啟動");
            console.error("Tarot API error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Hero Section - Tarot Theme: Mystical Purple */}
            <div className="relative -mx-6 -mt-8 mb-10 overflow-hidden rounded-b-3xl">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1601369499799-0fa4dc67c7c6?q=80&w=2070&auto=format&fit=crop"
                        alt="Tarot cards"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-900/90 via-purple-900/80 to-purple-900/95"></div>
                </div>
                <div className="relative z-10 px-8 py-16 text-center">
                    <div className="text-6xl mb-4">🃏</div>
                    <h1 className="text-4xl md:text-5xl font-semibold text-white mb-3">塔羅占卜</h1>
                    <p className="text-purple-200 text-lg max-w-xl mx-auto">
                        透過78張偉特塔羅牌的神秘智慧，探索您內心深處的答案
                    </p>
                    <div className="flex justify-center gap-4 mt-6">
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80">過去</span>
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80">現在</span>
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80">未來</span>
                    </div>
                </div>
            </div>

            {/* Question Input */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-100 mb-8">
                <label className="block text-sm font-medium text-purple-900 mb-3">❓ 請在心中默想您的問題</label>
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="例如：我的感情運勢如何？最近適合換工作嗎？"
                    className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                />

                <button
                    onClick={drawCards}
                    disabled={loading}
                    className="mt-6 w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white text-sm font-medium py-4 rounded-full hover:from-purple-700 hover:to-violet-700 transition-all shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 disabled:opacity-50"
                >
                    {loading ? "🔄 抽牌中..." : "✨ 抽取三張牌"}
                </button>

                {error && (
                    <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
                )}
            </div>

            {/* Drawn Cards */}
            {cards.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-medium text-zinc-900 mb-6 text-center">📜 您抽到的牌</h3>
                    <div className="grid grid-cols-3 gap-6">
                        {cards.map((card, idx) => (
                            <div key={idx} className="group">
                                <div className="aspect-[2/3] bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl overflow-hidden border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
                                    <img
                                        src={card.imageUrl}
                                        alt={card.name}
                                        className={`w-full h-full object-cover ${card.reversed ? "rotate-180" : ""}`}
                                    />
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-xs text-purple-600 font-semibold uppercase tracking-wider">
                                        {positions[idx] || ["過去", "現在", "未來"][idx]}
                                    </p>
                                    <p className="text-base font-medium text-zinc-900 mt-1">
                                        {card.name}
                                    </p>
                                    <p className={`text-sm ${card.reversed ? "text-red-500" : "text-emerald-500"}`}>
                                        {card.reversed ? "逆位 ↓" : "正位 ↑"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Reading */}
            {cards.length > 0 && (
                <div className="bg-white rounded-2xl border border-purple-100 shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-6 py-4">
                        <h3 className="text-lg font-medium text-white">🔮 塔羅解讀</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        {cards.map((card, idx) => (
                            <div key={idx} className="border-l-4 border-purple-400 pl-6 py-3">
                                <h4 className="font-semibold text-zinc-900 mb-2">
                                    <span className="text-purple-600">{positions[idx] || ["過去", "現在", "未來"][idx]}</span> · {card.name}
                                    <span className={`ml-2 text-sm ${card.reversed ? "text-red-500" : "text-emerald-500"}`}>
                                        {card.reversed ? "(逆位)" : "(正位)"}
                                    </span>
                                </h4>

                                {/* Card Meaning */}
                                <p className="text-zinc-600 mb-3 leading-relaxed">
                                    {card.meaning}
                                </p>

                                {/* Keywords */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {card.keywords.split("、").map((keyword, kidx) => (
                                        <span
                                            key={kidx}
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${card.reversed
                                                    ? "bg-red-50 text-red-600 border border-red-200"
                                                    : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                                }`}
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>

                                {/* Position Context */}
                                <p className="text-sm text-zinc-400 italic">
                                    {idx === 0 && "💫 過去的能量影響：這張牌揭示了您過去的經歷，它塑造了您現在的處境。"}
                                    {idx === 1 && "⚡ 現在的狀態：這張牌反映您當前的挑戰與機會。注意它帶來的直覺感受。"}
                                    {idx === 2 && "🌟 未來的指引：這張牌暗示可能的發展方向。記住，未來是可以改變的。"}
                                </p>
                            </div>
                        ))}

                        <div className="mt-6 p-5 bg-purple-50 rounded-xl border border-purple-100">
                            <h4 className="font-medium text-purple-900 mb-2">💜 綜合建議</h4>
                            <p className="text-purple-800/80 leading-relaxed">
                                根據這三張牌的組合，宇宙正在向您傳達一個訊息：順應當下的能量流動，
                                保持開放的心態面對變化。過去已經過去，未來充滿可能，把握現在才是關鍵。
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
