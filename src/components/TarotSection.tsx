"use client";

import { useState, useEffect } from "react";
import { tarotApi, TarotCard } from "@/services/api";

// RWS 塔羅牌圖片對照表 (Wikipedia Commons)
// RWS 塔羅牌圖片對照表 (Major Arcana) - 本地靜態資源
const MAJOR_ARCANA_FILES: Record<string, string> = {
    "愚者": "Major_00.jpg",
    "魔術師": "Major_01.jpg",
    "女祭司": "Major_02.jpg",
    "皇后": "Major_03.jpg",
    "皇帝": "Major_04.jpg",
    "教皇": "Major_05.jpg",
    "戀人": "Major_06.jpg",
    "戰車": "Major_07.jpg",
    "力量": "Major_08.jpg",
    "隱士": "Major_09.jpg",
    "命運之輪": "Major_10.jpg",
    "正義": "Major_11.jpg",
    "倒吊人": "Major_12.jpg",
    "死神": "Major_13.jpg",
    "節制": "Major_14.jpg",
    "惡魔": "Major_15.jpg",
    "高塔": "Major_16.jpg",
    "星星": "Major_17.jpg",
    "月亮": "Major_18.jpg",
    "太陽": "Major_19.jpg",
    "審判": "Major_20.jpg",
    "世界": "Major_21.jpg",
};

const getCardImageUrl = (cardName: string): string => {
    // 本地資源路徑
    const LOCAL_BASE = "/tarot/";

    // 1. 大阿爾克那 (Major Arcana)
    for (const [name, filename] of Object.entries(MAJOR_ARCANA_FILES)) {
        if (cardName.includes(name)) return `${LOCAL_BASE}${filename}`;
    }

    // 2. 小阿爾克那 (Minor Arcana)
    // 解析花色
    let suit = "";
    if (cardName.includes("Wands") || cardName.includes("權杖")) suit = "Wands";
    else if (cardName.includes("Cups") || cardName.includes("聖杯")) suit = "Cups";
    else if (cardName.includes("Swords") || cardName.includes("寶劍")) suit = "Swords";
    else if (cardName.includes("Pentacles") || cardName.includes("錢幣") || cardName.includes("五角星")) suit = "Pentacles";

    if (suit) {
        let rank = "";
        // 解析數字/宮廷
        if (cardName.includes("Ace") || cardName.includes("王牌")) rank = "Ace";
        else if (cardName.includes("Page") || cardName.includes("侍者")) rank = "Page";
        else if (cardName.includes("Knight") || cardName.includes("騎士")) rank = "Knight";
        else if (cardName.includes("Queen") || cardName.includes("皇后")) rank = "Queen";
        else if (cardName.includes("King") || cardName.includes("國王")) rank = "King";
        else {
            // 嘗試抓取數字
            const match = cardName.match(/(\d+)/);
            if (match) {
                const num = parseInt(match[1]);
                if (num >= 2 && num <= 10) {
                    rank = num < 10 ? `0${num}` : `${num}`;
                }
            }
        }

        if (rank) {
            // 檔名格式: Wands_Ace.jpg, Cups_05.jpg
            const filename = `${suit}_${rank}.jpg`;
            return `${LOCAL_BASE}${filename}`;
        }
    }

    // 預設牌背
    return `${LOCAL_BASE}Card_Back.jpg`;
};


export default function TarotSection() {
    const [question, setQuestion] = useState("");
    const [spreadType, setSpreadType] = useState<string>("AI Decides");
    const [cards, setCards] = useState<TarotCard[]>([]);
    const [positions, setPositions] = useState<string[]>([]);
    const [spreadName, setSpreadName] = useState("");
    const [interpretation, setInterpretation] = useState("");
    const [yesNoResult, setYesNoResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showGuide, setShowGuide] = useState(false);
    const [guideStep, setGuideStep] = useState(0);
    const [guideAnswers, setGuideAnswers] = useState<string[]>([]);
    const [isSpreadOpen, setIsSpreadOpen] = useState(false); // Custom dropdown state

    // Spread Options
    const SPREAD_OPTIONS = [
        { label: "🤖 AI 大師決斷 (推薦)", value: "AI Decides", desc: "由 AI 塔羅大師根據您的問題，自動選擇最適合的牌陣。" },
        { label: "⏳ 聖三角時間流", value: "聖三角時間流", desc: "經典的三張牌陣，展示【過去】、【現在】、【未來】的時間脈絡，適合分析事情的演變。" },
        { label: "🧘 身心靈檢測", value: "身心靈檢測", desc: "分析您當下的【身體】、【心理】、【靈性】狀態，提供全方位的自我檢視與建議。" },
        { label: "⚖️ 二擇一牌陣", value: "二擇一", desc: "當您面臨兩個選擇時，分別分析【選擇A】與【選擇B】的可能發展與結果。" },
        { label: "❤️ 關係發展牌陣", value: "關係發展", desc: "專注於人際或感情關係，分析【您的看法】、【對方的看法】、【阻礙】與【未來發展】。" },
        { label: "✡️ 六芒星牌陣", value: "六芒星", desc: "七張牌的深入分析，涵蓋【過去、現在、未來、建議、環境、阻礙、結果】，適合具體且複雜的問題。" },
        { label: "✝️ 塞爾特十字", value: "塞爾特十字", desc: "最經典的十張牌大牌陣，全方位解析現況、阻礙、潛意識、過去、未來及最終結果，適合重大人生課題。" },
        { label: "❓ 是非題占卜", value: "是非題", desc: "抽三張牌，根據正逆位數量判斷「是」或「否」，適合封閉式問題。" },
        { label: "💡 問題解決牌陣", value: "問題解決", desc: "三張牌分析問題核心、阻礙原因、解決方案，適合尋找突破點。" },
        { label: "💎 鑽石牌陣", value: "鑽石牌陣", desc: "四張牌呈菱形排列，分析現況、阻礙、潛力與解決方案。" },
        { label: "🧲 馬蹄鐵牌陣", value: "馬蹄鐵", desc: "七張牌呈倒V形，涵蓋過去、現在、未來、建議、環境、態度與結果。" },
        { label: "💕 戀人金字塔", value: "戀人金字塔", desc: "五張牌專為感情設計，分析雙方現況、關係核心、挑戰與建議。" },
        { label: "💗 心之聲牌陣", value: "心之聲", desc: "五張牌探索感情中的深層想法與真實情緒。" },
        { label: "🌌 黃道十二宮", value: "黃道十二宮", desc: "十二張牌對應星座宮位，進行年度運勢或人生綜合分析。" }
    ];

    // 引導提問問題集
    const guideQuestions = [
        {
            question: "您想占卜的領域是？",
            options: ["感情", "事業", "學業", "財運", "人際", "健康", "家庭", "自我成長", "其他"]
        },
        {
            question: "您想了解的具體情況是？",
            options: ["現況分析", "未來發展", "問題解決", "選擇建議", "潛在阻礙", "機會把握", "個人特質", "關係互動"]
        },
        {
            question: "您最想知道的結果或建議是？",
            options: ["如何改善現狀", "最佳行動方案", "潛在的風險", "如何提升運勢", "對方的真實想法", "我的優勢與劣勢", "最終的結果"]
        }
    ];

    const handleAnalyze = async (isDailyDraw: boolean) => {
        setError(null);
        setLoading(true);
        setCards([]);
        setInterpretation("");
        setSpreadName("");
        setPositions([]);
        setYesNoResult(null);

        try {
            let selectedSpreadType = spreadType;
            let currentQuestion = question;

            if (isDailyDraw) {
                selectedSpreadType = "每日一抽";
                currentQuestion = "今日運勢指引";
            } else if (!currentQuestion.trim()) {
                setError("請輸入您的問題，或選擇每日一抽。");
                setLoading(false);
                return;
            }

            await tarotApi.analyzeStream(
                currentQuestion,
                selectedSpreadType,
                // onData (Initial cards)
                (data) => {
                    setCards(data.cards);
                    setPositions(data.positions);
                    setSpreadName(data.spread || "塔羅牌陣");
                    if (data.yes_no_result) {
                        setYesNoResult(data.yes_no_result);
                    }
                },
                // onChunk (AI Text)
                (chunk) => {
                    setInterpretation(prev => prev + chunk);
                },
                // onDone
                () => {
                    setLoading(false);
                },
                // onError
                (err) => {
                    console.error("Tarot Analysis Failed:", err);
                    setError("無法連接後端 API，請確認後端服務已啟動");
                    setLoading(false);
                },
                // onReset (模型切換時清空之前的解讀)
                () => {
                    setInterpretation("");
                }
            );
        } catch (err) {
            console.error("Tarot analysis failed:", err);
            setError("占卜失敗，請稍後再試。");
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-4xl font-extrabold text-center text-purple-900 mb-10 leading-tight">
                🔮 AI 塔羅占卜
            </h1>

            {/* Main Interactive Card */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-100 mb-8 max-w-2xl mx-auto shadow-sm">

                {/* --- 區塊 1: 每日一抽 (快速占卜) --- */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">☀️</span>
                        <h3 className="text-lg font-bold text-purple-900">每日運勢指引</h3>
                    </div>
                    <button
                        onClick={() => handleAnalyze(true)}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-base font-medium py-4 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>🔮 抽取中...</>
                        ) : (
                            <>✨ 立即抽取今日指引牌</>)}
                    </button>
                    <p className="text-xs text-center text-zinc-500 mt-2">無需輸入問題，AI 為您抽取一張專屬指引牌</p>
                </div>

                {/* 分隔線 */}
                <div className="relative flex items-center my-8">
                    <div className="flex-1 border-t border-purple-200"></div>
                    <span className="px-4 text-sm font-medium text-purple-600 bg-purple-50/50 rounded-full py-1">自訂專業占卜</span>
                    <div className="flex-1 border-t border-purple-200"></div>
                </div>

                {/* --- 區塊 2: 專業占卜 (自訂問題) --- */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">🔮</span>
                        <h3 className="text-lg font-bold text-purple-900">針對問題詳解</h3>
                    </div>

                    {/* 1. Spread Selector */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-purple-900 mb-2">🎴 選擇牌陣</label>
                        <div className="relative">
                            {/* Custom Dropdown Trigger */}
                            <div
                                onClick={() => setIsSpreadOpen(!isSpreadOpen)}
                                className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-zinc-800 cursor-pointer flex justify-between items-center hover:border-purple-300 transition-colors"
                            >
                                <span className="font-medium">{SPREAD_OPTIONS.find(opt => opt.value === spreadType)?.label}</span>
                                <span className="text-purple-400 text-xs transform transition-transform duration-200" style={{ transform: isSpreadOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                            </div>

                            {/* Dropdown Menu */}
                            {isSpreadOpen && (
                                <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-purple-100 max-h-80 overflow-y-auto">
                                    {SPREAD_OPTIONS.map(opt => (
                                        <div
                                            key={opt.value}
                                            onClick={() => {
                                                setSpreadType(opt.value);
                                                setIsSpreadOpen(false);
                                            }}
                                            className={`p-4 border-b border-purple-50 hover:bg-purple-50 cursor-pointer transition-colors last:border-0 ${spreadType === opt.value ? 'bg-purple-50/50' : ''}`}
                                        >
                                            <div className="font-bold text-purple-900 mb-1">{opt.label}</div>
                                            <div className="text-xs text-zinc-500 leading-relaxed">{opt.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* 牌陣說明 (Backup display for selected) */}
                        <div className="mt-3 p-3 bg-white/60 rounded-lg text-sm text-purple-800 border border-purple-100 flex gap-2">
                            <span className="text-lg">💡</span>
                            <p>{SPREAD_OPTIONS.find(s => s.value === spreadType)?.desc}</p>
                        </div>
                    </div>

                    {/* 2. Question */}
                    <label className="block text-sm font-medium text-purple-900 mb-3">❓ 請在心中默想您的問題</label>

                    {/* 引導提問開關 */}
                    {!showGuide ? (
                        <div className="mb-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowGuide(true);
                                    setGuideStep(0);
                                    setGuideAnswers([]);
                                }}
                                className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 transition-colors"
                            >
                                <span className="text-lg">💡</span>
                                <span className="underline underline-offset-2">不知道怎麼問？讓我引導您</span>
                            </button>
                        </div>
                    ) : (
                        /* 引導流程 */
                        <div className="mb-6 p-4 bg-white rounded-xl border border-purple-200">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-sm font-medium text-purple-900">
                                    🧭 引導提問（步驟 {guideStep + 1}/{guideQuestions.length}）
                                </h4>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowGuide(false);
                                        setGuideStep(0);
                                        setGuideAnswers([]);
                                    }}
                                    className="text-xs text-zinc-400 hover:text-zinc-600"
                                >
                                    ✕ 關閉引導
                                </button>
                            </div>

                            {/* 進度條 */}
                            <div className="flex gap-1 mb-4">
                                {guideQuestions.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1 flex-1 rounded-full transition-all ${idx <= guideStep ? 'bg-purple-500' : 'bg-purple-200'
                                            }`}
                                    />
                                ))}
                            </div>

                            <p className="text-sm text-zinc-700 mb-3">{guideQuestions[guideStep].question}</p>
                            <div className="flex flex-wrap gap-2">
                                {guideQuestions[guideStep].options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                            const newAnswers = [...guideAnswers];
                                            newAnswers[guideStep] = option;
                                            setGuideAnswers(newAnswers);

                                            if (guideStep < guideQuestions.length - 1) {
                                                setGuideStep(guideStep + 1);
                                            } else {
                                                // 完成引導，組合問題
                                                const composedQuestion = `關於${newAnswers[0]}方面，${newAnswers[1]}，我想知道${option}`;
                                                setQuestion(composedQuestion);
                                                setShowGuide(false);
                                            }
                                        }}
                                        className={`px-4 py-2 text-sm rounded-lg border transition-all ${guideAnswers[guideStep] === option
                                            ? 'bg-purple-600 text-white border-purple-600'
                                            : 'bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-400 hover:bg-purple-100'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>

                            {guideStep > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setGuideStep(guideStep - 1)}
                                    className="mt-3 text-xs text-purple-500 hover:text-purple-700"
                                >
                                    ← 上一步
                                </button>
                            )}
                        </div>
                    )}

                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="輸入您的問題，或點擊上方引導按鈕..."
                        className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3.5 text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all shadow-sm"
                    />

                    <button
                        onClick={() => handleAnalyze(false)}
                        disabled={loading}
                        className="mt-6 w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white text-base font-medium py-4 rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                {/* SVG Spinner */}
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                塔羅大師抽牌解讀中...
                            </>
                        ) : (
                            <>✨ 開始占卜</>
                        )}
                    </button>
                </div>
            </div>

            {error && (
                <p className="mt-4 text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{error}</p>
            )}

            {/* Results */}
            {
                cards.length > 0 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                        {/* 1. Cards Display */}
                        <div>
                            <div className="text-center mb-8">
                                <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-3">
                                    使用牌陣：{spreadName}
                                </span>
                                {/* 是非題判定結果 */}
                                {yesNoResult && (
                                    <div className="text-center mb-4 mt-2">
                                        <span className="inline-block px-6 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 rounded-full text-lg font-bold shadow-sm">
                                            {yesNoResult}
                                        </span>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold text-zinc-800">📜 抽牌結果</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {cards.map((card, idx) => (
                                    <div key={idx} className="group bg-white rounded-2xl p-4 shadow-md border border-purple-50 hover:-translate-y-1 transition-transform duration-300">
                                        <div className="aspect-[2/3] bg-zinc-100 rounded-xl overflow-hidden mb-4 relative">
                                            {/* Placeholder for Card Image - In real app, map card.name to asset */}
                                            <div className="absolute inset-0 flex items-center justify-center text-purple-200 text-4xl select-none">
                                                🃏
                                            </div>
                                            <div className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${card.reversed ? "rotate-180" : ""}`}
                                                style={{ backgroundImage: `url('${getCardImageUrl(card.name)}')` }}
                                            ></div>
                                            {/* 遮罩，讓文字更清楚 */}
                                            <div className="absolute inset-0 bg-black/10"></div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-purple-600 font-bold uppercase tracking-wider mb-1">
                                                {card.position || positions[idx]}
                                            </p>
                                            <h4 className="text-lg font-bold text-zinc-900 mb-1">{card.name}</h4>
                                            <p className={`text-xs font-medium ${card.reversed ? "text-red-500" : "text-emerald-600"}`}>
                                                {card.reversed ? "逆位 (Reversed)" : "正位 (Upright)"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. AI Interpretation */}
                        <div className="bg-white rounded-2xl border border-purple-100 shadow-xl p-8 max-w-4xl mx-auto">
                            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600 mb-6 flex items-center gap-2">
                                <span>🔮</span> 塔羅大師解讀
                            </h3>

                            <div className="prose prose-purple max-w-none prose-p:text-zinc-700 prose-headings:text-purple-900">
                                {(!interpretation) && (
                                    <div className="flex items-center gap-3 text-purple-600 animate-pulse py-4">
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>塔羅大師正在感應牌意中...</span>
                                    </div>
                                )}
                                {interpretation?.split('\n').map((line, i) => {
                                    if (line.startsWith('### ')) return <h3 key={i} className="mt-6 mb-3 text-lg font-bold">{line.replace('### ', '')}</h3>;
                                    if (line.startsWith('**') && line.endsWith('**')) return <strong key={i} className="block mt-4 text-purple-800">{line.replace(/\*\*/g, '')}</strong>;
                                    if (line.startsWith('- ')) return <li key={i} className="ml-4 mb-2">{line.replace('- ', '')}</li>;
                                    if (line.trim() === '') return <br key={i} />;
                                    return <p key={i} className="mb-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-purple-700">$1</strong>') }}></p>;
                                })}
                            </div>
                        </div>

                        {/* Recalculate Button */}
                        <div className="max-w-2xl mx-auto mt-8">
                            <button
                                onClick={() => {
                                    setCards([]);
                                    setInterpretation("");
                                    setSpreadName("");
                                    // 保留問題與牌陣選擇，方便重測
                                }}
                                disabled={loading}
                                className={`w-full font-medium py-3 rounded-xl transition-all shadow-sm ${loading ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' : 'bg-white text-zinc-600 hover:bg-zinc-50 border border-zinc-200'}`}
                            >
                                {loading ? '分析中...' : '重新占卜'}
                            </button>
                        </div>

                    </div>
                )
            }
        </div>
    );
}
