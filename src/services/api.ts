/**
 * Spiritual AI Advisor - API Service
 * 後端 API 連接服務
 */

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`;

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
  position?: string;
}

export interface TarotDrawResponse {
  success: boolean;
  cards: TarotCard[];
  positions: string[];
  spread?: string;
  interpretation?: string;
  yes_no_result?: string;  // 是非題判定結果
}

export const tarotApi = {
  draw: (count: number = 3): Promise<TarotDrawResponse> =>
    fetchApi('/tarot/draw', {
      method: 'POST',
      body: JSON.stringify({ count }),
    }),

  getCards: (): Promise<{ success: boolean; cards: { name: string; id: string }[] }> =>
    fetchApi('/tarot/cards'),

  analyzeStream: async (
    question: string,
    spreadType: string | null,
    onData: (data: TarotDrawResponse) => void,
    onChunk: (chunk: string) => void,
    onDone: () => void,
    onError: (err: any) => void,
    onReset?: () => void
  ) => {
    try {
      const response = await fetch(`${API_BASE}/tarot/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, spreadType }),
      });
      await handleStreamResponse(response, onData, onChunk, onDone, onError, onReset);
    } catch (err) {
      onError(err);
    }
  }
};

// ========== 八字 API ==========

export interface BaziLiunian {
  year: number;
  ganzhi: string;
  score: number;
}

export interface BaziPillar {
  gan: string;
  zhi: string;
  ten_god: string;
  hidden_stems: { gan: string; ten_god: string }[];
  nayin: string;
  shen_sha: string[];
}

export interface BaziDaYun {
  start_age: number;
  start_year: number;
  end_year: number;
  gan: string;
  zhi: string;
  gan_ten_god: string;
  zhi_ten_god: string;
  nayin: string;
}

export interface BaziChart {
  pillars: {
    year: BaziPillar;
    month: BaziPillar;
    day: BaziPillar;
    hour: BaziPillar;
  };
  day_master: string;
  lunar_date_str: string;
  solar_date_str: string;
  da_yun: BaziDaYun[];
  liunian: BaziLiunian[];
  gender: string;
  start_age: number;
  summary_short?: string;
  dm_wuxing?: string;
  dm_trait?: string;
}

export interface BaziResponse {
  success: boolean;
  chart: BaziChart;
  interpretation: string;
}

export const baziApi = {
  calculate: (birthDate: string, birthHour: number, gender: 'male' | 'female' = 'male'): Promise<BaziResponse> =>
    fetchApi('/bazi/calculate', {
      method: 'POST',
      body: JSON.stringify({ birthDate, birthHour, gender }),
    }),

  calculateStream: async (
    birthDate: string,
    birthHour: number,
    gender: 'male' | 'female',
    onData: (data: BaziResponse) => void,
    onChunk: (chunk: string) => void,
    onDone: () => void,
    onError: (err: any) => void,
    onReset?: () => void
  ) => {
    try {
      const response = await fetch(`${API_BASE}/bazi/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthDate, birthHour, gender, stream: true }),
      });

      await handleStreamResponse(response, onData, onChunk, onDone, onError, onReset);
    } catch (err) {
      onError(err);
    }
  }
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
  calculateStream: async (
    birthDate: string,
    birthTime: string,
    birthCity: string | undefined,
    onData: (data: any) => void,
    onChunk: (chunk: string) => void,
    onDone: () => void,
    onError: (err: any) => void,
    onReset?: () => void
  ) => {
    try {
      const response = await fetch(`${API_BASE}/humandesign/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthDate, birthTime, birthCity, stream: true }),
      });
      await handleStreamResponse(response, onData, onChunk, onDone, onError, onReset);
    } catch (err) {
      onError(err);
    }
  }
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
  calculateStream: async (
    birthDate: string,
    birthTime: string,
    birthCity: string | undefined,
    onData: (data: any) => void,
    onChunk: (chunk: string) => void,
    onDone: () => void,
    onError: (err: any) => void,
    onReset?: () => void
  ) => {
    try {
      const response = await fetch(`${API_BASE}/astrology/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthDate, birthTime, birthCity, stream: true }),
      });
      await handleStreamResponse(response, onData, onChunk, onDone, onError, onReset);
    } catch (err) {
      onError(err);
    }
  }
};

// ========== 紫微斗數 API ==========

export interface ZiweiPalace {
  dizhi: string;
  stars: string[];
  stars_str: string;
}

export interface ZiweiResponse {
  success: boolean;
  main_star: string;
  mingzhu: string;
  shenzhu: string;
  wuxing_ju?: string;
  ming_palace_dizhi?: string;
  shen_palace_dizhi?: string;
  lunar_date?: string;
  si_hua?: string;
  palaces: Record<string, ZiweiPalace>;
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

  calculateStream: async (
    birthDate: string,
    birthHour: number,
    onData: (data: any) => void,
    onChunk: (chunk: string) => void,
    onDone: () => void,
    onError: (err: any) => void,
    onReset?: () => void
  ) => {
    try {
      const response = await fetch(`${API_BASE}/ziwei/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthDate, birthHour, stream: true }),
      });
      await handleStreamResponse(response, onData, onChunk, onDone, onError, onReset);
    } catch (err) {
      onError(err);
    }
  }

};

// ========== 整合分析 API ==========

export interface IntegrationResponse {
  success: boolean;
  question: string;
  analysis: string;
  source: 'gemini' | 'demo';
  model?: string;
  system_data?: {
    tarot?: {
      spread_name: string;
      cards: string[];
    };
    humandesign?: {
      type: string;
      strategy?: string;
      summary: string;
    };
    astrology?: {
      sun_sign?: string;
      moon_sign?: string;
      summary: string;
    };
    ziwei?: {
      main_star?: string;
      ming_palace?: string;
      summary: string;
    };
  };
}

export interface IntegrationBirthData {
  date?: string;          // "1990-01-01"
  time?: string;          // "06:00"
  hour?: number;          // 時辰 0-11
  gender?: 'male' | 'female';
  city?: { name: string; lat: number; lng: number };
}



export const integrationApi = {
  analyze: (question: string, systems?: string[], birthData?: IntegrationBirthData): Promise<IntegrationResponse> =>
    fetchApi('/integration/analyze', {
      method: 'POST',
      body: JSON.stringify({ question, systems, birth_data: birthData }),
    }),

  analyzeStream: async (
    question: string,
    systems: string[],
    birthData: IntegrationBirthData | undefined,
    onData: (data: any) => void,
    onChunk: (chunk: string) => void,
    onDone: () => void,
    onError: (err: any) => void,
    onReset?: () => void
  ) => {
    try {
      const response = await fetch(`${API_BASE}/integration/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, systems, birth_data: birthData }),
      });
      await handleStreamResponse(response, onData, onChunk, onDone, onError, onReset);
    } catch (err) {
      onError(err);
    }
  }
};

// ========== 健康檢查 ==========

export const healthApi = {
  check: (): Promise<{ status: string; message: string }> =>
    fetchApi('/health'),
};

// Helper function to handle SSE stream parsing
async function handleStreamResponse(
  response: Response,
  onData: (data: any) => void,
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (err: any) => void,
  onReset?: () => void
) {
  if (!response.ok) throw new Error(response.statusText);
  if (!response.body) throw new Error('No response body');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Process lines
    const lines = buffer.split('\n\n');
    buffer = lines.pop() || ''; // Keep incomplete line in buffer

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const jsonStr = line.replace('data: ', '');
        if (jsonStr === '[DONE]') {
          onDone();
          return;
        }
        try {
          const event = JSON.parse(jsonStr);
          if (event.type === 'data') {
            onData(event.payload);
          } else if (event.type === 'chunk') {
            onChunk(event.content);
          } else if (event.type === 'reset') {
            // 模型切換，清空之前的內容並顯示提示
            if (onReset) {
              onReset();
            }
            // 靜默重新開始
          } else if (event.type === 'done') {
            onDone();
            return;
          }
        } catch (e) {
          console.error('JSON parse error', e);
        }
      }
    }
  }
}


