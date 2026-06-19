# 🚀 Astrology Content Automation Platform — Supabase & Vercel Production Setup Guide

Welcome to the premium deployment center. Below are the complete, production-ready blueprints and configuration steps required to connect this application to a live server-authoritative Postgres cluster using **Supabase** and deploy the client-side/server-side code using **Vercel** or **Cloud Run**.

---

## 📅 Part 1: Supabase Database Schema setup

Create these tables in your Supabase SQL Editor. This aligns perfectly with the application's automated content ingestion modules.

```sql
-- 1. Create content categories lookup table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed basic categories
INSERT INTO categories (name, slug) VALUES 
('Career Alignment', 'career-alignment'),
('Financial Astrology', 'financial-astrology'),
('Love & Relationships', 'love-relationships'),
('Physical Wellness', 'physical-wellness'),
('Spiritual Sadhana', 'spiritual-sadhana'),
('Zodiac Signs', 'zodiac-signs'),
('Planetary Transits', 'planetary-transits'),
('Birth Chart Analysis', 'birth-chart-analysis'),
('Numerology', 'numerology');

-- 2. Daily Insights Table
CREATE TABLE daily_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL REFERENCES categories(name) ON UPDATE CASCADE,
    image_prompt TEXT NOT NULL,
    image_url TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Weekly Forecasts Table
CREATE TABLE weekly_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_starting DATE NOT NULL UNIQUE, -- Commencing Monday
    title VARCHAR(255) NOT NULL,
    career_summary TEXT NOT NULL,
    career_score INTEGER CHECK (career_score BETWEEN 0 AND 100),
    finance_summary TEXT NOT NULL,
    finance_score INTEGER CHECK (finance_score BETWEEN 0 AND 100),
    relationships_summary TEXT NOT NULL,
    relationships_score INTEGER CHECK (relationships_score BETWEEN 0 AND 100),
    health_summary TEXT NOT NULL,
    health_score INTEGER CHECK (health_score BETWEEN 0 AND 100),
    spiritual_summary TEXT NOT NULL,
    spiritual_score INTEGER CHECK (spiritual_score BETWEEN 0 AND 100),
    image_url TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Zodiac Predictions Table
CREATE TABLE zodiac_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zodiac_sign VARCHAR(50) NOT NULL, -- 'aries', 'taurus', etc.
    prediction_date DATE NOT NULL,
    range_type VARCHAR(20) NOT NULL CHECK (range_type IN ('daily', 'weekly', 'monthly')),
    prediction_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(zodiac_sign, prediction_date, range_type)
);

-- 5. Blog Posts / Magazines Table (SEO Ready)
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL REFERENCES categories(name) ON UPDATE CASCADE,
    tags TEXT[] DEFAULT '{}',
    image_url TEXT NOT NULL,
    meta_title VARCHAR(150) NOT NULL,
    meta_description VARCHAR(255) NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    author VARCHAR(100) DEFAULT 'Pathak Aanna',
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    scheduled_for DATE, -- NULL means publish immediately; otherwise holds targeting date
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Centralized Image Prompts Catalog
CREATE TABLE image_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id VARCHAR(100) NOT NULL, -- Refers to corresponding tables id/uuid
    prompt_text TEXT NOT NULL,
    style_style VARCHAR(100) DEFAULT 'Premium Cosmic Luxury Artwork',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE zodiac_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_prompts ENABLE ROW LEVEL SECURITY;

-- Create public read policies (Any user can read approved content)
CREATE POLICY "Allow public read on approved daily insights" ON daily_insights
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Allow public read on approved weekly forecasts" ON weekly_forecasts
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Allow public read on zodiac predictions" ON zodiac_predictions
    FOR SELECT USING (true);

CREATE POLICY "Allow public read on approved blog posts" ON blog_posts
    FOR SELECT USING (is_approved = true AND (scheduled_for IS NULL OR scheduled_for <= CURRENT_DATE));

-- Create Write/Management policies for authenticated admin users
CREATE POLICY "Allow admin full access" ON daily_insights
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin full access" ON weekly_forecasts
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin full access" ON blog_posts
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

---

## ⚡ Part 2: Supabase Edge Functions (Automated Ingress)

Create a Supabase Edge Function to automate daily and weekly astrologer updates. For instance, creating a project function called `generate-astrology-insights`:

```typescript
// supabase/functions/generate-astrology-insights/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const geminiKey = Deno.env.get("GEMINI_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Call Gemini to generate Today's daily insight
    const todayStr = new Date().toISOString().split("T")[0];
    const prompt = `Create a professional Vedic astrology daily insight for the date ${todayStr}. Return strictly valid pure JSON: {"title": "...", "summary": "...", "content": "...", "category": "Career|Finance|Relationships|Health|Spiritual", "imagePrompt": "..."}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const parsedGemini = await res.json();
    const resultObj = JSON.parse(parsedGemini.candidates[0].content.parts[0].text);

    // Insert into Supabase
    const { data, error } = await supabase
      .from('daily_insights')
      .insert([
        {
          date: todayStr,
          title: resultObj.title,
          summary: resultObj.summary,
          content: resultObj.content,
          category: resultObj.category,
          image_prompt: resultObj.imagePrompt,
          image_url: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=600&auto=format&fit=crop"
        }
      ]);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, inserted: data }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
})
```

### Setup a Cron Trigger
In Supabase dashboard, head to **Database** ➔ **Triggers** or execute Deno pg_cron (if enabled) in SQL editor to run daily at 6:00 AM IST (00:30 UTC):
```sql
SELECT cron.schedule(
    'daily-astrology-automation',
    '30 0 * * *', -- 6:00 AM IST
    $$ SELECT net.http_post('https://your-project.supabase.co/functions/v1/generate-astrology-insights', NULL, NULL, NULL) $$
);
```

---

## 🛠️ Part 3: Environment Variables Setup

Configure these environment variables in your live **Vercel Settings/Environment Variables** console:

| Variable | Scope / Purpose | Example Value |
|---|---|---|
| `GEMINI_API_KEY` | Server-side Gemini Content Generator | `AIzaSyBw...` |
| `RAZORPAY_KEY_ID` | Active payment processor key | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Secret hash signature validator | `UXK8frx...` |
| `VITE_API_URL` | Endpoint router proxy path | (Defaults to current server location) |
| `SUPABASE_URL` | Supabase Cloud Database URL | `https://xoljagz.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Database admin key (Bypasses row RLS for automated cron job write ops) | `sb_srv_...` |

---

## 🚀 Part 4: Vercel Production Deployment

To host this as a fully functional fullstack site:

1. **Connect GitHub Branch:** Push this code repository to your GitHub page.
2. **Import Repo to Vercel:** Access Vercel Dashboard, select **Add New Project**, and link this workspace.
3. **Set Build Commands:** 
   - Root Directory: `.`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Publish:** Hit Deploy! Vercel serves the static React modules instantly while proxying client-side router fallbacks as declared in `vercel.json`.
