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
    const [selectedPalace, setSelectedPalace] = useState<string | null>(null);

    const DIZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    const getRelation = (target: string) => {
        if (!selectedPalace) return null;
        if (target === selectedPalace) return 'self';

        const tIdx = DIZHI_ORDER.indexOf(target);
        const sIdx = DIZHI_ORDER.indexOf(selectedPalace);
        if (tIdx === -1 || sIdx === -1) return null;

        const diff = Math.abs(tIdx - sIdx);
        if (diff === 6) return 'opposite'; // 對宮
        if (diff === 4 || diff === 8) return 'harmony'; // 三合
        return null;
    };

    const calculateChart = async () => {
        setLoading(true);
        setError(null);
        setSelectedPalace(null);
        setZiweiData(null);

        await ziweiApi.calculateStream(
            birthDate,
            birthHour,
            (data: ZiweiResponse) => {
                setZiweiData({ ...data, interpretation: '' });
            },
            (chunk: string) => {
                setZiweiData(prev => {
                    if (!prev) return prev;
                    return { ...prev, interpretation: (prev.interpretation || '') + chunk };
                });
            },
            () => { setLoading(false); },
            (err: any) => {
                setError("無法連接後端 API，請確認後端服務已啟動");
                console.error("Ziwei API error:", err);
                setLoading(false);
            }
        );
    };

    const renderPalaceCell = (dz: string) => {
        if (!ziweiData) return null;

        const palace = Object.entries(ziweiData.palaces).find(([_, data]) =>
            typeof data === 'object' && (data as any).dizhi === dz
        );
        const palaceName = palace ? palace[0] : '';
        const stars = palace && typeof palace[1] === 'object' ? (palace[1] as any).stars?.join(' ') || '' : palace?.[1] || '';
        const isMing = palaceName === '命宮';
        const relation = getRelation(dz);

        // Dynamic styles based on relation
        let bgStyle = isMing ? 'bg-violet-50 border-violet-200' : 'bg-white border-slate-200';
        let borderStyle = '';
        let shadowStyle = '';

        if (relation === 'self') {
            bgStyle = 'bg-violet-100 border-violet-500';
            shadowStyle = 'shadow-md ring-2 ring-violet-300 ring-offset-1 z-10';
        } else if (relation === 'opposite') {
            bgStyle = 'bg-blue-50 border-blue-400 border-dashed';
            shadowStyle = 'ring-2 ring-blue-200 ring-offset-1';
        } else if (relation === 'harmony') {
            bgStyle = 'bg-emerald-50 border-emerald-400';
            shadowStyle = 'ring-2 ring-emerald-200 ring-offset-1';
        }

        return (
            <div
                key={dz}
                onClick={() => setSelectedPalace(dz === selectedPalace ? null : dz)}
                className={`aspect-square p-2 border rounded-lg flex flex-col justify-between text-center cursor-pointer transition-all duration-200 hover:shadow-md ${bgStyle} ${borderStyle} ${shadowStyle}`}
            >
                <div className="flex justify-between items-start">
                    <span className="text-xs text-slate-400 font-mono">{dz}</span>
                    {relation && (
                        <span className={`text-[10px] px-1 rounded-full ${relation === 'self' ? 'bg-violet-200 text-violet-700' :
                            relation === 'opposite' ? 'bg-blue-100 text-blue-600' :
                                'bg-emerald-100 text-emerald-600'
                            }`}>
                            {relation === 'self' ? '本宮' : relation === 'opposite' ? '對宮' : '三合'}
                        </span>
                    )}
                </div>
                <div className={`text-xs font-medium ${isMing ? 'text-violet-700' : 'text-slate-600'}`}>{palaceName}</div>
                <div className={`text-xs font-bold leading-tight line-clamp-2 ${isMing ? 'text-violet-900' : 'text-slate-700'}`}>
                    {stars || <span className="text-slate-300 font-normal">無主星</span>}
                </div>
            </div>
        );
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
                    {/* 農曆與基本資訊 */}
                    {ziweiData.lunar_date && (
                        <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 mb-6 border border-slate-200">
                            <div className="flex flex-wrap gap-4 items-center justify-center">
                                <span className="text-sm text-slate-600">📅 農曆：<span className="font-bold text-slate-800">{ziweiData.lunar_date}</span></span>
                                {ziweiData.wuxing_ju && <span className="text-sm text-slate-600">🔮 五行局：<span className="font-bold text-purple-700">{ziweiData.wuxing_ju}</span></span>}
                                {ziweiData.ming_palace_dizhi && <span className="text-sm text-slate-600">🏛️ 命宮：<span className="font-bold text-violet-700">{ziweiData.ming_palace_dizhi}宮</span></span>}
                            </div>
                        </div>
                    )}

                    {/* Main Stars */}
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
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

                    {/* 四化 */}
                    {ziweiData.si_hua && (
                        <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl p-4 mb-6 border border-cyan-200">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">🌊</span>
                                <span className="text-sm font-bold text-cyan-800">本年四化</span>
                            </div>
                            <p className="text-sm text-cyan-700">{ziweiData.si_hua}</p>
                        </div>
                    )}

                    {/* Traditional 4x4 Ziwei Chart Grid */}
                    <div className="bg-white rounded-2xl border border-violet-100 shadow-lg overflow-hidden mb-8">
                        <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-white">🏛️ 紫微命盤</h3>
                            <span className="text-xs text-violet-200 bg-white/10 px-2 py-1 rounded">
                                {selectedPalace ? "點擊其他宮位查看關係" : "點擊宮位查看三方四正"}
                            </span>
                        </div>
                        <div className="p-4">
                            {/* Traditional 4x4 Grid Layout */}
                            <div className="grid grid-cols-4 gap-1 max-w-2xl mx-auto">
                                {/* Row 1: 巳 午 未 申 */}
                                {/* Row 1: 巳 午 未 申 */}
                                {['巳', '午', '未', '申'].map(renderPalaceCell)}

                                {/* Row 2: 辰 + Center + 酉 */}
                                {/* Row 2: 辰 + Center + 酉 */}
                                {['辰'].map(renderPalaceCell)}
                                {/* Center cells (span 2 rows) */}
                                <div className="col-span-2 row-span-2 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-3 flex flex-col justify-center items-center">
                                    <div className="text-lg font-bold text-purple-800 mb-2">紫微斗數</div>
                                    <div className="text-xs text-purple-600 space-y-1 text-center">
                                        <div>命主: <span className="font-bold">{ziweiData.mingzhu}</span></div>
                                        <div>身主: <span className="font-bold">{ziweiData.shenzhu}</span></div>
                                        <div>五行局: <span className="font-bold">{ziweiData.wuxing_ju}</span></div>
                                    </div>
                                    {selectedPalace && (
                                        <div className="mt-4 pt-4 border-t border-purple-200 w-full text-center">
                                            <div className="text-xs text-purple-500 mb-1">當前選取</div>
                                            <div className="font-bold text-purple-800 text-lg">{selectedPalace}宮</div>
                                        </div>
                                    )}
                                </div>
                                {['酉'].map(renderPalaceCell)}

                                {/* Row 3: 卯 + Center + 戌 */}
                                {/* Row 3: 卯 + Center + 戌 */}
                                {['卯'].map(renderPalaceCell)}
                                {/* The center 2x2 is already done with row-span-2 above */}
                                {['戌'].map(renderPalaceCell)}

                                {/* Row 4: 寅 丑 子 亥 */}
                                {/* Row 4: 寅 丑 子 亥 */}
                                {['寅', '丑', '子', '亥'].map(renderPalaceCell)}
                            </div>
                        </div>
                    </div>

                    {/* AI Interpretation */}
                    <div className="bg-white rounded-2xl border border-violet-100 shadow-lg overflow-hidden mb-8">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-violet-100 shadow-lg">
                            <h3 className="text-xl font-bold text-violet-900 mb-6 flex items-center gap-2">
                                <span>📜</span> 命盤詳批
                            </h3>
                            <div className="prose prose-violet max-w-none">
                                {(!ziweiData.interpretation || ziweiData.interpretation.length === 0) && (
                                    <div className="flex items-center gap-3 text-violet-600 animate-pulse py-4">
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>紫微大師正在詳批中，請稍候...</span>
                                    </div>
                                )}
                                {ziweiData.interpretation?.split('\n').map((line, i) => {
                                    if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-4 mb-2 text-violet-800">{line.replace('###', '')}</h3>
                                    if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc text-slate-700">{line.replace('-', '')}</li>
                                    if (line.trim() === '') return <br key={i} />
                                    return <p key={i} className="mb-2 text-slate-700 leading-relaxed">{line}</p>
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Calculate Again */}
                    <button
                        onClick={() => setZiweiData(null)}
                        disabled={loading}
                        className={`w-full font-medium py-3 rounded-xl transition-all ${loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        {loading ? '分析中...' : '重新計算'}
                    </button>
                </>
            )}
        </div>
    );
}
