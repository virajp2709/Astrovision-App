export interface ZodiacSign {
  id: string;
  name: string;
  sanskritName: string;
  element: string;
  ruler: string;
  symbol: string;
  mantra: string;
  dailyForecast: string;
  weeklyForecast: string;
  monthlyForecast: string;
  luckyNumber: number;
  luckyColor: string;
}

export interface Astrologer {
  id: string;
  name: string;
  title: string;
  experience: string;
  specialization: string;
  rating: number;
  consultationFee: number;
  image: string;
}

export const astrolgersData: Astrologer[] = [
  {
    id: "astro-aanna",
    name: "Pathak Aanna",
    title: "Founder & Jyotish (World Greatest Record Holder for 12,000+ Successful Clients)",
    experience: "Founder & Acharya",
    specialization: "Brain development, Signature & Handwriting Analysis, Face Reading analysis, Numerology Expert",
    rating: 5.0,
    consultationFee: 2100,
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
  }
];

export const zodiacSigns: ZodiacSign[] = [
  {
    id: "aries",
    name: "Aries",
    sanskritName: "Mesha",
    element: "Fire",
    ruler: "Mars (Mangal)",
    symbol: "♈",
    mantra: "Om Angarakaya Namah",
    dailyForecast: "Adityasya Gatasya - The transition of Mars provides exceptional enthusiasm for starting pending ventures today. Take action in your career, but speak softly with colleagues.",
    weeklyForecast: "A week of immense strength. Expect resolution of minor land or property matters. Jupiter's aspect on your house of earnings inspires strategic investments.",
    monthlyForecast: "May is a transformative month for you. Planetary transits bring spiritual awakenings and clarity regarding relationship goals. Remain grounded.",
    luckyNumber: 9,
    luckyColor: "Crimson Red"
  },
  {
    id: "taurus",
    name: "Taurus",
    sanskritName: "Vrishabha",
    element: "Earth",
    ruler: "Venus (Shukra)",
    symbol: "♉",
    mantra: "Om Shukraya Namah",
    dailyForecast: "Yatha Dristi Tatha Srishti - Your perspective shapes your day. Venus encourages artistic appreciation and self-care. A wonderful day to invest in long-term bonds.",
    weeklyForecast: "Your ruling planet Venus aligned in your finance sector guarantees sound monetary inflows. Be cautious about extravagant lifestyle spent.",
    monthlyForecast: "A stable lunar flow brings tranquility to home life. It is an excellent month for home renovation or securing family blessings.",
    luckyNumber: 6,
    luckyColor: "Sandalwood Cream"
  },
  {
    id: "gemini",
    name: "Gemini",
    sanskritName: "Mithuna",
    element: "Air",
    ruler: "Mercury (Budha)",
    symbol: "♊",
    mantra: "Om Budhaya Namah",
    dailyForecast: "Budhena Sahita - Mercury elevates your speech and intelligence. Write, pitch, or resolve long-standing misunderstandings. Your humor will be appreciated.",
    weeklyForecast: "Cosmic energies are favorable for students and creative artists. Keep your focus undivided. A midweek transit suggests avoiding high physical exertion.",
    monthlyForecast: "Career charts indicate unexpected communications or travel. Embrace new digital skills as they will pave path for future prosperity.",
    luckyNumber: 5,
    luckyColor: "Emerald Green"
  },
  {
    id: "cancer",
    name: "Cancer",
    sanskritName: "Karka",
    element: "Water",
    ruler: "Moon (Chandra)",
    symbol: "♋",
    mantra: "Om Chandraya Namah",
    dailyForecast: "Chandra Balasya - The Moon rules your emotional waves. Expect a reflective phase. Meditate in the evening to harness positive cosmic fields.",
    weeklyForecast: "Family relations occupy center stage. Ensure empathy when discussing sensitive ancestral matters. Financial stability improves by Friday.",
    monthlyForecast: "Planetary dashas favor intuitive projects. Trust your gut feeling when forming brand new personal and business associations.",
    luckyNumber: 2,
    luckyColor: "Pearl White"
  },
  {
    id: "leo",
    name: "Leo",
    sanskritName: "Simha",
    element: "Fire",
    ruler: "Sun (Surya)",
    symbol: "♌",
    mantra: "Om Suryaya Namah",
    dailyForecast: "Tejas Guna - Surya bestows strong authority and vitality upon you today. A highly beneficial day for leading projects or meeting administrative figures.",
    weeklyForecast: "Public recognition or leadership positions are likely to unlock. A small dispute with an elder can easily be sidestepped with respectful quietude.",
    monthlyForecast: "The sun shines brightly on your career house. Dynamic growth, bonuses, or critical life transformations will unfold over the next three weeks.",
    luckyNumber: 1,
    luckyColor: "Radiant Gold"
  },
  {
    id: "virgo",
    name: "Virgo",
    sanskritName: "Kanya",
    element: "Earth",
    ruler: "Mercury (Budha)",
    symbol: "♍",
    mantra: "Om Kanya Devyai Namah",
    dailyForecast: "Viveka - A day prioritizing strict financial analysis and organizing spaces. Mercury keeps your analytical sight sharp. Trust statistics over rumors.",
    weeklyForecast: "Excellent results in examinations or competitive interviews. Focus on maintaining a balanced diet and regular yoga postures to stay energetic.",
    monthlyForecast: "A favorable transit of Venus expands your social circle and brings high-value network circles. Long-distance associations offer unexpected payoffs.",
    luckyNumber: 7,
    luckyColor: "Sea Green"
  },
  {
    id: "libra",
    name: "Libra",
    sanskritName: "Tula",
    element: "Air",
    ruler: "Venus (Shukra)",
    symbol: "♎",
    mantra: "Om Shukraya Namah",
    dailyForecast: "Samatvam Yoga Uchyate - Balance is yoga. Strive for harmony in relationships today. A minor compromise with life partner yields long-lasting emotional peace.",
    weeklyForecast: "Legal matters see favorable winds. Avoid high risks in stock and commodity markets of late. Focus heavily on core professional deliverables.",
    monthlyForecast: "A highly passionate month. Creative ventures will flourish under Venus's direct protection. Health indices reflect steady healing rhythms.",
    luckyNumber: 8,
    luckyColor: "Pastel Pink"
  },
  {
    id: "scorpio",
    name: "Scorpio",
    sanskritName: "Vrishchika",
    element: "Water",
    ruler: "Mars / Ketu",
    symbol: "♏",
    mantra: "Om Kethave Namah",
    dailyForecast: "Dharma Chari - Mars instills focus and inner courage. Do not fear difficult decisions today. A secret ally will extend support when requested.",
    weeklyForecast: "An intense spiritual period. Your interest in hidden realms, occult sciences, or sacred texts will peak. Spend hours in quiet dhyana (meditation).",
    monthlyForecast: "Relationships require mindful patience from your end. Saturn’s gentle aspect hints at clearing spiritual debts to secure smoother progress.",
    luckyNumber: 3,
    luckyColor: "Deep Maroon"
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    sanskritName: "Dhanu",
    element: "Fire",
    ruler: "Jupiter (Guru)",
    symbol: "♐",
    mantra: "Om Gurave Namah",
    dailyForecast: "Guru Kripa - Jupiter enhances wisdom and teaching capabilities. Sharing knowledge or guiding a junior will attract divine merits. Travel plans feel aligned.",
    weeklyForecast: "Cosmic alignment promises financial relief. Loans can be repaid or settled. Excellent phase for seeking spiritual initiation or higher education.",
    monthlyForecast: "Favorable dasha shifts of Saturn/Jupiter will remove blockades in career path. A major life milestone is getting structured behind the scenes.",
    luckyNumber: 11,
    luckyColor: "Saffron Yellow"
  },
  {
    id: "capricorn",
    name: "Capricorn",
    sanskritName: "Makara",
    element: "Earth",
    ruler: "Saturn (Shani)",
    symbol: "♑",
    mantra: "Om Sham Shanaishcharaya Namah",
    dailyForecast: "Karma Yoga - Shani Dev blesses hard work and discipline above all. Do not hunt for shortcuts today. Slow progress guarantees permanent foundations.",
    weeklyForecast: "Responsibilities at work will rise, but so will your social respect. Be mindful of sleeping hours; body seeks restoration and healing.",
    monthlyForecast: "Major focus locks on domestic and ancestral tasks. Honoring elders brings peaceful cosmic energies into your direct biofield.",
    luckyNumber: 4,
    luckyColor: "Steel Gray"
  },
  {
    id: "aquarius",
    name: "Aquarius",
    sanskritName: "Kumbha",
    element: "Air",
    ruler: "Saturn / Rahu",
    symbol: "♒",
    mantra: "Om Rahave Namah",
    dailyForecast: "Sankalpa - Your innovative ideas receive support. Rahu sparks out-of-the-box thinking. Combine logic with spiritual clarity for the best design.",
    weeklyForecast: "An auspicious time to initiate self-improvement or physical fitness regimes. Business partnerships initialized now will carry structural harmony.",
    monthlyForecast: "Finances see general appreciation. A long-pending money dispute will transition into mutual agreement. Dedicate time to charity.",
    luckyNumber: 22,
    luckyColor: "Electric Blue"
  },
  {
    id: "pisces",
    name: "Pisces",
    sanskritName: "Meena",
    element: "Water",
    ruler: "Jupiter (Guru)",
    symbol: "♓",
    mantra: "Om Devagurave Namah",
    dailyForecast: "Dhyana Yoga - The water element deepens your emotional intelligence and dreams. Perfect day to engage in creative writing, fine music, or sacred mantras.",
    weeklyForecast: "A steady, soothing wind is blowing in your support. Relationship conflicts dissolve. Midweek is excellent for travel and health checkups.",
    monthlyForecast: "Career transits support international trade or spiritual businesses. Your intuitive predictions for colleagues will prove uncannily correct.",
    luckyNumber: 12,
    luckyColor: "Golden Ochre"
  }
];

export const gemstonesData = [
  {
    name: "Emerald",
    sanskritName: "Panna",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=200",
    planet: "Mercury (Budha)",
    metal: "Gold or Silver",
    finger: "Little finger of the working hand",
    mantra: "Om Bum Budhaya Namah (Chant 108 times)",
    benefits: [
      "Sharper memory, intellectual clarity, and swift speech",
      "Boosts trade, public communication, and financial mathematics",
      "Harmonizes skin, auditory, and nervous systems"
    ],
    precautions: "Do NOT wear Emerald together with Pearl, Coral, or Ruby under any circumstances."
  },
  {
    name: "Yellow Sapphire",
    sanskritName: "Pukhraj",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=200",
    planet: "Jupiter (Guru)",
    metal: "Yellow Gold",
    finger: "Index finger of the working hand",
    mantra: "Om Gram Greem Groum Sah Gurave Namah (Chant 108 times)",
    benefits: [
      "Attracts high wealth, spiritual wisdom, and supreme fortune",
      "Ensures success in academics, teaching, law, and business finance",
      "Helps match-making and delays in marital alliances"
    ],
    precautions: "Never wear Yellow Sapphire with Diamond, Blue Sapphire, or Emerald unless specifically advised by an Acharya."
  },
  {
    name: "Ruby",
    sanskritName: "Manik",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=200",
    planet: "Sun (Surya)",
    metal: "Gold or Copper",
    finger: "Ring finger of the working hand",
    mantra: "Om Hram Hreem Hroum Sah Suryaya Namah (Chant 108 times)",
    benefits: [
      "Ignites immense courage, command, and political authority",
      "Dissolves self-doubt, lethargy, and structural career roadblocks",
      "Nourishes bone density, eyesight, and digestive fire"
    ],
    precautions: "Never wear Ruby paired with Blue Sapphire, Diamond, or Onyx."
  },
  {
    name: "Coral",
    sanskritName: "Moonga",
    image: "https://images.unsplash.com/photo-1574044536225-047db18b6393?auto=format&fit=crop&q=80&w=200",
    planet: "Mars (Mangal)",
    metal: "Gold, Copper or Silver",
    finger: "Ring finger of the working hand",
    mantra: "Om Kram Kreem Kroum Sah Bhaumaya Namah (Chant 108 times)",
    benefits: [
      "Infuses tremendous physical energy, confidence, and determination",
      "Eradicates fear, debt struggles, and Manglik Dosha blockages",
      "Governs bone marrow, muscular health, and blood circulation"
    ],
    precautions: "Do NOT wear Coral with Emerald or Blue Sapphire."
  },
  {
    name: "Blue Sapphire",
    sanskritName: "Neelam",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=200",
    planet: "Saturn (Shani)",
    metal: "Silver, Platinum or Iron",
    finger: "Middle finger of the working hand",
    mantra: "Om Pram Preem Proum Sah Shanishcharaya Namah (Chant 108 times)",
    benefits: [
      "Offers ultra-rapid transformation, financial windfall, and supreme wisdom",
      "Protects from accidents, negative biological evil eyes, and litigation",
      "Establishes pristine work ethic, systematic focus, and extreme perseverance"
    ],
    precautions: "CRITICAL: Blue Sapphire is highly reactive. Always test it under your pillow for 3 days to check for negative dreams before wearing properly."
  },
  {
    name: "Natural Pearl",
    sanskritName: "Moti",
    image: "https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&q=80&w=200",
    planet: "Moon (Chandra)",
    metal: "Pure Silver",
    finger: "Little finger of the working hand",
    mantra: "Om Shram Shreem Shroum Sah Chandraya Namah (Chant 108 times)",
    benefits: [
      "Calms hyper-anxiety, severe mood swings, and mental turbulence",
      "Enables peace of mind, self-reflection, and sweet family bonding",
      "Balances biological fluids, asthma, and cooling energies"
    ],
    precautions: "Do NOT wear Pearl alongside Blue Sapphire or Ruby."
  }
];

export const vastuTipsDataList = [
  {
    room: "Pooja Room (Altar)",
    direction: "North-East (Ishan Kona)",
    dosha: "Pooja altar placed in South or South-West drains spiritual merit and invites mental blockages.",
    remedy: "Re-locate deities to the North-East. Worship facing East. Place a small container of sacred Ganga water in the room."
  },
  {
    room: "Kitchen (Cooking Fire)",
    direction: "South-East (Agneya Kona)",
    dosha: "Kitchen situated in North or North-East leads to constant financial drain and hot-headed arguments.",
    remedy: "Position stoves in the South-East corner. Ensure the cook faces East. Place a golden brass representation of Surya Dev on the wall."
  },
  {
    room: "Master Bedroom",
    direction: "South-West (Nairutya Kona)",
    dosha: "Master bed in North-East compromises emotional attachment and leads to chronic exhaustion.",
    remedy: "Align the headboard towards the South. Keep the South-West floor slightly higher. Avoid keeping mirrors facing the resting bed."
  },
  {
    room: "Entrance Door",
    direction: "North, East or North-East",
    dosha: "Main door facing South-West or heavily shadowed by trees/clutter blocks auspicious Prana inflows.",
    remedy: "Install a gold/copper Swastika or Panchmukhi Hanuman icon above the main threshold. Ensure the space is well-lit."
  },
  {
    room: "Living Room",
    direction: "North or East",
    dosha: "Heavy clutter or dynamic water items in North-West invites administrative or social dispute.",
    remedy: "De-clutter the central Brahmastan area. Hang a peaceful panoramic landscape or 7 running horses painting in the East."
  }
];
