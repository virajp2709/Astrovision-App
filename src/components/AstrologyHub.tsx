import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Compass, 
  BookOpen, 
  Calendar, 
  Search, 
  Filter, 
  Trash2, 
  Check, 
  X, 
  Edit, 
  Plus, 
  Share2, 
  ExternalLink, 
  Eye, 
  Settings, 
  AlertTriangle, 
  Heart, 
  DollarSign, 
  Award, 
  Activity, 
  CloudLightning, 
  Moon, 
  Sun, 
  Info,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Clock,
  Unlock,
  Lock
} from "lucide-react";
import { DailyInsight, WeeklyForecast, BlogArticle, ZodiacSignDetails } from "../data/astrologyHubTypes";
import { zodiacSignsList } from "../data/zodiacSignsDb";
import { preseededDailyInsights, preseededWeeklyForecasts, preseededBlogArticles } from "../data/blogInsightsPreseeded";

// Local storage helpers for static deployment fallback (e.g. Vercel static router rewrite fallback)
const getLocalBackup = () => {
  try {
    const backupStr = localStorage.getItem("nakshatra_backup_db");
    if (backupStr) {
      const parsed = JSON.parse(backupStr);
      if (parsed.dailyInsights && parsed.weeklyForecasts && parsed.blogArticles) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("localStorage not available:", e);
  }
  return {
    dailyInsights: preseededDailyInsights,
    weeklyForecasts: preseededWeeklyForecasts,
    blogArticles: preseededBlogArticles
  };
};

const saveLocalBackup = (daily: DailyInsight[], weekly: WeeklyForecast[], blogs: BlogArticle[]) => {
  try {
    localStorage.setItem("nakshatra_backup_db", JSON.stringify({
      dailyInsights: daily,
      weeklyForecasts: weekly,
      blogArticles: blogs
    }));
  } catch (e) {
    console.warn("localStorage save failed:", e);
  }
};

export default function AstrologyHub() {
  // Database States loaded from Server
  const [dailyInsights, setDailyInsights] = useState<DailyInsight[]>([]);
  const [weeklyForecasts, setWeeklyForecasts] = useState<WeeklyForecast[]>([]);
  const [blogArticles, setBlogArticles] = useState<BlogArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isOfflineFallback, setIsOfflineFallback] = useState(false);

  // Tabs within Insights Hub: "daily" | "weekly" | "blog" | "zodiac" | "admin"
  const [hubTab, setHubTab] = useState<"daily" | "weekly" | "blog" | "zodiac" | "admin">("daily");

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [zodiacFilter, setZodiacFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState(""); // YYYY-MM-DD

  // Details expander states
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null);
  const [selectedZodiacId, setSelectedZodiacId] = useState<string | null>(null);
  const [selectedZodiacRange, setSelectedZodiacRange] = useState<"daily" | "weekly" | "monthly">("daily");

  // Admin and Editor state
  const [isAdminMode, setIsAdminMode] = useState(() => {
    try {
      return localStorage.getItem("astro_admin_active") === "true";
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const active = localStorage.getItem("astro_admin_active") === "true";
      if (active !== isAdminMode) {
        setIsAdminMode(active);
      }
      if (!active && hubTab === "admin") {
        setHubTab("daily");
      }
    };
    const interval = setInterval(handleStorageChange, 1000);
    return () => clearInterval(interval);
  }, [isAdminMode, hubTab]);

  const handleToggleAdmin = (enabled: boolean) => {
    setIsAdminMode(enabled);
    try {
      if (enabled) {
        localStorage.setItem("astro_admin_active", "true");
      } else {
        localStorage.removeItem("astro_admin_active");
      }
    } catch (e) {}
  };

  const [adminToken, setAdminToken] = useState(""); // mock password to lock/unlock Admin Panel
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  // Custom composer form
  const [composeType, setComposeType] = useState<"daily" | "weekly" | "blog">("daily");
  const [editorPayload, setEditorPayload] = useState<any>({
    title: "",
    summary: "",
    content: "",
    category: "Spiritual",
    imagePrompt: "",
    imageUrl: "",
    careerSummary: "",
    careerScore: 85,
    financeSummary: "",
    financeScore: 85,
    relationshipSummary: "",
    relationshipScore: 85,
    healthSummary: "",
    healthScore: 85,
    spiritualSummary: "",
    spiritualScore: 85,
    blogCategory: "Planetary Transits",
    tagsStr: "",
    metaTitle: "",
    metaDescription: "",
    scheduledFor: "",
    isApproved: true,
  });

  // AI Prompt generation controller
  const [aiPromptInput, setAiPromptInput] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiGenerateSuccess, setAiGenerateSuccess] = useState("");

  // Fetch all hub data on mount/tab interaction
  const fetchHubData = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const resp = await fetch("/api/astrology-hub");
      const contentType = resp.headers.get("content-type");

      // Validate that it's a real API endpoint output instead of a routing rewrite index.html SPA content
      if (resp.status !== 200 || (contentType && contentType.includes("text/html"))) {
        throw new Error("Local API endpoint bypass detected. Activating offline backup database.");
      }

      const d = await resp.json();
      if (d.success) {
        setDailyInsights(d.dailyInsights);
        setWeeklyForecasts(d.weeklyForecasts);
        setBlogArticles(d.blogArticles);
        // Persist to offline backup store
        saveLocalBackup(d.dailyInsights, d.weeklyForecasts, d.blogArticles);
        setIsOfflineFallback(false);
      } else {
        throw new Error(d.error || "Registry query returned success=false.");
      }
    } catch (err: any) {
      console.warn("Using localized astrology store fallback:", err.message);
      const backup = getLocalBackup();
      setDailyInsights(backup.dailyInsights);
      setWeeklyForecasts(backup.weeklyForecasts);
      setBlogArticles(backup.blogArticles);
      setIsOfflineFallback(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHubData();
  }, []);

  // Post approval trigger
  const toggleApprovalStatus = async (type: "daily" | "weekly" | "blog", id: string) => {
    if (isOfflineFallback) {
      let updatedDaily = [...dailyInsights];
      let updatedWeekly = [...weeklyForecasts];
      let updatedBlog = [...blogArticles];

      if (type === "daily") {
        updatedDaily = dailyInsights.map(item => item.id === id ? { ...item, isApproved: !item.isApproved } : item);
      } else if (type === "weekly") {
        updatedWeekly = weeklyForecasts.map(item => item.id === id ? { ...item, isApproved: !item.isApproved } : item);
      } else if (type === "blog") {
        updatedBlog = blogArticles.map(item => item.id === id ? { ...item, isApproved: !item.isApproved } : item);
      }

      setDailyInsights(updatedDaily);
      setWeeklyForecasts(updatedWeekly);
      setBlogArticles(updatedBlog);
      saveLocalBackup(updatedDaily, updatedWeekly, updatedBlog);
      return;
    }

    try {
      const resp = await fetch("/api/astrology-hub/toggle-approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id })
      });
      const d = await resp.json();
      if (d.success) {
        setDailyInsights(d.db.dailyInsights);
        setWeeklyForecasts(d.db.weeklyForecasts);
        setBlogArticles(d.db.blogArticles);
      } else {
        alert(d.error);
      }
    } catch (err) {
      alert("Error updating posting approval state.");
    }
  };

  // Post deletion trigger
  const deletePostBytes = async (type: "daily" | "weekly" | "blog", id: string) => {
    if (!window.confirm("Are you absolutely sure you want to delete this celestial post permanently?")) {
      return;
    }

    if (isOfflineFallback) {
      const updatedDaily = dailyInsights.filter(item => !(type === "daily" && item.id === id));
      const updatedWeekly = weeklyForecasts.filter(item => !(type === "weekly" && item.id === id));
      const updatedBlog = blogArticles.filter(item => !(type === "blog" && item.id === id));

      setDailyInsights(updatedDaily);
      setWeeklyForecasts(updatedWeekly);
      setBlogArticles(updatedBlog);
      saveLocalBackup(updatedDaily, updatedWeekly, updatedBlog);
      return;
    }

    try {
      const resp = await fetch(`/api/astrology-hub/${type}/${id}`, {
        method: "DELETE"
      });
      const d = await resp.json();
      if (d.success) {
        setDailyInsights(d.db.dailyInsights);
        setWeeklyForecasts(d.db.weeklyForecasts);
        setBlogArticles(d.db.blogArticles);
      } else {
        alert(d.error);
      }
    } catch (err) {
      alert("Error deleting item.");
    }
  };

  // AI Generation trigger on server-side
  const runAiDraftCreation = async (type: "daily" | "weekly" | "blog") => {
    setIsAiGenerating(true);
    setAiGenerateSuccess("");

    if (isOfflineFallback) {
      // Simulate gorgeous instant client-side Gemini Generation
      setTimeout(() => {
        const uniqueId = `local_ai_${Date.now()}`;
        const cleanPrompt = aiPromptInput || "Sade Sati, Spiritual Guidance";
        
        let newDaily: DailyInsight | null = null;
        let newWeekly: WeeklyForecast | null = null;
        let newBlog: BlogArticle | null = null;

        if (type === "daily") {
          newDaily = {
            id: uniqueId,
            date: new Date().toISOString().split("T")[0],
            title: `Cosmic Pulse: Alignment on ${cleanPrompt}`,
            summary: `Spiritual daily gateway focused on ${cleanPrompt} supporting immediate life adjustments.`,
            content: `The planetary transits align with your focus on "${cleanPrompt}". During today's transit, cosmic waves prompt deep and disciplined action, supporting concept-based learning, experienced faculty connections, and structured spiritual practice. Ensure to lock in quiet morning hours for self-reflection.`,
            category: "Spiritual",
            imagePrompt: `Spiritual cosmic pathway depicting ${cleanPrompt} in shimmering golden stars`,
            imageUrl: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=600&auto=format&fit=crop",
            isApproved: false,
            publishedAt: new Date().toISOString()
          };
        } else if (type === "weekly") {
          newWeekly = {
            id: uniqueId,
            weekStarting: new Date().toISOString().split("T")[0],
            title: `Weekly Insight: Navigating ${cleanPrompt}`,
            career: { summary: `Excelling in career goals matching ${cleanPrompt}. High diligence produces major rewards.`, score: 90 },
            finance: { summary: `Financial transits show steady wealth growth and clear budgetary structures.`, score: 85 },
            relationships: { summary: `Build healthy boundaries with supportive partners and family leaders.`, score: 82 },
            health: { summary: `Hydrate well, align sleep cycles with circadian rhythms, and avoid screen time.`, score: 88 },
            spiritual: { summary: `Excellent spiritual Sadhana cycles activated under solar energy aspects.`, score: 95 },
            imageUrl: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=600&auto=format&fit=crop",
            isApproved: false,
            publishedAt: new Date().toISOString()
          };
        } else if (type === "blog") {
          newBlog = {
            id: uniqueId,
            title: `Vedic Secrets of ${cleanPrompt === "Sade Sati, Spiritual Guidance" ? "Shani Sade Sati" : cleanPrompt}`,
            slug: `concept-learning-secrets-${uniqueId}`,
            excerpt: `A high-fidelity guide explaining custom remediations for daily wellness and path alignment regarding ${cleanPrompt}.`,
            content: `### Understanding the Cosmic Principles\n\nWhen we study the astrological details of **${cleanPrompt}**, we notice direct patterns of spiritual geometry acting upon the chart native. It demands Concept-Based Learning and highly experienced, disciplined preparation.\n\n### Vedic Remediations & Mantras:\n\n1. **Pranayama & Meditation:** Perform 10-15 cycles daily to cultivate high cognitive peace.\n2. **Charitable Service:** Support senior citizens or helpers to channel beneficial energetic aspects.\n3. **Vastu Optimization:** Keep the West sector clean and properly decluttered.\n\nPractice deep devotion to unlock outstanding fine arts and cosmic clarity.`,
            category: "Planetary Transits",
            tags: ["Vedic Wisdom", "Remedies", "Sadhana"],
            imageUrl: "https://images.unsplash.com/photo-1504333631150-c8cd2f64b16e?q=80&w=600&auto=format&fit=crop",
            metaTitle: `Guide to ${cleanPrompt} Secrets - pathakaanna`,
            metaDescription: `Discover the professional planetary insights behind ${cleanPrompt}. Fast and authentic Vedic remediations.`,
            author: "Pathak Aanna",
            isApproved: false,
            publishedAt: new Date().toISOString()
          };
        }

        const updatedDaily = newDaily ? [newDaily, ...dailyInsights] : dailyInsights;
        const updatedWeekly = newWeekly ? [newWeekly, ...weeklyForecasts] : weeklyForecasts;
        const updatedBlog = newBlog ? [newBlog, ...blogArticles] : blogArticles;

        setDailyInsights(updatedDaily);
        setWeeklyForecasts(updatedWeekly);
        setBlogArticles(updatedBlog);
        saveLocalBackup(updatedDaily, updatedWeekly, updatedBlog);

        setIsAiGenerating(false);
        setAiPromptInput("");
        setAiGenerateSuccess(`Successfully drafted fresh ${type} about "${cleanPrompt}" inside offline memory! Validate and APPROVE it below.`);
        setTimeout(() => setAiGenerateSuccess(""), 8000);
      }, 1200);
      return;
    }

    try {
      const resp = await fetch("/api/astrology-hub/trigger-ai-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, promptInput: aiPromptInput })
      });
      const d = await resp.json();
      if (d.success) {
        setDailyInsights(d.db.dailyInsights);
        setWeeklyForecasts(d.db.weeklyForecasts);
        setBlogArticles(d.db.blogArticles);
        setAiGenerateSuccess(`Successfully generated fresh ${type} draft using Gemini AI! It is placed as PENDING for your validation in the Admin panel.`);
        setAiPromptInput("");
        setTimeout(() => setAiGenerateSuccess(""), 8000);
      } else {
        alert(d.error || "Generation returned failure.");
      }
    } catch (err) {
      alert("Failed to compile AI insights prompt request.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Submission handler for Custom Editor
  const saveCustomPublish = async (e: React.FormEvent) => {
    e.preventDefault();

    let formattedPayload: any = {};
    if (composeType === "daily") {
      formattedPayload = {
        id: `custom_di_${Date.now()}`,
        title: editorPayload.title,
        summary: editorPayload.summary,
        content: editorPayload.content,
        category: editorPayload.category,
        imagePrompt: editorPayload.imagePrompt || "Golden clockwork nebula luxury",
        imageUrl: editorPayload.imageUrl || "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=600&auto=format&fit=crop",
        isApproved: editorPayload.isApproved,
        date: dateFilter || new Date().toISOString().split("T")[0]
      };
    } else if (composeType === "weekly") {
      formattedPayload = {
        id: `custom_wf_${Date.now()}`,
        title: editorPayload.title,
        weekStarting: dateFilter || new Date().toISOString().split("T")[0],
        career: { summary: editorPayload.careerSummary, score: Number(editorPayload.careerScore) },
        finance: { summary: editorPayload.financeSummary, score: Number(editorPayload.financeScore) },
        relationships: { summary: editorPayload.relationshipSummary, score: Number(editorPayload.relationshipScore) },
        health: { summary: editorPayload.healthSummary, score: Number(editorPayload.healthScore) },
        spiritual: { summary: editorPayload.spiritualSummary, score: Number(editorPayload.spiritualScore) },
        imageUrl: editorPayload.imageUrl || "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=600&auto=format&fit=crop",
        isApproved: editorPayload.isApproved
      };
    } else if (composeType === "blog") {
      formattedPayload = {
        id: `custom_blog_${Date.now()}`,
        title: editorPayload.title,
        excerpt: editorPayload.summary,
        content: editorPayload.content,
        category: editorPayload.blogCategory,
        tags: (editorPayload.tagsStr || "").split(",").map((t: string) => t.trim()).filter(Boolean),
        imageUrl: editorPayload.imageUrl || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
        metaTitle: editorPayload.metaTitle || `${editorPayload.title} - pathakaanna`,
        metaDescription: editorPayload.metaDescription || editorPayload.summary,
        scheduledFor: editorPayload.scheduledFor || "",
        isApproved: editorPayload.isApproved
      };
    }

    if (isOfflineFallback) {
      const updatedDaily = composeType === "daily" ? [formattedPayload, ...dailyInsights] : dailyInsights;
      const updatedWeekly = composeType === "weekly" ? [formattedPayload, ...weeklyForecasts] : weeklyForecasts;
      const updatedBlog = composeType === "blog" ? [formattedPayload, ...blogArticles] : blogArticles;

      setDailyInsights(updatedDaily);
      setWeeklyForecasts(updatedWeekly);
      setBlogArticles(updatedBlog);
      saveLocalBackup(updatedDaily, updatedWeekly, updatedBlog);

      alert(`Successfully published ${composeType} into local offline memory!`);
      // Reset composer
      setEditorPayload({
        title: "",
        summary: "",
        content: "",
        category: "Spiritual",
        imagePrompt: "",
        imageUrl: "",
        careerSummary: "",
        careerScore: 85,
        financeSummary: "",
        financeScore: 85,
        relationshipSummary: "",
        relationshipScore: 85,
        healthSummary: "",
        healthScore: 85,
        spiritualSummary: "",
        spiritualScore: 85,
        blogCategory: "Planetary Transits",
        tagsStr: "",
        metaTitle: "",
        metaDescription: "",
        scheduledFor: "",
        isApproved: true
      });
      return;
    }

    try {
      const resp = await fetch("/api/astrology-hub/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: composeType, payload: formattedPayload })
      });
      const d = await resp.json();
      if (d.success) {
        setDailyInsights(d.db.dailyInsights);
        setWeeklyForecasts(d.db.weeklyForecasts);
        setBlogArticles(d.db.blogArticles);
        alert(`Successfully published ${composeType}! It is now live in the hub.`);
        // Reset composer
        setEditorPayload({
          title: "",
          summary: "",
          content: "",
          category: "Spiritual",
          imagePrompt: "",
          imageUrl: "",
          careerSummary: "",
          careerScore: 85,
          financeSummary: "",
          financeScore: 85,
          relationshipSummary: "",
          relationshipScore: 85,
          healthSummary: "",
          healthScore: 85,
          spiritualSummary: "",
          spiritualScore: 85,
          blogCategory: "Planetary Transits",
          tagsStr: "",
          metaTitle: "",
          metaDescription: "",
          scheduledFor: "",
          isApproved: true,
        });
      } else {
        alert(d.error);
      }
    } catch (err) {
      alert("Error submitting to publisher API portal.");
    }
  };

  // Pre-seed individual edits into composer
  const populateEditorForEdit = (type: "daily" | "weekly" | "blog", item: any) => {
    setComposeType(type);
    if (type === "daily") {
      setEditorPayload({
        title: item.title,
        summary: item.summary,
        content: item.content,
        category: item.category,
        imagePrompt: item.imagePrompt,
        imageUrl: item.imageUrl,
        isApproved: item.isApproved
      });
      setDateFilter(item.date);
    } else if (type === "weekly") {
      setEditorPayload({
        title: item.title,
        careerSummary: item.career?.summary || "",
        careerScore: item.career?.score || 85,
        financeSummary: item.finance?.summary || "",
        financeScore: item.finance?.score || 85,
        relationshipSummary: item.relationships?.summary || "",
        relationshipScore: item.relationships?.score || 85,
        healthSummary: item.health?.summary || "",
        healthScore: item.health?.score || 85,
        spiritualSummary: item.spiritual?.summary || "",
        spiritualScore: item.spiritual?.score || 85,
        imageUrl: item.imageUrl,
        isApproved: item.isApproved
      });
      setDateFilter(item.weekStarting);
    } else if (type === "blog") {
      setEditorPayload({
        title: item.title,
        summary: item.excerpt,
        content: item.content,
        blogCategory: item.category,
        tagsStr: item.tags?.join(", ") || "",
        imageUrl: item.imageUrl,
        metaTitle: item.metaTitle,
        metaDescription: item.metaDescription,
        scheduledFor: item.scheduledFor || "",
        isApproved: item.isApproved
      });
    }
    // Scroll to form inside Admin Panel
    const elem = document.getElementById("admin-composer-form");
    if (elem) elem.scrollIntoView({ behavior: "smooth" });
  };

  // Handle Mock sharing alert & link copying
  const handleShareSimulate = (platform: string, title: string, url: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    if (platform === "copy") {
      navigator.clipboard.writeText(fullUrl);
      alert("🌌 Link copied to clipboard! Share the cosmic blessings with friends.");
    } else {
      alert(`✨ Sharing "${title}" on ${platform}. (Simulated API delivery)`);
    }
  };

  // Filters application
  const getFilteredDaily = () => {
    return dailyInsights.filter(insight => {
      // Must be approved to show in front views, or we show everything to Admins
      if (!insight.isApproved && !isAdminMode) return false;
      
      const matchQuery = 
        insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        insight.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        insight.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = categoryFilter === "All" || insight.category === categoryFilter;
      const matchDate = !dateFilter || insight.date === dateFilter;

      return matchQuery && matchCategory && matchDate;
    });
  };

  const getFilteredWeekly = () => {
    return weeklyForecasts.filter(forecast => {
      if (!forecast.isApproved && !isAdminMode) return false;

      const matchQuery = 
        forecast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        forecast.career.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        forecast.finance.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        forecast.relationships.summary.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDate = !dateFilter || forecast.weekStarting === dateFilter;

      return matchQuery && matchDate;
    });
  };

  const getFilteredBlogs = () => {
    return blogArticles.filter(article => {
      if (!article.isApproved && !isAdminMode) return false;

      // Handle raw scheduling filter (hide future posts from non-admins)
      if (article.scheduledFor && !isAdminMode) {
        const today = new Date().toISOString().split("T")[0];
        if (article.scheduledFor > today) return false;
      }

      const matchQuery = 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = categoryFilter === "All" || article.category === categoryFilter;

      return matchQuery && matchCategory;
    });
  };

  const getFilteredZodiacs = () => {
    return zodiacSignsList.filter(sign => {
      const matchQuery = 
        sign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sign.sanskritName.includes(searchQuery) ||
        sign.element.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sign.ruler.toLowerCase().includes(searchQuery.toLowerCase());

      const matchZodiac = zodiacFilter === "All" || sign.id === zodiacFilter;

      return matchQuery && matchZodiac;
    });
  };

  // Category tags style mapping
  const getCategoryTheme = (category: string) => {
    switch(category) {
      case "Career": return "bg-[#0B3C5D]/10 text-sky-400 border-[#0B3C5D]/30";
      case "Finance": return "bg-amber-400/10 text-yellow-500 border-yellow-500/30";
      case "Relationships": return "bg-pink-400/10 text-pink-500 border-pink-500/30";
      case "Health": return "bg-emerald-400/10 text-emerald-500 border-emerald-500/30";
      default: return "bg-purple-400/10 text-purple-400 border-purple-500/30";
    }
  };

  return (
    <div id="astrology-hub" className="bg-[#040814] text-stone-100 rounded-lg border-2 border-[#F2B705]/50 overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.8)] p-1 sm:p-5 relative">
      {/* Mystical Star Background Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40"></div>
      
      {/* Glowing luxury accent orb in background */}
      <div className="absolute top-20 left-1/3 w-80 h-80 bg-[#0B3C5D]/25 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Astro Hub Headline Header (Dark Royalty Magazine styling) */}
      <div className="relative z-10 border-b-2 border-[#F2B705]/30 pb-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div>
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="text-[10px] uppercase font-mono tracking-widest bg-yellow-400/10 text-[#F2B705] border border-[#F2B705]/30 px-2.5 py-1 rounded">
              ⚜️ Professional Editorial Publication
            </span>
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-4xl text-[#F2B705] tracking-tight mt-2 drop-shadow-sm flex items-center justify-center md:justify-start gap-3">
            <Compass className="w-8 h-8 text-[#F2B705] animate-spin-slow rotate-12" />
            ASTROLOGY INSIGHTS HUB
          </h2>
          <p className="text-xs text-stone-300 mt-1 font-sans italic max-w-xl">
            Fully automated celestial planetary intelligence, updated in real-time. Created on basis of concept learning, experienced Vedic insights and absolute astronomical precision.
          </p>
        </div>

        {/* Sync & Admin controllers */}
        {isAdminMode && (
          <div className="flex items-center gap-3">
            <button
              onClick={fetchHubData}
              title="Squeeze latest alignments"
              className="p-2.5 rounded bg-slate-900/80 border border-stone-700 hover:border-[#F2B705] text-[#F2B705] transition cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>

            {/* Admin Panel Selector */}
            <button
              onClick={() => {
                if (isAdminMode) {
                  handleToggleAdmin(false);
                } else {
                  setShowAdminLogin(true);
                }
              }}
              className={`px-4 py-2.5 rounded text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 border ${
                isAdminMode 
                  ? "bg-purple-950 text-purple-200 border-purple-500/50" 
                  : "bg-slate-900 text-[#F2B705] border-stone-800 hover:border-[#F2B705]/80"
              }`}
            >
              {isAdminMode ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              {isAdminMode ? "Admin Active" : "Author Access"}
            </button>
          </div>
        )}
      </div>

      {/* ADMIN PASSCODE DIALOG */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#0b1329] border-2 border-purple-500/50 rounded-lg p-6 max-w-md w-full text-stone-100 shadow-[0_20px_50px_rgba(168,85,247,0.3)]">
            <h4 className="font-serif font-bold text-lg text-purple-400 flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#F2B705]" />
              Authenticating Author Panel
            </h4>
            <p className="text-xs text-stone-300 mt-1">
              Unlock approving, editing, dynamic scheduling, and custom content compose tools. Enter passcode: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-yellow-400 font-mono">admin</code> to test.
            </p>
            <input
              type="password"
              placeholder="Passcode..."
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              className="w-full bg-slate-950 border border-stone-800 rounded px-4 py-2.5 text-sm font-mono mt-4 text-[#F2B705] focus:outline-none focus:border-purple-500"
            />
            <div className="flex justify-end gap-2.5 mt-5">
              <button
                onClick={() => {
                  setShowAdminLogin(false);
                  setAdminToken("");
                }}
                className="px-4 py-2 rounded text-xs bg-slate-900 hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (adminToken.trim().toLowerCase() === "admin") {
                    handleToggleAdmin(true);
                    setHubTab("admin");
                    setShowAdminLogin(false);
                    setAdminToken("");
                  } else {
                    alert("Incorrect astronomical password alignment.");
                  }
                }}
                className="px-4 py-2 rounded text-xs font-bold uppercase tracking-wider bg-purple-600 hover:bg-purple-500 text-white cursor-pointer"
              >
                Launch Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ERROR / DISCONNECTED BAR */}
      {errorMessage && (
        <div className="bg-red-950/40 border border-red-500/50 rounded-md p-3 mb-6 text-xs text-red-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* LOCAL REDUNDANT DATABASE STATUS FOR VERCEL DEPLOYMENTS */}
      {isOfflineFallback && (
        <div className="relative z-10 bg-[#F2B705]/10 border border-[#F2B705]/30 rounded-md p-3.5 mb-6 text-xs text-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-start sm:items-center gap-2.5">
            <Sparkles className="w-4.5 h-4.5 text-[#F2B705] shrink-0 animate-pulse mt-0.5 sm:mt-0" />
            <div>
              <span className="font-bold text-[#F2B705]">[Redundant Edge Database Active]</span>
              <span className="ml-1 text-stone-300">Synchronized client fallback active. You can read, draft, approve, and schedule posts. Changes are saved in your browser's LocalStorage.</span>
            </div>
          </div>
          <button 
            onClick={() => {
              fetchHubData();
            }}
            className="text-[10px] uppercase font-mono tracking-wider bg-[#F2B705] text-slate-950 px-2.5 py-1.5 rounded font-bold hover:bg-amber-300 cursor-pointer self-start sm:self-center shrink-0 transition"
          >
            Retry Live Sync
          </button>
        </div>
      )}

      {/* SEARCH AND FILTER CONSOLE */}
      <div className="relative z-10 bg-slate-950/60 p-4 rounded-md border border-stone-800/80 mb-6 space-y-3 shadow-inner">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Keyword Query Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search transits, predictions, titles, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 pl-10 pr-9 py-2.5 rounded text-xs text-stone-100 border border-stone-800 focus:ring-1 focus:ring-[#F2B705] focus:outline-none placeholder:text-stone-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Selector (Daily/Blog contexts) */}
          <div className="md:col-span-3 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#F2B705] hidden sm:block" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-950 py-2.5 px-3 rounded text-xs text-stone-100 border border-stone-800 focus:outline-none focus:border-[#F2B705]"
            >
              <option value="All">All Categories</option>
              {/* Daily Insight & Blog Categories */}
              <option value="Career">Career Alignment</option>
              <option value="Finance">Financial Astrology</option>
              <option value="Relationships">Love & Relationships</option>
              <option value="Health">Physical Wellness</option>
              <option value="Spiritual">Spiritual Sadhana</option>
              <option value="Zodiac Signs">Zodiac Signs</option>
              <option value="Planetary Transits">Planetary Transits</option>
              <option value="Birth Chart Analysis">Birth Chart Analysis</option>
              <option value="Numerology">Numerology</option>
            </select>
          </div>

          {/* Zodiac Specific Filter Selector */}
          <div className="md:col-span-2">
            <select
              value={zodiacFilter}
              onChange={(e) => setZodiacFilter(e.target.value)}
              className="w-full bg-slate-950 py-2.5 px-3 rounded text-xs text-stone-100 border border-stone-800 focus:outline-none focus:border-[#F2B705]"
            >
              <option value="All">All Zodiacs</option>
              {zodiacSignsList.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.id.toUpperCase()})</option>
              ))}
            </select>
          </div>

          {/* Target Date Selector */}
          <div className="md:col-span-2">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-slate-950 py-2 px-2.5 rounded text-xs text-stone-100 border border-stone-800 focus:outline-none focus:border-[#F2B705]"
            />
          </div>
        </div>

        {/* Clear active filters widget */}
        {(searchQuery || categoryFilter !== "All" || zodiacFilter !== "All" || dateFilter) && (
          <div className="flex items-center justify-between text-[11px] text-stone-400 border-t border-dashed border-stone-900 pt-2">
            <span>Filtered list matching active parameters.</span>
            <button
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("All");
                setZodiacFilter("All");
                setDateFilter("");
              }}
              className="font-mono text-[#F2B705] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Reset Filters ×
            </button>
          </div>
        )}
      </div>

      {/* CORE HUB NAVIGATION TAB BAR */}
      <div className={`relative z-10 grid grid-cols-2 ${isAdminMode ? "sm:grid-cols-5" : "sm:grid-cols-4"} gap-1.5 p-1 bg-slate-950/80 rounded border border-stone-800/70 mb-6 select-none shadow-md`}>
        <button
          onClick={() => setHubTab("daily")}
          className={`py-3 px-1.5 text-center text-xs font-mono font-bold uppercase tracking-wider transition rounded cursor-pointer ${
            hubTab === "daily"
              ? "bg-[#0B3C5D] text-white border-b-2 border-[#F2B705]"
              : "text-stone-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          🌌 Daily Insight
        </button>
        <button
          onClick={() => setHubTab("weekly")}
          className={`py-3 px-1.5 text-center text-xs font-mono font-bold uppercase tracking-wider transition rounded cursor-pointer ${
            hubTab === "weekly"
              ? "bg-[#0B3C5D] text-white border-b-2 border-[#F2B705]"
              : "text-stone-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          🧭 Weekly Forecast
        </button>
        <button
          onClick={() => setHubTab("blog")}
          className={`py-3 px-1.5 text-center text-xs font-mono font-bold uppercase tracking-wider transition rounded cursor-pointer ${
            hubTab === "blog"
              ? "bg-[#0B3C5D] text-white border-b-2 border-[#F2B705]"
              : "text-stone-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          📖 Astro Magazine
        </button>
        <button
          onClick={() => setHubTab("zodiac")}
          className={`py-3 px-1.5 text-center text-xs font-mono font-bold uppercase tracking-wider transition rounded cursor-pointer ${
            hubTab === "zodiac"
              ? "bg-[#0B3C5D] text-white border-b-2 border-[#F2B705]"
              : "text-stone-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          🌟 Zodiac Wheel
        </button>
        {isAdminMode && (
          <button
            onClick={() => {
              setHubTab("admin");
            }}
            className={`col-span-2 sm:col-span-1 py-3 px-1.5 text-center text-xs font-mono font-bold uppercase tracking-wider transition rounded cursor-pointer ${
              hubTab === "admin"
                ? "bg-purple-900 text-purple-100 border-b-2 border-[#F2B705]"
                : "text-purple-400 hover:bg-purple-950/20"
            }`}
          >
            ⚙️ Operator Console
          </button>
        )}
      </div>

      {/* RENDER ACTIVE TAB VIEW */}
      <div className="relative z-10 text-left min-h-[400px]">
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-20 text-stone-400 font-sans gap-3">
            <RefreshCw className="w-8 h-8 text-[#F2B705] animate-spin" />
            <p className="text-xs font-mono tracking-widest uppercase text-stone-500">
              Synchronizing with astronomical satellites...
            </p>
          </div>
        )}

        {!isLoading && (
          <AnimatePresence mode="wait">
            {/* TAB 1: DAILY ASTROLOGY INSIGHTS */}
            {hubTab === "daily" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Highlighted Today's Main Insight */}
                {getFilteredDaily().slice(0, 1).map((insight) => (
                  <div key={insight.id} className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950 p-5 rounded-lg border border-[#F2B705]/20 shadow-[0_8px_30px_rgb(0,0,0,0.6)] relative overflow-hidden">
                    {/* Corner Tag */}
                    <span className="absolute top-0 right-0 bg-[#F2B705] text-[#040814] font-mono text-[9px] uppercase font-black px-4 py-1 rounded-bl shadow-md">
                      💫 TODAY'S RULING ALIGNMENT
                    </span>

                    {/* Left Frame: Image display */}
                    <div className="lg:col-span-5 rounded-md overflow-hidden border border-stone-800/80 relative h-60 lg:h-full min-h-[220px]">
                      <img
                        src={insight.imageUrl}
                        alt="Celestial Graphic"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 flex flex-col justify-end">
                        <span className="text-[9px] uppercase font-mono text-amber-400 font-bold block mb-1">
                          🎨 Gemini AI Asset Prompt
                        </span>
                        <p className="text-[10px] text-stone-300 italic line-clamp-2">
                          &quot;{insight.imagePrompt}&quot;
                        </p>
                      </div>
                    </div>

                    {/* Right Frame: Detailed Text */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono text-purple-400 font-bold flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {insight.date}
                          </span>
                          <span className={`text-[10px] uppercase font-semibold border px-2 py-0.5 rounded font-mono ${getCategoryTheme(insight.category)}`}>
                            {insight.category} Focus
                          </span>
                        </div>

                        <h3 className="font-serif font-black text-xl sm:text-2xl text-stone-100 italic">
                          {insight.title}
                        </h3>

                        <p className="text-xs text-yellow-500 font-medium font-mono leading-relaxed bg-[#F2B705]/5 p-2 rounded border border-[#F2B705]/10">
                          🎯 Essential Summary: {insight.summary}
                        </p>

                        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans mt-3">
                          {insight.content}
                        </p>
                      </div>

                      {/* Share simulated buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-stone-900">
                        <span className="text-[10px] font-mono uppercase text-stone-500 font-bold mr-1">Share Alignment:</span>
                        <button
                          onClick={() => handleShareSimulate("copy", insight.title, `?insight=${insight.id}`)}
                          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-stone-800 rounded text-[11px] font-sans flex items-center gap-1 cursor-pointer transition text-[#F2B705]"
                        >
                          <Share2 className="w-3.5 h-3.5" /> Copy Link
                        </button>
                        <button
                          onClick={() => handleShareSimulate("X / Twitter", insight.title, `?insight=${insight.id}`)}
                          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-stone-800 rounded text-[11px] text-stone-300 cursor-pointer"
                        >
                           Share on X
                        </button>
                        <button
                          onClick={() => handleShareSimulate("WhatsApp", insight.title, `?insight=${insight.id}`)}
                          className="px-2.5 py-1.5 bg-emerald-950/30 text-emerald-400 hover:bg-slate-800 border border-stone-800 rounded text-[11px] cursor-pointer"
                        >
                          💬 Send WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Previous Archived Insights list */}
                {getFilteredDaily().length > 1 && (
                  <div className="mt-8 space-y-4">
                    <h4 className="font-serif font-bold text-lg text-[#F2B705] border-b border-stone-900 pb-2">
                      📜 Previous Daily Alignments Archive
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getFilteredDaily().slice(1).map((insight) => {
                        const isExpanded = selectedInsightId === insight.id;
                        return (
                          <div
                            key={insight.id}
                            onClick={() => setSelectedInsightId(isExpanded ? null : insight.id)}
                            className={`bg-slate-950/80 p-4 rounded border border-stone-800 hover:border-[#F2B705]/50 transition-all cursor-pointer flex gap-4 ${
                              isExpanded ? "ring-2 ring-indigo-500/30" : ""
                            }`}
                          >
                            <img
                              src={insight.imageUrl}
                              alt="Archive Thumbnail"
                              className="w-16 h-16 object-cover rounded border border-stone-800/80 shrink-0"
                            />
                            <div className="space-y-1 w-full flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between text-[10px] font-mono text-stone-500">
                                  <span>{insight.date}</span>
                                  <span className="text-purple-400 font-bold">{insight.category}</span>
                                </div>
                                <h5 className="font-serif font-black text-sm text-stone-100 hover:text-[#F2B705] transition-colors">
                                  {insight.title}
                                </h5>
                                <p className="text-[11px] text-stone-400 italic mt-0.5 line-clamp-1">
                                  {insight.summary}
                                </p>
                              </div>

                              {isExpanded && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  className="pt-2.5 border-t border-dashed border-stone-900 block mt-2 text-xs text-stone-300 space-y-3"
                                >
                                  <p className="leading-relaxed">{insight.content}</p>
                                  <div className="bg-slate-900 p-2 rounded text-[10px] font-mono italic text-stone-400">
                                    Prompts: {insight.imagePrompt}
                                  </div>
                                </motion.div>
                              )}

                              <div className="text-[10px] font-bold text-[#F2B705] uppercase tracking-wider mt-1.5 flex items-center gap-1">
                                {isExpanded ? "Collapse Cosmic Record ▲" : "Read More Alignment Details"}
                                <ChevronRight className="w-3 h-3" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {getFilteredDaily().length === 0 && (
                  <div className="p-12 text-center bg-slate-950 border border-dashed border-stone-800 rounded">
                    <Info className="w-8 h-8 text-[#F2B705] mx-auto mb-2" />
                    <p className="text-xs text-stone-400">No daily alignments registered in active query filter parameters.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 2: WEEKLY FORECASTS */}
            {hubTab === "weekly" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {getFilteredWeekly().slice(0, 1).map((forecast) => (
                  <div key={forecast.id} className="space-y-6">
                    {/* Header summary of weekly gateway */}
                    <div className="bg-slate-950 p-6 rounded-lg border border-[#F2B705]/20 shadow-md relative overflow-hidden">
                      <div className="absolute right-[-40px] top-[-40px] opacity-10 pointer-events-none">
                        <Sparkles className="w-48 h-48 text-[#F2B705]" />
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 mb-2">
                        <span className="text-xs font-mono text-amber-500 font-extrabold bg-[#F2B705]/10 px-2.5 py-1 rounded">
                          📅 FORECAST FOR WEEK COMMENCING: {forecast.weekStarting}
                        </span>
                      </div>
                      <h3 className="font-serif font-black text-2xl sm:text-3xl text-stone-100 italic">
                        {forecast.title}
                      </h3>
                      <p className="text-stone-300 text-xs mt-1 max-w-2xl font-sans italic">
                        Automatic planetary analysis generated on Monday. Vedic matching highlights current career aspects, health indexes, romantic alignments, and specific wealth strategies.
                      </p>
                    </div>

                    {/* Highly aesthetic cards for distinct aspects */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {/* Career Card */}
                      <div className="bg-slate-950 p-4.5 rounded border border-stone-800 hover:border-sky-500/50 transition duration-300 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b border-stone-900 pb-2">
                            <span className="font-mono text-xs text-sky-400 font-bold flex items-center gap-1">
                              <Award className="w-4 h-4" /> Career
                            </span>
                            <span className="font-mono text-xs font-black bg-sky-500/10 text-sky-300 px-1.5 py-0.5 rounded">
                              {forecast.career.score}% Value
                            </span>
                          </div>
                          <p className="text-xs text-stone-200 leading-relaxed font-sans">
                            {forecast.career.summary}
                          </p>
                        </div>
                        <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-sky-500 rounded-full" style={{ width: `${forecast.career.score}%` }}></div>
                        </div>
                      </div>

                      {/* Finance Card */}
                      <div className="bg-slate-950 p-4.5 rounded border border-stone-800 hover:border-yellow-500/50 transition duration-300 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b border-stone-900 pb-2">
                            <span className="font-mono text-xs text-yellow-500 font-bold flex items-center gap-1">
                              <DollarSign className="w-4 h-4" /> Wealth
                            </span>
                            <span className="font-mono text-xs font-black bg-yellow-400/10 text-yellow-300 px-1.5 py-0.5 rounded">
                              {forecast.finance.score}% Flow
                            </span>
                          </div>
                          <p className="text-xs text-stone-200 leading-relaxed font-sans">
                            {forecast.finance.summary}
                          </p>
                        </div>
                        <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${forecast.finance.score}%` }}></div>
                        </div>
                      </div>

                      {/* Relationships Card */}
                      <div className="bg-slate-950 p-4.5 rounded border border-stone-800 hover:border-pink-500/50 transition duration-300 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b border-stone-900 pb-2">
                            <span className="font-mono text-xs text-pink-500 font-bold flex items-center gap-1">
                              <Heart className="w-4 h-4" /> Love Match
                            </span>
                            <span className="font-mono text-xs font-black bg-pink-500/10 text-pink-300 px-1.5 py-0.5 rounded">
                              {forecast.relationships.score}% Sync
                            </span>
                          </div>
                          <p className="text-xs text-stone-200 leading-relaxed font-sans">
                            {forecast.relationships.summary}
                          </p>
                        </div>
                        <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-pink-500 rounded-full" style={{ width: `${forecast.relationships.score}%` }}></div>
                        </div>
                      </div>

                      {/* Health Card */}
                      <div className="bg-slate-950 p-4.5 rounded border border-stone-800 hover:border-emerald-500/50 transition duration-300 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b border-stone-900 pb-2">
                            <span className="font-mono text-xs text-emerald-500 font-bold flex items-center gap-1">
                              <Activity className="w-4 h-4" /> Vitality
                            </span>
                            <span className="font-mono text-xs font-black bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded">
                              {forecast.health.score}% Index
                            </span>
                          </div>
                          <p className="text-xs text-stone-200 leading-relaxed font-sans">
                            {forecast.health.summary}
                          </p>
                        </div>
                        <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${forecast.health.score}%` }}></div>
                        </div>
                      </div>

                      {/* Spiritual Card */}
                      <div className="bg-slate-950 p-4.5 rounded border border-stone-800 hover:border-purple-500/50 transition duration-300 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b border-stone-900 pb-2">
                            <span className="font-mono text-xs text-purple-400 font-bold flex items-center gap-1">
                              <CloudLightning className="w-4 h-4" /> Spiritual
                            </span>
                            <span className="font-mono text-xs font-black bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded">
                              {forecast.spiritual.score}% Sadhana
                            </span>
                          </div>
                          <p className="text-xs text-stone-200 leading-relaxed font-sans">
                            {forecast.spiritual.summary}
                          </p>
                        </div>
                        <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${forecast.spiritual.score}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Archives section of previous weekly forecasts */}
                {getFilteredWeekly().length > 1 && (
                  <div className="mt-8 space-y-4">
                    <h4 className="font-serif font-bold text-lg text-[#F2B705] border-b border-stone-900 pb-2">
                      📜 Archival Historical Weekly Predictions
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getFilteredWeekly().slice(1).map(forecast => (
                        <div key={forecast.id} className="bg-slate-950/40 p-4 rounded border border-stone-800 space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-mono text-stone-500">
                            <span>Week Starting: {forecast.weekStarting}</span>
                            <span className="text-yellow-400 font-bold">Approved Track</span>
                          </div>
                          <h5 className="font-serif font-black text-sm text-stone-100 italic">
                            {forecast.title}
                          </h5>
                          <p className="text-xs text-stone-400 line-clamp-2">
                            Career: {forecast.career.summary}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {getFilteredWeekly().length === 0 && (
                  <div className="p-12 text-center bg-slate-950 border border-dashed border-stone-800 rounded">
                    <Info className="w-8 h-8 text-[#F2B705] mx-auto mb-2" />
                    <p className="text-xs text-stone-400">No weekly energy predictions met description check filters.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 3: ASTRO MAGAZINE / BLOGS */}
            {hubTab === "blog" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Custom magazine layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {getFilteredBlogs().map((article) => {
                    const isExpanded = selectedArticleId === article.id;
                    return (
                      <div 
                        key={article.id} 
                        className={`bg-slate-950/90 rounded border border-stone-800 hover:border-[#F2B705]/40 overflow-hidden flex flex-col justify-between shadow transition duration-300 ${
                          isExpanded ? "md:col-span-3 ring-2 ring-amber-500/20" : ""
                        }`}
                      >
                        <div>
                          {/* Rich magazine header imagery */}
                          <div className="relative h-44 w-full border-b border-stone-800">
                            <img
                              src={article.imageUrl}
                              alt="Article visual"
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-3 left-3 bg-[#0B3C5D] text-[#F2B705] border border-[#F2B705]/50 font-mono text-[9px] uppercase font-black px-2.5 py-1 rounded">
                              📚 {article.category}
                            </span>
                            {article.scheduledFor && (
                              <span className="absolute bottom-3 right-3 bg-indigo-950 text-indigo-300 border border-indigo-700/50 font-mono text-[9px] uppercase px-2 py-0.5 rounded flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Scheduled: {article.scheduledFor}
                              </span>
                            )}
                          </div>

                          <div className="p-4 space-y-2">
                            <div className="flex items-center justify-between text-[10px] font-mono text-stone-500">
                              <span>Published: {article.publishedAt.split("T")[0]}</span>
                              <span>By: {article.author}</span>
                            </div>

                            <h4 className="font-serif font-black text-base sm:text-lg text-stone-100 italic leading-snug">
                              {article.title}
                            </h4>

                            <p className="text-xs text-stone-300 leading-relaxed font-sans font-medium">
                              {article.excerpt}
                            </p>

                            {/* Detailed Rich text body on select */}
                            {isExpanded && (
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="pt-4 border-t border-stone-900 mt-4 space-y-4 text-xs sm:text-sm text-stone-300 leading-relaxed font-sans"
                              >
                                {article.content.split("\n\n").map((para, pIdx) => {
                                  if (para.startsWith("###")) {
                                    return <h5 key={pIdx} className="font-serif font-bold text-base text-[#F2B705] pt-2">{para.replace("###", "")}</h5>;
                                  }
                                  if (para.startsWith("-")) {
                                    return (
                                      <ul key={pIdx} className="list-disc pl-5 mt-2 space-y-1.5 text-stone-300">
                                        {para.split("\n").map((li, lIdx) => (
                                          <li key={lIdx}>{li.replace("- ", "").replace("• ", "")}</li>
                                        ))}
                                      </ul>
                                    );
                                  }
                                  return <p key={pIdx}>{para}</p>;
                                })}

                                </motion.div>
                            )}
                          </div>
                        </div>

                        {/* Card bottom bar */}
                        <div className="p-4 border-t border-stone-900 bg-slate-950 flex flex-wrap gap-2 items-center justify-between">
                          <button
                            onClick={() => setSelectedArticleId(isExpanded ? null : article.id)}
                            className="text-xs font-mono font-black text-[#F2B705] uppercase hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            {isExpanded ? "Collapse Article ▲" : "Read Full Detailed Article"} 
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          {/* Instant simulated social share */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleShareSimulate("copy", article.title, `/blog/${article.slug}`)}
                              title="Copy Article link"
                              className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-stone-800 text-stone-400 hover:text-white rounded transition cursor-pointer"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[10px] text-stone-500 font-mono hidden sm:inline ml-1">Copy Link</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {getFilteredBlogs().length === 0 && (
                  <div className="p-12 text-center bg-slate-950 border border-dashed border-stone-800 rounded">
                    <Info className="w-8 h-8 text-[#F2B705] mx-auto mb-2" />
                    <p className="text-xs text-stone-400">No blog documents match search term or category options.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 4: INTERACTIVE ZODIAC CARDS */}
            {hubTab === "zodiac" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="bg-slate-950 p-6 rounded-lg border border-[#F2B705]/20 text-center mb-6">
                  <h4 className="font-serif font-black text-xl text-[#F2B705] italic">The 12 Sacred Zodiac signs of Vedic Astrology</h4>
                  <p className="text-xs text-stone-300 max-w-xl mx-auto mt-1 font-sans italic">
                    Understand personality structures, lucky symbols, planetary rulers, and automated predictions for the current cycles.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {getFilteredZodiacs().map((sign) => {
                    const isExpanded = selectedZodiacId === sign.id;
                    return (
                      <div
                        key={sign.id}
                        onClick={() => setSelectedZodiacId(isExpanded ? null : sign.id)}
                        className={`bg-slate-950 border-2 rounded-lg p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer relative overflow-hidden ${
                          isExpanded 
                            ? "border-[#F2B705] md:col-span-2 shadow-[0_8px_25px_rgba(242,183,5,0.15)] bg-slate-950" 
                            : "border-stone-800 hover:border-[#F2B705]/50 shadow-md"
                        }`}
                      >
                        {/* Artwork display */}
                        <div className="relative h-32 w-full rounded overflow-hidden border border-stone-900/80 mb-4 bg-slate-950">
                          <img
                            src={sign.imageUrl}
                            alt={`${sign.name} artwork`}
                            className="w-full h-full object-cover opacity-80"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                          
                          {/* Element Tag */}
                          <div className="absolute top-2 left-2 flex items-center gap-1 bg-[#040814]/80 border border-stone-800 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-amber-400">
                            🌌 {sign.element} Sign
                          </div>
                        </div>

                        {/* Title Info */}
                        <div className="space-y-2 text-left">
                          <div className="flex items-center justify-between">
                            <h5 className="font-serif font-black text-lg text-stone-100 italic">
                              {sign.name}
                            </h5>
                            <span className="text-[11px] font-mono text-[#F2B705] pr-1">
                              {sign.sanskritName}
                            </span>
                          </div>

                          <span className="text-[10px] font-mono text-stone-400 block pb-1 border-b border-stone-900">
                            📅 Interval: {sign.dates}
                          </span>

                          <div className="grid grid-cols-2 gap-2 text-[11px] font-sans text-stone-300 py-1 bg-slate-900/60 p-2 rounded">
                            <div>
                              <span className="text-[9px] font-mono uppercase text-stone-500 block">Ruler:</span>
                              <span className="font-bold text-stone-200">{sign.ruler}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-mono uppercase text-stone-500 block">Lucky Number:</span>
                              <span className="font-bold text-stone-200"># {sign.luckyNumber}</span>
                            </div>
                            <div className="col-span-2 mt-1">
                              <span className="text-[9px] font-mono uppercase text-stone-500 block">Lucky Color:</span>
                              <span className="font-bold text-blue-300">{sign.luckyColor}</span>
                            </div>
                          </div>

                          {/* Personality Bullet Points */}
                          <div className="space-y-1 pt-1.5 text-xs text-stone-300">
                            <span className="text-[9px] font-mono uppercase text-teal-400 font-bold block">Traits Profile:</span>
                            <div className="flex flex-wrap gap-1">
                              {sign.traits.map(t => (
                                <span key={t} className="bg-teal-950/20 text-teal-300 border border-teal-800/40 px-1.5 py-0.2 rounded text-[10px]">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Expanded Full Prediction Profiles */}
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="pt-4 border-t border-stone-900 mt-4 space-y-4 text-xs leading-relaxed text-stone-300"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5 bg-slate-900/50 p-2 rounded border border-stone-800">
                                  <span className="font-mono text-[9px] uppercase text-emerald-400 font-bold block">🎯 Structural Strengths:</span>
                                  <ul className="list-disc pl-4 space-y-1">
                                    {sign.strengths.map((str, idx) => (
                                      <li key={idx}>{str}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="space-y-1.5 bg-slate-900/50 p-2 rounded border border-stone-800">
                                  <span className="font-mono text-[9px] uppercase text-red-400 font-bold block">⚠️ Challenge Weaknesses:</span>
                                  <ul className="list-disc pl-4 space-y-1">
                                    {sign.weaknesses.map((weak, idx) => (
                                      <li key={idx}>{weak}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              {/* Predictions Range Toggle Selector */}
                              <div className="space-y-3 pt-2">
                                <div className="flex border-b border-stone-900 pb-1.5 gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedZodiacRange("daily");
                                    }}
                                    className={`px-3 py-1 text-[11px] font-mono rounded-full font-bold uppercase transition ${
                                      selectedZodiacRange === "daily"
                                        ? "bg-amber-400 text-slate-950 font-black shadow-sm"
                                        : "bg-slate-900 text-stone-400 hover:text-stone-200"
                                    }`}
                                  >
                                    🌌 Daily Prediction
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedZodiacRange("weekly");
                                    }}
                                    className={`px-3 py-1 text-[11px] font-mono rounded-full font-bold uppercase transition ${
                                      selectedZodiacRange === "weekly"
                                        ? "bg-sky-500 text-slate-950 font-black shadow-sm"
                                        : "bg-slate-900 text-stone-400 hover:text-stone-200"
                                    }`}
                                  >
                                    📅 Weekly Prediction
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedZodiacRange("monthly");
                                    }}
                                    className={`px-3 py-1 text-[11px] font-mono rounded-full font-bold uppercase transition ${
                                      selectedZodiacRange === "monthly"
                                        ? "bg-purple-500 text-slate-950 font-black shadow-sm"
                                        : "bg-slate-900 text-stone-400 hover:text-stone-200"
                                    }`}
                                  >
                                    🌙 Monthly Prediction
                                  </button>
                                </div>

                                {selectedZodiacRange === "daily" && (
                                  <div className="space-y-1 bg-amber-500/5 p-3 rounded border border-amber-500/15 animate-fadeIn">
                                    <span className="font-serif font-black text-[11px] text-[#F2B705] block">✨ Vedic Daily Transit Influence</span>
                                    <p className="italic font-sans text-stone-200 text-xs">{sign.dailyPrediction}</p>
                                  </div>
                                )}

                                {selectedZodiacRange === "weekly" && (
                                  <div className="space-y-1 bg-sky-500/5 p-3 rounded border border-sky-500/15 animate-fadeIn">
                                    <span className="font-serif font-black text-[11px] text-sky-400 block">⚡ Weekly Transits Prediction</span>
                                    <p className="italic font-sans text-stone-200 text-xs">{sign.weeklyPrediction}</p>
                                  </div>
                                )}

                                {selectedZodiacRange === "monthly" && (
                                  <div className="space-y-1 bg-purple-500/5 p-3 rounded border border-purple-500/15 animate-fadeIn">
                                    <span className="font-serif font-black text-[11px] text-purple-400 block">🌙 Monthly Forecast Blueprint</span>
                                    <p className="italic font-sans text-stone-200 text-xs">{sign.monthlyPrediction}</p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </div>

                        {/* Expander indicator */}
                        <div className="text-[10px] font-bold text-[#F2B705] uppercase tracking-wider mt-4 text-center border-t border-dashed border-stone-900/50 pt-2 flex items-center justify-center gap-1">
                          {isExpanded ? "Collapse Zodiac Details ▲" : "View Detailed Transits Analysis"}
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 5: ADMIN / OPERATOR PANEL */}
            {hubTab === "admin" && isAdminMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Highlights Summary for moderation */}
                <div className="bg-purple-950/20 border-2 border-purple-500/30 rounded-lg p-5">
                  <h4 className="font-serif font-bold text-[#F2B705] text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-400" />
                    Astrology Hub Core Operator Dashboard
                  </h4>
                  <p className="text-xs text-stone-300 mt-1">
                    Manage real database documents here. Approve newly generated AI drafts before public viewing, or composition completely customized content.
                  </p>
                </div>

                {/* TWO COLUMN PANEL: AI GENERATOR VS COMPOSER FORM */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* LEFT FRAME: AUTOMATION COMMANDS */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-slate-950 p-5 rounded border border-stone-800 space-y-4">
                      <span className="text-[10px] bg-sky-500/10 text-sky-400 uppercase font-mono px-2 py-0.5 rounded font-black">
                        ⚡ GEMINI AI AUTOMATIC GENERATOR
                      </span>
                      <h5 className="font-serif text-sm font-bold text-stone-100">
                        Synthesize New Scientific Astrology Entries
                      </h5>
                      <p className="text-[11px] text-stone-400">
                        Input keyword anchors or dates, and let the Google Gemini AI models compose complete, premium, SEO-ready materials instantly. (Items populate below as PENDING for your validation).
                      </p>

                      <div className="space-y-2">
                        <label className="text-[10px] font-mono text-stone-500 block">Keyword/Date prompt cue:</label>
                        <input
                          type="text"
                          placeholder="e.g. 2026-06-25, or Vedic Marriage matching..."
                          value={aiPromptInput}
                          onChange={(e) => setAiPromptInput(e.target.value)}
                          className="w-full bg-slate-950 border border-stone-800 rounded px-3 py-2 text-xs text-[#F2B705] placeholder:text-stone-600 focus:outline-none focus:border-[#F2B705]"
                        />
                      </div>

                      {aiGenerateSuccess && (
                        <div className="bg-emerald-950/20 text-emerald-400 text-[11px] p-2 rounded border border-emerald-800/20">
                          {aiGenerateSuccess}
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-1.5 pt-2">
                        <button
                          onClick={() => runAiDraftCreation("daily")}
                          disabled={isAiGenerating}
                          className="py-2 rounded bg-slate-900 hover:bg-slate-800 border border-stone-800 text-[#F2B705] text-[10px] font-mono font-bold uppercase transition disabled:opacity-40 cursor-pointer"
                        >
                          🔮 Daily
                        </button>
                        <button
                          onClick={() => runAiDraftCreation("weekly")}
                          disabled={isAiGenerating}
                          className="py-2 rounded bg-slate-900 hover:bg-slate-800 border border-stone-800 text-[#F2B705] text-[10px] font-mono font-bold uppercase transition disabled:opacity-40 cursor-pointer"
                        >
                          🧭 Weekly
                        </button>
                        <button
                          onClick={() => runAiDraftCreation("blog")}
                          disabled={isAiGenerating}
                          className="py-2 rounded bg-[#0B3C5D]/50 hover:bg-[#0B3C5D] text-white text-[10px] font-mono font-bold uppercase transition disabled:opacity-40 cursor-pointer"
                        >
                          📖 Blog Article
                        </button>
                      </div>

                      {isAiGenerating && (
                        <div className="text-[10px] font-mono text-amber-400 animate-pulse text-center">
                          ⚙️ Orbiting model layers: synthesizing complex structures...
                        </div>
                      )}
                    </div>

                    {/* Pending Moderation Queue */}
                    <div className="bg-slate-950 p-5 rounded border border-stone-800 space-y-4">
                      <span className="text-[10px] bg-purple-500/10 text-purple-400 uppercase font-mono px-2 py-0.5 rounded font-black">
                        📬 PENDING REVIEWS
                      </span>
                      <h5 className="font-serif text-sm font-bold text-stone-100">Pending Approvals Queue</h5>
                      
                      <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                        {/* Daily insights pending */}
                        {dailyInsights.filter(i => !i.isApproved).map(item => (
                          <div key={item.id} className="bg-slate-900 border border-purple-500/30 p-2.5 rounded text-xs flex justify-between items-center gap-2">
                            <div>
                              <span className="text-[9px] font-mono text-stone-500 block">Daily Insight Draft ({item.date})</span>
                              <strong className="text-stone-100 font-serif leading-tight">{item.title}</strong>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => toggleApprovalStatus("daily", item.id)}
                                className="p-1 bg-purple-900 rounded text-purple-200 hover:bg-purple-800 cursor-pointer"
                                title="Approve now & Publish"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => populateEditorForEdit("daily", item)}
                                className="p-1 bg-slate-800 rounded text-amber-400 hover:bg-slate-750 cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deletePostBytes("daily", item.id)}
                                className="p-1 bg-red-950 text-red-400 rounded hover:bg-red-900 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Weekly pending */}
                        {weeklyForecasts.filter(i => !i.isApproved).map(item => (
                          <div key={item.id} className="bg-slate-900 border border-purple-500/30 p-2.5 rounded text-xs flex justify-between items-center gap-2">
                            <div>
                              <span className="text-[9px] font-mono text-stone-500 block">Weekly Forecast ({item.weekStarting})</span>
                              <strong className="text-stone-100 font-serif leading-tight">{item.title}</strong>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => toggleApprovalStatus("weekly", item.id)}
                                className="p-1 bg-purple-900 rounded text-purple-200 hover:bg-purple-800 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => populateEditorForEdit("weekly", item)}
                                className="p-1 bg-slate-800 rounded text-amber-400 hover:bg-slate-750 cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deletePostBytes("weekly", item.id)}
                                className="p-1 bg-red-950 text-red-400 rounded hover:bg-red-900 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Blogs pending */}
                        {blogArticles.filter(i => !i.isApproved).map(item => (
                          <div key={item.id} className="bg-slate-900 border border-purple-500/30 p-2.5 rounded text-xs flex justify-between items-center gap-2">
                            <div>
                              <span className="text-[9px] font-mono text-stone-500 block">Blog Article draft</span>
                              <strong className="text-stone-100 font-serif leading-tight">{item.title}</strong>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => toggleApprovalStatus("blog", item.id)}
                                className="p-1 bg-purple-900 rounded text-purple-200 hover:bg-purple-800 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => populateEditorForEdit("blog", item)}
                                className="p-1 bg-slate-800 rounded text-amber-400 hover:bg-slate-750 cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deletePostBytes("blog", item.id)}
                                className="p-1 bg-red-950 text-red-400 rounded hover:bg-red-900 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {dailyInsights.filter(i => !i.isApproved).length === 0 &&
                         weeklyForecasts.filter(i => !i.isApproved).length === 0 &&
                         blogArticles.filter(i => !i.isApproved).length === 0 && (
                          <div className="p-4 text-center border border-dashed border-stone-800 rounded text-stone-500 text-[11px]">
                            No pending content drafts in cue. Run AI synthesis above to see.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT FRAME: CUSTOM COMPOSE / EDIT FORM */}
                  <form 
                    id="admin-composer-form"
                    onSubmit={saveCustomPublish} 
                    className="lg:col-span-7 bg-slate-950 p-5 rounded border border-stone-800 space-y-4 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-stone-900 pb-3">
                      <h5 className="font-serif text-sm font-bold text-stone-100 flex items-center gap-1">
                        <Plus className="w-4 h-4 text-[#F2B705]" />
                        Vedic Content Composer & Creator
                      </h5>
                      
                      <div className="flex gap-2">
                        {["daily", "weekly", "blog"].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => {
                              setComposeType(t as any);
                            }}
                            className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase font-extrabold cursor-pointer border transition ${
                              composeType === t
                                ? "bg-[#F2B705] border-[#F2B705] text-[#040814]"
                                : "bg-slate-900 text-stone-400 border-stone-800 hover:bg-slate-850"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Standard Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-1">
                        <label className="font-mono text-[10px] text-stone-400 block">Content Title Heading:</label>
                        <input
                          type="text"
                          required
                          value={editorPayload.title}
                          onChange={(e) => setEditorPayload({...editorPayload, title: e.target.value})}
                          placeholder="Compelling cosmic heading..."
                          className="w-full bg-slate-950 border border-stone-800 rounded px-3 py-2 text-[#F2B705] focus:outline-none"
                        />
                      </div>

                      {/* URL Asset */}
                      <div className="col-span-2 space-y-1">
                        <label className="font-mono text-[10px] text-stone-400 block">Featured Premium Image URL:</label>
                        <input
                          type="text"
                          value={editorPayload.imageUrl}
                          onChange={(e) => setEditorPayload({...editorPayload, imageUrl: e.target.value})}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full bg-slate-950 border border-stone-800 rounded px-3 py-2 text-stone-300 focus:outline-none placeholder:text-stone-700"
                        />
                      </div>
                    </div>

                    {/* Daily Specific inputs */}
                    {composeType === "daily" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-mono text-[10px] text-stone-400">Target Date:</label>
                          <input
                            type="date"
                            value={dateFilter || new Date().toISOString().split("T")[0]}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full bg-slate-950 border border-stone-800 rounded px-2.5 py-1.5 focus:outline-none text-[#F2B705]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[10px] text-stone-400">Insight category:</label>
                          <select
                            value={editorPayload.category}
                            onChange={(e) => setEditorPayload({...editorPayload, category: e.target.value})}
                            className="w-full bg-slate-950 border border-stone-800 rounded px-2.5 py-1.5 focus:outline-none text-stone-100"
                          >
                            <option value="Spiritual">Spiritual Focus</option>
                            <option value="Career">Career Alignment</option>
                            <option value="Finance">Financial Astrology</option>
                            <option value="Relationships">Love Relationships</option>
                            <option value="Health">Physical Wellness</option>
                          </select>
                        </div>
                        <div className="col-span-2 space-y-1">
                          <label className="font-mono text-[10px] text-stone-400 block">Summary text (1-2 sentences):</label>
                          <input
                            type="text"
                            required
                            value={editorPayload.summary}
                            onChange={(e) => setEditorPayload({...editorPayload, summary: e.target.value})}
                            placeholder="An energy transition brings changes..."
                            className="w-full bg-slate-950 border border-stone-800 rounded px-3 py-2 text-stone-100 focus:outline-none"
                          />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <label className="font-mono text-[10px] text-stone-400 block">Vedic remediation actions / detailed content description:</label>
                          <textarea
                            required
                            rows={4}
                            value={editorPayload.content}
                            onChange={(e) => setEditorPayload({...editorPayload, content: e.target.value})}
                            placeholder="Write comprehensive astral parameters here..."
                            className="w-full bg-slate-950 border border-stone-800 rounded p-3 text-stone-100 focus:outline-none text-[11px]"
                          />
                        </div>
                      </div>
                    )}

                    {/* Weekly specific predictions */}
                    {composeType === "weekly" && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="font-mono text-[10px] text-stone-400 block">Week Commencement (Monday):</label>
                          <input
                            type="date"
                            required
                            value={dateFilter || new Date().toISOString().split("T")[0]}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full bg-slate-950 border border-stone-800 rounded px-3 py-1.5 focus:outline-none text-indigo-400"
                          />
                        </div>

                        {/* Double grid aspects */}
                        <div className="space-y-3 border-t border-stone-900 pt-3">
                          <div className="grid grid-cols-12 gap-2.5 items-center">
                            <span className="col-span-3 text-[10px] uppercase font-bold text-sky-400 font-mono">👔 Career Aspect:</span>
                            <input
                              className="col-span-7 bg-[#040814] border border-stone-800 rounded px-2.5 py-1"
                              placeholder="Summary of professional transits..."
                              value={editorPayload.careerSummary}
                              onChange={(e) => setEditorPayload({...editorPayload, careerSummary: e.target.value})}
                            />
                            <input
                              type="number"
                              className="col-span-2 bg-slate-950 border border-stone-850 rounded text-center py-1"
                              title="Score value (0-100)"
                              value={editorPayload.careerScore}
                              onChange={(e) => setEditorPayload({...editorPayload, careerScore: e.target.value})}
                            />
                          </div>
                          
                          <div className="grid grid-cols-12 gap-2.5 items-center">
                            <span className="col-span-3 text-[10px] uppercase font-bold text-yellow-500 font-mono">💰 Wealth Aspect:</span>
                            <input
                              className="col-span-7 bg-[#040814] border border-stone-800 rounded px-2.5 py-1"
                              placeholder="Summary of wealth transits..."
                              value={editorPayload.financeSummary}
                              onChange={(e) => setEditorPayload({...editorPayload, financeSummary: e.target.value})}
                            />
                            <input
                              type="number"
                              className="col-span-2 bg-slate-950 border border-stone-850 rounded text-center py-1"
                              value={editorPayload.financeScore}
                              onChange={(e) => setEditorPayload({...editorPayload, financeScore: e.target.value})}
                            />
                          </div>

                          <div className="grid grid-cols-12 gap-2.5 items-center">
                            <span className="col-span-3 text-[10px] uppercase font-bold text-pink-500 font-mono">❤️ Love Aspect:</span>
                            <input
                              className="col-span-7 bg-[#040814] border border-stone-800 rounded px-2.5 py-1"
                              placeholder="Summary of romance transits..."
                              value={editorPayload.relationshipSummary}
                              onChange={(e) => setEditorPayload({...editorPayload, relationshipSummary: e.target.value})}
                            />
                            <input
                              type="number"
                              className="col-span-2 bg-slate-950 border border-stone-850 rounded text-center py-1"
                              value={editorPayload.relationshipScore}
                              onChange={(e) => setEditorPayload({...editorPayload, relationshipScore: e.target.value})}
                            />
                          </div>

                          <div className="grid grid-cols-12 gap-2.5 items-center">
                            <span className="col-span-3 text-[10px] uppercase font-bold text-emerald-500 font-mono">🍏 Vitality Aspect:</span>
                            <input
                              className="col-span-7 bg-[#040814] border border-stone-800 rounded px-2.5 py-1"
                              placeholder="Summary of energy transits..."
                              value={editorPayload.healthSummary}
                              onChange={(e) => setEditorPayload({...editorPayload, healthSummary: e.target.value})}
                            />
                            <input
                              type="number"
                              className="col-span-2 bg-slate-950 border border-stone-850 rounded text-center py-1"
                              value={editorPayload.healthScore}
                              onChange={(e) => setEditorPayload({...editorPayload, healthScore: e.target.value})}
                            />
                          </div>

                          <div className="grid grid-cols-12 gap-2.5 items-center">
                            <span className="col-span-3 text-[10px] uppercase font-bold text-purple-400 font-mono">🧘 Sadhana:</span>
                            <input
                              className="col-span-7 bg-[#040814] border border-stone-800 rounded px-2.5 py-1"
                              placeholder="Summary of spiritual transits..."
                              value={editorPayload.spiritualSummary}
                              onChange={(e) => setEditorPayload({...editorPayload, spiritualSummary: e.target.value})}
                            />
                            <input
                              type="number"
                              className="col-span-2 bg-slate-950 border border-stone-850 rounded text-center py-1"
                              value={editorPayload.spiritualScore}
                              onChange={(e) => setEditorPayload({...editorPayload, spiritualScore: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Blog Specific editor */}
                    {composeType === "blog" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-mono text-[10px] text-stone-400 block">Astro category:</label>
                          <select
                            value={editorPayload.blogCategory}
                            onChange={(e) => setEditorPayload({...editorPayload, blogCategory: e.target.value})}
                            className="w-full bg-slate-950 border border-stone-800 rounded px-2.5 py-1.5 focus:outline-none"
                          >
                            <option value="Zodiac Signs">Zodiac Signs</option>
                            <option value="Career Astrology">Career Astrology</option>
                            <option value="Financial Astrology">Financial Astrology</option>
                            <option value="Love Compatibility">Love Compatibility</option>
                            <option value="Planetary Transits">Planetary Transits</option>
                            <option value="Birth Chart Analysis">Birth Chart Analysis</option>
                            <option value="Numerology">Numerology</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[10px] text-stone-400 block">Tags (comma-separated):</label>
                          <input
                            type="text"
                            value={editorPayload.tagsStr}
                            onChange={(e) => setEditorPayload({...editorPayload, tagsStr: e.target.value})}
                            placeholder="e.g. Kundli, Wealth, Vastu"
                            className="w-full bg-slate-950 border border-stone-800 rounded px-3 py-1.5 focus:outline-none text-stone-300"
                          />
                        </div>

                        <div className="col-span-2 space-y-1">
                          <label className="font-mono text-[10px] text-stone-400 block">Article Excerpt Outline:</label>
                          <input
                            type="text"
                            required
                            value={editorPayload.summary}
                            onChange={(e) => setEditorPayload({...editorPayload, summary: e.target.value})}
                            placeholder="Catchy tagline overview of the blog..."
                            className="w-full bg-slate-950 border border-stone-800 rounded px-3 py-2 text-stone-100 focus:outline-none"
                          />
                        </div>

                        <div className="col-span-2 space-y-1">
                          <label className="font-mono text-[10px] text-stone-400 block">Markdown Body Content (separating paragraphs by double lines):</label>
                          <textarea
                            required
                            rows={8}
                            value={editorPayload.content}
                            onChange={(e) => setEditorPayload({...editorPayload, content: e.target.value})}
                            placeholder="Use ### headers for sub-sections. Write extensive descriptions..."
                            className="w-full bg-slate-950 border border-stone-800 rounded p-3 text-stone-100 focus:outline-none text-[11px]"
                          />
                        </div>

                        {/* Advanced SEO fields */}
                        <div className="col-span-2 border-t border-stone-900 pt-3 grid grid-cols-2 gap-3 bg-slate-900/45 p-3 rounded">
                          <span className="col-span-2 text-[10px] uppercase font-bold text-amber-400 font-mono tracking-wider">🔍 Detailed Search Engine Optimization (SEO) Config:</span>
                          <div className="space-y-1">
                            <label className="text-[9px] text-stone-405 block">Meta Title Header Pin (max 60):</label>
                            <input
                              type="text"
                              value={editorPayload.metaTitle}
                              onChange={(e) => setEditorPayload({...editorPayload, metaTitle: e.target.value})}
                              placeholder="Premium SEO Title..."
                              className="w-full bg-slate-950 border border-stone-800 rounded px-2.5 py-1 focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] text-stone-405 block">Scheduled For Date (YYYY-MM-DD):</label>
                            <input
                              type="date"
                              value={editorPayload.scheduledFor}
                              onChange={(e) => setEditorPayload({...editorPayload, scheduledFor: e.target.value})}
                              className="w-full bg-slate-950 border border-stone-800 rounded px-2.5 py-1 focus:outline-none text-yellow-500"
                            />
                          </div>
                          <div className="col-span-2 space-y-1">
                            <label className="text-[9px] text-stone-405 block">Meta Description Summary (max 160):</label>
                            <input
                              type="text"
                              value={editorPayload.metaDescription}
                              onChange={(e) => setEditorPayload({...editorPayload, metaDescription: e.target.value})}
                              placeholder="SEO description showing up on google searches..."
                              className="w-full bg-slate-950 border border-stone-800 rounded px-2.5 py-1 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Active Publish Controls */}
                    <div className="flex items-center justify-between border-t border-stone-900 pt-4 mt-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="admin-approved-instant"
                          checked={editorPayload.isApproved}
                          onChange={(e) => setEditorPayload({...editorPayload, isApproved: e.target.checked})}
                          className="w-4 h-4 rounded text-purple-600 focus:ring-0 bg-slate-950 border-stone-850 cursor-pointer"
                        />
                        <label htmlFor="admin-approved-instant" className="text-[10px] font-mono select-none text-stone-400 cursor-pointer">
                          Approve instantly & Publish live (no draft review)
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#F2B705] hover:bg-[#dca204] text-[#040814] font-mono font-black uppercase text-xs rounded transition flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <Lock className="w-3.5 h-3.5" /> Post Celestial Material
                      </button>
                    </div>
                  </form>
                </div>

                {/* All active postings list for operator deletion/approving */}
                <div className="space-y-4 pt-6 border-t border-stone-900">
                  <h4 className="font-serif font-black text-[#F2B705] text-base">Active Content Repository Manifest (Operator Overrides)</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Insights list */}
                    <div className="bg-slate-950/40 p-3 rounded border border-stone-850 space-y-3">
                      <h5 className="font-serif font-bold text-xs text-sky-400 border-b border-stone-900 pb-1.5 uppercase">Daily insights</h5>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {dailyInsights.map(item => (
                          <div key={item.id} className="bg-slate-900 p-2 rounded text-xs flex justify-between gap-1 border border-stone-800">
                            <div>
                              <span className="text-[9px] font-mono text-stone-500 block">{item.date}</span>
                              <span className="font-sans font-bold text-stone-300 line-clamp-1">{item.title}</span>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => toggleApprovalStatus("daily", item.id)}
                                className={`p-1 rounded ${item.isApproved ? "bg-emerald-950 text-emerald-400" : "bg-yellow-950 text-yellow-500"}`}
                                title={item.isApproved ? "Approved (Live)" : "Pending Approval"}
                              >
                                {item.isApproved ? "✔" : "⏳"}
                              </button>
                              <button
                                onClick={() => populateEditorForEdit("daily", item)}
                                className="p-1 bg-slate-800 rounded text-stone-400 hover:text-white"
                              >
                                ✎
                              </button>
                              <button
                                onClick={() => deletePostBytes("daily", item.id)}
                                className="p-1 bg-red-950 text-red-500 rounded"
                              >
                                🗙
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Weekly list */}
                    <div className="bg-slate-950/40 p-3 rounded border border-stone-850 space-y-3">
                      <h5 className="font-serif font-bold text-xs text-yellow-500 border-b border-stone-900 pb-1.5 uppercase">Weekly Forecasts</h5>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {weeklyForecasts.map(item => (
                          <div key={item.id} className="bg-slate-900 p-2 rounded text-xs flex justify-between gap-1 border border-stone-800">
                            <div>
                              <span className="text-[9px] font-mono text-stone-500 block">Monday {item.weekStarting}</span>
                              <span className="font-sans font-bold text-stone-300 line-clamp-1">{item.title}</span>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => toggleApprovalStatus("weekly", item.id)}
                                className={`p-1 rounded ${item.isApproved ? "bg-emerald-950 text-emerald-400" : "bg-yellow-950 text-yellow-500"}`}
                                title={item.isApproved ? "Approved (Live)" : "Pending Approval"}
                              >
                                {item.isApproved ? "✔" : "⏳"}
                              </button>
                              <button
                                onClick={() => populateEditorForEdit("weekly", item)}
                                className="p-1 bg-slate-800 rounded text-stone-400 hover:text-white"
                              >
                                ✎
                              </button>
                              <button
                                onClick={() => deletePostBytes("weekly", item.id)}
                                className="p-1 bg-red-950 text-red-500 rounded"
                              >
                                🗙
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Articles list */}
                    <div className="bg-slate-950/40 p-3 rounded border border-stone-850 space-y-3">
                      <h5 className="font-serif font-bold text-xs text-purple-400 border-b border-stone-900 pb-1.5 uppercase">Blog articles</h5>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {blogArticles.map(item => (
                          <div key={item.id} className="bg-slate-900 p-2 rounded text-xs flex justify-between gap-1 border border-stone-800">
                            <div>
                              <span className="text-[9px] font-mono text-stone-300 block bg-stone-800/80 px-1 rounded w-max">{item.category}</span>
                              <span className="font-sans font-bold text-stone-300 line-clamp-1 pt-0.5">{item.title}</span>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => toggleApprovalStatus("blog", item.id)}
                                className={`p-1 rounded ${item.isApproved ? "bg-emerald-950 text-emerald-400" : "bg-yellow-950 text-yellow-500"}`}
                                title={item.isApproved ? "Approved (Live)" : "Pending Approval"}
                              >
                                {item.isApproved ? "✔" : "⏳"}
                              </button>
                              <button
                                onClick={() => populateEditorForEdit("blog", item)}
                                className="p-1 bg-slate-800 rounded text-stone-400 hover:text-white"
                              >
                                ✎
                              </button>
                              <button
                                onClick={() => deletePostBytes("blog", item.id)}
                                className="p-1 bg-red-955 text-red-500 rounded"
                              >
                                🗙
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
