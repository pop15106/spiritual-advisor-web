"use client";

import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/contexts/AuthContext';

export default function UserMenu() {
    const { user, isLoggedIn, login, logout, isLoading } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    if (isLoading) {
        return (
            <div className="w-8 h-8 rounded-full bg-zinc-200 animate-pulse" />
        );
    }

    if (!isLoggedIn) {
        return (
            <>
                <button
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center gap-2 bg-zinc-900 text-white text-xs font-medium px-3 sm:px-4 py-2 rounded-full hover:bg-zinc-800 transition-all"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    <span className="hidden sm:inline">登入 / 註冊</span>
                </button>

                {/* Login Modal */}
                {showLoginModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowLoginModal(false)}
                        />
                        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
                            <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center">
                                        <span className="text-xl">✨</span>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">登入或註冊帳號</h2>
                                        <p className="text-zinc-400 text-xs">儲存您的占卜結果</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex flex-col items-center gap-4">
                                    <p className="text-sm text-zinc-600 text-center mb-2">
                                        使用 Google 帳號登入，即可儲存並查看您的占卜歷史紀錄
                                    </p>

                                    <GoogleLogin
                                        onSuccess={async (credentialResponse) => {
                                            if (credentialResponse.credential) {
                                                const success = await login(credentialResponse.credential);
                                                if (success) {
                                                    setShowLoginModal(false);
                                                }
                                            }
                                        }}
                                        onError={() => {
                                            console.log('Login Failed');
                                        }}
                                        theme="outline"
                                        size="large"
                                        text="continue_with"
                                        shape="pill"
                                        width="280"
                                    />

                                    <button
                                        onClick={() => setShowLoginModal(false)}
                                        className="text-sm text-zinc-500 hover:text-zinc-700 mt-2"
                                    >
                                        稍後再說
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    // Logged in user
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
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-zinc-100 overflow-hidden z-50">
                        <div className="p-4 border-b border-zinc-100">
                            <p className="font-medium text-zinc-900 truncate">{user?.name}</p>
                            <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                        </div>

                        <div className="p-2">
                            <a
                                href="/history"
                                className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors"
                            >
                                <span>📜</span>
                                占卜歷史
                            </a>
                            <a
                                href="/settings"
                                className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors"
                            >
                                <span>⚙️</span>
                                設定
                            </a>
                        </div>

                        <div className="p-2 border-t border-zinc-100">
                            <button
                                onClick={() => {
                                    logout();
                                    setShowDropdown(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <span>🚪</span>
                                登出
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
