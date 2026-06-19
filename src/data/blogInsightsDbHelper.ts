import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { DailyInsight, WeeklyForecast, BlogArticle } from "./astrologyHubTypes";
import { preseededDailyInsights, preseededWeeklyForecasts, preseededBlogArticles } from "./blogInsightsPreseeded";

const DB_FILE_PATH = path.join(process.cwd(), "blogInsightsDb.json");

interface BlogInsightsDb {
  dailyInsights: DailyInsight[];
  weeklyForecasts: WeeklyForecast[];
  blogArticles: BlogArticle[];
  settings?: {
    founderPhoto?: string;
  };
}

// Ensure database file exists and is initialized
export function initDb(): BlogInsightsDb {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const data = fs.readFileSync(DB_FILE_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (!parsed.settings) {
        parsed.settings = {
          founderPhoto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400"
        };
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(parsed, null, 2), "utf-8");
      }
      return parsed;
    }
  } catch (error) {
    console.error("Database read error. Re-initializing...", error);
  }

  // Pre-seed if missing or broken
  const db: BlogInsightsDb = {
    dailyInsights: [...preseededDailyInsights],
    weeklyForecasts: [...preseededWeeklyForecasts],
    blogArticles: [...preseededBlogArticles],
    settings: {
      founderPhoto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400"
    }
  };
  saveDb(db);
  return db;
}

export function saveDb(db: BlogInsightsDb) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write to database file", error);
  }
}

// High-fidelity fallback templates for daily insights
const fallbackInsightsPool = [
  {
    title: "Celestial Portal: Sun Sextile Uranus",
    summary: "A thrilling wave of progressive thoughts highlights your intellectual work. Expect sudden breakthroughs and tech-focused initiatives.",
    content: "When the Sun coordinates a favorable sextile aspect with Uranian forces, mental pathways open to high-vibration creativity. Today is highly auspicious for prototyping experimental apps, publishing bold thoughts on social streams, or rearranging desk setups to let fresh oxygen trigger mental pathways. Trust the unconventional.",
    category: "Career" as const,
    imagePrompt: "Luxury glowing celestial sphere surrounded by gold geometric orbits, starry twilight background",
    imageUrl: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Lunar Mysticism: Full Moon in Scorpio",
    summary: "A deep, intuitive emotional reset demands silent reflection. Great day for psychological purging, ancestor worship, and clearing debt.",
    content: "The Moon reaches its peak depth in Scorpio, casting a radiant silver spotlight over your psychic houses. Today, superficial answers fail to satisfy. Seek truth in quiet meditation, burn sacred incense, clear physical cluttered desks, and pay off residual debts. This is a profound window of spiritual empowerment.",
    category: "Spiritual" as const,
    imagePrompt: "Glowing full moon rising over dark violet cosmic ocean with gold reflections, ultra luxury",
    imageUrl: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Venus-Jupiter Conjunction: Abundance Gateway",
    summary: "The two great benefics align, promising beautiful gains in romance, luxury investments, and artistic creative expansion.",
    content: "Venus and Jupiter join forces in Taurus, generating an unparalleled magnetic field of abundance, beauty, and love. It is the perfect date to pitch investments, propose to partners, or decorate space with gold accents. Keep your speech filled with appreciation, as cosmic currents are amplifying words.",
    category: "Finance" as const,
    imagePrompt: "Gold cosmic scales overflowing with starlight under majestic purple galaxy",
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Mercury Direct: clearing Communication Channels",
    summary: "Mind ruler Mercury ends its retrograded orbit. Blockages clear across contracts, flights, and software integrations.",
    content: "Mercury stations direct in Taurus, dissolving the frustrating haze that has slowed communications for the last three weeks. Missed messages, buggy software routes, and contract debates resolve into clear options. Implement immediate follow-up calls and structure plans.",
    category: "Relationships" as const,
    imagePrompt: "Radiant golden key locking a cosmic stellar gate, luxury spiritual branding",
    imageUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=600&auto=format&fit=crop"
  }
];

// High-fidelity fallback templates for blogs
const fallbackBlogsPool = [
  {
    title: "Planetary Transits 2026: Preparing for Jupiter's Golden Saffron Shift",
    category: "Planetary Transits" as const,
    excerpt: "Jupiter enters its exaltation zone, triggering massive spiritual expansions and financial breakthroughs for global thinkers.",
    content: "When the cosmic giant Jupiter enters its auspicious zone in mid-2026, global consciousness undergoes a distinct elevation. This transition shifts focus from material accumulation towards systematic spiritual and mental recovery.\n\n### Preparing Your Life for Jupiter's Elevation\n- **Nurture Inner Curiosity:** Read classical texts and practice regular visual breathing exercises.\n- **Vastu Action:** The Northeast (Ishan) corner of your living space rules Jupiter. Put yellow floral arrangements or light brass oil lamps there to attract financial guidance.\n- **Lucky Colors during Transit:** Saffron, Golden Ochre, and Cream.",
    tags: ["Jupiter Transit", "Vedic Astrology", "Vastu Tips", "Spiritual Rebirth"],
    imageUrl: "https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=600&auto=format&fit=crop",
    metaTitle: "Jupiter Gold Saffron Shift Transit 2026 Secrets — pathakaanna",
    metaDescription: "In-depth astronomical look into Jupiter's exalted transit. Learn how this impacts your financial luck and spiritual alignment today."
  },
  {
    title: "The Ultimate Guide to Deciphering Your Saturn Career House Placement",
    category: "Career Astrology" as const,
    excerpt: "Where is Saturn in your chart? Discover how Shani Dev guides your professional authority, persistence levels, and ultimate legacy.",
    content: "Saturn sitting in your 10th House of Career indicates an ambitious but disciplined rise to public authority. Unlike rapid planetary blessings, Saturn requires slow, systematic mastery of work duties.\n\n### Keys to Pacifying Saturnian Delay\n- Maintain absolute honesty with team members and workforce.\n- Establish highly consistent schedules.\n- Avoid quick speculative trades; stick to durable assets like gold and real estate.",
    tags: ["Saturn Placement", "10th House", "Career Guidance", "Vedic Success"],
    imageUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=600&auto=format&fit=crop",
    metaTitle: "Saturn 10th House Career Placement Astrological Secrets - pathakaanna",
    metaDescription: "Does Shani delay your professional promotion? Find out how to transform Saturnian delay into rock-solid global authority."
  }
];

// Helper to get Gemini client if API key is active
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Automatically generate a new Daily Insight
export async function autoGenerateDaily(dateStr: string): Promise<DailyInsight> {
  const ai = getGeminiClient();
  const id = `di_auto_${Date.now()}`;

  if (ai) {
    try {
      console.log(`[Auto-Generate] Running Gemini for date: ${dateStr}...`);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Create a professional Vedic astrology daily insight for the date ${dateStr}.
Return it strictly in JSON format matching this TypeScript interface (no markdown code fence blocks, just clean JSON parseable text):
{
  "title": "A short, highly compelling title (e.g. Venus Trine Neptune: Infinite Devotion)",
  "summary": "1-2 sentence high-impact summary focusing on immediate cosmic impacts",
  "content": "A detailed, professionally styled paragraph with specific, actionable Vedic guidance, suitable for a premium magazine catalog.",
  "category": "One of: Career, Finance, Relationships, Health, Spiritual",
  "imagePrompt": "A highly detailed aesthetic prompt for generating a premium astrology image corresponding to this transit (e.g., Luxury golden clockwork sphere floating over purple galactic star waves)"
}`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text.trim());
      
      // Select appropriate Unsplash themed placeholder matching category
      const imageMap: Record<string, string> = {
        Career: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=600&auto=format&fit=crop",
        Finance: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=600&auto=format&fit=crop",
        Relationships: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
        Health: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?q=80&w=600&auto=format&fit=crop",
        Spiritual: "https://images.unsplash.com/photo-1504333631150-c8cd2f64b16e?q=80&w=600&auto=format&fit=crop"
      };

      return {
        id,
        date: dateStr,
        title: result.title || "Cosmic Realignment",
        summary: result.summary || "Planetary angles suggest an important day of self-discovery.",
        content: result.content || "The cosmic alignment favors deep study, meditation, and structured work today.",
        category: (result.category || "Spiritual") as any,
        imagePrompt: result.imagePrompt || "Golden celestial orbits under dark violet nebula",
        imageUrl: imageMap[result.category || "Spiritual"] || imageMap.Spiritual,
        isApproved: true,
        publishedAt: new Date().toISOString()
      };
    } catch (err) {
      console.error("[Auto-Generate] Gemini error, using high-fidelity fallback:", err);
    }
  }

  // Fallback if no Gemini or errored
  const randomFallback = fallbackInsightsPool[Math.floor(Math.random() * fallbackInsightsPool.length)];
  return {
    id,
    date: dateStr,
    title: randomFallback.title,
    summary: randomFallback.summary,
    content: randomFallback.content,
    category: randomFallback.category,
    imagePrompt: randomFallback.imagePrompt,
    imageUrl: randomFallback.imageUrl,
    isApproved: true,
    publishedAt: new Date().toISOString()
  };
}

// Automatically generate a new Weekly Forecast
export async function autoGenerateWeekly(weekStr: string): Promise<WeeklyForecast> {
  const ai = getGeminiClient();
  const id = `wf_auto_${Date.now()}`;

  if (ai) {
    try {
      console.log(`[Auto-Generate] Running Gemini for weekly forecast week: ${weekStr}...`);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Create a professional Vedic astrology weekly forecast starting on date ${weekStr}.
Return it strictly in JSON format matching this TypeScript interface (no markdown code fence blocks, just clean JSON parseable text):
{
  "title": "A powerful summary title for the week",
  "career": { "summary": "Detailed career advice and predictions.", "score": 85 },
  "finance": { "summary": "Detailed financial advice and investments.", "score": 90 },
  "relationships": { "summary": "Detailed romantic guidance.", "score": 80 },
  "health": { "summary": "Detailed physical energy guidelines.", "score": 75 },
  "spiritual": { "summary": "Sadhana and mantra chanting ideas.", "score": 95 }
}`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text.trim());
      return {
        id,
        weekStarting: weekStr,
        title: result.title || "Weekly Cosmic Path",
        career: result.career || { summary: "Expect steady progress and executive opportunities.", score: 85 },
        finance: result.finance || { summary: "Perfect times to lock-in long-term investments.", score: 88 },
        relationships: result.relationships || { summary: "Venus provides supportive romantic and friendship channels.", score: 82 },
        health: result.health || { summary: "Rest brain neurons, reduce screen focus, and consume warm herbal tea.", score: 78 },
        spiritual: result.spiritual || { summary: "Chant cosmic mantras and practice mindful breathing.", score: 92 },
        imageUrl: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=600&auto=format&fit=crop",
        isApproved: true,
        publishedAt: new Date().toISOString()
      };
    } catch (err) {
      console.error("[Auto-Generate] Gemini error for weekly, using high-fidelity fallback:", err);
    }
  }

  // Fallback
  return {
    id,
    weekStarting: weekStr,
    title: "Weekly Ascendant Alignment",
    career: {
      summary: "This week planetary rulers align to bolster your workplace authority. Settle technical debts and present outlines to directors.",
      score: 87
    },
    finance: {
      summary: "Jupiter's positive gaze supports secure assets like precious metals and long-term funds. Minimize spontaneous expenditures.",
      score: 91
    },
    relationships: {
      summary: "Honest and quiet heart-to-heart dialogues dissolve modern friction. Venus rules social events this weekend.",
      score: 84
    },
    health: {
      summary: "Stay grounded, perform digital detox routines after sunset, and consume water-dense organic foods.",
      score: 81
    },
    spiritual: {
      summary: "Invaluable space for deep mental visualization. Divine elements guide your current path.",
      score: 96
    },
    imageUrl: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=600&auto=format&fit=crop",
    isApproved: true,
    publishedAt: new Date().toISOString()
  };
}

// Automatically generate a new Blog Article
export async function autoGenerateBlog(topic: string): Promise<BlogArticle> {
  const ai = getGeminiClient();
  const id = `art_auto_${Date.now()}`;
  const author = "Pathak Aanna";

  if (ai) {
    try {
      console.log(`[Auto-Generate] Running Gemini for blog article on topic: ${topic}...`);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Create a professional, SEO-optimized, in-depth astrology blog article about the topic: "${topic}".
Include high-quality headings, markdown bullet points, explanations of Vedic transits or charts, and specific remediations.
Return it strictly in JSON format matching this TypeScript interface:
{
  "title": "A highly clickable, SEO-optimized title for parents/students",
  "excerpt": "A striking 1-2 sentence preview to engage immediate clicks.",
  "content": "Deeply extensive markdown styled body text (3-4 detailed sections using ### headers and lists)",
  "category": "One of: Zodiac Signs, Career Astrology, Financial Astrology, Love Compatibility, Planetary Transits, Birth Chart Analysis, Numerology",
  "tags": ["3-5 trending tags", "astrology"],
  "metaTitle": "SEO meta title (maximum 60 chars)",
  "metaDescription": "SEO meta description with call-to-action (maximum 160 chars)"
}`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text.trim());
      const slug = (result.title || "astrology-post")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      return {
        id,
        title: result.title || "The Hidden Power of Daily Transits",
        slug,
        excerpt: result.excerpt || "Explore how daily planetary alignments impact your lifestyle.",
        content: result.content || "Vedic transits outline powerful rhythms in career and romance...",
        category: (result.category || "Planetary Transits") as any,
        tags: result.tags || ["Vedic Astrology", "Astrology Tips"],
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
        metaTitle: result.metaTitle || "The Hidden Power of Daily Transits - pathakaanna",
        metaDescription: result.metaDescription || "Learn how planetary alignments govern your energetic potential.",
        isApproved: true,
        publishedAt: new Date().toISOString(),
        author
      };
    } catch (err) {
      console.error("[Auto-Generate] Gemini error for blog, using high-fidelity fallback:", err);
    }
  }

  // Fallback
  const randomBlog = fallbackBlogsPool[Math.floor(Math.random() * fallbackBlogsPool.length)];
  const slug = randomBlog.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return {
    id,
    title: randomBlog.title,
    slug,
    excerpt: randomBlog.excerpt,
    content: randomBlog.content,
    category: randomBlog.category,
    tags: randomBlog.tags,
    imageUrl: randomBlog.imageUrl,
    metaTitle: randomBlog.metaTitle,
    metaDescription: randomBlog.metaDescription,
    isApproved: true,
    publishedAt: new Date().toISOString(),
    author
  };
}
