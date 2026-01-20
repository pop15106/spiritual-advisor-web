"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function UserMenu() {
    const { user, isLoggedIn, login, logout, isLoading, trialDetails } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    if (isLoading) {
        return (
            <div className="w-8 h-8 rounded-full bg-zinc-200 animate-pulse" />
        );
    }

    if (!isLoggedIn) {
        // Simple "Guest" logic or just nothing if we auto-login guests
        // Given the "guest mode" implementation elsewhere, we might just show "Guest"
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 rounded-full border border-yellow-200">
                <span className="text-xl">👤</span>
                <span className="text-xs font-bold text-yellow-800">訪客模式</span>
            </div>
        );
    }

    // Logged in user (Guest User)
    const [timeLeft, setTimeLeft] = useState<string>("");

    // Countdown timer effect
    useEffect(() => {
        if (!trialDetails?.next_reset) return;

        const updateTimer = () => {
            const now = new Date();
            const resetTime = new Date(trialDetails.next_reset!);
            const diff = resetTime.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft("即將重置");
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${hours}時 ${minutes}分 ${seconds}秒`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [trialDetails?.next_reset]);

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
                {user?.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white text-sm font-medium">
                        {user?.name?.[0] || '?'}
                    </div>
                )}
            </button>

            {showDropdown && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-zinc-100 overflow-hidden z-50">
                        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                            <p className="font-medium text-zinc-900 truncate">{user?.name}</p>
                            <p className="text-xs text-zinc-500 truncate mb-3">{user?.email}</p>

                            {/* Trial Status Card */}
                            <div className="bg-white border border-zinc-200 rounded-lg p-3 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs text-zinc-500">剩餘次數</span>
                                    <span className="text-sm font-bold text-gold">{trialDetails?.total || 0} 次</span>
                                </div>

                                <div className="space-y-1 mb-2">
                                    <div className="flex justify-between text-[10px] text-zinc-400">
                                        <span>初始額度</span>
                                        <span>{trialDetails?.initial || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-zinc-400">
                                        <span>每日免費</span>
                                        <span>{trialDetails?.daily || 0}</span>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-zinc-100 flex justify-between items-center">
                                    <span className="text-[10px] text-zinc-400">下次重置</span>
                                    <span className="text-[10px] font-medium text-purple-600 font-mono">
                                        {timeLeft || "--:--:--"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Guest likely won't have history or logout in the same way, but let's keep basics */}
                        <div className="p-2 border-t border-zinc-100">
                            <div className="px-3 py-2 text-xs text-center text-zinc-400">
                                目前為訪客試用模式
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
