"use client";

const PALACES = [
    { name: "命宮", star: "紫微", main: true },
    { name: "兄弟宮", star: "天機" },
    { name: "夫妻宮", star: "太陽" },
    { name: "子女宮", star: "武曲" },
    { name: "財帛宮", star: "天同" },
    { name: "疾厄宮", star: "廉貞" },
    { name: "遷移宮", star: "天府" },
    { name: "交友宮", star: "太陰" },
    { name: "官祿宮", star: "貪狼" },
    { name: "田宅宮", star: "巨門" },
    { name: "福德宮", star: "天相" },
    { name: "父母宮", star: "天梁" },
];

export default function ZiweiSection() {
    return (
        <div>
            {/* Hero Section - Ziwei Theme: Royal Purple */}
            <div className="relative -mx-6 -mt-8 mb-10 overflow-hidden rounded-b-3xl">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=2050&auto=format&fit=crop"
                        alt="Purple galaxy"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-violet-900/90 via-purple-900/85 to-fuchsia-900/95"></div>
                </div>
                <div className="relative z-10 px-8 py-16 text-center">
                    <div className="text-6xl mb-4">💜</div>
                    <h1 className="text-4xl md:text-5xl font-semibold text-white mb-3">紫微斗數</h1>
                    <p className="text-purple-200 text-lg max-w-xl mx-auto">
                        東方占星術的精華，帝王之學，從命盤看透一生格局
                    </p>
                    <div className="flex justify-center gap-3 mt-6 flex-wrap">
                        {["十二宮位", "十四主星", "輔佐煞星"].map((item, idx) => (
                            <span key={idx} className="px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-lg text-sm text-purple-100 border border-purple-400/30">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Info */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="relative overflow-hidden bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-center text-white shadow-xl">
                    <div className="absolute -right-4 -bottom-4 text-[80px] opacity-10">⭐</div>
                    <div className="relative z-10">
                        <div className="text-4xl mb-2">⭐</div>
                        <p className="text-xs text-purple-200 font-medium uppercase tracking-wider">命宮主星</p>
                        <p className="text-3xl font-bold mt-2">紫微</p>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-fuchsia-50 to-purple-50 rounded-2xl p-6 text-center border border-purple-200">
                    <div className="text-3xl mb-2">👤</div>
                    <p className="text-xs text-purple-600 font-medium uppercase tracking-wider">命主</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">貪狼</p>
                </div>
                <div className="bg-gradient-to-br from-fuchsia-50 to-purple-50 rounded-2xl p-6 text-center border border-purple-200">
                    <div className="text-3xl mb-2">💫</div>
                    <p className="text-xs text-purple-600 font-medium uppercase tracking-wider">身主</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">天機</p>
                </div>
            </div>

            {/* 12 Palaces */}
            <div className="bg-white rounded-2xl border border-purple-100 shadow-lg overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4">
                    <h3 className="text-lg font-medium text-white">🏛️ 十二宮位</h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {PALACES.map((palace, idx) => (
                            <div
                                key={idx}
                                className={`rounded-xl p-4 text-center transition-all hover:-translate-y-1 ${palace.main
                                        ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg"
                                        : "bg-gradient-to-br from-fuchsia-50 to-purple-50 border border-purple-100 hover:border-purple-300 hover:shadow-md"
                                    }`}
                            >
                                <div className={`text-xs font-semibold uppercase tracking-wider ${palace.main ? "text-purple-200" : "text-purple-500"}`}>
                                    {palace.name}
                                </div>
                                <div className={`text-xl font-bold mt-1 ${palace.main ? "text-white" : "text-slate-900"}`}>
                                    {palace.star}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Interpretation */}
            <div className="bg-white rounded-2xl border border-purple-100 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4">
                    <h3 className="text-lg font-medium text-white">💜 命格解析</h3>
                </div>
                <div className="p-6">
                    <div className="flex gap-4 mb-6">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl shrink-0 shadow-lg">⭐</div>
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-1">紫微坐命 · 帝王之格</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                <strong className="text-purple-600">紫微星</strong>是斗數中的帝王星！紫微坐命的人天生具有
                                <strong>領導格局</strong>，氣質高貴，有主見有魄力。是天生的領袖人物。
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-100">
                            <h4 className="font-semibold text-purple-800 mb-3">🌟 性格特質</h4>
                            <ul className="text-sm text-purple-700 space-y-2">
                                <li className="flex items-center gap-2"><span>👑</span> 天生的領導者氣質</li>
                                <li className="flex items-center gap-2"><span>🎯</span> 有主見、有決斷力</li>
                                <li className="flex items-center gap-2"><span>💼</span> 適合擔任管理職位</li>
                                <li className="flex items-center gap-2"><span>⚠️</span> 注意不要太過高傲</li>
                            </ul>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
                            <h4 className="font-semibold text-emerald-800 mb-3">💰 財運分析</h4>
                            <p className="text-sm text-emerald-700 leading-relaxed">
                                <strong>天同</strong>在財帛宮，代表財運平穩，適合穩定收入的工作。
                                財來財去較為順暢，但不適合高風險投機！建議穩健理財。
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 p-5 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-100">
                        <h4 className="font-semibold text-pink-800 mb-2">💕 感情分析</h4>
                        <p className="text-sm text-pink-700 leading-relaxed">
                            <strong>太陽</strong>在夫妻宮，代表另一半可能是陽光、開朗、有能力的類型。
                            感情運勢正面，但要注意太陽的光芒可能掩蓋對方，適時要給予伴侶表現的空間！
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
