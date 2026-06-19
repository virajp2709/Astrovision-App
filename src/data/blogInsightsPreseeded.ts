import { DailyInsight, WeeklyForecast, BlogArticle } from "./astrologyHubTypes";

export const preseededDailyInsights: DailyInsight[] = [
  {
    id: "di_1",
    date: "2026-06-19",
    title: "Celestial Balance: Mercury Trines Saturn",
    summary: "A high-stability intellectual transit favors systematic technical planning, contractual agreements, and logical communications.",
    content: "Today, Mercury in Gemini coordinates a supportive trine angle with Saturn in Aquarius. This provides an amazing, grounded bridge between intellectual curiosity and structured realism. It is the absolute pinnacle window to sign binding legal agreements, compose tedious document drafts, or undertake complex scientific calculations. Make sure to ground key decisions in facts today.",
    category: "Spiritual",
    imagePrompt: "Luxury golden clockwork sphere floating over a deep dark blue nebula with gold lines, premium branding style",
    imageUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=600&auto=format&fit=crop",
    isApproved: true,
    publishedAt: new Date("2026-06-19T00:00:00Z").toISOString()
  },
  {
    id: "di_2",
    date: "2026-06-18",
    title: "Mars Conjunct North Node: Igniting True Purpose",
    summary: "Dynamic physical energy aligns with stellar destiny. A cosmic calling to take courageous risks in alignment with your future self.",
    content: "When Mars connects with the North Node of Destiny, the universe releases a high-voltage current of raw willpower. Today is designed for confronting deep fears, terminating toxic patterns, and launching courageous new initiatives. Trust where your future beckons.",
    category: "Career",
    imagePrompt: "A golden path of light leading towards a massive majestic star systems, gold and purple celestial energy",
    imageUrl: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=600&auto=format&fit=crop",
    isApproved: true,
    publishedAt: new Date("2026-06-18T00:00:00Z").toISOString()
  },
  {
    id: "di_3",
    date: "2026-06-17",
    title: "Venus Square Neptune: Seeing Beyond Illusions",
    summary: "Tides of highly sensitive emotional energy require clear filters. Avoid quick commitments in financial investments and romance today.",
    content: "Venus clashes with Neptune, throwing a beautiful but confusing celestial mist over financial contracts and romantic partnerships. Ensure to double-check contract terms and hold back on major asset purchases until the emotional tides settle into clear grounding.",
    category: "Finance",
    imagePrompt: "Shining gold celestial scales balancing emerald gems under purple cosmic background",
    imageUrl: "https://images.unsplash.com/photo-1516339901601-2e1d62dc0c45?q=80&w=600&auto=format&fit=crop",
    isApproved: true,
    publishedAt: new Date("2026-06-17T00:00:00Z").toISOString()
  }
];

export const preseededWeeklyForecasts: WeeklyForecast[] = [
  {
    id: "wf_current",
    weekStarting: "2026-06-15",
    title: "Weekly Transition: Solstice Gateway & Lunar Awakening",
    career: {
      summary: "Dynamic leadership aspects highlight high-stakes management. Sun in Gemini illuminates presentation plans, making it perfect to pitch high-level corporate directors.",
      score: 88
    },
    finance: {
      summary: "Mercury-Saturn trine delivers structured, durable wealth planning templates. Look for stable gold, blue-chip, or index-linked opportunities. Settle overdue accounts.",
      score: 92
    },
    relationships: {
      summary: "Venus-Jupiter alignment opens warm, generous channels of romantic expression. Single souls can align with compatible partners via educational retreats. Keep boundaries balanced.",
      score: 85
    },
    health: {
      summary: "High cognitive stimulation requires adequate offline digital hygiene. Undergo light magnesium bath rituals, optimize room air flow, and sleep prior to 11 PM to rest brain neurons.",
      score: 79
    },
    spiritual: {
      summary: "A pristine window for Kundli activation, temple prayers, and deep-root mantra chanting. Direct spiritual vibrations support deep ancestral offerings.",
      score: 95
    },
    imageUrl: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=600&auto=format&fit=crop",
    isApproved: true,
    publishedAt: new Date("2026-06-15T08:00:00Z").toISOString()
  }
];

export const preseededBlogArticles: BlogArticle[] = [
  {
    id: "art_1",
    title: "Navigating Saturn's Sade Sati: A Guide to Spiritual Maturity & Career Rebirth",
    slug: "navigating-saturns-sade-sati-guide",
    excerpt: "Understand the deep astronomical significance of Sade Sati, separate the fears from facts, and implement protective mantras and vastu remedies.",
    content: "Saturn or Shani Dev is often misunderstood as a negative celestial force, but in high-end Vedic Astrology, Saturn functions as the divine cosmic judicial officer. Sade Sati—the 7.5-year transit of Saturn over your natal Moon sign and adjacent houses—is actually a sacred crucible designed to burn away superficial ego, false alignments, and pride.\n\n### The Three Crucial phases of Sade Sati\n\n1. **The First Phase (Rising Cycle):** Transitioning through the 12th house from the Moon. This sector regulates expenses, overseas travels, and sleep cycles. Challenges focus on financial audits and inner-directed insulation.\n2. **The Second Phase (Peak peak Core):** Transit of Saturn directly over the natal Moon. This activates mental resilience checks, demanding total commitment to professional integrity, patience, and rigorous hard work.\n3. **The Third Phase (Setting Cycle):** Leaving through the 2nd house. Focuses on rebuilding wealth structures, speech parameters, and solid family commitments.\n\n### Strategic Vedic Remedies\n- **Chant the Hanuman Chalisa:** Highly potent planetary resonance to pacify Saturnian friction.\n- **Vastu Alignment:** Clean the West sector of your residence. Saturn rules the West compass; place dark metal ornaments or keep this zone dust-free.\n- **Charity (Daan):** Support service workers and disadvantaged groups on Saturdays.\n- **Wear Blue Sapphire / Amethyst:** Only after validating strong Saturn placement in your Kundli.",
    category: "Planetary Transits",
    tags: ["Saturn Transit", "Sade Sati", "Vedic Remedies", "Shani Dev", "Career Astrology"],
    imageUrl: "https://images.unsplash.com/photo-1504333631150-c8cd2f64b16e?q=80&w=600&auto=format&fit=crop",
    metaTitle: "Ultimate Guide to Sade Sati Remedies & Saturn Transit — pathakaanna",
    metaDescription: "Learn what Saturn's Sade Sati means for your career, health, and relationship. Discover authentic Vedic mantras & Vastu tips to succeed under Shani's gaze.",
    isApproved: true,
    publishedAt: new Date("2026-06-18T10:00:00Z").toISOString(),
    author: "Pathak Aanna"
  },
  {
    id: "art_2",
    title: "Financial Astrology: Hidden Wealth Placements in Your Birth Chart",
    slug: "financial-astrology-wealth-birth-chart",
    excerpt: "Is your business destined for high global scale? Learn how the 2nd House (Dhana), 11th House (Labha), and Jupiter placements dictate financial destiny.",
    content: "While persistent hard work is vital, astronomical parameters dictate the ease of wealth circulation in a material life. Vedic Astrology studies key financial indicators to decipher wealth portals.\n\n### The Core Pillars of Financial Astrology\n- **The Second House (Dhana Bhava):** Regulates immediate bank savings, familial assets, and jewelry.\n- **The Eleventh House (Labha Bhava):** Regulates massive gains, dynamic business cashflow, and influential social networks.\n- **The Ninth House (Bhagya Bhava):** Divine luck and planetary fortune.\n\n### The Auspicious 'Dhana Yogas'\nWhen the rulers of the 2nd, 9th, and 11th houses establish mutual connections (conjunction or mutual aspect), a premium 'Dhana Yoga' or Wealth Code triggers in the chart. For example, if Jupiter (Guru) sits in the 11th house aspects Venus in the 5th house, it produces a dynamic natural wealth flow.\n\n### Vastu Tips for Financial Expansion\nKeep the Northeast (Ishan) sector of your house empty, white, and active. Place clean water elements there to support intuitive investment ideas.",
    category: "Financial Astrology",
    tags: ["Wealth Astrology", "Dhana Yoga", "Jupiter Placement", "Vastu Remedies", "Finance Growth"],
    imageUrl: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=600&auto=format&fit=crop",
    metaTitle: "Financial Astrology: Dhana Yogas & Wealth Secrets - pathakaanna",
    metaDescription: "Uncover how planetary rulers of the 2nd and 11th houses impact your business scale. Discover astrological remedies for debt settlement and persistent cashflow.",
    isApproved: true,
    publishedAt: new Date("2026-06-16T12:00:00Z").toISOString(),
    author: "Pathak Aanna"
  },
  {
    id: "art_3",
    title: "Vedic Love Compatibility: Deciphering the Ashtakoota Gun Milan",
    slug: "vedic-love-compatibility-gun-milan",
    excerpt: "Explore the astronomical science of Ashtakoota marriage matching (36 Gunas) to predict emotional compatibility, family harmony, and biological synergy.",
    content: "Vedic relationship matching or 'Kundli Milan' goes far beyond simple sun-sign compatibility. It evaluates the exact Nakshatras (Lunar Mansions) of the partners using the highly scientific 'Ashtakoota' system.\n\n### The 8 Levels of Ashtakoota Matching\n1. **Varna (1 Point):** Intellectual/work compatibility.\n2. **Vashya (2 Points):** Mutual attraction and balance of influence.\n3. **Tara (3 Points):** Lifespan and safety factors.\n4. **Yoni (4 Points):** Deep biological and sexual compatibility.\n5. **Graha Maitri (5 Points):** Mental friendship and planetary compatibility between Moon rulers.\n6. **Gana (6 Points):** Nature matching (Deva, Manushya, or Rakshasa).\n7. **Bhakoot (7 Points):** Overall destiny synchronization and family health.\n8. **Nadi (8 Points):** Genetic compatibility and descendant success.\n\n### The Importance of Gunas\n- **Above 18 Gunas:** Approved for a harmonious, cooperative journey.\n- **Above 25 Gunas:** Outstanding mental, spiritual, and biological synergy.\n- **Nadi Dosha:** If both partners belong to the same Nadi, it requires remedial gemstones or specific mantra chanting to pacify energetic friction.",
    category: "Love Compatibility",
    tags: ["Ashtakoota", "Gun Milan", "Relationship Astrology", "Kundli Matching", "Marriage Guide"],
    imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
    metaTitle: "Ashtakoota Gun Milan: Astro Love Compatibility Explained — pathakaanna",
    metaDescription: "Understand the deep planetary logic of 36 Guna marriage matching. Explore the impact of Bhakoot, Gana, and Nadi Doshas in modern relationships.",
    isApproved: true,
    publishedAt: new Date("2026-06-14T09:00:00Z").toISOString(),
    author: "Pathak Aanna"
  }
];
