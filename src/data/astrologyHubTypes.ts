export interface DailyInsight {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  summary: string;
  content: string;
  category: "Career" | "Finance" | "Relationships" | "Health" | "Spiritual";
  imagePrompt: string;
  imageUrl: string;
  isApproved: boolean;
  publishedAt: string; // ISO string
}

export interface WeeklyForecast {
  id: string;
  weekStarting: string; // YYYY-MM-DD (Monday)
  title: string;
  career: { summary: string; score: number };
  finance: { summary: string; score: number };
  relationships: { summary: string; score: number };
  health: { summary: string; score: number };
  spiritual: { summary: string; score: number };
  imageUrl: string;
  isApproved: boolean;
  publishedAt: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: "Zodiac Signs" | "Career Astrology" | "Financial Astrology" | "Love Compatibility" | "Planetary Transits" | "Birth Chart Analysis" | "Numerology";
  tags: string[];
  imageUrl: string;
  metaTitle: string;
  metaDescription: string;
  isApproved: boolean;
  publishedAt: string; // ISO or YYYY-MM-DD
  scheduledFor?: string; // Optional scheduling YYYY-MM-DD
  author: string;
}

export interface ZodiacSignDetails {
  id: string; // "aries", "taurus", etc.
  name: string;
  sanskritName: string;
  dates: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  ruler: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  luckyColor: string;
  luckyNumber: number;
  imageUrl: string;
  weeklyPrediction: string;
  monthlyPrediction: string;
  dailyPrediction: string;
}
