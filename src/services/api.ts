/**
 * Spiritual AI Advisor - API Service
 * 後端 API 連接服務
 */

const API_BASE = 'http://localhost:5000/api';

// ========== 通用 fetch 函數 ==========

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// ========== 塔羅 API ==========

export interface TarotCard {
  name: string;
  id: string;
  reversed: boolean;
  imageUrl: string;
  upright: string;
  reversedMeaning: string;
  meaning: string;
  keywords: string;
}

export interface TarotDrawResponse {
  success: boolean;
  cards: TarotCard[];
  positions: string[];
}

export const tarotApi = {
  draw: (count: number = 3): Promise<TarotDrawResponse> =>
    fetchApi('/tarot/draw', {
      method: 'POST',
      body: JSON.stringify({ count }),
    }),

  getCards: (): Promise<{ success: boolean; cards: { name: string; id: string }[] }> =>
    fetchApi('/tarot/cards'),
};

// ========== 八字 API ==========

export interface BaziLiunian {
  year: number;
  ganzhi: string;
  score: number;
}

export interface BaziResponse {
  success: boolean;
  lunar: string;
  year_gan: string;
  year_zhi: string;
  month_gan: string;
  month_zhi: string;
  day_gan: string;
  day_zhi: string;
  hour_gan: string;
  hour_zhi: string;
  day_master: string;
  liunian: BaziLiunian[];
  interpretation: string;
}

export const baziApi = {
  calculate: (birthDate: string, birthHour: number): Promise<BaziResponse> =>
    fetchApi('/bazi/calculate', {
      method: 'POST',
      body: JSON.stringify({ birthDate, birthHour }),
    }),
};

// ========== 人類圖 API ==========

export interface HumanDesignCenter {
  defined: boolean;
  color: string;
  desc: string;
  gates: number[];
}

export interface PlanetGate {
  gate: string;   // e.g., "40.3"
  name: string;   // e.g., "太陽"
}

export interface HumanDesignResponse {
  success: boolean;
  type: string;
  profile: string;
  authority: string;
  definition: string;
  strategy: string;
  notSelfTheme: string;
  design: Record<string, PlanetGate>;       // Design (紅色/潛意識)
  personality: Record<string, PlanetGate>;  // Personality (黑色/意識)
  centers: Record<string, HumanDesignCenter>;
  channels: string[];      // e.g., ["20-34", "10-57"]
  channelsDetail?: unknown[];  // 已定義通道詳細資訊
  openChannels?: string[];     // 開放通道列表
  openChannelsDetail?: unknown[];  // 開放通道詳細資訊
  gates: number[];         // e.g., [20, 34, 10, 57]
  info: {
    color: string;
    desc: string;
    strategy: string;
    icon: string;
  };
  interpretation: string;
}

export const humanDesignApi = {
  getInfo: (): Promise<HumanDesignResponse> =>
    fetchApi('/humandesign/info'),
  calculate: (birthDate: string, birthTime: string, birthCity?: string, birthLat?: number, birthLon?: number): Promise<HumanDesignResponse> =>
    fetchApi('/humandesign/calculate', {
      method: 'POST',
      body: JSON.stringify({ birthDate, birthTime, birthCity, birthLat, birthLon }),
    }),
};

// ========== 占星 API ==========

export interface AstrologyResponse {
  success: boolean;
  sun: string;
  sunSign?: string;
  moon?: string;
  moonSign?: string;
  ascendant: string;
  ascendantSign?: string;
  planets: Record<string, string>;
  birthCity?: string;
  interpretation: string;
}

export const astrologyApi = {
  getChart: (): Promise<AstrologyResponse> =>
    fetchApi('/astrology/chart'),
  calculate: (birthDate: string, birthTime: string, birthLat?: number, birthLon?: number, birthCity?: string): Promise<AstrologyResponse> =>
    fetchApi('/astrology/calculate', {
      method: 'POST',
      body: JSON.stringify({ birthDate, birthTime, birthLat, birthLon, birthCity }),
    }),
};

// ========== 紫微斗數 API ==========

export interface ZiweiResponse {
  success: boolean;
  main_star: string;
  mingzhu: string;
  shenzhu: string;
  palaces: Record<string, string>;
  interpretation: string;
}

export const ziweiApi = {
  getChart: (): Promise<ZiweiResponse> =>
    fetchApi('/ziwei/chart'),
  calculate: (birthDate: string, birthHour: number): Promise<ZiweiResponse> =>
    fetchApi('/ziwei/calculate', {
      method: 'POST',
      body: JSON.stringify({ birthDate, birthHour }),
    }),

};

// ========== 整合分析 API ==========

export interface IntegrationResponse {
  success: boolean;
  question: string;
  analysis: string;
  source: 'gemini' | 'demo';
}

export const integrationApi = {
  analyze: (question: string): Promise<IntegrationResponse> =>
    fetchApi('/integration/analyze', {
      method: 'POST',
      body: JSON.stringify({ question }),
    }),
};

// ========== 健康檢查 ==========

export const healthApi = {
  check: (): Promise<{ status: string; message: string }> =>
    fetchApi('/health'),
};
