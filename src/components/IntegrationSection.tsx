"use client";

import { useState } from "react";
import { integrationApi, IntegrationResponse, baziApi, BaziResponse, BaziChart } from "@/services/api";

const SYSTEMS = [
    { id: "tarot", name: "塔羅", icon: "🃏", color: "from-purple-600 to-violet-600", needsBirthData: false, needsGender: false, needsPreciseTime: false, needsLocation: false },
    { id: "bazi", name: "八字", icon: "☯️", color: "from-red-700 to-amber-600", needsBirthData: true, needsGender: true, needsPreciseTime: true, needsLocation: false },
    { id: "humandesign", name: "人類圖", icon: "🧬", color: "from-cyan-600 to-teal-600", needsBirthData: true, needsGender: false, needsPreciseTime: true, needsLocation: true },
    { id: "astrology", name: "占星", icon: "⭐", color: "from-indigo-600 to-blue-600", needsBirthData: true, needsGender: false, needsPreciseTime: true, needsLocation: true },
    { id: "ziwei", name: "紫微", icon: "💜", color: "from-violet-600 to-purple-600", needsBirthData: true, needsGender: true, needsPreciseTime: false, needsLocation: false },
];

// Planet symbols for astrology content - returns HTML with colored badges
const addPlanetSymbols = (text: string): string => {
    return text
        // Planets - with colored badges
        .replace(/太陽/g, '<span class="inline-flex items-center gap-0.5 bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-md text-sm font-medium">☉太陽</span>')
        .replace(/月亮/g, '<span class="inline-flex items-center gap-0.5 bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md text-sm font-medium">☽月亮</span>')
        .replace(/水星/g, '<span class="inline-flex items-center gap-0.5 bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-md text-sm font-medium">☿水星</span>')
        .replace(/金星/g, '<span class="inline-flex items-center gap-0.5 bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded-md text-sm font-medium">♀金星</span>')
        .replace(/火星/g, '<span class="inline-flex items-center gap-0.5 bg-red-100 text-red-700 px-1.5 py-0.5 rounded-md text-sm font-medium">♂火星</span>')
        .replace(/木星/g, '<span class="inline-flex items-center gap-0.5 bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-md text-sm font-medium">♃木星</span>')
        .replace(/土星/g, '<span class="inline-flex items-center gap-0.5 bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md text-sm font-medium">♄土星</span>')
        .replace(/天王星/g, '<span class="inline-flex items-center gap-0.5 bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded-md text-sm font-medium">♅天王星</span>')
        .replace(/海王星/g, '<span class="inline-flex items-center gap-0.5 bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md text-sm font-medium">♆海王星</span>')
        .replace(/冥王星/g, '<span class="inline-flex items-center gap-0.5 bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md text-sm font-medium">♇冥王星</span>')
        // Angles
        .replace(/上升/g, '<span class="inline-flex items-center gap-0.5 bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-md text-sm font-medium">ASC↑上升</span>')
        // Zodiac signs - with element colors (Fire=red, Earth=green, Air=blue, Water=teal)
        .replace(/牡羊座/g, '<span class="inline-flex items-center gap-0.5 bg-red-50 text-red-600 px-1 py-0.5 rounded text-sm">♈牡羊</span>')
        .replace(/金牛座/g, '<span class="inline-flex items-center gap-0.5 bg-green-50 text-green-600 px-1 py-0.5 rounded text-sm">♉金牛</span>')
        .replace(/雙子座/g, '<span class="inline-flex items-center gap-0.5 bg-sky-50 text-sky-600 px-1 py-0.5 rounded text-sm">♊雙子</span>')
        .replace(/巨蟹座/g, '<span class="inline-flex items-center gap-0.5 bg-teal-50 text-teal-600 px-1 py-0.5 rounded text-sm">♋巨蟹</span>')
        .replace(/獅子座/g, '<span class="inline-flex items-center gap-0.5 bg-red-50 text-red-600 px-1 py-0.5 rounded text-sm">♌獅子</span>')
        .replace(/處女座/g, '<span class="inline-flex items-center gap-0.5 bg-green-50 text-green-600 px-1 py-0.5 rounded text-sm">♍處女</span>')
        .replace(/天秤座/g, '<span class="inline-flex items-center gap-0.5 bg-sky-50 text-sky-600 px-1 py-0.5 rounded text-sm">♎天秤</span>')
        .replace(/天蠍座/g, '<span class="inline-flex items-center gap-0.5 bg-teal-50 text-teal-600 px-1 py-0.5 rounded text-sm">♏天蠍</span>')
        .replace(/射手座/g, '<span class="inline-flex items-center gap-0.5 bg-red-50 text-red-600 px-1 py-0.5 rounded text-sm">♐射手</span>')
        .replace(/摩羯座/g, '<span class="inline-flex items-center gap-0.5 bg-green-50 text-green-600 px-1 py-0.5 rounded text-sm">♑摩羯</span>')
        .replace(/水瓶座/g, '<span class="inline-flex items-center gap-0.5 bg-sky-50 text-sky-600 px-1 py-0.5 rounded text-sm">♒水瓶</span>')
        .replace(/雙魚座/g, '<span class="inline-flex items-center gap-0.5 bg-teal-50 text-teal-600 px-1 py-0.5 rounded text-sm">♓雙魚</span>');
};

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

const CITIES = [
    { name: "台北", lat: 25.033, lng: 121.565 },
    { name: "新北", lat: 25.017, lng: 121.462 },
    { name: "基隆", lat: 25.127, lng: 121.739 },
    { name: "桃園", lat: 24.993, lng: 121.301 },
    { name: "新竹", lat: 24.813, lng: 120.967 },
    { name: "苗栗", lat: 24.560, lng: 120.821 },
    { name: "台中", lat: 24.147, lng: 120.673 },
    { name: "彰化", lat: 24.051, lng: 120.516 },
    { name: "南投", lat: 23.903, lng: 120.690 },
    { name: "雲林", lat: 23.709, lng: 120.431 },
    { name: "嘉義", lat: 23.480, lng: 120.449 },
    { name: "台南", lat: 22.999, lng: 120.226 },
    { name: "高雄", lat: 22.627, lng: 120.301 },
    { name: "屏東", lat: 22.551, lng: 120.548 },
    { name: "宜蘭", lat: 24.702, lng: 121.737 },
    { name: "花蓮", lat: 23.987, lng: 121.601 },
    { name: "台東", lat: 22.760, lng: 121.144 },
    { name: "澎湖", lat: 23.571, lng: 119.579 },
    { name: "金門", lat: 24.329, lng: 118.411 },
    { name: "連江", lat: 26.151, lng: 119.957 },
];

export default function IntegrationSection() {
    const [selectedSystems, setSelectedSystems] = useState(["tarot", "bazi", "humandesign"]);
    const [question, setQuestion] = useState("");
    const [birthDate, setBirthDate] = useState("1990-01-01");
    const [birthHour, setBirthHour] = useState(3);
    const [birthTime, setBirthTime] = useState("06:00");  // 精確時間
    const [birthCity, setBirthCity] = useState(CITIES[0]);  // 出生地點
    const [gender, setGender] = useState<"male" | "female">("male");  // 性別
    const [result, setResult] = useState<IntegrationResponse | null>(null);
    const [baziData, setBaziData] = useState<BaziChart | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingStage, setLoadingStage] = useState("");  // 載入階段提示
    const [error, setError] = useState<string | null>(null);

    const toggleSystem = (id: string) => {
        setSelectedSystems((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    // Check requirements based on selected systems
    const needsBirthData = selectedSystems.some(
        sysId => SYSTEMS.find(s => s.id === sysId)?.needsBirthData
    );
    const needsGender = selectedSystems.some(
        sysId => SYSTEMS.find(s => s.id === sysId)?.needsGender
    );
    const needsPreciseTime = selectedSystems.some(
        sysId => SYSTEMS.find(s => s.id === sysId)?.needsPreciseTime
    );
    const needsLocation = selectedSystems.some(
        sysId => SYSTEMS.find(s => s.id === sysId)?.needsLocation
    );

    // Convert precise time to shichen for Ziwei
    const getShichenFromTime = (timeStr: string): number => {
        const hour = parseInt(timeStr.split(':')[0]);
        if (hour === 23 || hour === 0) return 0;  // 子時
        return Math.floor((hour + 1) / 2);
    };

    const analyzeIntegration = async () => {
        if (selectedSystems.length < 2) return;

        // Validation: Tarot requires a question
        if (selectedSystems.includes('tarot') && !question.trim()) {
            setError("🔮 選擇塔羅牌系統時，請務必輸入具體問題，以便塔羅大師進行感應。");
            return;
        }

        setLoading(true);
        setError(null);

        // Build dynamic loading message based on selected systems
        const systemNames = selectedSystems.map(id => {
            const sys = SYSTEMS.find(s => s.id === id);
            return sys ? `${sys.icon}${sys.name}` : id;
        }).join(' + ');
        setLoadingStage(`正在準備 ${systemNames} 分析...`);

        try {
            // Calculate effective birthHour from precise time if needed
            const effectiveBirthHour = needsPreciseTime
                ? getShichenFromTime(birthTime)
                : birthHour;

            // Only calculate bazi if bazi is selected
            let baziResult: BaziResponse | null = null;
            if (selectedSystems.includes('bazi')) {
                const baziSys = SYSTEMS.find(s => s.id === 'bazi');
                setLoadingStage(`${baziSys?.icon || '☯️'} 計算八字命盤...`);
                baziResult = await baziApi.calculate(birthDate, effectiveBirthHour);
                if (baziResult.success) {
                    setBaziData(baziResult.chart);
                }
            } else {
                setBaziData(null);  // Clear bazi data if not selected
            }

            // Build enriched question
            let baseQuestion = question;
            if (!question.trim()) {
                // No question + No Tarot => Full Analysis
                baseQuestion = "請針對我的命盤做「全盤解析」，詳細分析我的性格特質、天賦潛能、人生挑戰以及近期的流年運勢。";
            }

            let enrichedQuestion = baseQuestion;

            // Add birth data context
            if (needsBirthData) {
                enrichedQuestion += `\n\n[用戶出生資料]\n`;
                enrichedQuestion += `出生日期：${birthDate}\n`;

                if (needsPreciseTime) {
                    enrichedQuestion += `出生時間：${birthTime}\n`;
                } else {
                    enrichedQuestion += `出生時辰：${HOURS[effectiveBirthHour]?.label || effectiveBirthHour}\n`;
                }

                if (needsGender) {
                    enrichedQuestion += `性別：${gender === 'male' ? '男' : '女'}\n`;
                }

                if (needsLocation) {
                    enrichedQuestion += `出生地點：${birthCity.name} (${birthCity.lat}, ${birthCity.lng})\n`;
                }
            }

            // Add bazi chart if available
            if (baziResult && baziResult.success && baziResult.chart) {
                const chart = baziResult.chart;
                const p = chart.pillars;
                enrichedQuestion += `\n[八字命盤]\n`;
                enrichedQuestion += `八字：${p.year.gan}${p.year.zhi} ${p.month.gan}${p.month.zhi} ${p.day.gan}${p.day.zhi} ${p.hour.gan}${p.hour.zhi}\n`;
                enrichedQuestion += `日主：${chart.day_master}\n`;
                enrichedQuestion += `農曆：${chart.lunar_date_str}`;
            }

            // Prepare structured birth data for backend calculations
            const birthDataForBackend = needsBirthData ? {
                date: birthDate,
                time: needsPreciseTime ? birthTime : undefined,
                hour: effectiveBirthHour,
                gender: needsGender ? gender : undefined,
                city: needsLocation ? birthCity : undefined,
            } : undefined;


            setLoadingStage(`🔮 大師將為您進行深度整合分析（約30秒）...`);

            // 使用串流模式進行整合分析
            let cumulativeAnalysis = "";
            await integrationApi.analyzeStream(
                enrichedQuestion,
                selectedSystems,
                birthDataForBackend,
                (initialData) => {
                    // 接收到計算出的原始數據（八字、塔羅等）
                    // 確保 analysis 欄位存在，避免渲染時 split 報錯
                    setResult({
                        ...initialData,
                        analysis: ""
                    });
                },
                (chunk) => {
                    // 接收到 AI 解析片段
                    cumulativeAnalysis += chunk;
                    setResult(prev => prev ? {
                        ...prev,
                        analysis: cumulativeAnalysis
                    } : null);
                },
                () => {
                    // 完成
                    setLoading(false);
                    setLoadingStage("");
                },
                (err) => {
                    setError("分析過程中發生錯誤，請稍後再試");
                    console.error("Integration stream error:", err);
                    setLoading(false);
                    setLoadingStage("");
                }
            );

        } catch (err) {
            setError("無法連接後端 API，請確認後端服務已啟動");
            console.error("Integration API error:", err);
            setLoading(false);
            setLoadingStage("");
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
                                {[
                                    needsGender && '性別',
                                    needsPreciseTime && '精確時間',
                                    needsLocation && '地點'
                                ].filter(Boolean).join('、') || '日期、時辰'}
                            </span>
                        </div>

                        {/* Row 1: Date + Time */}
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-amber-700 mb-1">出生日期 (國曆)</label>
                                <input
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    className="w-full bg-white border border-amber-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                                />
                            </div>

                            {/* Precise Time OR Shichen based on requirements */}
                            <div>
                                {needsPreciseTime ? (
                                    <>
                                        <label className="block text-sm font-medium text-amber-700 mb-1">精確出生時間</label>
                                        <input
                                            type="time"
                                            value={birthTime}
                                            onChange={(e) => {
                                                setBirthTime(e.target.value);
                                                setBirthHour(getShichenFromTime(e.target.value));
                                            }}
                                            className="w-full bg-white border border-amber-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                                        />
                                    </>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Row 2: Gender + Location (conditional) */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Gender - for 紫微 and 八字 */}
                            {needsGender && (
                                <div>
                                    <label className="block text-sm font-medium text-amber-700 mb-1">性別</label>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setGender("male")}
                                            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${gender === "male"
                                                ? "bg-blue-500 text-white shadow"
                                                : "bg-white border border-amber-300 text-slate-600 hover:border-blue-300"
                                                }`}
                                        >
                                            👨 男
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setGender("female")}
                                            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${gender === "female"
                                                ? "bg-pink-500 text-white shadow"
                                                : "bg-white border border-amber-300 text-slate-600 hover:border-pink-300"
                                                }`}
                                        >
                                            👩 女
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Location - for 占星 and 人類圖 */}
                            {needsLocation && (
                                <div>
                                    <label className="block text-sm font-medium text-amber-700 mb-1">出生地點</label>
                                    <select
                                        value={birthCity.name}
                                        onChange={(e) => {
                                            const city = CITIES.find(c => c.name === e.target.value);
                                            if (city) setBirthCity(city);
                                        }}
                                        className="w-full bg-white border border-amber-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                                    >
                                        {CITIES.map((c) => (
                                            <option key={c.name} value={c.name}>📍 {c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
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
                {!question.trim() && !selectedSystems.includes('tarot') && (
                    <p className="mt-2 text-xs text-indigo-500 flex items-center gap-1">
                        💡 提示：若未輸入問題，AI 將為您進行「個人命盤全盤解析」。
                    </p>
                )}
                {!question.trim() && selectedSystems.includes('tarot') && (
                    <p className="mt-2 text-xs text-purple-500 font-medium flex items-center gap-1">
                        ⚠️ 提示：選擇「塔羅」時，請務必輸入您的問題以進行占卜。
                    </p>
                )}

                <button
                    onClick={analyzeIntegration}
                    disabled={selectedSystems.length < 2 || loading}
                    className="mt-6 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-sm font-medium py-4 rounded-full hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin">🔄</span>
                            {loadingStage || "分析中..."}
                        </span>
                    ) : "🔮 開始多系統整合分析"}
                </button>

                {error && (
                    <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
                )}
            </div>

            {result && (
                <>
                    {/* Birth Chart Summary (only show if Bazi is selected) */}
                    {selectedSystems.includes("bazi") && baziData && (
                        <div className="mb-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-200/50">
                                <div>
                                    <h3 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                                        📋 您的命盤資料
                                    </h3>
                                    <p className="text-amber-700 text-sm mt-1">{baziData.summary_short || `${baziData.day_master}日主，性格獨特。`}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-amber-500 block uppercase tracking-wider mb-1">農曆日期</span>
                                    <span className="font-semibold text-amber-900">{baziData.lunar_date_str}</span>
                                </div>
                            </div>

                            <div className="flex justify-center gap-3 overflow-x-auto pb-2">
                                {[
                                    { key: 'year', label: '年柱' },
                                    { key: 'month', label: '月柱' },
                                    { key: 'day', label: '日柱' },
                                    { key: 'hour', label: '時柱' }
                                ].reverse().map((pInfo, i) => {
                                    const p = baziData.pillars[pInfo.key as keyof typeof baziData.pillars];
                                    const isDayMaster = pInfo.key === 'day';
                                    return (
                                        <div key={pInfo.key} className={`flex flex-col items-center min-w-[70px] pt-2 px-2 pb-3 rounded-xl border ${isDayMaster ? 'bg-amber-100/80 border-amber-400 shadow-sm' : 'bg-white border-amber-200'}`}>
                                            <span className={`text-[11px] mb-2 font-medium ${isDayMaster ? 'text-amber-800' : 'text-amber-500'}`}>{pInfo.label}</span>
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="text-2xl font-serif font-bold text-zinc-800">{p.gan}</div>
                                                <div className="text-2xl font-serif font-bold text-zinc-800">{p.zhi}</div>
                                            </div>
                                            <div className={`mt-2 text-[10px] py-0.5 px-1.5 rounded-full ${isDayMaster ? 'bg-red-500 text-white' : 'bg-amber-50 text-amber-600'}`}>
                                                {isDayMaster ? '日主' : p.ten_god}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="bg-white/50 p-3 rounded-xl border border-amber-100">
                                    <span className="text-[10px] text-amber-500 block mb-1">五行屬性</span>
                                    <span className="text-sm font-bold text-amber-900">{baziData.dm_wuxing || '未知'}</span>
                                </div>
                                <div className="bg-white/50 p-3 rounded-xl border border-amber-100">
                                    <span className="text-[10px] text-amber-500 block mb-1">主要性格</span>
                                    <span className="text-sm font-bold text-amber-900">{baziData.dm_trait || '獨特'}</span>
                                </div>
                                <div className="bg-white/50 p-3 rounded-xl border border-amber-100 col-span-2">
                                    <span className="text-[10px] text-amber-500 block mb-1">格局意義</span>
                                    <span className="text-[11px] text-amber-800 leading-tight">代表您的核心本質與內在動力。</span>
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
                                    {result?.system_data?.tarot ? (
                                        <div className="text-sm text-purple-700">
                                            <div className="font-bold mb-1 border-b border-purple-200 pb-1">{result.system_data.tarot.spread_name}</div>
                                            <ul className="space-y-1 mt-2">
                                                {result.system_data.tarot.cards.map((card, idx) => (
                                                    <li key={idx}>• {card}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-purple-700 opacity-70">
                                            {loading ? "正在感應牌陣..." : "請點擊分析以進行抽牌"}
                                        </p>
                                    )}
                                </div>
                            )}
                            {selectedSystems.includes("bazi") && baziData && (
                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-300 shadow-sm">
                                    <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-3">☯️ 八字觀點</h4>

                                    {/* 1. Summary line */}
                                    <div className="text-sm font-bold text-amber-800 mb-4 pb-2 border-b border-amber-200/50">
                                        ✨ {baziData.summary_short}
                                    </div>

                                    {/* 2. Simplified 4-pillars with labels */}
                                    <div className="flex gap-2 justify-between mb-4">
                                        {[
                                            { k: 'year', l: '年' },
                                            { k: 'month', l: '月' },
                                            { k: 'day', l: '日' },
                                            { k: 'hour', l: '時' }
                                        ].reverse().map(item => {
                                            const p = baziData.pillars[item.k as keyof typeof baziData.pillars];
                                            const isDay = item.k === 'day';
                                            return (
                                                <div key={item.k} className="flex flex-col items-center">
                                                    <span className="text-[10px] text-amber-500 font-medium mb-1">{item.l}</span>
                                                    <div className={`flex flex-col items-center bg-white px-2 py-1 rounded shadow-sm border ${isDay ? 'border-amber-500 ring-1 ring-amber-100' : 'border-amber-100'}`}>
                                                        <span className={`text-sm font-bold ${isDay ? 'text-red-700' : 'text-zinc-800'}`}>{p.gan}</span>
                                                        <span className="text-sm font-bold text-zinc-800">{p.zhi}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* 3. Meaning hint */}
                                    <div className="bg-amber-100/50 rounded-lg p-2 text-[11px] text-amber-700 leading-snug">
                                        💡 <strong>解读：</strong>您命格屬<strong>{baziData.dm_wuxing}</strong>，象徵著「{baziData.dm_trait}」。此格局預示著良好的生命能量與獨特的處世風格。
                                    </div>
                                </div>
                            )}
                            {selectedSystems.includes("humandesign") && (
                                <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-5 border border-cyan-200">
                                    <h4 className="font-medium text-cyan-900 flex items-center gap-2 mb-2">🧬 人類圖觀點</h4>
                                    <p className="text-sm text-cyan-700">
                                        {result?.system_data?.humandesign?.summary || "等待計算..."}
                                    </p>
                                </div>
                            )}
                            {selectedSystems.includes("astrology") && (
                                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-200">
                                    <h4 className="font-medium text-indigo-900 flex items-center gap-2 mb-2">⭐ 占星觀點</h4>
                                    <p className="text-sm text-indigo-700">
                                        {result?.system_data?.astrology?.summary || "等待計算..."}
                                    </p>
                                </div>
                            )}
                            {selectedSystems.includes("ziwei") && (
                                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-5 border border-violet-200">
                                    <h4 className="font-medium text-violet-900 flex items-center gap-2 mb-2">💜 紫微觀點</h4>
                                    <p className="text-sm text-violet-700">
                                        {result?.system_data?.ziwei?.summary || "等待計算..."}
                                    </p>
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
                        <div className="p-8">
                            <div className="space-y-6">
                                {loading && !result.analysis && (
                                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 animate-pulse">
                                        <div className="text-4xl mb-2">🔮</div>
                                        <h4 className="text-xl font-medium text-indigo-900">正在融合東方與西方智慧，為您解讀命盤...</h4>
                                        <p className="text-indigo-500">{loadingStage || "大師正在凝神感應中，請稍候..."}</p>
                                    </div>
                                )}
                                {(result.analysis || "").split('\n').reduce((acc: React.ReactNode[], line, idx) => {
                                    // Handle Headers (###)
                                    if (line.startsWith('### ')) {
                                        const cleanLine = line.replace('### ', '');

                                        // System-specific styling
                                        let icon = '📌';
                                        let bgColor = 'bg-slate-50';
                                        let borderColor = 'border-slate-300';
                                        let textColor = 'text-slate-900';

                                        // Check for system keywords
                                        if (cleanLine.includes('塔羅') || cleanLine.includes('tarot')) {
                                            icon = '🃏'; bgColor = 'bg-purple-50'; borderColor = 'border-purple-400'; textColor = 'text-purple-900';
                                        } else if (cleanLine.includes('八字') || cleanLine.includes('命理')) {
                                            icon = '☯️'; bgColor = 'bg-amber-50'; borderColor = 'border-amber-400'; textColor = 'text-amber-900';
                                        } else if (cleanLine.includes('紫微') || cleanLine.includes('斗數')) {
                                            icon = '💜'; bgColor = 'bg-violet-50'; borderColor = 'border-violet-400'; textColor = 'text-violet-900';
                                        } else if (cleanLine.includes('占星') || cleanLine.includes('星盤') || cleanLine.includes('星座')) {
                                            icon = '⭐'; bgColor = 'bg-indigo-50'; borderColor = 'border-indigo-400'; textColor = 'text-indigo-900';
                                        } else if (cleanLine.includes('人類圖') || cleanLine.includes('HD')) {
                                            icon = '🧬'; bgColor = 'bg-cyan-50'; borderColor = 'border-cyan-400'; textColor = 'text-cyan-900';
                                        } else if (cleanLine.includes('命格') || cleanLine.includes('特質') || cleanLine.includes('綜合')) {
                                            icon = '🌟'; bgColor = 'bg-gradient-to-r from-indigo-50 to-purple-50'; borderColor = 'border-indigo-400'; textColor = 'text-indigo-900';
                                        } else if (cleanLine.includes('運勢') || cleanLine.includes('今年') || cleanLine.includes('流年')) {
                                            icon = '📅'; bgColor = 'bg-blue-50'; borderColor = 'border-blue-400'; textColor = 'text-blue-900';
                                        } else if (cleanLine.includes('建議') || cleanLine.includes('行動')) {
                                            icon = '💡'; bgColor = 'bg-green-50'; borderColor = 'border-green-400'; textColor = 'text-green-900';
                                        } else if (cleanLine.includes('注意') || cleanLine.includes('提醒')) {
                                            icon = '⚠️'; bgColor = 'bg-yellow-50'; borderColor = 'border-yellow-400'; textColor = 'text-yellow-900';
                                        }

                                        acc.push(
                                            <div key={`head-${idx}`} className={`flex items-center gap-3 mt-8 mb-4 p-3 rounded-lg ${bgColor} border-l-4 ${borderColor}`}>
                                                <span className="text-2xl">{icon}</span>
                                                <h3 className={`text-lg font-bold ${textColor}`}>{cleanLine}</h3>
                                            </div>
                                        );
                                    }
                                    // Handle Main Headers (##)
                                    else if (line.startsWith('## ')) {
                                        acc.push(
                                            <h2 key={`main-${idx}`} className="text-xl font-bold text-slate-900 mt-8 mb-4 bg-indigo-50 p-3 rounded-lg border-l-4 border-indigo-500">
                                                {line.replace('## ', '')}
                                            </h2>
                                        );
                                    }
                                    // Handle #### Sub-Headers (System Viewpoints)
                                    else if (line.startsWith('#### ') || line.startsWith('####')) {
                                        const cleanLine = line.replace(/^####\s*/, '').replace(/\*\*/g, '');

                                        // System-specific card styling
                                        let icon = '📌';
                                        let gradientFrom = 'from-slate-100';
                                        let gradientTo = 'to-slate-50';
                                        let borderColor = 'border-slate-400';
                                        let textColor = 'text-slate-900';
                                        let shadowColor = 'shadow-slate-200';

                                        if (cleanLine.includes('塔羅') || cleanLine.includes('tarot')) {
                                            icon = '🃏'; gradientFrom = 'from-purple-100'; gradientTo = 'to-violet-50'; borderColor = 'border-purple-500'; textColor = 'text-purple-900'; shadowColor = 'shadow-purple-200';
                                        } else if (cleanLine.includes('八字') || cleanLine.includes('命理')) {
                                            icon = '☯️'; gradientFrom = 'from-amber-100'; gradientTo = 'to-orange-50'; borderColor = 'border-amber-500'; textColor = 'text-amber-900'; shadowColor = 'shadow-amber-200';
                                        } else if (cleanLine.includes('紫微') || cleanLine.includes('斗數')) {
                                            icon = '💜'; gradientFrom = 'from-violet-100'; gradientTo = 'to-purple-50'; borderColor = 'border-violet-500'; textColor = 'text-violet-900'; shadowColor = 'shadow-violet-200';
                                        } else if (cleanLine.includes('占星') || cleanLine.includes('星盤') || cleanLine.includes('星座')) {
                                            icon = '⭐'; gradientFrom = 'from-indigo-100'; gradientTo = 'to-blue-50'; borderColor = 'border-indigo-500'; textColor = 'text-indigo-900'; shadowColor = 'shadow-indigo-200';
                                        } else if (cleanLine.includes('人類圖') || cleanLine.includes('HD')) {
                                            icon = '🧬'; gradientFrom = 'from-cyan-100'; gradientTo = 'to-teal-50'; borderColor = 'border-cyan-500'; textColor = 'text-cyan-900'; shadowColor = 'shadow-cyan-200';
                                        } else if (cleanLine.includes('綜合') || cleanLine.includes('整合') || cleanLine.includes('總結')) {
                                            icon = '✨'; gradientFrom = 'from-indigo-100'; gradientTo = 'to-pink-50'; borderColor = 'border-pink-500'; textColor = 'text-indigo-900'; shadowColor = 'shadow-pink-200';
                                        }

                                        acc.push(
                                            <div key={`h4-${idx}`} className={`mt-10 mb-5 p-4 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-xl border-l-4 ${borderColor} shadow-lg ${shadowColor}`}>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-3xl drop-shadow-sm">{icon}</span>
                                                    <h4 className={`text-xl font-bold ${textColor}`}>{cleanLine}</h4>
                                                </div>
                                            </div>
                                        );
                                    }
                                    // Handle Bullet Points (- **)
                                    else if (line.trim().startsWith('- **')) {
                                        const bulletContent = addPlanetSymbols(line.replace('- ', ''))
                                            .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-indigo-900 bg-indigo-50 px-1 rounded mx-0.5">$1</span>');
                                        acc.push(
                                            <div key={`bullet-${idx}`} className="flex items-start gap-3 my-3 p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow transition-all">
                                                <div className="mt-1.5 w-2 h-2 rounded-full bg-indigo-500 shrink-0 shadow-sm" />
                                                <div className="text-slate-700 leading-relaxed flex-1" dangerouslySetInnerHTML={{
                                                    __html: bulletContent
                                                }} />
                                            </div>
                                        );
                                    }
                                    // Handle Numbered Headers with system keywords (like **1. 占星分析**)
                                    else if (line.match(/^\*{0,2}\d+\.\s*/) && (
                                        line.includes('占星') || line.includes('塔羅') || line.includes('八字') ||
                                        line.includes('紫微') || line.includes('人類圖') || line.includes('生命藍圖') ||
                                        line.includes('洞察') || line.includes('觀點') || line.includes('解碼') ||
                                        line.includes('分析') || line.includes('運勢') || line.includes('總結')
                                    )) {
                                        const num = line.match(/\d+/)?.[0];
                                        const cleanText = line.replace(/^\*{0,2}\d+\.\s*/, '').replace(/\*\*/g, '');

                                        // System-specific styling
                                        let icon = '📌';
                                        let gradientFrom = 'from-slate-100';
                                        let gradientTo = 'to-slate-50';
                                        let borderColor = 'border-slate-400';
                                        let textColor = 'text-slate-900';
                                        let numBgColor = 'bg-slate-600';

                                        if (cleanText.includes('塔羅') || cleanText.includes('tarot') || cleanText.includes('牌陣')) {
                                            icon = '🃏'; gradientFrom = 'from-purple-100'; gradientTo = 'to-violet-50'; borderColor = 'border-purple-500'; textColor = 'text-purple-900'; numBgColor = 'bg-purple-600';
                                        } else if (cleanText.includes('八字') || cleanText.includes('命理') || cleanText.includes('命盤')) {
                                            icon = '☯️'; gradientFrom = 'from-amber-100'; gradientTo = 'to-orange-50'; borderColor = 'border-amber-500'; textColor = 'text-amber-900'; numBgColor = 'bg-amber-600';
                                        } else if (cleanText.includes('紫微') || cleanText.includes('斗數')) {
                                            icon = '💜'; gradientFrom = 'from-violet-100'; gradientTo = 'to-purple-50'; borderColor = 'border-violet-500'; textColor = 'text-violet-900'; numBgColor = 'bg-violet-600';
                                        } else if (cleanText.includes('占星') || cleanText.includes('星盤') || cleanText.includes('星座') || cleanText.includes('生命藍圖')) {
                                            icon = '⭐'; gradientFrom = 'from-indigo-100'; gradientTo = 'to-blue-50'; borderColor = 'border-indigo-500'; textColor = 'text-indigo-900'; numBgColor = 'bg-indigo-600';
                                        } else if (cleanText.includes('人類圖') || cleanText.includes('HD')) {
                                            icon = '🧬'; gradientFrom = 'from-cyan-100'; gradientTo = 'to-teal-50'; borderColor = 'border-cyan-500'; textColor = 'text-cyan-900'; numBgColor = 'bg-cyan-600';
                                        } else if (cleanText.includes('綜合') || cleanText.includes('總結') || cleanText.includes('整合')) {
                                            icon = '✨'; gradientFrom = 'from-indigo-100'; gradientTo = 'to-pink-50'; borderColor = 'border-pink-500'; textColor = 'text-indigo-900'; numBgColor = 'bg-pink-600';
                                        } else if (cleanText.includes('運勢') || cleanText.includes('建議') || cleanText.includes('提醒')) {
                                            icon = '💡'; gradientFrom = 'from-green-100'; gradientTo = 'to-emerald-50'; borderColor = 'border-green-500'; textColor = 'text-green-900'; numBgColor = 'bg-green-600';
                                        }

                                        acc.push(
                                            <div key={`sysnum-${idx}`} className={`mt-8 mb-5 p-4 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-xl border-l-4 ${borderColor} shadow-lg`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 ${numBgColor} text-white text-sm font-bold rounded-full flex items-center justify-center shadow-md`}>
                                                        {num}
                                                    </div>
                                                    <span className="text-2xl">{icon}</span>
                                                    <h4 className={`text-lg font-bold ${textColor}`}>{cleanText}</h4>
                                                </div>
                                            </div>
                                        );
                                    }
                                    // Handle Regular Numbered Lists (1. **)
                                    else if (line.match(/^\d+\./)) {
                                        const num = line.match(/^\d+/)?.[0];
                                        acc.push(
                                            <div key={`num-${idx}`} className="flex items-start gap-3 my-4 bg-slate-50 p-4 rounded-xl border border-slate-100 transition-hover hover:border-indigo-200">
                                                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                                    {num}
                                                </div>
                                                <div className="text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{
                                                    __html: line.replace(/^\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-slate-900">$1</span>')
                                                }} />
                                            </div>
                                        );
                                    }
                                    // Handle Normal Text (skip empty lines)
                                    else if (line.trim()) {
                                        // Apply planet symbols (returns HTML with styled badges)
                                        const processedLine = addPlanetSymbols(line)
                                            .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-slate-900">$1</span>');

                                        // Check if it's a short emphatic line
                                        if (line.length < 20 && (line.includes('！') || line.includes('：'))) {
                                            acc.push(<p key={`p-${idx}`} className="font-medium text-indigo-800 my-2" dangerouslySetInnerHTML={{ __html: processedLine }} />);
                                        } else {
                                            // Regular paragraphs with card styling
                                            acc.push(
                                                <div key={`p-${idx}`} className="my-3 p-4 bg-gradient-to-r from-white to-slate-50 rounded-xl border border-slate-200 shadow-sm">
                                                    <p className="text-slate-600 leading-7 text-justify" dangerouslySetInnerHTML={{ __html: processedLine }} />
                                                </div>
                                            );
                                        }
                                    }
                                    return acc;
                                }, [])}
                            </div>

                            {/* Disclaimer */}
                            <div className="mt-10 pt-6 border-t border-slate-100 text-center">
                                <p className="text-xs text-slate-400">
                                    此分析結合了多種命理系統的觀點，僅供參考。命運掌握在自己手中，請以積極的態度面對生活。
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
