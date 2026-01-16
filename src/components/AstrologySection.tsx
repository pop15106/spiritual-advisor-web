"use client";

import React, { useState } from "react";
import { astrologyApi, AstrologyResponse } from "@/services/api";

const CITIES = [
    { name: "台北市", lat: 25.0330, lon: 121.5654 },
    { name: "新北市", lat: 25.0169, lon: 121.4628 },
    { name: "桃園市", lat: 24.9936, lon: 121.3010 },
    { name: "台中市", lat: 24.1477, lon: 120.6736 },
    { name: "台南市", lat: 22.9998, lon: 120.2269 },
    { name: "高雄市", lat: 22.6273, lon: 120.3014 },
    { name: "新竹市", lat: 24.8138, lon: 120.9675 },
    { name: "基隆市", lat: 25.1276, lon: 121.7392 },
];

interface PlanetDetail {
    sign: string;
    symbol: string;
    degree: number;
    abs_degree: number;
    element: string;
    modality: string;
    polarity: string;
    retrograde?: boolean;
}

interface Aspect {
    planet1: string;
    planet2: string;
    aspect: string;
    nature: string;
    orb: number;
}

interface Pattern {
    name: string;
    type?: string;
    planets: string[];
    meaning: string;
    element?: string;
    apex?: string;
}

interface House {
    house: number;
    sign: string;
    degree: number;
}

interface Dispositor {
    sign: string;
    dispositor: string;
    dispositor_sign: string;
}

interface AscRulerInfo {
    planet: string;
    sign: string;
    dignity: string;
    meaning: string;
}

type ExtendedAstroResponse = AstrologyResponse & {
    ascendantRuler?: string;
    mc?: string;
    mcSign?: string;
    elements?: Record<string, number>;
    dominantElement?: string;
    elementAnalysis?: string;
    modalities?: Record<string, number>;
    dominantModality?: string;
    modalityAnalysis?: string;
    polarity?: Record<string, number>;
    polarityDesc?: string;
    aspects?: Aspect[];
    patterns?: Pattern[];
    houses?: House[];
    planetDetails?: Record<string, PlanetDetail>;
    dispositors?: Record<string, Dispositor>;
    planetDignities?: Record<string, string>;
    finalDispositors?: string[];
    ascRulerInfo?: AscRulerInfo;
};

// 行星符號對照表
const PLANET_SYMBOLS: Record<string, string> = {
    "太陽": "☉", "月亮": "☽", "水星": "☿", "金星": "♀", "火星": "♂",
    "木星": "♃", "土星": "♄", "天王星": "♅", "海王星": "♆", "冥王星": "♇"
};

// 相位符號對照表
const ASPECT_SYMBOLS: Record<string, string> = {
    "合相": "☌", "六分相": "⚹", "四分相": "□", "三分相": "△",
    "對分相": "☍", "半六分相": "⚺", "梅花相": "⚻"
};

export default function AstrologySection() {
    const [astroData, setAstroData] = useState<ExtendedAstroResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [birthDate, setBirthDate] = useState("1991-07-02");
    const [birthTime, setBirthTime] = useState("14:24");
    const [selectedCity, setSelectedCity] = useState(CITIES[1]);

    const calculateChart = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await astrologyApi.calculate(birthDate, birthTime, selectedCity.lat, selectedCity.lon, selectedCity.name);
            setAstroData(response as ExtendedAstroResponse);
        } catch (err) {
            setError("無法連接後端 API");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 格局類型顏色
    const getPatternColor = (type?: string) => {
        switch (type) {
            case "harmonious": return "bg-green-100 text-green-800 border-green-300";
            case "challenging": return "bg-orange-100 text-orange-800 border-orange-300";
            case "very_challenging": return "bg-red-100 text-red-800 border-red-300";
            case "fated": return "bg-purple-100 text-purple-800 border-purple-300";
            case "dynamic_talent": return "bg-blue-100 text-blue-800 border-blue-300";
            case "creative_tension": return "bg-yellow-100 text-yellow-800 border-yellow-300";
            default: return "bg-slate-100 text-slate-800 border-slate-300";
        }
    };

    // 狀態顏色
    const getDignityColor = (dignity: string) => {
        if (dignity.includes("入廟") || dignity.includes("旺")) return "text-green-600 bg-green-50";
        if (dignity.includes("陷") || dignity.includes("落")) return "text-red-600 bg-red-50";
        return "text-slate-600 bg-slate-50";
    };

    return (
        <div>
            {/* Hero */}
            <div className="relative -mx-6 -mt-8 mb-6 overflow-hidden rounded-b-3xl">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013&auto=format&fit=crop" alt="Stars" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/90 via-blue-900/80 to-slate-900/95"></div>
                </div>
                <div className="relative z-10 px-6 py-10 text-center">
                    <div className="text-4xl mb-2">⭐</div>
                    <h1 className="text-2xl font-semibold text-white mb-1">西洋占星</h1>
                    <p className="text-indigo-200 text-sm">專業星盤分析</p>
                </div>
            </div>

            {/* Input */}
            {!astroData && (
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-200 mb-5">
                    <div className="grid grid-cols-3 gap-2 mb-3">
                        <div>
                            <label className="block text-[10px] text-indigo-700 mb-0.5">日期</label>
                            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
                                className="w-full bg-white border border-indigo-300 rounded px-2 py-1.5 text-sm" />
                        </div>
                        <div>
                            <label className="block text-[10px] text-indigo-700 mb-0.5">時間</label>
                            <input type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)}
                                className="w-full bg-white border border-indigo-300 rounded px-2 py-1.5 text-sm" />
                        </div>
                        <div>
                            <label className="block text-[10px] text-indigo-700 mb-0.5">城市</label>
                            <select value={selectedCity.name} onChange={(e) => setSelectedCity(CITIES.find(c => c.name === e.target.value) || CITIES[0])}
                                className="w-full bg-white border border-indigo-300 rounded px-2 py-1.5 text-sm">
                                {CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <button onClick={calculateChart} disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-2 rounded-lg text-sm">
                        {loading ? "計算中..." : "⭐ 計算星盤"}
                    </button>
                    {error && <p className="mt-2 text-red-500 text-xs text-center">{error}</p>}
                </div>
            )}

            {astroData && (
                <>
                    {/* 三大重點 */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg p-2 text-white text-center">
                            <div className="text-lg">☉</div>
                            <div className="text-[8px] opacity-80">太陽</div>
                            <div className="text-xs font-bold">{astroData.sunSign}</div>
                        </div>
                        <div className="bg-gradient-to-br from-slate-400 to-slate-600 rounded-lg p-2 text-white text-center">
                            <div className="text-lg">☽</div>
                            <div className="text-[8px] opacity-80">月亮</div>
                            <div className="text-xs font-bold">{astroData.moonSign}</div>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-2 text-white text-center">
                            <div className="text-lg">⬆</div>
                            <div className="text-[8px] opacity-80">上升</div>
                            <div className="text-xs font-bold">{astroData.ascendantSign}</div>
                        </div>
                        <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg p-2 text-white text-center">
                            <div className="text-lg">MC</div>
                            <div className="text-[8px] opacity-80">中天</div>
                            <div className="text-xs font-bold">{astroData.mcSign}</div>
                        </div>
                    </div>

                    {/* 命主星分析 */}
                    {astroData.ascRulerInfo && (
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-3 mb-4">
                            <h4 className="text-xs font-bold text-indigo-800 mb-2">👑 命主星 (Chart Ruler)</h4>
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">{PLANET_SYMBOLS[astroData.ascRulerInfo.planet]}</div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-indigo-900">
                                        {astroData.ascRulerInfo.planet} 落 {astroData.ascRulerInfo.sign}
                                    </p>
                                    <span className={`inline-block text-[10px] px-2 py-0.5 rounded mt-1 ${getDignityColor(astroData.ascRulerInfo.dignity)}`}>
                                        {astroData.ascRulerInfo.dignity}
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-indigo-700 mt-2">{astroData.ascRulerInfo.meaning}</p>
                        </div>
                    )}

                    {/* 行星位置表 */}
                    <div className="bg-white rounded-lg border border-indigo-100 p-3 mb-4">
                        <h4 className="text-xs font-bold text-indigo-800 mb-2">🪐 行星位置與力量</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-[10px]">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-600">
                                        <th className="text-left p-1.5">行星</th>
                                        <th className="text-left p-1.5">星座</th>
                                        <th className="text-right p-1.5">度數</th>
                                        <th className="text-center p-1.5">元素</th>
                                        <th className="text-center p-1.5">力量</th>
                                        <th className="text-center p-1.5">定位星</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {astroData.planetDetails && Object.entries(astroData.planetDetails).map(([name, detail]) => (
                                        <tr key={name} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="p-1.5 font-medium">
                                                {PLANET_SYMBOLS[name]} {name}
                                                {detail.retrograde && <span className="text-red-500 ml-1">R</span>}
                                            </td>
                                            <td className="p-1.5">{detail.symbol} {detail.sign}</td>
                                            <td className="p-1.5 text-right font-mono">{detail.degree?.toFixed(2)}°</td>
                                            <td className="p-1.5 text-center">
                                                <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                                                    detail.element === '火' ? 'bg-red-100 text-red-700' :
                                                    detail.element === '土' ? 'bg-green-100 text-green-700' :
                                                    detail.element === '風' ? 'bg-yellow-100 text-yellow-700' : 
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {detail.element}
                                                </span>
                                            </td>
                                            <td className="p-1.5 text-center">
                                                <span className={`px-1.5 py-0.5 rounded text-[9px] ${getDignityColor(astroData.planetDignities?.[name] || "中性")}`}>
                                                    {astroData.planetDignities?.[name]?.split(' ')[0] || "中性"}
                                                </span>
                                            </td>
                                            <td className="p-1.5 text-center text-slate-500">
                                                {astroData.dispositors?.[name]?.dispositor || "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 最終定位星 */}
                    {astroData.finalDispositors && astroData.finalDispositors.length > 0 && (
                        <div className="bg-amber-50 rounded-lg border border-amber-200 p-3 mb-4">
                            <h4 className="text-xs font-bold text-amber-800 mb-2">⭐ 最終定位星 (Final Dispositor)</h4>
                            <div className="flex flex-wrap gap-2">
                                {astroData.finalDispositors.map(planet => (
                                    <span key={planet} className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 rounded text-sm font-medium text-amber-800">
                                        {PLANET_SYMBOLS[planet]} {planet}
                                    </span>
                                ))}
                            </div>
                            <p className="text-[10px] text-amber-700 mt-2">
                                最終定位星是星盤的能量核心，所有行星能量最終匯聚於此
                            </p>
                        </div>
                    )}

                    {/* 四大元素與三模式 */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white rounded-lg border border-indigo-100 p-3">
                            <h4 className="text-xs font-bold text-indigo-800 mb-2">🔥 四大元素</h4>
                            <div className="space-y-1.5">
                                {["火", "土", "風", "水"].map(e => {
                                    const count = astroData.elements?.[e] || 0;
                                    const isDominant = astroData.dominantElement === e;
                                    const colors = { "火": "red", "土": "green", "風": "yellow", "水": "blue" };
                                    return (
                                        <div key={e} className={`flex items-center gap-2 p-1.5 rounded ${isDominant ? `bg-${colors[e as keyof typeof colors]}-50 ring-1 ring-${colors[e as keyof typeof colors]}-300` : ''}`}>
                                            <span className="text-sm">{e === "火" ? "🔥" : e === "土" ? "🌍" : e === "風" ? "💨" : "💧"}</span>
                                            <span className="flex-1 text-xs font-medium">{e}象</span>
                                            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${
                                                    e === "火" ? "bg-red-500" : e === "土" ? "bg-green-500" : e === "風" ? "bg-yellow-500" : "bg-blue-500"
                                                }`} style={{ width: `${count * 20}%` }}></div>
                                            </div>
                                            <span className="text-xs font-bold w-4 text-right">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-[10px] text-indigo-600 mt-2">主導: {astroData.dominantElement}象 - {astroData.elementAnalysis}</p>
                        </div>
                        
                        <div className="bg-white rounded-lg border border-indigo-100 p-3">
                            <h4 className="text-xs font-bold text-indigo-800 mb-2">⚡ 三大模式</h4>
                            <div className="space-y-1.5">
                                {["開創", "固定", "變動"].map(m => {
                                    const count = astroData.modalities?.[m] || 0;
                                    const isDominant = astroData.dominantModality === m;
                                    return (
                                        <div key={m} className={`flex items-center gap-2 p-1.5 rounded ${isDominant ? 'bg-indigo-50 ring-1 ring-indigo-300' : ''}`}>
                                            <span className="text-sm">{m === "開創" ? "🚀" : m === "固定" ? "🏔️" : "🌊"}</span>
                                            <span className="flex-1 text-xs font-medium">{m}</span>
                                            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${count * 20}%` }}></div>
                                            </div>
                                            <span className="text-xs font-bold w-4 text-right">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-[10px] text-indigo-600 mt-2">主導: {astroData.dominantModality} - {astroData.modalityAnalysis}</p>
                        </div>
                    </div>

                    {/* 陰陽極性 */}
                    <div className="bg-white rounded-lg border border-indigo-100 p-3 mb-4">
                        <h4 className="text-xs font-bold text-indigo-800 mb-2">☯️ 陰陽極性</h4>
                        <div className="flex gap-3">
                            <div className={`flex-1 rounded-lg p-2 text-center ${(astroData.polarity?.['陽'] || 0) > (astroData.polarity?.['陰'] || 0) ? 'bg-amber-100 ring-2 ring-amber-400' : 'bg-slate-50'}`}>
                                <div className="text-xl">☀️</div>
                                <div className="text-sm font-bold text-amber-700">{astroData.polarity?.['陽'] || 0}</div>
                                <div className="text-[10px] text-slate-600">陽性 (外向/主動)</div>
                            </div>
                            <div className={`flex-1 rounded-lg p-2 text-center ${(astroData.polarity?.['陰'] || 0) > (astroData.polarity?.['陽'] || 0) ? 'bg-indigo-100 ring-2 ring-indigo-400' : 'bg-slate-50'}`}>
                                <div className="text-xl">🌙</div>
                                <div className="text-sm font-bold text-indigo-700">{astroData.polarity?.['陰'] || 0}</div>
                                <div className="text-[10px] text-slate-600">陰性 (內斂/被動)</div>
                            </div>
                        </div>
                        <p className="text-[10px] text-center text-slate-600 mt-2">{astroData.polarityDesc}</p>
                    </div>

                    {/* 特殊格局 */}
                    {astroData.patterns && astroData.patterns.length > 0 && (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-3 mb-4">
                            <h4 className="text-xs font-bold text-purple-800 mb-2">⭐ 特殊格局 ({astroData.patterns.length})</h4>
                            <div className="space-y-2">
                                {astroData.patterns.map((p, idx) => (
                                    <div key={idx} className={`rounded-lg border p-2.5 ${getPatternColor(p.type)}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-sm">{p.name}</span>
                                            {p.element && <span className="text-[10px] px-1.5 py-0.5 bg-white/50 rounded">{p.element}象</span>}
                                        </div>
                                        <div className="text-[10px] mb-1 opacity-80">
                                            行星: {p.planets.map(pl => `${PLANET_SYMBOLS[pl] || ''} ${pl}`).join(' → ')}
                                            {p.apex && <span className="ml-2 font-medium">（焦點: {p.apex}）</span>}
                                        </div>
                                        <p className="text-xs">{p.meaning}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 相位列表 */}
                    {astroData.aspects && astroData.aspects.length > 0 && (
                        <div className="bg-white rounded-lg border border-indigo-100 p-3 mb-4">
                            <h4 className="text-xs font-bold text-indigo-800 mb-2">🔗 主要相位 ({astroData.aspects.length})</h4>
                            <div className="grid grid-cols-2 gap-1.5">
                                {astroData.aspects.slice(0, 16).map((asp, idx) => (
                                    <div key={idx} className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] ${
                                        asp.nature === '吉' ? 'bg-green-50 text-green-800' :
                                        asp.nature === '凶' ? 'bg-red-50 text-red-800' : 'bg-purple-50 text-purple-800'
                                    }`}>
                                        <span>{PLANET_SYMBOLS[asp.planet1]}</span>
                                        <span className="font-bold">{ASPECT_SYMBOLS[asp.aspect] || asp.aspect[0]}</span>
                                        <span>{PLANET_SYMBOLS[asp.planet2]}</span>
                                        <span className="flex-1 text-right opacity-60">{asp.orb.toFixed(1)}°</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3 mt-2 text-[9px] text-slate-500 justify-center">
                                <span className="text-green-600">● 吉相位</span>
                                <span className="text-red-600">● 凶相位</span>
                                <span className="text-purple-600">● 中性</span>
                            </div>
                        </div>
                    )}

                    {/* 宮位 */}
                    {astroData.houses && astroData.houses.length > 0 && (
                        <div className="bg-white rounded-lg border border-indigo-100 p-3 mb-4">
                            <h4 className="text-xs font-bold text-indigo-800 mb-2">🏠 十二宮位</h4>
                            <div className="grid grid-cols-4 gap-1.5">
                                {astroData.houses.map((h, idx) => (
                                    <div key={idx} className={`rounded-lg p-1.5 text-center ${
                                        [0, 3, 6, 9].includes(idx) ? 'bg-indigo-100' : 'bg-slate-50'
                                    }`}>
                                        <div className={`text-[10px] font-bold ${
                                            [0, 3, 6, 9].includes(idx) ? 'text-indigo-700' : 'text-slate-600'
                                        }`}>{h.house}宮</div>
                                        <div className="text-xs">{h.sign}</div>
                                        <div className="text-[9px] text-slate-500">{h.degree?.toFixed(1)}°</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* AI 解析 */}
                    <div className="bg-white rounded-lg border border-indigo-100 p-3 mb-4">
                        <h4 className="text-xs font-bold text-indigo-800 mb-2">🔮 AI 深度解析</h4>
                        <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
                            {astroData.interpretation?.split('\n').map((line, idx) => {
                                if (line.match(/^\d\./)) {
                                    return <h5 key={idx} className="font-bold text-indigo-700 mt-3 text-sm">{line}</h5>;
                                } else if (line.trim()) {
                                    return <p key={idx} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
                                }
                                return null;
                            })}
                        </div>
                    </div>

                    <button onClick={() => setAstroData(null)} className="w-full bg-slate-100 text-slate-600 py-2 rounded-lg text-sm hover:bg-slate-200">
                        重新計算
                    </button>
                </>
            )}
        </div>
    );
}
