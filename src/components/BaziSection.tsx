"use client";

import { useState } from "react";
import { baziApi, BaziResponse, BaziChart, BaziPillar } from "@/services/api";

const HOUR_MAP = [
    { label: "子時 (23-01)", value: 0 }, { label: "丑時 (01-03)", value: 1 },
    { label: "寅時 (03-05)", value: 2 }, { label: "卯時 (05-07)", value: 3 },
    { label: "辰時 (07-09)", value: 4 }, { label: "巳時 (09-11)", value: 5 },
    { label: "午時 (11-13)", value: 6 }, { label: "未時 (13-15)", value: 7 },
    { label: "申時 (15-17)", value: 8 }, { label: "酉時 (17-19)", value: 9 },
    { label: "戌時 (19-21)", value: 10 }, { label: "亥時 (21-23)", value: 11 }
];

export default function BaziSection() {
    const [birthDate, setBirthDate] = useState("1990-01-31");
    const [birthHour, setBirthHour] = useState(3); // 默認寅時
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [baziData, setBaziData] = useState<BaziResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const calculateBazi = async () => {
        setLoading(true);
        setBaziData(null); // Clear previous data when starting a new calculation
        setError(null);
        try {
            await baziApi.calculateStream(
                birthDate,
                birthHour, // birthHour is already a number
                gender,
                // onData
                (data: BaziResponse) => {
                    setBaziData(prev => ({ ...data, interpretation: '' }));
                },
                // onChunk
                (chunk: string) => {
                    setBaziData(prev => {
                        if (!prev) return prev;
                        return { ...prev, interpretation: (prev.interpretation || '') + chunk };
                    });
                },
                // onDone
                () => {
                    setLoading(false);
                },
                // onError
                (err: any) => {
                    console.error('Calculation failed:', err);
                    setError("無法連接後端 API，請確認後端服務已啟動");
                    setLoading(false);
                },
                // onReset
                () => {
                    setBaziData(prev => prev ? ({ ...prev, interpretation: '' }) : null);
                }
            );
        } catch (err) { // This catch block handles errors that occur before the stream even starts (e.g., network issues)
            console.error('Calculation failed:', err);
            setError("無法連接後端 API，請確認後端服務已啟動");
            setLoading(false);
        }
    };

    const getElementColor = (wuxing: string) => { // 簡易判斷，若無準確五行數據可略過
        if (wuxing?.includes('木')) return 'text-green-600';
        if (wuxing?.includes('火')) return 'text-red-600';
        if (wuxing?.includes('土')) return 'text-amber-600';
        if (wuxing?.includes('金')) return 'text-yellow-600';
        if (wuxing?.includes('水')) return 'text-blue-600';
        return 'text-zinc-700';
    };

    // 渲染單個柱子
    const renderPillar = (title: string, data: BaziPillar, isDayMaster = false) => (
        <div className="flex flex-col items-center flex-1 min-w-[80px] border-r border-amber-100 last:border-0 relative">
            {/* 十神 (Top) */}
            <div className="h-8 flex items-center justify-center text-xs text-zinc-500 font-medium pt-2">
                {isDayMaster ? <span className="text-red-600 font-bold border border-red-200 px-1 rounded bg-red-50">日主</span> : data.ten_god}
            </div>

            {/* 天干 */}
            <div className="text-2xl font-serif font-bold text-zinc-800 mt-1 mb-1">{data.gan}</div>

            {/* 地支 */}
            <div className="text-2xl font-serif font-bold text-zinc-800 mb-2">{data.zhi}</div>

            {/* 藏干 */}
            <div className="flex flex-col gap-0.5 text-[10px] text-zinc-500 w-full px-2 mb-2">
                {data.hidden_stems.map((h, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-dashed border-amber-100 pb-0.5 last:border-0">
                        <span>{h.gan}</span>
                        <span className="scale-90 origin-right text-zinc-400">{h.ten_god}</span>
                    </div>
                ))}
            </div>

            {/* 納音 & 神煞 */}
            <div className="mt-auto w-full bg-amber-50/50 p-2 text-center text-[10px] text-amber-800">
                <div className="font-medium mb-1">{data.nayin}</div>
                {data.shen_sha.map((s, i) => (
                    <div key={i} className="whitespace-nowrap scale-90">{s}</div>
                ))}
            </div>

            {/* 底部標籤 */}
            <div className="absolute top-0 left-0 text-[9px] text-amber-300 font-bold px-1">{title}</div>
        </div>
    );

    return (
        <div>
            {/* Hero Section */}
            <div className="relative -mx-6 -mt-8 mb-10 overflow-hidden rounded-b-3xl shadow-xl">
                <div className="absolute inset-0 z-0 bg-[#3a1c1c]">
                    <div className="absolute inset-0 bg-gradient-to-b from-red-900/90 via-red-950/95 to-amber-950/95"></div>
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
                </div>
                <div className="relative z-10 px-8 py-10 md:py-16 text-center">
                    <div className="w-16 h-16 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-amber-500/30 mb-4 transition-transform hover:rotate-180 duration-700">
                        <span className="text-3xl">☯️</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 mb-3 tracking-wide">
                        八字命理詳批
                    </h1>
                    <p className="text-amber-200/80 text-sm md:text-base max-w-xl mx-auto font-light tracking-wider">
                        探究先天格局，洞悉大運流年，掌握命運軌跡
                    </p>
                </div>
            </div>

            {/* Input Form */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-amber-100 mb-8 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Date */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">出生日期</label>
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                        />
                    </div>

                    {/* Time */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">出生時辰</label>
                        <select
                            value={birthHour}
                            onChange={(e) => setBirthHour(Number(e.target.value))}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                        >
                            {HOUR_MAP.map(h => (
                                <option key={h.value} value={h.value}>{h.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">性別</label>
                        <div className="flex bg-zinc-50 p-1 rounded-xl border border-zinc-200">
                            <button
                                onClick={() => setGender('male')}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${gender === 'male' ? 'bg-white text-blue-600 shadow-sm border border-zinc-100' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                                乾造 (男)
                            </button>
                            <button
                                onClick={() => setGender('female')}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${gender === 'female' ? 'bg-white text-rose-600 shadow-sm border border-zinc-100' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                                坤造 (女)
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={calculateBazi}
                        disabled={loading}
                        className="px-12 py-3.5 bg-gradient-to-r from-red-800 to-amber-900 text-amber-50 text-base font-medium rounded-full hover:shadow-lg hover:shadow-red-900/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 transform active:scale-95"
                    >
                        {loading ? (
                            <><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> 計算中...</>
                        ) : (
                            <>🔮 開始排盤分析</>
                        )}
                    </button>
                </div>
                {error && <p className="mt-4 text-center text-red-500 text-sm bg-red-50 py-2 rounded-lg">{error}</p>}
            </div>

            {baziData && baziData.chart && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* 命盤 Main Chart */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-amber-100">
                        <div className="bg-[#fcfaf7] border-b border-amber-100 p-4 flex flex-wrap gap-4 text-xs md:text-sm text-zinc-600 justify-between items-center">
                            <div className="flex gap-4">
                                <span>📅 公曆：{baziData.chart.solar_date_str}</span>
                                <span>🌙 農曆：{baziData.chart.lunar_date_str}</span>
                            </div>
                            <div className="flex gap-4 font-bold text-amber-900">
                                <span>{baziData.chart.gender}</span>
                                <span>起運：{baziData.chart.start_age}歲</span>
                            </div>
                        </div>

                        <div className="p-6 md:p-10 overflow-x-auto">
                            <div className="flex min-w-[320px] max-w-3xl mx-auto bg-white border border-amber-200 rounded-lg shadow-sm">
                                {renderPillar("時柱", baziData.chart.pillars.hour)}
                                {renderPillar("日柱 (主)", baziData.chart.pillars.day, true)}
                                {renderPillar("月柱", baziData.chart.pillars.month)}
                                {renderPillar("年柱", baziData.chart.pillars.year)}
                            </div>
                        </div>
                    </div>

                    {/* 大運 Da Yun */}
                    <div className="bg-white rounded-2xl border border-amber-100 shadow-md p-6">
                        <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                            <span>🌊</span> 大運歷程
                        </h3>
                        <div className="overflow-x-auto pb-4">
                            <div className="flex gap-3 min-w-max">
                                {baziData.chart.da_yun.map((yun, i) => (
                                    <div key={i} className="flex flex-col items-center bg-zinc-50 border border-zinc-200 px-3 py-3 rounded-xl min-w-[70px]">
                                        <div className="text-xs text-zinc-400 mb-1">{yun.start_age}歲</div>
                                        <div className="text-xs text-zinc-500 mb-1 scale-90">{yun.gan_ten_god}</div>
                                        <div className="flex flex-col items-center my-1 font-serif text-lg font-bold text-zinc-700">
                                            <span>{yun.gan}</span>
                                            <span>{yun.zhi}</span>
                                        </div>
                                        <div className="text-[10px] text-zinc-400 mt-1 scale-90">{yun.nayin}</div>
                                        <div className="text-[10px] text-amber-600 mt-1">{yun.start_year}~</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* AI Interpretation */}
                    <div className="bg-white rounded-2xl border border-amber-100 shadow-lg p-8">
                        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-800 to-amber-700 mb-6 flex items-center gap-2">
                            <span>📜</span> 命理大師詳批
                        </h3>
                        <div className="prose prose-amber max-w-none prose-headings:font-serif prose-headings:text-amber-900 prose-p:text-zinc-700 prose-strong:text-red-800">
                            {(!baziData.interpretation || baziData.interpretation.length === 0) && (
                                <div className="flex items-center gap-3 text-amber-600 animate-pulse py-4">
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>命理大師正在詳批中，請稍候...</span>
                                </div>
                            )}
                            {baziData.interpretation?.split('\n').map((line, i) => {
                                if (line.startsWith('### ')) return <h3 key={i} className="mt-6 mb-3 text-lg font-bold">{line.replace('### ', '')}</h3>;
                                if (line.startsWith('## ')) return <h2 key={i} className="mt-8 mb-4 text-xl font-bold border-l-4 border-amber-500 pl-3">{line.replace('## ', '')}</h2>;
                                if (line.startsWith('- ')) return <li key={i} className="ml-4 mb-1">{line.replace('- ', '')}</li>;
                                if (line.trim() === '') return <br key={i} />;
                                return <p key={i} className="mb-3 leading-relaxed">{line}</p>;
                            })}
                        </div>
                    </div>

                    <button
                        onClick={() => setBaziData(null)}
                        disabled={loading}
                        className={`w-full font-medium py-3 rounded-xl transition-all shadow-md ${loading ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' : 'bg-white text-zinc-600 hover:bg-zinc-50 border border-zinc-200'}`}
                    >
                        {loading ? '分析中...' : '重新排盤'}
                    </button>

                </div>
            )}
        </div>
    );
}
