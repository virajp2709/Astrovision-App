import React, { useState } from "react";
import { Sparkles, Copy, Check, Search, Heart, Music, Volume2, HelpCircle } from "lucide-react";

interface MantraItem {
  id: string;
  category: string;
  title: string;
  sanskrit: string;
  translation: string;
  purpose: string;
  benefits: string[];
}

export default function AstroMantras() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const categories = [
    "All",
    "गणेश (Ganesha)",
    "शिव (Shiva)",
    "विष्णु & देव (Deities)",
    "देवी (Devi)",
    "नवग्रह (Navagraha)",
    "कल्याण & समृद्धी (Prosperity & Life)"
  ];

  const mantras: MantraItem[] = [
    {
      id: "ganesha-beej",
      category: "गणेश (Ganesha)",
      title: "ॐ गं गणपतये नमः",
      sanskrit: "ॐ गं गणपतये नमः",
      translation: "Om Gam Ganapataye Namaha",
      purpose: "सर्व विघ्न दूर करण्यासाठी आणि कार्यात यश मिळवण्यासाठी (For clearing all mental and cosmic obstacles).",
      benefits: ["Provides energetic shield", "Deepens intellectual intuition", "Auspicious for starting anything new"]
    },
    {
      id: "ganesha-atharvashirsha",
      category: "गणेश (Ganesha)",
      title: "श्री गणपती अथर्वशीर्ष प्रारंभ मंत्र",
      sanskrit: "ॐ नमस्ते गणपतये।\nत्वमेव प्रत्यक्षं तत्त्वमसि॥",
      translation: "Om Namaste Ganapataye |\nTvameva Pratyaksham Tattvamasi ||",
      purpose: "गणपती उपनिषद आणि ब्रह्मज्ञान मिळवण्यासाठी (Supreme Upanishadic formula of devotion and self-realization).",
      benefits: ["Establishes divine cosmic union", "Cleanses karmic layers", "Grants core internal peace"]
    },
    {
      id: "ganesha-vakratunda",
      category: "गणेश (Ganesha)",
      title: "वक्रतुंड महाकाय मंत्र",
      sanskrit: "वक्रतुंड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥",
      translation: "Vakratunda Mahakaya Suryakoti Samaprabha |\nNirvighnam Kuru Me Deva Sarvakaryeshu Sarvada ||",
      purpose: "कार्य सिद्धी आणि यश मिळवण्यासाठी (For divine protection and absolute success of all efforts).",
      benefits: ["Neutralizes opposing negative forces", "Radiates intense confidence", "Guarantees tasks flow smoothly"]
    },
    {
      id: "shiva-panchakshari",
      category: "शिव (Shiva)",
      title: "पंचाक्षरी शिव मंत्र",
      sanskrit: "ॐ नमः शिवाय",
      translation: "Om Namah Shivaya",
      purpose: "मनःशांती, आत्मशुद्धी आणि शक्ती जागृतीसाठी (The foundational 5-syllable mantra of supreme auspicious consciousness).",
      benefits: ["Purifies elements of body", "Cools hot temperaments & anxiety", "Elevates master level awareness"]
    },
    {
      id: "shiva-mahamrityunjaya",
      category: "शिव (Shiva)",
      title: "महामृत्युंजय मंत्र",
      sanskrit: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।\nउर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्॥",
      translation: "Om Tryambakam Yajamahe Sugandhim Pushti-Vardhanam |\nUrvarukam-Iva Bandhanan Mrityor-Mukshiya Maamritat ||",
      purpose: "आरोग्य संजीवनी, दीर्घायुष्य आणि संरक्षणासाठी (Supreme protective life-restoration chant).",
      benefits: ["Speeds physiological healing", "Eradicates fears of dynamic changes", "Shields vehicle and body from mishaps"]
    },
    {
      id: "gayatri-major",
      category: "देवी (Devi)",
      title: "गायत्री मंत्र",
      sanskrit: "ॐ भूर्भुवः स्वः।\nतत्सवितुर्वरेण्यं।\nभर्गो देवस्य धीमहि।\nधियो यो नः प्रचोदयात्॥",
      translation: "Om Bhur Bhuvah Svah |\nTat Savitur Varenyam |\nBhargo Devasya Dhimahi |\nDhiyo Yo Nah Prachodayat ||",
      purpose: "बुद्धी आणि आत्मिक तेज वाढवण्यासाठी (Vedic solar chant for deep wisdom and intellectual upgrade).",
      benefits: ["Improves sharp academic memory", "Purifies bad thoughts and habits", "Invokes pure satvic radiation"]
    },
    {
      id: "lakshmi-beej",
      category: "देवी (Devi)",
      title: "महालक्ष्मी बीज मंत्र",
      sanskrit: "ॐ श्रीं महालक्ष्म्यै नमः",
      translation: "Om Shreem Mahalakshmyai Namaha",
      purpose: "ऐश्वर्य, संपत्ती आणि समृद्धी प्राप्तीसाठी (Premium seed syllable of ultimate material stability).",
      benefits: ["Attracts positive professional abundance", "Removes poverty and money blocks", "Infuses house with sweet golden energy"]
    },
    {
      id: "saraswati-beej",
      category: "देवी (Devi)",
      title: "सरस्वती बीज मंत्र",
      sanskrit: "ॐ ऐं सरस्वत्यै नमः",
      translation: "Om Aim Saraswatyai Namaha",
      purpose: "ज्ञान, विद्या आणि कला प्राप्तीसाठी (Chant for music, speaking skills, tests, and active mind power).",
      benefits: ["Enhances clear memory and attention", "Amplifies artistic mastery", "Opens communication pathways"]
    },
    {
      id: "durga-beej",
      category: "देवी (Devi)",
      title: "दुर्गा बीज मंत्र",
      sanskrit: "ॐ दुं दुर्गायै नमः",
      translation: "Om Dum Durgayai Namaha",
      purpose: "वाईट शक्तींपासून संरक्षण आणि आत्मशक्ती वाढवण्यासाठी (Fierce defense against toxic and negative energies).",
      benefits: ["Neutralizes psychic blockages", "Gives immense willpower and grit", "Builds aura protection shield"]
    },
    {
      id: "devi-shakti",
      category: "देवी (Devi)",
      title: "देवी महामंत्र",
      sanskrit: "या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता।\nनमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः॥",
      translation: "Ya Devi Sarvabhuteshu Shaktirupena Samsthita |\nNamastasyai Namastasyai Namastasyai Namo Namaha ||",
      purpose: "सर्वव्यापी स्त्रीशक्ती आणि आशीर्वाद मिळवण्यासाठी (Salutation to the ultimate motherly nature).",
      benefits: ["Awakens active inner power", "Spreads peaceful high vibrations", "Ensures motherly protection"]
    },
    {
      id: "hanuman-beej",
      category: "विष्णु & देव (Deities)",
      title: "हनुमान बीज मंत्र",
      sanskrit: "ॐ ऐं भ्रीम हनुमते श्रीरामदूताय नमः",
      translation: "Om Aim Bhreem Hanumate Shreeramadootaya Namaha",
      purpose: "शौर्य, शारीरिक बळ आणि भयमुक्तीसाठी (For profound devotion and robust physical health).",
      benefits: ["Dispels phantom anxieties & fears", "Grants infinite strength and dedication", "Pacifies Sade Sati/Saturn effects"]
    },
    {
      id: "hanuman-beej-simple",
      category: "विष्णु & देव (Deities)",
      title: "हनुमान मंत्र (भौतिक रक्षण)",
      sanskrit: "ॐ हं हनुमते नमः",
      translation: "Om Ham Hanumate Namaha",
      purpose: "संकट मुक्ती आणि साहसासाठी (For overcoming sudden situations with courage).",
      benefits: ["Gives speedy muscle stamina", "Boosts fearlessness"]
    },
    {
      id: "surya-aditya-hridaya",
      category: "विष्णु & देव (Deities)",
      title: "आदित्य हृदय स्तोत्र मंत्र (आरंभ)",
      sanskrit: "आदित्यहृदयं पुण्यं सर्वशत्रुविनाशनम्",
      translation: "Adityahridayam Punyam Sarvashatruvinashanam",
      purpose: "शत्रू पराभव आणि जीवनात सन्मान मिळवण्यासाठी (From the sacred Ramayana, solar light shield of Lord Rama).",
      benefits: ["Eliminates severe mental self-doubt", "Defeats active rivals and adversaries", "Brightens the professional orbit"]
    },
    {
      id: "surya-beej-simple",
      category: "विष्णु & देव (Deities)",
      title: "सूर्य मंत्र (आरोग्य)",
      sanskrit: "ॐ घृणि सूर्याय नमः",
      translation: "Om Ghrini Suryaya Namaha",
      purpose: "शारीरिक ऊर्जा आणि निरोगी आरोग्यासाठी (Daily sunrise ritual chant).",
      benefits: ["Improves vision and bone strength", "Removes lazy state of inertia"]
    },
    {
      id: "ram-tarak",
      category: "विष्णु & देव (Deities)",
      title: "राम तारक मंत्र",
      sanskrit: "श्री राम जय राम जय जय राम",
      translation: "Shri Ram Jay Ram Jay Jay Ram",
      purpose: "शांतता, मर्यादा आणि जीवनातील संतुलन कायम ठेवण्यासाठी (Simplest supreme formula of peaceful living).",
      benefits: ["Establishes cosmic harmony", "Clears relationship conflicts", "Frees mind from stressful loads"]
    },
    {
      id: "krishna-vasudeva",
      category: "विष्णु & देव (Deities)",
      title: "कृष्ण मंत्र",
      sanskrit: "ॐ नमो भगवते वासुदेवाय",
      translation: "Om Namo Bhagavate Vasudevaya",
      purpose: "प्रेम, भक्ती, मानसिक शांती आणि मोक्षासाठी (The 12-syllabled Maha-mantra of cosmic consciousness).",
      benefits: ["Unlocks intuitive devotion", "Heals toxic thoughts and worries", "Stabilizes life paths"]
    },
    {
      id: "vishnu-narayana",
      category: "विष्णु & देव (Deities)",
      title: "विष्णु मंत्र",
      sanskrit: "ॐ नमो नारायणाय",
      translation: "Om Namo Narayanaya",
      purpose: "शाश्वत वैश्विक संरक्षणासाठी (Auspicious chant of Lord Vishnu for sustenance and happiness).",
      benefits: ["Creates family safety net", "Removes sudden planetary blockages", "Brings absolute inner bliss"]
    },
    {
      id: "nrisingha-mantra",
      category: "विष्णु & देव (Deities)",
      title: "नृसिंह मंत्र",
      sanskrit: "ॐ उग्रं वीरं महाविष्णुं ज्वलन्तं सर्वतोमुखम्।\nनृसिंहं भीषणं भद्रं मृत्युमृत्युं नमाम्यहम्॥",
      translation: "Om Ugram Veeram Maha-Vishnum Jvalantam Sarvatomukham |\nNrisimham Bhishanam Bhadram Mrityur-Mrityum Namamy-Aham ||",
      purpose: "कठीण परिस्थितीतून मुक्ती आणि शत्रू नाशासाठी (The ultimate protective armour for absolute safety).",
      benefits: ["Shields against worst external energy forces", "Gives supreme unshakeable courage", "Fears disappear instantly"]
    },
    {
      id: "dattatreya-guru",
      category: "विष्णु & देव (Deities)",
      title: "दत्तात्रेय मंत्र",
      sanskrit: "ॐ श्री गुरुदेव दत्त",
      translation: "Om Shri Gurudev Datta",
      purpose: "पूर्वजांचे अमंगळ दोष निवारण्यासाठी आणि गुरुकृपेसाठी (For spiritual initiation and peace in family lineage).",
      benefits: ["Corrects Pitru Dosha", "Brings steady focus on life's lessons", "Attracts elite divine guidance"]
    },
    {
      id: "navagraha-sun",
      category: "नवग्रह (Navagraha)",
      title: "सूर्य मंत्र (Navagraha - Sun)",
      sanskrit: "ॐ सूर्याय नमः",
      translation: "Om Suryaya Namaha",
      purpose: "सूर्य ग्रहाची पीडा दूर करून तेज मिळवण्यासाठी.",
      benefits: ["Boosts inner self-esteem", "Improves father-child relations"]
    },
    {
      id: "navagraha-moon",
      category: "नवग्रह (Navagraha)",
      title: "चंद्र मंत्र (Navagraha - Moon)",
      sanskrit: "ॐ सोम सोमाय नमः",
      translation: "Om Soma Somaya Namaha",
      purpose: "चंद्र ग्रहाची सुखात्मक ऊर्जा आणि शांत मनासाठी.",
      benefits: ["Controls random thoughts", "Enriches deep peaceful sleep"]
    },
    {
      id: "navagraha-mars",
      category: "नवग्रह (Navagraha)",
      title: "मंगळ मंत्र (Navagraha - Mars)",
      sanskrit: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः",
      translation: "Om Kraam Kreem Kroum Sah Bhoumaya Namaha",
      purpose: "मंगळ ग्रहाची अनुकूलता, उर्जा आणि रिअल इस्टेट कामांसाठी (Powerful Beej Mantra structure).",
      benefits: ["Mitigates aggressive Manglik faults", "Gives muscular strength & direction"]
    },
    {
      id: "navagraha-mercury",
      category: "नवग्रह (Navagraha)",
      title: "बुध मंत्र (Navagraha - Mercury)",
      sanskrit: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः",
      translation: "Om Braam Breem Broum Sah Budhaya Namaha",
      purpose: "बुध ग्रहाची अनुकूलता, संवाद आणि व्यापार बुद्धीसाठी.",
      benefits: ["Increases analytical focus", "Heals nervous stress points"]
    },
    {
      id: "navagraha-jupiter",
      category: "नवग्रह (Navagraha)",
      title: "गुरु मंत्र (Navagraha - Jupiter)",
      sanskrit: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः",
      translation: "Om Graam Greem Groum Sah Gurave Namaha",
      purpose: "गुरु ग्रहाची कृपा, ज्ञान आणि भाग्य वृद्धीसाठी.",
      benefits: ["Expands dynamic wisdom", "Brings financial assets and happiness"]
    },
    {
      id: "navagraha-venus",
      category: "नवग्रह (Navagraha)",
      title: "शुक्र मंत्र (Navagraha - Venus)",
      sanskrit: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः",
      translation: "Om Draam Dreem Droum Sah Shukraya Namaha",
      purpose: "शुक्र ग्रहाची अनुकूलता, सुखी वैवाहिक जीवन आणि कलात्मक सौंदर्यासाठी.",
      benefits: ["Attracts luxury items", "Restores balance in relationship disputes"]
    },
    {
      id: "navagraha-saturn",
      category: "नवग्रह (Navagraha)",
      title: "शनि मंत्र (Navagraha - Saturn)",
      sanskrit: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः",
      translation: "Om Praam Preem Proum Sah Shanaishcharaya Namaha",
      purpose: "शनि ग्रहाची अनुकूलता, साडेसाती दोष निवारण आणि शिस्तीसाठी.",
      benefits: ["Removes delay patterns", "Teaches persistence & calm posture"]
    },
    {
      id: "navagraha-rahu",
      category: "नवग्रह (Navagraha)",
      title: "राहू मंत्र (Navagraha - Rahu)",
      sanskrit: "ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः",
      translation: "Om Bhraam Bhreem Bhroum Sah Rahave Namaha",
      purpose: "राहू ग्रहाची पीडा दूर करण्यासाठी आणि आकस्मिक घोडचुका रोखण्यासाठी.",
      benefits: ["Wards off mass panic & illusionary desires", "Protects against foreign vibes"]
    },
    {
      id: "navagraha-ketu",
      category: "नवग्रह (Navagraha)",
      title: "केतु मंत्र (Navagraha - Ketu)",
      sanskrit: "ॐ स्त्रां स्त्रीं स्त्रौं सः केतवे नमः",
      translation: "Om Shtraam Shtreem Shtroum Sah Ketave Namaha",
      purpose: "केतु ग्रहाची अनुकूलता आणि अध्यात्मिक प्रगतीसाठी.",
      benefits: ["Heals medical anomalies", "Provides ultimate metaphysical detachment"]
    },
    {
      id: "kalabhairav-protect",
      category: "कल्याण & समृद्धी (Prosperity & Life)",
      title: "कालभैरव मंत्र",
      sanskrit: "ॐ कालभैरवाय नमः",
      translation: "Om Kaalabhairavaya Namaha",
      purpose: "वेळेचे नियोजन, शिस्त आणि शत्रू व काळी जादू नाशासाठी.",
      benefits: ["Brings punctuality and focus", "Clears heavy negative blockages", "Protects house boundaries"]
    },
    {
      id: "nagdevta-worship",
      category: "कल्याण & समृद्धी (Prosperity & Life)",
      title: "नागदेवता मंत्र",
      sanskrit: "ॐ नमो नागदेव्यै नमः",
      translation: "Om Namo Nagadevyai Namaha",
      purpose: "कालसर्प दोष आणि भीती दूर करण्यासाठी आणि जमिनीच्या समृद्धीसाठी.",
      benefits: ["Controls family Rahu-Ketu patterns", "Gives earth stability"]
    },
    {
      id: "tulsi-purify",
      category: "देवी (Devi)",
      title: "तुलसी मंत्र",
      sanskrit: "ॐ तुलस्यै नमः",
      translation: "Om Tulasyai Namaha",
      purpose: "घर शुद्धीकरणासाठी आणि निरोगी वातावरणासाठी (Worshipping holy Tulsi plant).",
      benefits: ["Purifies the atmosphere", "Protects household from diseases", "Brings positive vibe"]
    },
    {
      id: "prithvi-bhumi",
      category: "देवी (Devi)",
      title: "पृथ्वी मंत्र",
      sanskrit: "ॐ पृथ्व्यै नमः",
      translation: "Om Prithvyai Namaha",
      purpose: "भूमी पुजेसाठी आणि निसर्गाचे आशीर्वाद मिळवण्यासाठी.",
      benefits: ["Grounds human frequency", "Brings maternal support from environment"]
    },
    {
      id: "kuber-wealth",
      category: "कल्याण & समृद्धी (Prosperity & Life)",
      title: "कुबेर मंत्र",
      sanskrit: "ॐ यक्षाय कुबेराय वैश्रवणाय धनधान्याधिपतये नमः",
      translation: "Om Yakshaya Kuberaya Vaishravanaya Dhanadhanyadhipataye Namaha",
      purpose: "तिजोरी वाढवणे आणि अडकलेले धन मिळवण्यासाठी (Vedic treasury alignment formula).",
      benefits: ["Clears lockouts of business sales", "Manifests luxurious options"]
    },
    {
      id: "marriage-katyayani",
      category: "कल्याण & समृद्धी (Prosperity & Life)",
      title: "विवाह मंत्र (मंगलाय)",
      sanskrit: "ॐ कात्यायनि महामाये महायोगिन्यधीश्वरि।\nनन्दगोपसुतं देवि पतिं मे कुरु ते नमः॥",
      translation: "Om Katyayani Mahamaye Mahayoginyadhishvari |\nNandagopasutam Devi Patim Me Kuru Te Namaha ||",
      purpose: "विवाहातील अडथळे दूर करून सुयोग्य जीवनसाथी मिळवण्यासाठी.",
      benefits: ["Speeds up marriage procedures", "Blesses family with healthy babies", "Removes relative objections"]
    },
    {
      id: "business-growth",
      category: "कल्याण & समृद्धी (Prosperity & Life)",
      title: "व्यवसाय वृद्धी मंत्र",
      sanskrit: "ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै नमः",
      translation: "Om Shreem Hreem Kleem Mahalakshmyai Namaha",
      purpose: "व्यापारात वाढ आणि गिऱ्हाईक वाढवण्यासाठी (Vedic business aura upgrade).",
      benefits: ["Restores steady customer frequency", "Brings quick expansion choices"]
    },
    {
      id: "yash-prapti",
      category: "कल्याण & समृद्धी (Prosperity & Life)",
      title: "यश प्राप्ती मंत्र (गणेश)",
      sanskrit: "ॐ गं गणपतये नमः",
      translation: "Om Gam Ganapataye Namaha",
      purpose: "प्रसिद्धी आणि सर्व क्षेत्रांत यश मिळवण्यासाठी.",
      benefits: ["Maintains positive career victory", "Ensures sharp mind execution"]
    }
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handlePlayChant = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      // Play mock audio / visual visualizer effect
    }
  };

  const filteredMantras = mantras.filter(mantra => {
    const matchesSearch = 
      mantra.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mantra.sanskrit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mantra.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mantra.purpose.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === "All") {
      return matchesSearch;
    }
    
    // Exact or general category check
    return mantra.category.includes(selectedCategory.split(" ")[0]) && matchesSearch;
  });

  return (
    <div className="bg-white rounded-md border-2 border-slate-900 shadow-[8px_8px_0px_rgba(26,26,26,0.06)] overflow-hidden">
      
      {/* Dynamic Header */}
      <div className="bg-gradient-to-r from-[#0B3C5D] to-slate-950 text-white p-5 border-b-2 border-slate-900 relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#F2B705]/10 rounded-full -mr-6 -mt-6 animate-pulse"></div>
        <div className="relative z-10 text-left">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#F2B705] bg-[#F2B705]/10 px-2.5 py-0.5 rounded border border-[#F2B705]/20 font-extrabold shadow-sm">
            वैदिक मंत्र साधना • Sacred Sound Currents
          </span>
          <h3 className="font-serif font-black text-lg md:text-xl text-white mt-1.5 flex items-center gap-2">
            🕉️ Divine Mantra Sanctuary
          </h3>
          <p className="text-xs text-stone-300 mt-1 max-w-xl leading-relaxed">
            Every syllable of Vedic Sanskrit carries deep physical vibrations matching key neurological and planetary channels. Chant with pure focus, deep breathing, and positive intent.
          </p>
        </div>
      </div>

      {/* Interactive Toolbar */}
      <div className="p-4 bg-stone-50 border-b border-slate-200 space-y-3.5">
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search mantras (e.g. शिव, वक्रतुंड, Om)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded px-4 py-2.5 text-xs text-slate-800 placeholder-stone-400 focus:outline-none focus:border-[#0B3C5D] transition shadow-inner font-sans pr-10"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
        </div>

        {/* Categories Scroller */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded border transition whitespace-nowrap cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? "bg-[#0B3C5D] text-[#F2B705] border-transparent font-black"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-stone-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Grid of Mantras */}
      <div className="p-5 bg-stone-50/50 space-y-4">
        {filteredMantras.length === 0 ? (
          <div className="text-center py-12 bg-white border border-dashed border-slate-300 rounded-md">
            <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-stone-500 font-mono">No matching sacred sound vibrations found. Try modifying your search filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMantras.map((mantra) => {
              const isFav = favorites.includes(mantra.id);
              const isCopied = copiedId === mantra.id;
              const isPlaying = playingId === mantra.id;

              return (
                <div 
                  key={mantra.id}
                  className="bg-white rounded border-2 border-slate-900 shadow-[2px_2px_0px_rgba(26,26,26,1)] hover:shadow-none transition-all duration-150 p-4 text-left flex flex-col justify-between relative overflow-hidden group"
                >
                  {/* Category Pill Tag */}
                  <div className="flex items-center justify-between border-b pb-2 mb-3 border-slate-100">
                    <span className="text-[9px] font-mono font-extrabold px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded">
                      {mantra.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => toggleFavorite(mantra.id)}
                        className="text-stone-300 hover:text-rose-600 transition cursor-pointer"
                        title={isFav ? "Remove from Sadhana" : "Save to my Sadhana diary"}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? "fill-rose-600 text-rose-600" : ""}`} />
                      </button>
                      <button 
                        onClick={() => handleCopy(mantra.id, `${mantra.sanskrit}\n\nTranslation: ${mantra.translation}`)}
                        className="text-stone-400 hover:text-[#0B3C5D] transition cursor-pointer"
                        title="Copy Mantra text"
                      >
                        {isCopied ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Mantra body */}
                  <div className="space-y-3 flex-1">
                    <div className="space-y-1">
                      <span className="text-[10px] text-stone-400 font-mono block">Mantra Theme:</span>
                      <h4 className="font-serif font-black text-slate-900 text-sm">{mantra.title}</h4>
                    </div>

                    <div className="bg-[#fdfcf9] border-l-3 border-[#F2B705] p-3 rounded-r relative">
                      <p className="text-base md:text-lg font-serif font-black text-slate-800 leading-normal whitespace-pre-line tracking-wide font-bilingual select-all">
                        {mantra.sanskrit}
                      </p>
                      <p className="text-[10px] font-mono text-stone-500 italic mt-2 border-t border-dotted border-stone-200 pt-1.5">
                        {mantra.translation}
                      </p>
                    </div>

                    <div className="space-y-1 leading-normal text-xs text-stone-700">
                      <p>
                        <strong className="text-[#0B3C5D]">उद्देश्य / Purpose:</strong> {mantra.purpose}
                      </p>
                    </div>

                    {mantra.benefits && mantra.benefits.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[9px] font-mono font-extrabold uppercase tracking-wide text-stone-400 block mb-1">Planetary and physical benefits:</span>
                        <ul className="grid grid-cols-1 gap-1 text-[10px] text-stone-600">
                          {mantra.benefits.map((b, bIdx) => (
                            <li key={bIdx} className="flex items-center gap-1">
                              <span className="text-[#F2B705] font-black">•</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Audio chant interactive emulator option */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button 
                      onClick={() => handlePlayChant(mantra.id)}
                      className={`text-[10px] font-mono tracking-wider uppercase font-black px-2.5 py-1.5 rounded flex items-center gap-1 transition cursor-pointer border ${
                        isPlaying 
                          ? "bg-slate-900 text-amber-400 border-slate-950 pulse-button" 
                          : "bg-stone-50 text-stone-700 hover:bg-stone-100 border-slate-200"
                      }`}
                    >
                      {isPlaying ? <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-bounce" /> : <Music className="w-3.5 h-3.5 text-stone-400" />}
                      <span>{isPlaying ? "Chanting Sound Live..." : "Simulate Tantric Chant"}</span>
                    </button>

                    {isPlaying && (
                      <div className="flex items-center gap-0.5 h-3 shrink-0">
                        <span className="w-0.5 bg-amber-500 h-full rounded animate-pulse-fast"></span>
                        <span className="w-0.5 bg-[#0B3C5D] h-2/3 rounded animate-pulse-slow"></span>
                        <span className="w-0.5 bg-amber-400 h-1/2 rounded animate-pulse-fast"></span>
                        <span className="w-0.5 bg-[#0B3C5D] h-3/4 rounded animate-pulse-slow"></span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Simple Instruction Box */}
      <div className="bg-[#0B3C5D]/5 p-4 border-t border-slate-200 text-left text-[11px] text-stone-600 leading-relaxed font-sans space-y-1">
        <p className="font-serif font-black text-slate-800">💡 पवित्र साधना मार्गदर्शक (Sacred Sadhana Guidelines):</p>
        <p>1. स्नान करून किंवा मन एकाग्र करून शुचिर्भूत स्थितीत बसा (Sit in a clean posture, preferably facing East or North).</p>
        <p>2. प्रत्येक मंत्राचा किमान १०८ वेळा (एक माळ) जप करावा (Try chanting each mantra 108 times using a Rudraksha or Tulsi mala).</p>
        <p>3. श्वासावर नियंत्रण ठेऊन संतत गतीने जप करावा (Maintain rhythmic controlled deep breaths during sound resonance).</p>
      </div>

    </div>
  );
}
