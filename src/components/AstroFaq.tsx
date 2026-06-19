import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, BookOpen } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

export default function AstroFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs: FaqItem[] = [
    {
      question: "What is Astrology?",
      answer: "Astrology is a time-tested cosmic science that studies the correlation between the cyclical movements of celestial bodies and terrestrial occurrences. It operates on the ancient principle of 'As Above, So Below'—recognizing that planetary configurations at the exact moment of an event or birth reflect specific vibrational patterns, strengths, weaknesses, and potential timelines of human experience."
    },
    {
      question: "How does Vedic Astrology differ from other types of astrology?",
      answer: "Vedic Astrology (Jyotish) is the eye of the sacred Vedas. Unlike Western astrology, which utilizes the Sun-based Tropical Zodiac, Vedic Astrology is anchored in the Sidereal Zodiac, accounting for the actual astronomical precession of equinoxes. Jyotish also incorporates the profound systems of 27 Nakshatras (Lunar Mansions), planetary Vimshottari Dashas (time-cycles), and divisional charts (Vargas) to render highly precise, karma-based life alignments and timing of events."
    },
    {
      question: "How can astrology help me in my life?",
      answer: "Astrology acts as a divine blueprint and weather forecast for your soul. By decoding planetary transits and your birth chart, it provides deep self-awareness, highlights hidden talents, reveals internal blockages, and clarifies the timing of favorable vs. challenging periods. This wisdom empowers you to make conscious, proactive choices, align with natural cosmic flows, and mitigate obstacles before they arise."
    },
    {
      question: "Will astrology help me know exactly what will happen in my life further down the line?",
      answer: "Astrology reveals the celestial roadmap and karmic directions, not a rigid, unchangeable script. It maps the energetic weather and high-probability trends. Vedic principles strongly state that while Prarabdha Karma sets the initial blueprint, your Free Will (Kriyaman Karma) and conscious action determine how you adapt and act. Astrology shows the cosmic winds; you still command the sails."
    },
    {
      question: "Can astrology help improve my relationships?",
      answer: "Absolutely. Through Kundli Milan (compatibility matchmaking) and relational synergy charts, we examine the mental, physical, spiritual, and emotional alignment of couples. It highlights potential friction points (such as Manglik Dosha or Gana conflicts) and provides constructive communication guidelines and planetary remedies to cultivate harmony, empathy, and long-term marital bliss."
    },
    {
      question: "What role does astrology play in the field of career?",
      answer: "Your birth chart's 10th House (Karma Bhava), along with planetary signifiers like Jupiter, Mercury, and Saturn, defines your vocational natural-flow. A professional reading reveals suited industries, indicates whether business or job-based paths yield faster growth, and highlights precise planetary Dasha periods of career breakthroughs, promotions, or transition opportunities."
    },
    {
      question: "What is a birth chart? And what is the importance of a birth chart?",
      answer: "A birth chart (Kundli) is a visual snapshot of the heavens at the precise millisecond and geographical coordinate of your birth. Its importance cannot be overstated: it is your lifetime karmic mirror. It maps your mental disposition, physical health prospects, financial destiny, relationships, and spiritual lessons, guiding you to fulfill your soul's true purpose (Dharma)."
    },
    {
      question: "Is the practice of astrology beneficial in regard to making strategies?",
      answer: "Yes, astrology is highly strategic. Ancient kings utilized 'Muhurtha' (cosmic timing) before launching negotiations, laying foundation stones, or conducting campaigns. Strategic astrology enables modern leaders to schedule high-stakes product launches, business expansions, or crucial investments during supportive planetary Dasha and transit cycles for maximum longevity and success."
    },
    {
      question: "Can I consult an astrologer regarding a health-related issue?",
      answer: "Yes, Medical Astrology (Ayur-Jyotish) is deeply rooted in Vedic science, correlating twelve zodiac signs and planetary transits with bodily functions and elemental balances (Vata, Pitta, Kapha). While astrology does not replace standard medical care, it acts as a valuable preventative tool—revealing periods of heightened physiological vulnerability and suggesting holistic lifestyle or diet remedies."
    },
    {
      question: "For accurate readings, is it necessary to have the precise time of birth?",
      answer: "For highly accurate and micro-detailed analyses, precise birth time is critical, as the Ascendant (Lagna) changes signs approximately every two hours, and subtle divisional charts change within minutes. However, if your exact birth time is unknown, Acharya Pathak Aanna can perform 'Birth Time Rectification' based on key life events, or utilize Prashna Kundli (Horary Astrology) to answer specific questions."
    },
    {
      question: "Should I consider astrology when facing a transition in my life?",
      answer: "Transitions are the absolute best times to consult an astrologer. Whether you are changing careers, moving countries, getting married, or experiencing internal spiritual transformations, knowing the active planetary cycles helps you understand whether to push aggressively forward, focus on internal preparation, or perform specific planetary remediations."
    },
    {
      question: "How often should I consult an astrologer?",
      answer: "We recommend a comprehensive birth chart overview once a year to assess your annual solar return (Varshaphala) and transition trends. Beyond that, micro-consultations are highly beneficial during key life transitions, before picking major dates (Muhurtha), or when navigating intense transits like Sade Sati or Graha transits."
    },
    {
      question: "Is Astrology - Predictions only or is it something more?",
      answer: "Astrology goes far beyond simple fortune-telling; it is a profound system of self-realization and spiritual alignment. It diagnoses the spiritual cause of worldly obstacles and prescribes active, transformative solutions (Sadhana, mantra recitation, charity, and gemstone meditation) to raise your energetic vibration and transcend negative karmic loops."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="section-faq bg-[#fcfbf9] py-14 px-4 border-t-2 border-slate-900" id="faqs-container">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center space-y-3 mb-10">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest text-[#0B3C5D] bg-[#0B3C5D]/5 px-3.5 py-1 rounded-full border border-[#0B3C5D]/15 font-extrabold shadow-sm">
            <Sparkles className="w-3 h-3 text-[#F2B705] animate-spin-slow" />
            Celestial FAQ Center
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-900 tracking-tight">
            Divine Wisdom & Answers
          </h2>
          <p className="text-xs md:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
            Have questions about the mystical science of Vedic Astrology or how Astropatri secures your path? Explore our comprehensive answers below.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search cosmic questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-slate-900 px-4 py-2.5 rounded-md text-xs text-slate-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#0B3C5D] shadow-[2px_2px_0px_rgba(26,26,26,1)] transition-all font-sans"
            />
            <BookOpen className="w-4 h-4 text-[#0B3C5D] absolute right-3.5 top-3.5" />
          </div>
        </div>

        {/* Faqs List */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-10 bg-white border-2 border-slate-300 rounded">
            <p className="text-xs text-stone-500 font-mono">No matching stellar wisdom threads found. Try different keywords.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className="bg-white border-2 border-slate-900 rounded-md shadow-[4px_4px_0px_rgba(26,26,26,1)] overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-serif font-black text-[#0B3C5D] hover:text-slate-900 bg-[#f9f8f6] hover:bg-slate-50 transition cursor-pointer select-none"
                  >
                    <span className="text-xs md:text-sm flex items-start gap-2.5">
                      <HelpCircle className="w-4.5 h-4.5 text-[#F2B705] shrink-0 mt-0.5" />
                      <span>{faq.question}</span>
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                  </button>

                  {/* Transition/Collapsible block */}
                  {isOpen && (
                    <div className="border-t border-slate-100 px-5 py-4 bg-white text-stone-700 text-xs md:text-[13px] leading-relaxed font-sans text-left space-y-2">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
