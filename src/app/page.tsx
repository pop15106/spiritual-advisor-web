"use client";

import { useState, useEffect } from "react";
import TarotSection from "@/components/TarotSection";
import BaziSection from "@/components/BaziSection";
import HumanDesignSection from "@/components/HumanDesignSection";
import AstrologySection from "@/components/AstrologySection";
import ZiweiSection from "@/components/ZiweiSection";
import IntegrationSection from "@/components/IntegrationSection";
import ApiKeyModal from "@/components/ApiKeyModal";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

const services = [
  { id: "tarot", name: "塔羅占卜", icon: "🃏", desc: "透過78張偉特塔羅牌，解讀您的過去、現在與未來" },
  { id: "bazi", name: "八字命理", icon: "☯️", desc: "中國傳統命理學，從四柱八字解析您的天命格局" },
  { id: "humandesign", name: "人類圖", icon: "🧬", desc: "融合易經與脈輪系統，揭示您的天生設計藍圖" },
  { id: "astrology", name: "西洋占星", icon: "⭐", desc: "透過行星與星座的位置，解讀您的性格與運勢" },
  { id: "ziwei", name: "紫微斗數", icon: "💜", desc: "東方占星術的精華，從命盤看透一生格局" },
  { id: "integration", name: "多系統整合", icon: "🌐", desc: "結合東西方智慧，給出最全面的命理分析" },
];

export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [pendingSection, setPendingSection] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [localFreeTrials, setLocalFreeTrials] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);

  // 從 AuthContext 取得登入用戶的試用次數
  const { isLoggedIn, freeTrials: authFreeTrials, useTrial, login } = useAuth();

  // 計算實際可用的免費次數（登入用戶用資料庫，訪客用 localStorage）
  const freeTrialsLeft = isLoggedIn ? authFreeTrials : localFreeTrials;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // 首次訪問顯示歡迎彈窗
  useEffect(() => {
    const hasVisited = localStorage.getItem("has_visited");
    if (!hasVisited && !isLoggedIn) {
      setShowWelcome(true);
      localStorage.setItem("has_visited", "true");
    }
  }, [isLoggedIn]);

  // 檢查是否為管理員或已有 API Key
  useEffect(() => {
    // 檢查 localStorage 中是否有 API Key
    const savedKey = localStorage.getItem("user_api_key");
    if (savedKey) {
      setHasApiKey(true);
    }

    // 檢查是否為管理員
    const adminToken = localStorage.getItem("admin_token");
    if (adminToken) {
      fetch(`${apiUrl}/api/check-admin`, {
        headers: { "Authorization": `Bearer ${adminToken}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.isAdmin) {
            setIsAdmin(true);
          }
        })
        .catch(() => { });
    }

    // 檢查訪客免費試用次數（localStorage）
    const trials = localStorage.getItem("free_trials");
    if (trials === null) {
      // 新用戶，給予 10 次免費試用
      localStorage.setItem("free_trials", "10");
      setLocalFreeTrials(10);
    } else {
      setLocalFreeTrials(parseInt(trials, 10));
    }
  }, [apiUrl]);

  // Browser history support for mouse side buttons (back/forward)
  useEffect(() => {
    // Read initial state from URL hash
    const hash = window.location.hash.slice(1); // Remove '#'
    if (hash && services.some(s => s.id === hash)) {
      setActiveSection(hash);
    }

    // Handle browser back/forward navigation (mouse side buttons)
    const handlePopState = (event: PopStateEvent) => {
      const section = event.state?.section || null;
      setActiveSection(section);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 登入要求彈窗狀態
  const [showLoginRequired, setShowLoginRequired] = useState(false);

  // Update URL and history when section changes
  const navigateToSection = async (sectionId: string | null) => {
    if (sectionId) {
      // 管理員直接通過
      if (isAdmin) {
        window.history.pushState({ section: sectionId }, '', `#${sectionId}`);
        setActiveSection(sectionId);
        return;
      }

      // 有自己的 API Key 直接通過
      if (hasApiKey) {
        window.history.pushState({ section: sectionId }, '', `#${sectionId}`);
        setActiveSection(sectionId);
        return;
      }

      // 未登入用戶：要求先登入
      if (!isLoggedIn) {
        setPendingSection(sectionId);
        setShowLoginRequired(true);
        return;
      }

      // 已登入用戶：檢查免費次數
      if (freeTrialsLeft <= 0) {
        setPendingSection(sectionId);
        setShowApiKeyModal(true);
        return;
      }

      // 消耗一次免費試用
      await useTrial();

      window.history.pushState({ section: sectionId }, '', `#${sectionId}`);
    } else {
      window.history.pushState({ section: null }, '', window.location.pathname);
    }
    setActiveSection(sectionId);
  };

  // API Key 提交成功後
  const handleApiKeySubmit = (apiKey: string) => {
    setHasApiKey(true);
    setShowApiKeyModal(false);
    // 繼續導航到原本要去的頁面
    if (pendingSection) {
      window.history.pushState({ section: pendingSection }, '', `#${pendingSection}`);
      setActiveSection(pendingSection);
      setPendingSection(null);
    }
  };

  // 計算顯示的試用狀態（只對已登入用戶顯示）
  const showTrialBadge = isLoggedIn && !isAdmin && !hasApiKey && authFreeTrials > 0;

  if (activeSection) {
    // Get pattern class based on active section
    const patternClass = {
      tarot: "bg-pattern-tarot",
      bazi: "bg-pattern-bazi",
      humandesign: "bg-pattern-humandesign",
      astrology: "bg-pattern-astrology",
      ziwei: "bg-pattern-ziwei",
      integration: "bg-pattern-integration",
    }[activeSection] || "";

    return (
      <div className={`min-h-screen bg-white ${patternClass}`}>
        {/* Back Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100/50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <button
              onClick={() => navigateToSection(null)}
              className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              ← 返回首頁
            </button>
            <span className="text-xl tracking-tighter font-semibold text-zinc-900 uppercase">
              AI 身心靈<span className="text-gold">.</span>
            </span>
            <div className="w-20"></div>
          </div>
        </nav>

        <main className="pt-28 pb-20 px-6">
          <div className="max-w-5xl mx-auto">
            {activeSection === "tarot" && <TarotSection />}
            {activeSection === "bazi" && <BaziSection />}
            {activeSection === "humandesign" && <HumanDesignSection />}
            {activeSection === "astrology" && <AstrologySection />}
            {activeSection === "ziwei" && <ZiweiSection />}
            {activeSection === "integration" && <IntegrationSection />}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <span className="text-lg sm:text-xl tracking-tighter font-semibold text-zinc-900 uppercase">
            AI 身心靈<span className="text-gold">.</span>
          </span>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
            <a href="#services" className="hover:text-zinc-900 transition-colors duration-300">服務項目</a>
            <a href="#about" className="hover:text-zinc-900 transition-colors duration-300">關於我們</a>
            <a href="#contact" className="hover:text-zinc-900 transition-colors duration-300">聯繫我們</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* 免費試用提示（已登入用戶） */}
            {showTrialBadge && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-gold bg-gold/10 px-3 py-1.5 rounded-full">
                🎁 免費試用 {authFreeTrials} 次
              </span>
            )}
            <a href="#services" className="hidden sm:inline-flex bg-zinc-900 text-white text-xs font-medium px-5 py-2.5 rounded-full hover:bg-zinc-800 transition-all duration-300 tracking-wide hover:shadow-lg">
              開始占卜
            </a>
            <UserMenu />
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-zinc-600 hover:text-zinc-900"
              aria-label="選單"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-t border-zinc-100">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#services"
                onClick={() => setShowMobileMenu(false)}
                className="block py-2 text-sm font-medium text-zinc-700 hover:text-gold transition-colors"
              >
                🎯 服務項目
              </a>
              <a
                href="#about"
                onClick={() => setShowMobileMenu(false)}
                className="block py-2 text-sm font-medium text-zinc-700 hover:text-gold transition-colors"
              >
                ℹ️ 關於我們
              </a>
              <a
                href="#contact"
                onClick={() => setShowMobileMenu(false)}
                className="block py-2 text-sm font-medium text-zinc-700 hover:text-gold transition-colors"
              >
                📧 聯繫我們
              </a>
              <div className="pt-2 border-t border-zinc-100">
                <a
                  href="#services"
                  onClick={() => setShowMobileMenu(false)}
                  className="block w-full text-center py-3 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 transition-colors"
                >
                  開始占卜
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.jpg"
            alt="Spiritual Meditation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-16">
          <span className="inline-flex items-center gap-2 py-1 px-3 border border-white/10 rounded-full text-white/90 text-xs tracking-wider uppercase mb-8 bg-white/5 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            東西方智慧融合 · AI 命理平台
          </span>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium text-white tracking-tight mb-8 leading-[1.1]">
            探索你的 <br className="hidden md:block" /> 命運藍圖
          </h1>

          <p className="text-lg md:text-xl text-zinc-300 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            融合塔羅、八字、人類圖、占星、紫微斗數五大系統，<br className="hidden md:block" />
            AI 智能分析，為您解讀前世今生、指引人生方向。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#services" className="w-full sm:w-auto bg-white text-zinc-900 text-sm font-medium px-8 py-3.5 rounded-full hover:bg-zinc-100 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              立即開始占卜
            </a>
            <a href="#about" className="w-full sm:w-auto backdrop-blur-md border border-white/20 text-white text-sm font-medium px-8 py-3.5 rounded-full hover:bg-white/10 transition-all hover:border-white/40">
              了解更多
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-medium text-zinc-900 tracking-tight mb-4">命理服務</h2>
              <p className="text-zinc-500 font-light text-lg">五大東西方命理系統，AI 智能解讀，為您揭開命運的神秘面紗。</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => navigateToSection(service.id)}
                className="service-card bg-white p-8 rounded-2xl border border-zinc-200 cursor-pointer group"
              >
                <div className="icon-box w-14 h-14 bg-zinc-50 rounded-xl flex items-center justify-center mb-6 text-2xl transition-colors duration-300">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-3 tracking-tight">{service.name}</h3>
                <p className="text-sm text-zinc-500 font-light leading-relaxed mb-6">
                  {service.desc}
                </p>
                <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">AI 解讀</span>
                  <span className="text-sm font-medium text-gold group-hover:translate-x-1 transition-transform">
                    開始 →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 md:py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 md:order-1 group">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-100 relative z-10">
              <img
                src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2070&auto=format&fit=crop"
                alt="Meditation"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 z-20 bg-white p-6 shadow-2xl shadow-zinc-200/50 rounded-xl border border-zinc-100 hidden md:block transform transition-transform duration-500 hover:-translate-y-2">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-semibold text-zinc-900 tracking-tighter">5</span>
                <span className="text-xs text-zinc-500 uppercase tracking-wide leading-tight font-medium">大命理<br />系統</span>
              </div>
            </div>
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-zinc-50 rounded-full blur-3xl -z-10"></div>
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-5xl font-medium text-zinc-900 tracking-tight mb-8">
              東西方智慧 <br />融合創新
            </h2>
            <div className="w-16 h-0.5 bg-gold mb-10"></div>
            <p className="text-zinc-500 font-light leading-relaxed mb-6 text-lg">
              我們相信，每個人都有獨特的命運藍圖。透過融合東方的八字、紫微斗數，與西方的塔羅、占星、人類圖，我們為您提供最全面的命理分析。
            </p>
            <p className="text-zinc-500 font-light leading-relaxed mb-10 text-lg">
              結合 AI 智能技術，我們能夠快速解讀複雜的命理資訊，為您提供個人化的建議與指引。
            </p>
            <ul className="space-y-4">
              {[
                "五大命理系統整合",
                "AI 智能解讀分析",
                "個人化建議指引",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 text-sm font-medium text-zinc-700">
                  <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xs">
                    ✓
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-zinc-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-16 text-center">用戶好評</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "小美", role: "塔羅體驗者", text: "塔羅解讀非常準確，幫助我看清了感情中的盲點。AI 的分析既專業又容易理解！" },
              { name: "阿明", role: "八字分析用戶", text: "八字分析讓我更了解自己的性格特質，流年運勢圖表很直觀，推薦給大家！" },
              { name: "小惠", role: "多系統整合用戶", text: "整合分析真的很神奇！結合了多個系統的觀點，給我的建議非常全面實用。" },
            ].map((review, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-gold/30 transition-colors">
                <div className="flex text-gold mb-5 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-zinc-300 font-light italic mb-8 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-xs font-semibold border border-white/10">
                    {review.name[0]}
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-white">{review.name}</span>
                    <span className="block text-xs text-zinc-500">{review.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-white border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <span className="text-xl tracking-tighter font-semibold text-zinc-900 uppercase">
                AI 身心靈<span className="text-gold">.</span>
              </span>
              <p className="text-sm text-zinc-500 mt-2">東西方智慧融合的 AI 命理平台</p>
            </div>

            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <span>聯繫我們：hello@spiritual-ai.com</span>
            </div>
          </div>

          <div className="border-t border-zinc-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-400">
            <p>© 2024 AI 身心靈顧問. 僅供娛樂參考.</p>
            <div className="flex gap-8 mt-4 md:mt-0 font-medium">
              <a href="#" className="hover:text-zinc-900 transition-colors">隱私政策</a>
              <a href="#" className="hover:text-zinc-900 transition-colors">使用條款</a>
            </div>
          </div>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => {
          setShowApiKeyModal(false);
          setPendingSection(null);
        }}
        onSubmit={handleApiKeySubmit}
      />

      {/* Login Required Modal */}
      {showLoginRequired && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setShowLoginRequired(false);
              setPendingSection(null);
            }}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🔐</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">請先登入</h2>
                  <p className="text-purple-200 text-xs">登入即可獲得 10 次免費體驗</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-col items-center gap-4">
                <div className="text-center mb-2">
                  <p className="text-sm text-zinc-600">
                    使用 Google 帳號登入，立即獲得
                  </p>
                  <p className="text-2xl font-bold text-purple-600 my-2">
                    🎁 10 次免費占卜
                  </p>
                  <p className="text-xs text-zinc-400">
                    登入後次數會永久綁定，不會因為換瀏覽器而消失
                  </p>
                </div>

                <GoogleLogin
                  onSuccess={async (credentialResponse: CredentialResponse) => {
                    if (credentialResponse.credential) {
                      const success = await login(credentialResponse.credential);
                      if (success) {
                        setShowLoginRequired(false);
                        // 登入成功後繼續導航
                        if (pendingSection) {
                          window.history.pushState({ section: pendingSection }, '', `#${pendingSection}`);
                          setActiveSection(pendingSection);
                          setPendingSection(null);
                        }
                      }
                    }
                  }}
                  onError={() => {
                    console.error('Login Failed');
                  }}
                  theme="filled_blue"
                  size="large"
                  width="300"
                />

                <button
                  onClick={() => {
                    setShowLoginRequired(false);
                    setPendingSection(null);
                  }}
                  className="text-sm text-zinc-400 hover:text-zinc-600 mt-2"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Popup - 首次訪問提示 */}
      {showWelcome && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowWelcome(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-gold via-yellow-500 to-gold px-6 py-8 text-center">
              <div className="text-5xl mb-3">✨</div>
              <h2 className="text-2xl font-bold text-white">歡迎來到 AI 身心靈顧問</h2>
              <p className="text-yellow-100 text-sm mt-2">東西方智慧融合的命理平台</p>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-lg text-zinc-700 mb-3">
                  🎁 註冊即可獲得 <span className="font-bold text-purple-600">10 次免費占卜</span>
                </p>
                <p className="text-sm text-zinc-500">
                  包含塔羅牌、八字、紫微斗數、西洋占星等多種命理服務
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <GoogleLogin
                  onSuccess={async (credentialResponse: CredentialResponse) => {
                    if (credentialResponse.credential) {
                      await login(credentialResponse.credential);
                      setShowWelcome(false);
                    }
                  }}
                  onError={() => console.error('Login Failed')}
                  theme="filled_blue"
                  size="large"
                  width="350"
                />

                <button
                  onClick={() => setShowWelcome(false)}
                  className="text-sm text-zinc-400 hover:text-zinc-600 py-2"
                >
                  稍後再說，先逛逛
                </button>
              </div>

              <p className="text-xs text-zinc-400 text-center mt-4">
                登入後免費次數會永久綁定帳號，不會因為換瀏覽器而消失
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
