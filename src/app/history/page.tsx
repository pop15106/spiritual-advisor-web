"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface Reading {
    id: number;
    type: string;
    result: Record<string, unknown>;
    birth_data?: Record<string, unknown>;
    created_at: string;
}

const typeNames: Record<string, string> = {
    tarot: '塔羅占卜',
    bazi: '八字命理',
    humandesign: '人類圖',
    astrology: '西洋占星',
    ziwei: '紫微斗數',
    integration: '多系統整合',
};

const typeIcons: Record<string, string> = {
    tarot: '🃏',
    bazi: '☯️',
    humandesign: '🧬',
    astrology: '⭐',
    ziwei: '💜',
    integration: '🌐',
};

export default function HistoryPage() {
    const { token, isLoggedIn, isLoading: authLoading } = useAuth();
    const [readings, setReadings] = useState<Reading[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<string>('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && isLoggedIn && token) {
            fetchReadings();
        }
    }, [authLoading, isLoggedIn, token, filter]);

    const fetchReadings = async () => {
        setIsLoading(true);
        try {
            const url = filter
                ? `http://localhost:5000/api/readings?type=${filter}`
                : 'http://localhost:5000/api/readings';

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                setReadings(data.readings);
            } else {
                setError(data.error || '無法載入紀錄');
            }
        } catch {
            setError('無法連接伺服器');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteReading = async (id: number) => {
        if (!confirm('確定要刪除這筆紀錄嗎？')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/readings/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                setReadings(prev => prev.filter(r => r.id !== id));
            }
        } catch {
            alert('刪除失敗');
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6">
                <div className="text-6xl mb-6">🔒</div>
                <h1 className="text-2xl font-medium text-zinc-900 mb-2">請先登入</h1>
                <p className="text-zinc-500 mb-6">登入後即可查看您的占卜歷史紀錄</p>
                <Link
                    href="/"
                    className="bg-zinc-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors"
                >
                    返回首頁
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50">
            {/* Header */}
            <nav className="bg-white border-b border-zinc-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
                    <Link href="/" className="text-lg sm:text-xl tracking-tighter font-semibold text-zinc-900 uppercase">
                        AI 身心靈<span className="text-gold">.</span>
                    </Link>
                    <Link href="/" className="text-xs sm:text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                        ← 返回首頁
                    </Link>
                </div>
            </nav>

            {/* Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-zinc-900">占卜歷史</h1>
                        <p className="text-sm sm:text-base text-zinc-500 mt-1">共 {readings.length} 筆紀錄</p>
                    </div>

                    {/* Filter */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                    >
                        <option value="">全部類型</option>
                        {Object.entries(typeNames).map(([key, name]) => (
                            <option key={key} value={key}>{typeIcons[key]} {name}</option>
                        ))}
                    </select>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                    </div>
                ) : readings.length === 0 ? (
                    <div className="text-center py-12 sm:py-16">
                        <div className="text-5xl sm:text-6xl mb-4">📭</div>
                        <p className="text-zinc-500">還沒有任何占卜紀錄</p>
                        <Link
                            href="/"
                            className="inline-block mt-4 text-gold hover:underline"
                        >
                            開始您的第一次占卜 →
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-3 sm:gap-4">
                        {readings.map((reading) => (
                            <div
                                key={reading.id}
                                className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-2xl">
                                            {typeIcons[reading.type] || '📖'}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-zinc-900">
                                                {typeNames[reading.type] || reading.type}
                                            </h3>
                                            <p className="text-sm text-zinc-500">
                                                {formatDate(reading.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => deleteReading(reading.id)}
                                        className="text-zinc-400 hover:text-red-500 transition-colors p-2"
                                        title="刪除"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Preview of result */}
                                <div className="mt-4 pt-4 border-t border-zinc-100">
                                    <p className="text-sm text-zinc-600 line-clamp-2">
                                        {typeof reading.result === 'object'
                                            ? JSON.stringify(reading.result).slice(0, 200) + '...'
                                            : String(reading.result).slice(0, 200)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
