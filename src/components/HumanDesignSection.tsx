"use client";

import { useState, useEffect } from "react";
import { humanDesignApi, HumanDesignResponse } from "@/services/api";

interface PlanetGateWithIChing {
    gate: string;
    gateNum?: number;
    line?: number;
    lineName?: string;
    name: string;
    hexagram?: string;
    gateName?: string;
    meaning?: string;
    description?: string;
    gift?: string;
    shadow?: string;
    advice?: string;
}

interface ChannelDetail {
    channel: string;
    name: string;
    centers: string[];
    type?: string;
    meaning?: string;
    description?: string;
    gift?: string;
    advice?: string;
    status?: string;
    hangingGate?: number;
    wisdom?: string;
    challenge?: string;
}

const CITIES = [
    { name: "台北市", lat: 25.0330, lon: 121.5654 },
    { name: "新北市", lat: 25.0169, lon: 121.4628 },
    { name: "桃園市", lat: 24.9936, lon: 121.3010 },
    { name: "台中市", lat: 24.1477, lon: 120.6736 },
    { name: "台南市", lat: 22.9998, lon: 120.2269 },
    { name: "高雄市", lat: 22.6273, lon: 120.3014 },
    { name: "新竹市", lat: 24.8138, lon: 120.9675 },
    { name: "基隆市", lat: 25.1276, lon: 121.7392 },
    { name: "花蓮市", lat: 23.9872, lon: 121.6016 },
];

export default function HumanDesignSection() {
    const [hdData, setHdData] = useState<HumanDesignResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [birthDate, setBirthDate] = useState("1990-01-01");
    const [birthTime, setBirthTime] = useState("12:00");
    const [selectedCity, setSelectedCity] = useState(CITIES[1]); // 預設新北市
    const [selectedGate, setSelectedGate] = useState<PlanetGateWithIChing | null>(null);
    const [lineExplanation, setLineExplanation] = useState<string | null>(null);
    const [loadingLine, setLoadingLine] = useState(false);

    const calculateChart = async () => {
        setLoading(true);
        setError(null);
        setHdData(null);

        await humanDesignApi.calculateStream(
            birthDate,
            birthTime,
            selectedCity.name,
            (data: any) => {
                setHdData({ ...data, interpretation: '' } as HumanDesignResponse);
            },
            (chunk: string) => {
                setHdData(prev => {
                    if (!prev) return prev;
                    return { ...prev, interpretation: (prev.interpretation || '') + chunk };
                });
            },
            () => { setLoading(false); },
            (err: any) => {
                setError("無法連接後端 API，請確認後端服務已啟動");
                console.error("Human Design API error:", err);
                setLoading(false);
            }
        );
    };

    // 當選擇閘門時，獲取爻的 AI 解釋
    useEffect(() => {
        if (!selectedGate || !selectedGate.gateNum || !selectedGate.line) {
            setLineExplanation(null);
            return;
        }

        const fetchLineExplanation = async () => {
            setLoadingLine(true);
            try {
                const response = await fetch('http://localhost:5000/api/humandesign/line-explanation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        gateNum: selectedGate.gateNum,
                        line: selectedGate.line,
                        gateInfo: {
                            hexagram: selectedGate.hexagram,
                            name: selectedGate.gateName,
                            meaning: selectedGate.meaning
                        }
                    })
                });
                const data = await response.json();
                if (data.success) {
                    setLineExplanation(data.explanation);
                }
            } catch (err) {
                console.error("Failed to fetch line explanation:", err);
            } finally {
                setLoadingLine(false);
            }
        };

        fetchLineExplanation();
    }, [selectedGate]);

    const planetOrder = ["☉", "⊕", "☽", "☊", "☋", "☿", "♀", "♂", "♃", "♄", "⛢", "♆", "♇"];

    const planetNames: Record<string, string> = {
        "☉": "太陽", "⊕": "地球", "☽": "月亮", "☊": "北交點", "☋": "南交點",
        "☿": "水星", "♀": "金星", "♂": "火星", "♃": "木星", "♄": "土星",
        "⛢": "天王星", "♆": "海王星", "♇": "冥王星"
    };

    // 行星代表的意義
    const planetMeanings: Record<string, { theme: string; influence: string; percentage?: string }> = {
        "太陽": {
            theme: "核心自我",
            influence: "這是你最明顯、最穩定的特質，佔你整體能量的約70%。這個閘門展現了你的本質和生命主題。",
            percentage: "70%"
        },
        "地球": {
            theme: "落實支撐",
            influence: "支持太陽能量的根基。這個閘門幫助你將太陽的特質落實在實際生活中。"
        },
        "月亮": {
            theme: "驅動力",
            influence: "推動你行動的內在動力。這個閘門代表驅使你前進的深層動機。"
        },
        "北交點": {
            theme: "環境面向",
            influence: "你與外在世界互動的方式。這個閘門影響你如何融入環境。"
        },
        "南交點": {
            theme: "過去模式",
            influence: "你帶來的過往經驗與習慣模式。這個閘門代表你熟悉但需要超越的領域。"
        },
        "水星": {
            theme: "溝通表達",
            influence: "你的思維與表達方式。這個閘門影響你如何處理資訊和與人溝通。"
        },
        "金星": {
            theme: "價值觀",
            influence: "你重視的事物和道德觀。這個閘門揭示什麼對你真正有價值。"
        },
        "火星": {
            theme: "成熟能量",
            influence: "需要時間發展的力量。這個閘門代表隨著年齡增長會更成熟的特質。"
        },
        "木星": {
            theme: "法則哲學",
            influence: "你的人生哲學和信念系統。這個閘門展現你追求的更高真理。"
        },
        "土星": {
            theme: "業力課題",
            influence: "需要學習的人生功課。這個閘門代表你來到這世界要精熟的主題。"
        },
        "天王星": {
            theme: "突變創新",
            influence: "帶有革新與突破的能量。這個閘門可能帶來意想不到的改變和創新視角。"
        },
        "海王星": {
            theme: "靈性直覺",
            influence: "連結更高維度的通道。這個閘門與靈性發展和直覺力相關。"
        },
        "冥王星": {
            theme: "深層轉化",
            influence: "生死與重生的力量。這個閘門涉及深刻的轉變和靈魂層面的演進。"
        }
    };

    // Bodygraph SVG component removed - using list-based display instead

    // Planet Column
    const PlanetColumn = ({ title, planets, color }: {
        title: string;
        planets: Record<string, PlanetGateWithIChing>;
        color: "red" | "black"
    }) => (
        <div className={`${color === "red" ? "text-red-700 bg-red-50" : "text-slate-800 bg-slate-50"} rounded-lg p-2`}>
            <h4 className={`text-[10px] font-bold mb-1 pb-1 border-b text-center ${color === "red" ? "border-red-200 text-red-600" : "border-slate-300 text-slate-600"
                }`}>{title}</h4>
            <div className="space-y-0.5">
                {planetOrder.map(symbol => {
                    const planet = planets[symbol] as PlanetGateWithIChing;
                    if (!planet) return null;
                    return (
                        <div
                            key={symbol}
                            className={`flex items-center justify-between text-[10px] cursor-pointer hover:bg-white/50 rounded px-0.5 ${selectedGate?.gate === planet.gate ? 'bg-white ring-1 ring-cyan-400' : ''
                                }`}
                            onClick={() => setSelectedGate(planet)}
                            title={`${planet.hexagram || ''} ${planet.gateName || ''}`}
                        >
                            <span className={`text-sm ${color === "red" ? "text-red-500" : "text-slate-600"}`}>{symbol}</span>
                            <span className={`font-mono font-bold text-[11px] ${color === "red" ? "text-red-600" : "text-slate-700"}`}>
                                {planet.gate}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div>
            {/* Hero */}
            <div className="relative -mx-6 -mt-8 mb-6 overflow-hidden rounded-b-3xl">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop" alt="Sacred geometry" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/90 via-teal-900/80 to-emerald-900/95"></div>
                </div>
                <div className="relative z-10 px-6 py-10 text-center">
                    <div className="text-4xl mb-2">🧬</div>
                    <h1 className="text-2xl md:text-3xl font-semibold text-white mb-1">人類圖</h1>
                    <p className="text-cyan-200 text-sm">發現你獨特的能量藍圖</p>
                </div>
            </div>

            {/* Input */}
            {!hdData && (
                <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-5 border border-cyan-200 mb-5">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">📅</span>
                        <div>
                            <h3 className="text-sm font-semibold text-cyan-900">請輸入您的出生資料</h3>
                            <p className="text-[10px] text-cyan-600">人類圖需要準確的出生時間與地點</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                        <div>
                            <label className="block text-[10px] font-medium text-cyan-700 mb-0.5">出生日期</label>
                            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
                                className="w-full bg-white border border-cyan-300 rounded-lg px-2 py-1.5 text-sm" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-medium text-cyan-700 mb-0.5">出生時間</label>
                            <input type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)}
                                className="w-full bg-white border border-cyan-300 rounded-lg px-2 py-1.5 text-sm" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-medium text-cyan-700 mb-0.5">出生城市</label>
                            <select value={selectedCity.name} onChange={(e) => setSelectedCity(CITIES.find(c => c.name === e.target.value) || CITIES[0])}
                                className="w-full bg-white border border-cyan-300 rounded-lg px-2 py-1.5 text-sm">
                                {CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <button onClick={calculateChart} disabled={loading}
                        className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-medium py-2 rounded-xl text-sm">
                        {loading ? "🔄 精確計算中..." : "🧬 開始計算人類圖"}
                    </button>
                    {error && <p className="mt-2 text-red-500 text-xs text-center">{error}</p>}
                </div>
            )}

            {hdData && (
                <>
                    {/* Chart */}
                    <div className="bg-white rounded-xl border border-cyan-100 shadow-lg overflow-hidden mb-4">
                        <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-3 py-2">
                            <h3 className="text-sm font-medium text-white text-center">🔮 您的人類圖</h3>
                        </div>

                        {/* Design vs Personality 說明 */}
                        <div className="grid grid-cols-2 gap-2 px-3 pt-3 pb-1 bg-slate-50 text-[10px]">
                            <div className="bg-red-50 rounded-lg p-2 border border-red-200">
                                <div className="font-bold text-red-700 mb-0.5">🔴 Design（設計）</div>
                                <div className="text-red-600">潛意識 · 身體智慧</div>
                                <div className="text-red-500">你不自覺展現的特質，別人比你更容易看到</div>
                            </div>
                            <div className="bg-slate-100 rounded-lg p-2 border border-slate-300">
                                <div className="font-bold text-slate-700 mb-0.5">⚫ Personality（個性）</div>
                                <div className="text-slate-600">意識 · 你認識的自己</div>
                                <div className="text-slate-500">你知道自己有的特質，你認為「這就是我」</div>
                            </div>
                        </div>

                        <div className="p-3">
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <PlanetColumn title="Design" planets={hdData.design as Record<string, PlanetGateWithIChing> || {}} color="red" />
                                </div>
                                <div className="w-px bg-slate-200"></div>
                                <div className="flex-1">
                                    <PlanetColumn title="Personality" planets={hdData.personality as Record<string, PlanetGateWithIChing> || {}} color="black" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gate I Ching Info - 詳細版 */}
                    {selectedGate && selectedGate.hexagram && (
                        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-xl p-4 mb-4 border border-amber-200 shadow-lg">
                            <div className="flex items-start gap-3">
                                <div className="text-3xl">☯️</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="text-lg font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">{selectedGate.gate}</span>
                                        <span className="font-bold text-amber-700 text-lg">{selectedGate.hexagram}卦 · {selectedGate.gateName}</span>
                                        {selectedGate.lineName && (
                                            <span className="px-2 py-0.5 bg-purple-100 rounded text-xs font-bold text-purple-700">
                                                {selectedGate.lineName}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-amber-700 font-medium mb-2">{selectedGate.meaning}</p>

                                    {/* 卦象描述 */}
                                    {selectedGate.description && (
                                        <div className="bg-white/60 rounded-lg p-2 mb-2">
                                            <p className="text-xs text-amber-800">{selectedGate.description}</p>
                                        </div>
                                    )}

                                    {/* 爻的 AI 解釋 */}
                                    {selectedGate.lineName && (
                                        <div className="bg-purple-50 rounded-lg p-2 mb-2 border border-purple-200">
                                            <div className="flex items-center gap-1 mb-1">
                                                <span className="text-sm">🔮</span>
                                                <span className="text-[10px] font-bold text-purple-700">
                                                    {selectedGate.gate} {selectedGate.lineName} 解析
                                                </span>
                                            </div>
                                            {loadingLine ? (
                                                <p className="text-xs text-purple-500 animate-pulse">AI 正在解讀此爻的特殊意義...</p>
                                            ) : lineExplanation ? (
                                                <p className="text-xs text-purple-700 whitespace-pre-wrap">{lineExplanation}</p>
                                            ) : (
                                                <p className="text-xs text-purple-400">點擊其他閘門查看爻的解釋</p>
                                            )}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 gap-2 mt-2">
                                        {/* 天賦禮物 */}
                                        {selectedGate.gift && (
                                            <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                                                <div className="flex items-center gap-1 mb-0.5">
                                                    <span className="text-sm">🎁</span>
                                                    <span className="text-[10px] font-bold text-green-700">天賦禮物</span>
                                                </div>
                                                <p className="text-xs text-green-700">{selectedGate.gift}</p>
                                            </div>
                                        )}

                                        {/* 陰影面 */}
                                        {selectedGate.shadow && (
                                            <div className="bg-red-50 rounded-lg p-2 border border-red-200">
                                                <div className="flex items-center gap-1 mb-0.5">
                                                    <span className="text-sm">👻</span>
                                                    <span className="text-[10px] font-bold text-red-700">陰影面</span>
                                                </div>
                                                <p className="text-xs text-red-700">{selectedGate.shadow}</p>
                                            </div>
                                        )}

                                        {/* 建議 */}
                                        {selectedGate.advice && (
                                            <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                                                <div className="flex items-center gap-1 mb-0.5">
                                                    <span className="text-sm">💡</span>
                                                    <span className="text-[10px] font-bold text-blue-700">生活建議</span>
                                                </div>
                                                <p className="text-xs text-blue-700">{selectedGate.advice}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* 行星影響 */}
                                    {selectedGate.name && planetMeanings[selectedGate.name] && (
                                        <div className="bg-purple-50 rounded-lg p-2 mt-2 border border-purple-200">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-lg">🪐</span>
                                                <span className="text-xs font-bold text-purple-800">
                                                    {selectedGate.name} · {planetMeanings[selectedGate.name].theme}
                                                </span>
                                                {planetMeanings[selectedGate.name].percentage && (
                                                    <span className="px-1.5 py-0.5 bg-purple-200 rounded text-[9px] text-purple-700 font-bold">
                                                        {planetMeanings[selectedGate.name].percentage}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-purple-700">
                                                {planetMeanings[selectedGate.name].influence}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => setSelectedGate(null)} className="text-amber-400 hover:text-amber-600 text-xl">✕</button>
                            </div>
                        </div>
                    )}

                    {/* Type Info */}
                    <div className="grid grid-cols-4 gap-1.5 mb-3">
                        <div className="bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg p-2 text-white text-center">
                            <div className="text-base mb-0.5">{hdData.info?.icon || "⚡"}</div>
                            <div className="text-[8px] opacity-80">類型</div>
                            <div className="text-[10px] font-bold">{hdData.type}</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-2 text-white text-center">
                            <div className="text-base mb-0.5">👤</div>
                            <div className="text-[8px] opacity-80">角色</div>
                            <div className="text-[10px] font-bold">{hdData.profile}</div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg p-2 text-white text-center">
                            <div className="text-base mb-0.5">🎯</div>
                            <div className="text-[8px] opacity-80">權威</div>
                            <div className="text-[10px] font-bold">{hdData.authority}</div>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg p-2 text-white text-center">
                            <div className="text-base mb-0.5">🔗</div>
                            <div className="text-[8px] opacity-80">定義</div>
                            <div className="text-[10px] font-bold">{hdData.definition}</div>
                        </div>
                    </div>

                    {/* Strategy & Not-Self - 加入詳細說明 */}
                    <div className="grid grid-cols-1 gap-3 mb-3">
                        {/* 策略說明 */}
                        <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg p-3 border border-cyan-200">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">🚀</span>
                                <h4 className="font-bold text-cyan-900 text-sm">策略</h4>
                                <span className="px-2 py-0.5 bg-cyan-200 rounded-full text-xs font-bold text-cyan-800">
                                    {hdData.strategy}
                                </span>
                            </div>
                            <p className="text-[11px] text-cyan-600 mb-2">
                                「策略」是你做決定的最佳方式。當你遵循策略，人生會更順流。
                            </p>
                            <div className="bg-white/70 rounded p-2">
                                <p className="text-xs text-cyan-800">
                                    {hdData.type?.includes('生產者') && '作為生產者，你的能量需要被外在事物「啟動」。當有事情讓你興奮，你會感覺到薦骨的「嗯哼！」回應。等待這個回應再行動，而不是主動發起。'}
                                    {hdData.type === '投射者' && '作為投射者，你需要被「認可和邀請」。當別人看見你的天賦並邀請你時，你的能量才能正確發揮。不要主動推銷自己。'}
                                    {hdData.type === '顯示者' && '作為顯示者，你有發起的能量。但在行動前「告知」相關的人，可以減少阻力，讓事情更順利。'}
                                    {hdData.type === '反映者' && '作為反映者，重大決定需要等待「一個月亮週期」（約28天）。這讓你有時間感受和反映環境的能量。'}
                                </p>
                            </div>
                        </div>

                        {/* 非自我主題說明 */}
                        <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-lg p-3 border border-rose-200">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">⚠️</span>
                                <h4 className="font-bold text-rose-900 text-sm">非自我主題</h4>
                                <span className="px-2 py-0.5 bg-rose-200 rounded-full text-xs font-bold text-rose-800">
                                    {hdData.notSelfTheme}
                                </span>
                            </div>
                            <p className="text-[11px] text-rose-600 mb-2">
                                「非自我主題」是你沒有遵循策略時會出現的情緒信號。這是提醒你回到正軌的警示燈。
                            </p>
                            <div className="bg-white/70 rounded p-2">
                                <p className="text-xs text-rose-800">
                                    {hdData.type?.includes('生產者') && '當你感到「挫敗」或「憤怒」時，表示你可能在做不適合你的事，或沒有等待正確的回應就行動了。停下來，等待真正讓你興奮的事物出現。'}
                                    {hdData.type === '投射者' && '當你感到「苦澀」時，可能是你在沒被邀請的情況下付出，卻沒有得到認可。學會等待正確的邀請。'}
                                    {hdData.type === '顯示者' && '當你感到「憤怒」時，可能是有人在阻礙你，或你沒有告知就行動導致阻力。記得告知相關的人。'}
                                    {hdData.type === '反映者' && '當你感到「失望」時，可能是你做決定太快，沒有給自己足夠的時間。放慢腳步，等待一個月亮週期。'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Defined Channels - 已定義通道 */}
                    {hdData.channels && hdData.channels.length > 0 && (
                        <div className="bg-white rounded-lg border border-cyan-100 p-3 mb-3">
                            <h4 className="font-semibold text-cyan-800 text-sm mb-2 flex items-center gap-1">
                                🔗 已定義通道 <span className="text-xs font-normal text-cyan-500">({hdData.channels.length}條)</span>
                            </h4>
                            <div className="space-y-2">
                                {(hdData.channelsDetail as ChannelDetail[] || []).map((ch, idx) => (
                                    <div key={idx} className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-2 border border-red-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-1.5 py-0.5 bg-red-500 rounded text-[10px] font-mono font-bold text-white">
                                                {ch.channel}
                                            </span>
                                            <span className="text-xs font-bold text-red-800">{ch.name}</span>
                                            <span className="text-[9px] text-red-500">({ch.type})</span>
                                        </div>
                                        <p className="text-[11px] text-red-700">{ch.description}</p>
                                        {ch.gift && (
                                            <p className="text-[10px] text-green-700 mt-1">🎁 {ch.gift}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Open Channels - 開放通道 (懸掛閘門) */}
                    {hdData.openChannels && (hdData.openChannels as string[]).length > 0 && (
                        <div className="bg-white rounded-lg border border-slate-200 p-3 mb-3">
                            <h4 className="font-semibold text-slate-700 text-sm mb-2 flex items-center gap-1">
                                ⚪ 開放通道 <span className="text-xs font-normal text-slate-400">(學習領域)</span>
                            </h4>
                            <p className="text-[10px] text-slate-500 mb-2">以下是你擁有懸掛閘門的通道，代表你在這些領域會受他人影響，但也能發展出獨特的智慧。</p>
                            <div className="space-y-2">
                                {(hdData.openChannelsDetail as ChannelDetail[] || []).map((ch, idx) => (
                                    <div key={idx} className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-2 border border-slate-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-1.5 py-0.5 bg-slate-400 rounded text-[10px] font-mono font-bold text-white">
                                                {ch.channel}
                                            </span>
                                            <span className="text-xs font-bold text-slate-700">{ch.name}</span>
                                            <span className="text-[9px] text-orange-500">懸掛閘門: {ch.hangingGate}</span>
                                        </div>
                                        {ch.wisdom && (
                                            <p className="text-[11px] text-emerald-700">💡 智慧: {ch.wisdom}</p>
                                        )}
                                        {ch.challenge && (
                                            <p className="text-[10px] text-orange-600 mt-1">⚠️ 挑戰: {ch.challenge}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* AI Interpretation - 完整顯示 */}
                    <div className="bg-white rounded-xl border border-cyan-100 shadow p-4 mb-4">
                        <h4 className="font-semibold text-cyan-800 mb-3 text-sm flex items-center gap-2">
                            🔮 AI 完整解析
                        </h4>
                        <div className="prose prose-sm prose-cyan max-w-none text-slate-700 space-y-2">
                            {(!hdData.interpretation || hdData.interpretation.length === 0) && (
                                <div className="flex items-center gap-3 text-cyan-600 animate-pulse py-4">
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>人類圖分析師正在詳批中，請稍候...</span>
                                </div>
                            )}
                            {hdData.interpretation?.split('\n').map((line, idx) => {
                                // 標題處理
                                if (line.startsWith('##')) {
                                    return <h4 key={idx} className="text-base font-bold text-cyan-800 mt-4 mb-2 border-b border-cyan-100 pb-1">{line.replace(/^#+\s*/, '')}</h4>;
                                }
                                if (line.startsWith('#')) {
                                    return <h3 key={idx} className="text-lg font-bold text-cyan-900 mt-4 mb-2">{line.replace(/^#+\s*/, '')}</h3>;
                                }
                                // 數字列表
                                if (line.match(/^\d+\./)) {
                                    return <h5 key={idx} className="text-sm font-bold text-teal-700 mt-3 mb-1">{line}</h5>;
                                }
                                // 粗體
                                if (line.startsWith('**') && line.endsWith('**')) {
                                    return <p key={idx} className="font-semibold text-slate-800 text-sm">{line.replace(/\*\*/g, '')}</p>;
                                }
                                // 一般文字
                                if (line.trim()) {
                                    // 處理行內粗體
                                    const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                                    return <p key={idx} className="text-sm text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
                                }
                                // 空行
                                return <br key={idx} />;
                            })}
                        </div>
                    </div>

                    <button onClick={() => setHdData(null)} disabled={loading} className={`w-full font-medium py-2 rounded-lg text-sm ${loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        {loading ? '分析中...' : '重新計算'}
                    </button>
                </>
            )}
        </div>
    );
}
