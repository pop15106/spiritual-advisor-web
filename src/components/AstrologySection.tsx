"use client";

const PLANETS = [
    { name: "太陽", symbol: "☉", sign: "摩羯座", degree: "25°" },
    { name: "月亮", symbol: "☽", sign: "巨蟹座", degree: "12°" },
    { name: "水星", symbol: "☿", sign: "射手座", degree: "18°" },
    { name: "金星", symbol: "♀", sign: "水瓶座", degree: "7°" },
    { name: "火星", symbol: "♂", sign: "牡羊座", degree: "21°" },
    { name: "木星", symbol: "♃", sign: "天秤座", degree: "15°" },
    { name: "土星", symbol: "♄", sign: "摩羯座", degree: "8°" },
];

export default function AstrologySection() {
    return (
        <div>
            {/* Hero Section - Astrology Theme: Deep Blue Starry Night */}
            <div className="relative -mx-6 -mt-8 mb-10 overflow-hidden rounded-b-3xl">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop"
                        alt="Starry night sky"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/90 via-blue-900/85 to-slate-900/95"></div>
                </div>
                <div className="relative z-10 px-8 py-16 text-center">
                    <div className="text-6xl mb-4">⭐</div>
                    <h1 className="text-4xl md:text-5xl font-semibold text-white mb-3">西洋占星</h1>
                    <p className="text-blue-200 text-lg max-w-xl mx-auto">
                        透過星體運行軌跡，解讀您的性格特質與命運軌跡
                    </p>
                    <div className="flex justify-center gap-3 mt-6 flex-wrap">
                        {["☉ 太陽", "☽ 月亮", "⬆️ 上升"].map((item, idx) => (
                            <span key={idx} className="px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-lg text-sm text-blue-100 border border-blue-400/30">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Signs */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="relative overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-8 text-center text-white shadow-xl group hover:shadow-2xl transition-all hover:-translate-y-1">
                    <div className="absolute -right-6 -top-6 text-[120px] opacity-10">♑</div>
                    <div className="relative z-10">
                        <div className="text-5xl mb-3">☀️</div>
                        <p className="text-xs font-semibold text-amber-100/80 uppercase tracking-wider">太陽星座</p>
                        <p className="text-5xl mt-3 font-light">♑</p>
                        <p className="text-2xl font-bold mt-2">摩羯座</p>
                        <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-white/20 border border-white/30">
                            土象 · 本位宮
                        </span>
                    </div>
                </div>

                <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-center text-white shadow-xl group hover:shadow-2xl transition-all hover:-translate-y-1">
                    <div className="absolute -right-6 -top-6 text-[120px] opacity-10">♌</div>
                    <div className="relative z-10">
                        <div className="text-5xl mb-3">⬆️</div>
                        <p className="text-xs font-semibold text-purple-100/80 uppercase tracking-wider">上升星座</p>
                        <p className="text-5xl mt-3 font-light">♌</p>
                        <p className="text-2xl font-bold mt-2">獅子座</p>
                        <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-white/20 border border-white/30">
                            火象 · 固定宮
                        </span>
                    </div>
                </div>
            </div>

            {/* Planets */}
            <div className="bg-white rounded-2xl border border-indigo-100 shadow-lg overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
                    <h3 className="text-lg font-medium text-white">🌌 行星位置</h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {PLANETS.map((planet, idx) => (
                            <div key={idx} className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl p-4 text-center border border-indigo-100 hover:border-indigo-300 transition-all hover:-translate-y-1 hover:shadow-md group">
                                <div className="text-3xl text-indigo-600 group-hover:scale-110 transition-transform">{planet.symbol}</div>
                                <div className="text-xs text-indigo-400 mt-1 font-medium">{planet.name}</div>
                                <div className="text-base font-semibold text-slate-900 mt-2">{planet.sign}</div>
                                <div className="text-xs text-slate-500">{planet.degree}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Interpretation */}
            <div className="bg-white rounded-2xl border border-indigo-100 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
                    <h3 className="text-lg font-medium text-white">🌟 星盤解讀</h3>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl shrink-0">♑</div>
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-1">摩羯座太陽 · 核心本質</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                您的核心是<strong>務實、有野心、追求成就</strong>的摩羯能量。您做事有計畫、有耐心，願意為長遠目標付出努力。
                                責任感強，是可靠的領導者與執行者。
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl shrink-0">♌</div>
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-1">獅子座上升 · 外在形象</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                您給人的第一印象是<strong>自信、大方、有領導氣質</strong>。即使內心是務實的摩羯，
                                外表卻散發著獅子的王者風範，容易成為眾人焦點。
                            </p>
                        </div>
                    </div>
                </div>

                <div className="m-6 p-5 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
                    <h4 className="font-semibold text-indigo-900 mb-3">🎭 這個組合意味著...</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-start gap-2 text-indigo-800">
                            <span className="text-lg">✨</span>
                            <span>外表看起來自信有魄力</span>
                        </div>
                        <div className="flex items-start gap-2 text-indigo-800">
                            <span className="text-lg">🎯</span>
                            <span>內心其實很謹慎務實</span>
                        </div>
                        <div className="flex items-start gap-2 text-indigo-800">
                            <span className="text-lg">👑</span>
                            <span>適合擔任領導者角色</span>
                        </div>
                        <div className="flex items-start gap-2 text-indigo-800">
                            <span className="text-lg">📈</span>
                            <span>事業上容易有成就</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
