"use client";

const CENTERS = [
    { id: "head", name: "頭腦", color: "#f59e0b", defined: false, desc: "靈感與壓力來源" },
    { id: "ajna", name: "邏輯", color: "#10b981", defined: true, desc: "思考與概念化" },
    { id: "throat", name: "喉嚨", color: "#3b82f6", defined: true, desc: "表達與行動力" },
    { id: "g", name: "G中心", color: "#f59e0b", defined: true, desc: "身份認同與方向" },
    { id: "heart", name: "意志力", color: "#ef4444", defined: false, desc: "自我價值與意志" },
    { id: "spleen", name: "脾", color: "#14b8a6", defined: false, desc: "直覺與免疫系統" },
    { id: "solar", name: "情緒", color: "#8b5cf6", defined: true, desc: "情緒波動與感受" },
    { id: "sacral", name: "薦骨", color: "#ef4444", defined: true, desc: "生命力與回應" },
    { id: "root", name: "根", color: "#f97316", defined: true, desc: "壓力與動力" },
];

export default function HumanDesignSection() {
    const hdType = { name: "生產者", icon: "⚡", strategy: "等待回應", desc: "世界的建設者，擁有持久的生命力能量" };
    const profile = "3/5 烈士/異端";

    return (
        <div>
            {/* Hero Section - Human Design Theme: Cosmic Teal/Cyan */}
            <div className="relative -mx-6 -mt-8 mb-10 overflow-hidden rounded-b-3xl">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop"
                        alt="Cosmic energy"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-teal-900/90 via-cyan-900/85 to-slate-900/95"></div>
                </div>
                <div className="relative z-10 px-8 py-16 text-center">
                    <div className="text-6xl mb-4">🧬</div>
                    <h1 className="text-4xl md:text-5xl font-semibold text-white mb-3">人類圖</h1>
                    <p className="text-cyan-200 text-lg max-w-xl mx-auto">
                        融合易經、脈輪、卡巴拉與占星學，揭示您的天生設計藍圖
                    </p>
                    <div className="flex justify-center gap-3 mt-6 flex-wrap">
                        {["9 能量中心", "36 通道", "64 閘門"].map((item, idx) => (
                            <span key={idx} className="px-4 py-2 bg-cyan-500/20 backdrop-blur-sm rounded-lg text-sm text-cyan-100 border border-cyan-400/30">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Bodygraph with Human Body Outline */}
                <div className="bg-gradient-to-br from-slate-50 to-cyan-50 rounded-2xl p-6 border border-cyan-100">
                    <h3 className="text-lg font-medium text-slate-900 mb-4 text-center">人體圖 Bodygraph</h3>
                    <svg viewBox="0 0 300 450" className="w-full max-w-[300px] mx-auto">
                        {/* Human Body Silhouette */}
                        <defs>
                            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#e2e8f0" />
                                <stop offset="100%" stopColor="#cbd5e1" />
                            </linearGradient>
                        </defs>

                        {/* Head outline */}
                        <ellipse cx="150" cy="45" rx="35" ry="40" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,2" />

                        {/* Neck */}
                        <rect x="138" y="82" width="24" height="25" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,2" />

                        {/* Body outline */}
                        <path d="M95 107 Q80 120 75 150 L70 220 Q68 250 80 280 L90 320 Q95 350 90 380 L85 430 L115 430 L120 380 Q125 350 130 320 L140 280 H160 L170 320 Q175 350 180 380 L185 430 L215 430 L210 380 Q205 350 210 320 L220 280 Q232 250 230 220 L225 150 Q220 120 205 107 Z"
                            fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,2" />

                        {/* Arms */}
                        <path d="M75 130 Q50 140 35 180 L25 230" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,2" />
                        <path d="M225 130 Q250 140 265 180 L275 230" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,2" />

                        {/* === Energy Centers === */}

                        {/* Head Center - 頭腦 (top of head) */}
                        <polygon points="150,15 170,45 130,45"
                            fill={CENTERS[0].defined ? CENTERS[0].color : "white"}
                            stroke={CENTERS[0].color} strokeWidth="2.5"
                            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
                        <text x="150" y="37" textAnchor="middle" fill={CENTERS[0].defined ? "white" : "#475569"} fontSize="9" fontWeight="600">頭腦</text>

                        {/* Ajna Center - 邏輯 (forehead/third eye) */}
                        <polygon points="150,50 170,75 130,75"
                            fill={CENTERS[1].defined ? CENTERS[1].color : "white"}
                            stroke={CENTERS[1].color} strokeWidth="2.5"
                            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
                        <text x="150" y="68" textAnchor="middle" fill={CENTERS[1].defined ? "white" : "#475569"} fontSize="9" fontWeight="600">邏輯</text>

                        {/* Throat Center - 喉嚨 (throat) */}
                        <rect x="120" y="92" width="60" height="28" rx="5"
                            fill={CENTERS[2].defined ? CENTERS[2].color : "white"}
                            stroke={CENTERS[2].color} strokeWidth="2.5"
                            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
                        <text x="150" y="111" textAnchor="middle" fill={CENTERS[2].defined ? "white" : "#475569"} fontSize="9" fontWeight="600">喉嚨</text>

                        {/* G Center - 自我中心 (heart area) */}
                        <polygon points="150,135 180,170 150,205 120,170"
                            fill={CENTERS[3].defined ? CENTERS[3].color : "white"}
                            stroke={CENTERS[3].color} strokeWidth="2.5"
                            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
                        <text x="150" y="175" textAnchor="middle" fill={CENTERS[3].defined ? "white" : "#475569"} fontSize="9" fontWeight="600">G中心</text>

                        {/* Heart/Will Center - 意志力 (right chest) */}
                        <polygon points="85,155 105,170 85,185"
                            fill={CENTERS[4].defined ? CENTERS[4].color : "white"}
                            stroke={CENTERS[4].color} strokeWidth="2"
                            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
                        <text x="68" y="173" textAnchor="middle" fill="#475569" fontSize="7" fontWeight="500">意志力</text>

                        {/* Spleen Center - 脾 (left side) */}
                        <polygon points="215,155 195,170 215,185"
                            fill={CENTERS[5].defined ? CENTERS[5].color : "white"}
                            stroke={CENTERS[5].color} strokeWidth="2"
                            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
                        <text x="232" y="173" textAnchor="middle" fill="#475569" fontSize="7" fontWeight="500">脾</text>

                        {/* Solar Plexus - 情緒 (lower right) */}
                        <polygon points="190,215 215,250 190,285 165,250"
                            fill={CENTERS[6].defined ? CENTERS[6].color : "white"}
                            stroke={CENTERS[6].color} strokeWidth="2.5"
                            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
                        <text x="190" y="255" textAnchor="middle" fill={CENTERS[6].defined ? "white" : "#475569"} fontSize="9" fontWeight="600">情緒</text>

                        {/* Sacral Center - 薦骨 (belly/sacrum) */}
                        <rect x="110" y="215" width="70" height="50" rx="6"
                            fill={CENTERS[7].defined ? CENTERS[7].color : "white"}
                            stroke={CENTERS[7].color} strokeWidth="2.5"
                            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
                        <text x="145" y="245" textAnchor="middle" fill={CENTERS[7].defined ? "white" : "#475569"} fontSize="10" fontWeight="600">薦骨</text>

                        {/* Root Center - 根 (base) */}
                        <rect x="110" y="280" width="70" height="40" rx="6"
                            fill={CENTERS[8].defined ? CENTERS[8].color : "white"}
                            stroke={CENTERS[8].color} strokeWidth="2.5"
                            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
                        <text x="145" y="305" textAnchor="middle" fill={CENTERS[8].defined ? "white" : "#475569"} fontSize="10" fontWeight="600">根</text>

                        {/* Channels (connections between centers) */}
                        <line x1="150" y1="45" x2="150" y2="50" stroke={CENTERS[0].defined && CENTERS[1].defined ? "#0d9488" : "#94a3b8"} strokeWidth="4" />
                        <line x1="150" y1="75" x2="150" y2="92" stroke={CENTERS[1].defined && CENTERS[2].defined ? "#0d9488" : "#94a3b8"} strokeWidth="4" />
                        <line x1="150" y1="120" x2="150" y2="135" stroke={CENTERS[2].defined && CENTERS[3].defined ? "#0d9488" : "#94a3b8"} strokeWidth="4" />
                        <line x1="120" y1="170" x2="105" y2="170" stroke={CENTERS[3].defined && CENTERS[4].defined ? "#0d9488" : "#94a3b8"} strokeWidth="3" />
                        <line x1="180" y1="170" x2="195" y2="170" stroke={CENTERS[3].defined && CENTERS[5].defined ? "#0d9488" : "#94a3b8"} strokeWidth="3" />
                        <line x1="150" y1="205" x2="145" y2="215" stroke={CENTERS[3].defined && CENTERS[7].defined ? "#0d9488" : "#94a3b8"} strokeWidth="4" />
                        <line x1="165" y1="240" x2="180" y2="230" stroke={CENTERS[6].defined && CENTERS[7].defined ? "#0d9488" : "#94a3b8"} strokeWidth="3" />
                        <line x1="145" y1="265" x2="145" y2="280" stroke={CENTERS[7].defined && CENTERS[8].defined ? "#0d9488" : "#94a3b8"} strokeWidth="4" />
                    </svg>
                    <div className="flex justify-center gap-4 mt-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-teal-500"></span> 被定義</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded border-2 border-slate-300 bg-white"></span> 未定義</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-teal-600"></span> 通道啟動</span>
                    </div>
                </div>

                {/* Type Info */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl p-8 text-center text-white shadow-xl">
                        <div className="text-6xl mb-4">{hdType.icon}</div>
                        <h3 className="text-3xl font-bold">{hdType.name}</h3>
                        <p className="text-cyan-100 mt-2">{hdType.desc}</p>
                        <div className="inline-block mt-5 px-6 py-2.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30">
                            策略: {hdType.strategy}
                        </div>
                        <p className="mt-4 text-cyan-200 font-medium">🎭 人生角色: {profile}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-cyan-100 p-5 shadow-sm">
                        <h4 className="font-medium text-slate-900 mb-4">📊 能量中心狀態</h4>
                        <div className="space-y-2">
                            {CENTERS.map((center) => (
                                <div key={center.id} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-50 last:border-0">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`w-3 h-3 rounded ${center.defined ? "" : "border-2"}`}
                                            style={{ background: center.defined ? center.color : "transparent", borderColor: center.color }}
                                        />
                                        <span className="text-slate-700 font-medium">{center.name}</span>
                                    </div>
                                    <span className={`text-xs ${center.defined ? "text-teal-600" : "text-slate-400"}`}>
                                        {center.defined ? "被定義" : "開放"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Interpretation */}
            <div className="bg-white rounded-2xl border border-cyan-100 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-4">
                    <h3 className="text-lg font-medium text-white">✨ 你的天生設計</h3>
                </div>
                <div className="p-6">
                    <p className="text-slate-600 leading-relaxed mb-6">
                        作為<strong className="text-teal-600">生產者</strong>，你擁有地球上約 70% 人口的能量類型！
                        你的<strong className="text-red-500">薦骨中心</strong>是被定義的，這意味著你有源源不絕的生命力能量。
                        當你做熱愛的事情時，能量會不斷再生。
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
                            <h4 className="font-semibold text-emerald-800 mb-3">💪 你的超能力</h4>
                            <ul className="text-sm text-emerald-700 space-y-2">
                                <li className="flex items-start gap-2"><span>✓</span> 持久的工作能量</li>
                                <li className="flex items-start gap-2"><span>✓</span> 對「對的事情」有薦骨回應</li>
                                <li className="flex items-start gap-2"><span>✓</span> 創造與建設的天賦</li>
                                <li className="flex items-start gap-2"><span>✓</span> 按部就班的耐心</li>
                            </ul>
                        </div>
                        <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-6 border border-rose-100">
                            <h4 className="font-semibold text-rose-800 mb-3">⚠️ 容易踩的坑</h4>
                            <ul className="text-sm text-rose-700 space-y-2">
                                <li className="flex items-start gap-2"><span>✗</span> 主動發起而非等待回應</li>
                                <li className="flex items-start gap-2"><span>✗</span> 勉強自己做不想做的事</li>
                                <li className="flex items-start gap-2"><span>✗</span> 忽略薦骨的「嗯哼」聲音</li>
                                <li className="flex items-start gap-2"><span>✗</span> 不滿足感累積成挫敗</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
