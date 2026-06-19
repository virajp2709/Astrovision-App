/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Compass,
  Gem,
  Calendar,
  Hourglass,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  User,
  Heart,
  AlertTriangle,
  FileCheck,
  Check,
  Copy,
  ChevronRight,
  ShieldCheck,
  Zap,
  BookOpen,
  Mail,
  Search,
  X,
  RotateCcw,
  Info
} from "lucide-react";
import { BookingDetails, KundliInputs, CompatibilityInputs } from "./types";
import { zodiacSigns, gemstonesData, vastuTipsDataList, astrolgersData, Astrologer } from "./data/astrologyData";
import { nakshatrasDataList, NakshatraDetails } from "./data/nakshatrasData";

import AstroChat from "./components/AstroChat";
import AstrologyHub from "./components/AstrologyHub";
import AstroBookingFlow from "./components/AstroBookingFlow";
import AstroFaq from "./components/AstroFaq";
import AstroMantras from "./components/AstroMantras";
import AstroPujas from "./components/AstroPujas";


export function BraincordLogo() {
  return (
    <div className="flex flex-col items-center bg-[#07070a] px-5 py-2.5 rounded-lg border-2 border-editorial-ink shadow-[3px_3px_0px_rgba(26,26,26,1)] select-none">
      {/* PATHAKAANNA */}
      <div className="flex font-sans font-black text-2xl tracking-[0.04em] leading-none mb-1">
        <span className="text-[#3a85f7]">P</span>
        <span className="text-[#ea4335]">A</span>
        <span className="text-[#fbbc05]">T</span>
        <span className="text-[#34a853]">H</span>
        <span className="text-[#ea4335]">A</span>
        <span className="text-[#34a853]">K</span>
        <span className="text-[#2b7bf4]">A</span>
        <span className="text-[#ea4335]">A</span>
        <span className="text-[#fbbc05]">N</span>
        <span className="text-[#34a853]">N</span>
        <span className="bg-gradient-to-r from-[#2b7bf4] to-[#ea4335] bg-clip-text text-transparent">A</span>
      </div>

      {/* @ Pathak Aanna */}
      <div className="text-white text-[10px] font-bold font-sans mt-0.5 tracking-wider flex items-center justify-center">
        <span className="text-[#2b7bf4] font-medium mr-1">@</span>
        <span className="text-[#3a85f7] mr-1">Pathak</span>
        <span className="text-[#ea4335]">Aanna</span>
      </div>

      {/* Elegant curved brush bottom line */}
      <div className="w-14 h-[3px] rounded-full mt-1.5 bg-gradient-to-r from-[#fbbc05] via-[#34a853] to-[#2b7bf4]"></div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"nakshatras" | "horoscope" | "vastu" | "book" | "insights-hub" | "mantras" | "pujas">("insights-hub");
  const [nakshatraSearch, setNakshatraSearch] = useState("");
  const [selectedRulerFilter, setSelectedRulerFilter] = useState("All");
  const [selectedGanaFilter, setSelectedGanaFilter] = useState("All");
  const [selectedNakshatraId, setSelectedNakshatraId] = useState<string | null>(null);
  
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  // Permanent premium photo of the founder loaded dynamically from backend or localized fallback
  const [founderPhoto, setFounderPhoto] = useState<string>(
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400"
  );
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState("");

  // Retrieve customized founder photo URL from the server on mount
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.settings && data.settings.founderPhoto) {
          setFounderPhoto(data.settings.founderPhoto);
        }
      })
      .catch((err) => console.log("Failed to load settings:", err));
  }, []);
  
  // Kundli Generator States
  const [kundliInputs, setKundliInputs] = useState<KundliInputs>({
    name: "Aarav Singhania",
    dob: "1995-08-27",
    tob: "08:15",
    pob: "Varanasi, Uttar Pradesh, India"
  });
  const [isKundliGenerated, setIsKundliGenerated] = useState(true);

  // Milan (Compatibility) States
  const [milanInputs, setMilanInputs] = useState<CompatibilityInputs>({
    partner1Name: "Devendra Verma",
    partner1Dob: "1994-11-12",
    partner1Tob: "14:30",
    partner1Pob: "Jaipur, Rajasthan, India",
    partner2Name: "Anjali Mishra",
    partner2Dob: "1996-05-23",
    partner2Tob: "09:45",
    partner2Pob: "Lucknow, Uttar Pradesh, India"
  });
  const [isMilanGenerated, setIsMilanGenerated] = useState(true);

  // Zodiac Horoscope States
  const [selectedZodiac, setSelectedZodiac] = useState(zodiacSigns[4]); // Leo (Simha)
  const [horoscopePeriod, setHoroscopePeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  // Numerology Calculator States
  const [numName, setNumName] = useState("Viraj Rajan Pathak");
  const [numDob, setNumDob] = useState("1993-09-27");
  const [numerologyResult, setNumerologyResult] = useState<{
    lifePath: number;
    destiny: number;
    soulUrge: number;
    vibe: string;
    details: string;
  } | null>(null);

  // Vastu Selection States
  const [selectedVastuRoom, setSelectedVastuRoom] = useState(vastuTipsDataList[0]);

  // Gemstone category selection state
  const [selectedGemCategory, setSelectedGemCategory] = useState("Career Growth");

  // Booking Module States
  const [allBookings, setAllBookings] = useState<BookingDetails[]>(() => {
    const saved = localStorage.getItem("astro_bookings_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved bookings:", e);
      }
    }
    // Set initial mock bookings to demonstrate daily booking limit of 5.
    const today = new Date().toISOString().split("T")[0];
    const tomorrowTemp = new Date();
    tomorrowTemp.setDate(tomorrowTemp.getDate() + 1);
    const tomorrow = tomorrowTemp.toISOString().split("T")[0];
    
    const initialMockBookings: BookingDetails[] = [
      {
        booking_id: "ASTRO-111111",
        status: "confirmed",
        client_name: "Aarav Sharma",
        astrologer_name: "Pathak Aanna",
        astrologer_specialization: "Brain development, Signature, Numerology Expert",
        consultation_type: "Kundli",
        scheduled_at: `${today} (Slot 1 (09:00 AM - 10:00 AM))`,
        duration_minutes: 30,
        total_fee_inr: 2100,
        advance_amount_inr: 630,
        advance_percentage: 30,
        payment_deadline: `${today} 18:00`,
        payment_methods: ["UPI"],
        upi_id: "astrosage@upi",
        refund_policy: { "24hr_before": "100%", "12hr_before": "50%", "2hr_before": "No" },
        confirmation_message: "Confirmed"
      },
      {
        booking_id: "ASTRO-222222",
        status: "confirmed",
        client_name: "Ishita Kapoor",
        astrologer_name: "Pathak Aanna",
        astrologer_specialization: "Brain development, Signature, Numerology Expert",
        consultation_type: "Marriage",
        scheduled_at: `${today} (Slot 3 (02:00 PM - 03:00 PM))`,
        duration_minutes: 30,
        total_fee_inr: 2100,
        advance_amount_inr: 630,
        advance_percentage: 30,
        payment_deadline: `${today} 18:00`,
        payment_methods: ["UPI"],
        upi_id: "astrosage@upi",
        refund_policy: { "24hr_before": "100%", "12hr_before": "50%", "2hr_before": "No" },
        confirmation_message: "Confirmed"
      },
      {
        booking_id: "ASTRO-333333",
        status: "confirmed",
        client_name: "Rohit Verma",
        astrologer_name: "Pathak Aanna",
        astrologer_specialization: "Brain development, Signature, Numerology Expert",
        consultation_type: "Career",
        scheduled_at: `${tomorrow} (Slot 1 (09:00 AM - 10:00 AM))`,
        duration_minutes: 30,
        total_fee_inr: 2100,
        advance_amount_inr: 630,
        advance_percentage: 30,
        payment_deadline: `${today} 18:00`,
        payment_methods: ["UPI"],
        upi_id: "astrosage@upi",
        refund_policy: { "24hr_before": "100%", "12hr_before": "50%", "2hr_before": "No" },
        confirmation_message: "Confirmed"
      },
      {
        booking_id: "ASTRO-444444",
        status: "confirmed",
        client_name: "Nikhil Joshi",
        astrologer_name: "Pathak Aanna",
        astrologer_specialization: "Brain development, Signature, Numerology Expert",
        consultation_type: "Finance",
        scheduled_at: `${tomorrow} (Slot 2 (11:00 AM - 12:00 PM))`,
        duration_minutes: 30,
        total_fee_inr: 2100,
        advance_amount_inr: 630,
        advance_percentage: 30,
        payment_deadline: `${today} 18:00`,
        payment_methods: ["UPI"],
        upi_id: "astrosage@upi",
        refund_policy: { "24hr_before": "100%", "12hr_before": "50%", "2hr_before": "No" },
        confirmation_message: "Confirmed"
      },
      {
        booking_id: "ASTRO-555555",
        status: "confirmed",
        client_name: "Ananya Sen",
        astrologer_name: "Pathak Aanna",
        astrologer_specialization: "Brain development, Signature, Numerology Expert",
        consultation_type: "Numerology",
        scheduled_at: `${tomorrow} (Slot 3 (02:00 PM - 03:00 PM))`,
        duration_minutes: 30,
        total_fee_inr: 2100,
        advance_amount_inr: 630,
        advance_percentage: 30,
        payment_deadline: `${today} 18:00`,
        payment_methods: ["UPI"],
        upi_id: "astrosage@upi",
        refund_policy: { "24hr_before": "100%", "12hr_before": "50%", "2hr_before": "No" },
        confirmation_message: "Confirmed"
      },
      {
        booking_id: "ASTRO-666666",
        status: "confirmed",
        client_name: "Sanya Mehta",
        astrologer_name: "Pathak Aanna",
        astrologer_specialization: "Brain development, Signature, Numerology Expert",
        consultation_type: "Health",
        scheduled_at: `${tomorrow} (Slot 4 (04:30 PM - 05:30 PM))`,
        duration_minutes: 30,
        total_fee_inr: 2100,
        advance_amount_inr: 630,
        advance_percentage: 30,
        payment_deadline: `${today} 18:00`,
        payment_methods: ["UPI"],
        upi_id: "astrosage@upi",
        refund_policy: { "24hr_before": "100%", "12hr_before": "50%", "2hr_before": "No" },
        confirmation_message: "Confirmed"
      },
      {
        booking_id: "ASTRO-777777",
        status: "confirmed",
        client_name: "Aditya Roy",
        astrologer_name: "Pathak Aanna",
        astrologer_specialization: "Brain development, Signature, Numerology Expert",
        consultation_type: "Career",
        scheduled_at: `${tomorrow} (Slot 5 (07:00 PM - 08:00 PM))`,
        duration_minutes: 30,
        total_fee_inr: 2100,
        advance_amount_inr: 630,
        advance_percentage: 30,
        payment_deadline: `${today} 18:00`,
        payment_methods: ["UPI"],
        upi_id: "astrosage@upi",
        refund_policy: { "24hr_before": "100%", "12hr_before": "50%", "2hr_before": "No" },
        confirmation_message: "Confirmed"
      }
    ];
    localStorage.setItem("astro_bookings_history", JSON.stringify(initialMockBookings));
    return initialMockBookings;
  });

  const saveBookingToHistory = (booking: BookingDetails) => {
    setAllBookings(prev => {
      const filtered = prev.filter(b => b.booking_id !== booking.booking_id);
      const updated = [...filtered, booking];
      localStorage.setItem("astro_bookings_history", JSON.stringify(updated));
      return updated;
    });
  };

  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    dob: "",
    tob: "",
    pob: "",
    preferredDate: "",
    preferredSlot: "Slot 1 (09:00 AM - 10:00 AM)",
    consultationType: "Kundli",
    contactNumber: "",
    selectedAstroId: "astro-aanna"
  });
  const [activeBooking, setActiveBooking] = useState<BookingDetails | null>(null);
  const [bookingError, setBookingError] = useState("");
  const [copiedInvoiceJson, setCopiedInvoiceJson] = useState(false);

  // Razorpay Dynamic Checkout States
  const [isPaying, setIsPaying] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Helper payment deadline countdown
  const [countdownMinutes, setCountdownMinutes] = useState(15);
  const [countdownSeconds, setCountdownSeconds] = useState(0);

  useEffect(() => {
    if (activeBooking) {
      const timer = setInterval(() => {
        if (countdownSeconds > 0) {
          setCountdownSeconds((prev) => prev - 1);
        } else if (countdownMinutes > 0) {
          setCountdownMinutes((prev) => prev - 1);
          setCountdownSeconds(59);
        } else {
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeBooking, countdownMinutes, countdownSeconds]);

  // Auto calculate Numerology upon input changes
  useEffect(() => {
    if (numName && numDob) {
      calculateNumerology();
    }
  }, [numName, numDob]);

  const calculateNumerology = () => {
    // 1. Life Path Number (reduce DOB digits to single/master digit)
    const dobDigits = numDob.replace(/-/g, "").split("").map(Number);
    let lSum = dobDigits.reduce((acc, d) => acc + d, 0);
    while (lSum > 9 && lSum !== 11 && lSum !== 22) {
      lSum = lSum.toString().split("").map(Number).reduce((acc, d) => acc + d, 0);
    }

    // 2. Destiny Number (Pythagorean System values mapping)
    // A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9
    // J=1, K=2, L=3, M=4, N=5, O=6, P=7, Q=8, R=9
    // S=1, T=2, U=3, V=4, W=5, X=6, Y=7, Z=8
    const pythagoreanMap: { [key: string]: number } = {
      a: 1, j: 1, s: 1,
      b: 2, k: 2, t: 2,
      c: 3, l: 3, u: 3,
      d: 4, m: 4, v: 4,
      e: 5, n: 5, w: 5,
      f: 6, o: 6, x: 6,
      g: 7, p: 7, y: 7,
      h: 8, q: 8, z: 8,
      i: 9, r: 9
    };

    const cleanName = numName.toLowerCase().replace(/[^a-z]/g, "");
    let dSum = 0;
    for (let i = 0; i < cleanName.length; i++) {
      dSum += pythagoreanMap[cleanName[i]] || 0;
    }
    while (dSum > 9 && dSum !== 11 && dSum !== 22) {
      dSum = dSum.toString().split("").map(Number).reduce((acc, d) => acc + d, 0);
    }

    const soulUrgeVowels = "aeiou";
    let sSum = 0;
    for (let i = 0; i < cleanName.length; i++) {
      if (soulUrgeVowels.includes(cleanName[i])) {
        sSum += pythagoreanMap[cleanName[i]] || 0;
      }
    }
    while (sSum > 9 && sSum !== 11 && sSum !== 22) {
      sSum = sSum.toString().split("").map(Number).reduce((acc, d) => acc + d, 0);
    }

    // Determine Vibe
    let vibe = "The Visionary Sovereign";
    let details = "Carries pioneering leadership force. Driven, fiercely independent, and capable of constructing historic institutions.";
    if (lSum === 2) {
      vibe = "The Empathic Peacemaker";
      details = "Guided by serene partnership, celestial beauty, and divine healing capabilities. Extremely cooperative and sensitive.";
    } else if (lSum === 3) {
      vibe = "The Creative Wordsmith";
      details = "Governed by Jupiter's expansion. Possesses exceptional communicative talent, vibrant artistry, and inspiring wisdom.";
    } else if (lSum === 4) {
      vibe = "The Systematic Architect";
      details = "Aligned with Saturnian patterns. Thrives on high discipline, solid structural growth, loyalty, and deep patience.";
    } else if (lSum === 5) {
      vibe = "The Dynamic Free Soul";
      details = "Governed by fast Mercury. Seeks continuous discovery, multi-lingual communications, and rapid worldly expansion.";
    } else if (lSum === 6) {
      vibe = "The Divine Nourisher";
      details = "Vibrates on high Venusian frequencies of domestic harmony, healing, teaching, and exquisite creative counseling.";
    } else if (lSum === 7) {
      vibe = "The Mystical Philosopher";
      details = "Ruled by spiritual thresholds. Possesses profound analytical intellect, natural telepathic intuition, and interest in unseen sciences.";
    } else if (lSum === 8) {
      vibe = "The Material Alchemist";
      details = "Commands executive power, financial resilience, and mastery over complex global structures. Governed by Saturn.";
    } else if (lSum === 9) {
      vibe = "The Cosmic Philanthropist";
      details = "Governed by fiery Mars. Carries universal empathy, fighting spirit, and seeks to elevate collective human consciousness.";
    } else if (lSum === 11) {
      vibe = "Master Number 11: The intuitive conduit";
      details = "A sacred psychic threshold. Acts as a cosmic bridge of spiritual enlightenment, creative genius, and inspirational wisdom.";
    } else if (lSum === 22) {
      vibe = "Master Number 22: The Master Builder";
      details = "Translates high dimensions into material reality. Possesses practical master capabilities to change socio-economic maps.";
    }

    setNumerologyResult({
      lifePath: lSum,
      destiny: dSum,
      soulUrge: sSum,
      vibe,
      details
    });
  };

  // Gemstone advisory category mapper
  const getFilteredGemstones = () => {
    switch (selectedGemCategory) {
      case "Career Growth":
        return gemstonesData.slice(0, 2); // Emerald, Pukhraj
      case "Financial Success":
        return [gemstonesData[0], gemstonesData[1], gemstonesData[4]]; // Emerald, Pukhraj, Neelam
      case "Health & Protection":
        return [gemstonesData[2], gemstonesData[3], gemstonesData[5]]; // Manik, Moonga, Moti
      case "Auspicious Marriage":
        return [gemstonesData[1], gemstonesData[5]]; // Pukhraj, Moti
      case "Courage & Debt relief":
        return [gemstonesData[3], gemstonesData[4]]; // Moonga, Neelam
      default:
        return gemstonesData;
    }
  };

  // Direct Booking Handler
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError("");

    const { name, email, dob, tob, pob, preferredDate, preferredSlot, consultationType, contactNumber, selectedAstroId } = bookingForm;

    if (!name || !email || !dob || !tob || !pob || !preferredDate || !contactNumber) {
      setBookingError("Please complete all required fields (including dynamic email) to align your consultation.");
      return;
    }

    // Check if this date has already reached 5 bookings in total
    const bookingsOnThisDate = allBookings.filter(b => b.scheduled_at.startsWith(preferredDate));
    if (bookingsOnThisDate.length >= 5) {
      setBookingError(`⚠️ Divine Limit Exceeded: Acharya Aanna takes exactly 5 sessions per day to safeguard absolute spiritual energy and deep cognitive focus. Selected date "${preferredDate}" is fully booked. Please choose another date.`);
      return;
    }

    // Check if this particular slot is already taken for selected date
    const slotIsTaken = bookingsOnThisDate.some(b => b.scheduled_at.includes(preferredSlot));
    if (slotIsTaken) {
      setBookingError(`⚠️ Slot Conflict: "${preferredSlot}" has already been booked by another seeker on this date. Please select one of the other available hourly slots.`);
      return;
    }

    // Fetch details of astrologer
    const astrologer = astrolgersData.find((a) => a.id === selectedAstroId) || astrolgersData[0];
    const bookingId = "ASTRO-" + Math.floor(100000 + Math.random() * 900000);
    const totalFee = 2100; // Consultation fee set to 2100 INR
    const advanceAmount = 630; // Advance payment set to 630 INR
    const advancePercentage = 30; // 30% advance for 630 INR of 2100 INR

    const todayStr = new Date().toISOString().split("T")[0];
    const deadlineTime = "18:00";

    const newBooking: BookingDetails = {
      booking_id: bookingId,
      status: "pending_payment",
      client_name: name,
      client_email: email,
      client_mobile: contactNumber,
      astrologer_name: astrologer.name,
      astrologer_specialization: astrologer.specialization,
      consultation_type: consultationType,
      scheduled_at: `${preferredDate} (${preferredSlot})`,
      duration_minutes: 30,
      total_fee_inr: totalFee,
      advance_amount_inr: advanceAmount,
      advance_percentage: advancePercentage,
      payment_deadline: `${todayStr} ${deadlineTime}`,
      payment_methods: ["UPI", "Net Banking", "Card", "Wallet"],
      upi_id: "astrosage@upi",
      refund_policy: {
        "24hr_before": "100% refund",
        "12hr_before": "50% refund",
        "2hr_before": "No refund"
      },
      confirmation_message: "🙏 Jai Shree Ram ! Your cosmic journey begins."
    };

    setActiveBooking(newBooking);
    // Also store initially as pending in history
    saveBookingToHistory(newBooking);
    setCountdownMinutes(15);
    setCountdownSeconds(0);
  };

  // Trigger from chat when pasted details are successfully parsed
  const handleBookingDetectedInChat = (booking: BookingDetails) => {
    const updatedWith30MinFee = {
      ...booking,
      duration_minutes: 30,
      total_fee_inr: 2100,
      advance_amount_inr: 630
    };
    setActiveBooking(updatedWith30MinFee);
    
    let extractedSlot = "Slot 1 (09:00 AM - 10:00 AM)";
    const bracketMatch = booking.scheduled_at.match(/\(([^)]+)\)/);
    if (bracketMatch && bracketMatch[1]) {
      const inner = bracketMatch[1].trim();
      if (inner.includes("Slot 1") || inner.includes("Morning")) {
        extractedSlot = "Slot 1 (09:00 AM - 10:00 AM)";
      } else if (inner.includes("Slot 2")) {
        extractedSlot = "Slot 2 (11:00 AM - 12:00 PM)";
      } else if (inner.includes("Slot 3") || inner.includes("Afternoon")) {
        extractedSlot = "Slot 3 (02:00 PM - 03:00 PM)";
      } else if (inner.includes("Slot 4")) {
        extractedSlot = "Slot 4 (04:30 PM - 05:30 PM)";
      } else if (inner.includes("Slot 5") || inner.includes("Evening")) {
        extractedSlot = "Slot 5 (07:00 PM - 08:00 PM)";
      }
    }

    // Auto populate booking form fields to sync
    setBookingForm({
      name: booking.client_name,
      dob: "1993-09-27", // approximate fallback
      tob: "17:45",
      pob: "Mumbai, MH, India",
      preferredDate: booking.scheduled_at.split(" ")[0],
      preferredSlot: extractedSlot,
      consultationType: booking.consultation_type,
      contactNumber: "+91 8806510889",
      selectedAstroId: "astro-aanna"
    });
    setCountdownMinutes(15);
    setCountdownSeconds(0);
    setIsBookingModalOpen(true); // Pop open the dedicated non-scrolling booking dialogue
  };

  const copyInvoiceText = () => {
    if (!activeBooking) return;
    navigator.clipboard.writeText(JSON.stringify(activeBooking, null, 2));
    setCopiedInvoiceJson(true);
    setTimeout(() => setCopiedInvoiceJson(false), 2500);
  };

  const cancelActiveBooking = () => {
    // Explain the refund policy visually
    alert(
      "Cosmic Rescheduling:\n\nRefund Rules:\n- 100% refund if cancelled 24hrs before\n- 50% refund if cancelled within 12hrs\n- No refund under 2hrs.\n\nYour session is being reset."
    );
    setActiveBooking(null);
    setPaymentSuccess(false);
    setPaymentError("");
  };

  const handleRazorpayPayment = async () => {
    if (!activeBooking) return;
    setIsPaying(true);
    setPaymentError("");
    setPaymentSuccess(false);

    try {
      // 1. Create order on Express backend
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount_inr: activeBooking.advance_amount_inr,
          booking_id: activeBooking.booking_id
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to initiate Razorpay order.");
      }

      const orderData = await res.json();

      // 2. Open standard Razorpay Checkout matching the exact key ID that succeeded on our server side
      const rzpKey = orderData.key_id || (import.meta as any).env.VITE_RAZORPAY_KEY_ID || "rzp_test_SsmTMqvCYkHbGF";
      
      const options = {
        key: rzpKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "pathakaanna & NakshatraAI",
        description: `Panchanga Advance (${activeBooking.advance_percentage}%) for ${activeBooking.consultation_type}`,
        image: "https://ai.studio/build/favicon.ico",
        order_id: orderData.order_id,
        handler: async function (response: any) {
          setIsVerifying(true);
          try {
            // 3. Verify payment signature on Express backend
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (!verifyRes.ok) {
              const verifyData = await verifyRes.json();
              throw new Error(verifyData.error || "Payment signature verification failed.");
            }

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setPaymentSuccess(true);
              setPaymentError("");
              // Mark booking as fully confirmed!
              setActiveBooking((prev) => {
                if (!prev) return null;
                const confirmed = {
                  ...prev,
                  status: "confirmed" as const,
                  confirmation_message: "✨ Astro-Slot Safely Authenticated & Paid via Razorpay!"
                };
                saveBookingToHistory(confirmed);
                return confirmed;
              });
            } else {
              throw new Error("Payment signature verification rejected.");
            }
          } catch (verifyError: any) {
            console.error("Verification error:", verifyError);
            setPaymentError(verifyError.message || "Could not verify payment authenticity.");
          } finally {
            setIsVerifying(false);
            setIsPaying(false);
          }
        },
        prefill: {
          name: activeBooking.client_name,
          email: bookingForm.email || activeBooking.client_email || "",
          contact: bookingForm.contactNumber || activeBooking.client_mobile || ""
        },
        theme: {
          color: "#0B3C5D"
        },
        modal: {
          ondismiss: function () {
            setIsPaying(false);
            setPaymentError("Payment process closed by client.");
          }
        }
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      
      razorpayInstance.on("payment.failed", function (response: any) {
        console.error("Razorpay Payment Failed:", response.error);
        setPaymentError(`Payment failed: ${response.error.description}`);
        setIsPaying(false);
      });

      razorpayInstance.open();

    } catch (err: any) {
      console.error("Razorpay initialization error:", err);
      setPaymentError(err.message || "Failed to start Razorpay checkout transaction.");
      setIsPaying(false);
    }
  };

  const getFilteredNakshatras = () => {
    return nakshatrasDataList.filter((n) => {
      const matchSearch =
        n.name.toLowerCase().includes(nakshatraSearch.toLowerCase()) ||
        n.sanskritName.includes(nakshatraSearch) ||
        n.span.toLowerCase().includes(nakshatraSearch.toLowerCase()) ||
        n.characteristics.toLowerCase().includes(nakshatraSearch.toLowerCase()) ||
        n.ruler.toLowerCase().includes(nakshatraSearch.toLowerCase()) ||
        n.deity.toLowerCase().includes(nakshatraSearch.toLowerCase());

      const matchRuler = selectedRulerFilter === "All" || n.ruler.toLowerCase() === selectedRulerFilter.toLowerCase();
      const matchGana = selectedGanaFilter === "All" || n.gana.toLowerCase() === selectedGanaFilter.toLowerCase();

      return matchSearch && matchRuler && matchGana;
    });
  };

  return (
    <div className="min-h-screen bg-editorial-bg flex flex-col font-sans transition-colors duration-300">
      
      {/* Dynamic Nav Header */}
      <header className="relative sm:sticky sm:top-0 z-40 bg-white border-b-2 border-editorial-ink px-4 md:px-8 py-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4 flex-wrap">
          <BraincordLogo />
          
          {/* Top 'About' Section Navigation Shortcut */}
          <button
            onClick={() => {
              setIsAboutModalOpen(true);
            }}
            className="md:ml-2 text-xs font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-sm border-2 transition flex items-center gap-1 cursor-pointer bg-white text-slate-700 border-[#1a1a1a] hover:bg-stone-100 shadow-[2px_2px_0px_rgba(26,26,26,0.5)] hover:shadow-none active:translate-y-0.5"
          >
            <span>📜</span> About Founder
          </button>

          {/* Top 'Book Consultation' Persistent Shortcut */}
          <button
            onClick={() => {
              setIsBookingModalOpen(true);
            }}
            className="text-xs font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-sm border-2 transition flex items-center gap-1 cursor-pointer bg-[#F2B705] text-[#1a1a1a] border-[#1a1a1a] hover:bg-[#dca204] shadow-[2px_2px_0px_rgba(26,26,26,0.5)] hover:shadow-none active:translate-y-0.5"
          >
            <span>🗓️</span> Book Consultation
          </button>
        </div>

        {/* Action Highlights */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="text-xs uppercase font-bold tracking-wider text-editorial-ink opacity-80">Helpline</span>
            <a
              href="tel:+918806510889"
              className="text-[11px] font-mono text-editorial-accent flex items-center gap-1 font-semibold hover:underline"
            >
              <Phone className="w-3 h-3 text-editorial-accent" /> +91 8806510889
            </a>
          </div>
          
          <a
            href="https://wa.me/918806510889"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-md border border-emerald-800 shadow-[4px_4px_0px_rgba(16,185,129,0.15)] hover:bg-emerald-800 transition duration-150 cursor-pointer active:translate-y-0.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-100 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-100"></span>
            </span>
            Chat on WhatsApp
          </a>
        </div>
      </header>

      {/* Hero Header Introduction */}
      <section className="bg-white border-b border-editorial-ink px-4 md:px-8 py-8 text-center relative overflow-hidden" style={{ background: "radial-gradient(circle at 50% 130%, rgba(67, 56, 202, 0.05) 0%, transparent 70%), #ffffff" }}>
        <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
          <span className="bg-editorial-accent/10 border border-editorial-accent/30 text-editorial-accent px-4 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase mb-3 flex items-center gap-1.5 shadow-[2px_2px_0px_rgba(180,83,9,0.15)]">
            <Zap className="w-3.5 h-3.5 fill-editorial-accent" /> 100% Certified Vedic Panchanga Aligned
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-editorial-ink mb-3 leading-tight tracking-tight">
            Consult the <span className="italic font-normal text-[#0B3C5D]">Constellations</span> with NakshatraAI
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-sans max-w-2xl leading-relaxed mb-6">
            Where deep spiritual heritage converges with intuitive intelligence. Explore daily rashis, generate pristine geometry Kundli charts, check compatibility, and reserve sacred consultations.
          </p>

          {/* Premium Pathak Anna Presentation Card on Homepage */}
          <div className="bg-[#0B3C5D]/5 border-2 border-[#0B3C5D] p-5 rounded-md text-left max-w-3xl w-full shadow-[4px_4px_0px_#0B3C5D] relative overflow-hidden">
            <div className="absolute right-0 bottom-0 translate-y-3 translate-x-3 opacity-10 pointer-events-none">
              <span className="text-8xl">🔱</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start relative z-10">
              <span className="text-3xl hidden sm:block">⭐</span>
              <div>
                <p className="text-[13px] md:text-sm text-slate-800 leading-relaxed font-sans">
                  <strong className="text-[#0B3C5D] font-bold text-base">Pathak Anna</strong> is a dedicated Vedic astrologer and life guidance consultant who helps individuals gain clarity about their future, finances, career, relationships, and personal growth. Through personalized horoscope analysis and practical guidance, he empowers people to make confident decisions and move forward with greater certainty and peace of mind.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="bg-[#F2B705] text-[#1a1a1a] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-sm border border-[#1a1a1a]">
                    Vedic Astrologer
                  </span>
                  <span className="bg-[#0B3C5D] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-sm">
                    Life Guidance Consultant
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Dashboard */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: NakshatraAI Live Chat (5/12 cols) */}
        <section className="lg:col-span-5 w-full flex flex-col h-full lg:sticky lg:top-[90px]">
          <div className="mb-2 text-left px-1 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-editorial-accent fill-editorial-accent/20" />
              <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-editorial-ink">
                Chat Guide Assistant
              </h3>
            </div>
            <span className="text-[11px] text-editorial-spirit font-bold italic">
              Empathetic & Culturally Wise
            </span>
          </div>
          <AstroChat
            onBookingDetected={handleBookingDetectedInChat}
            bookingFormDetails={bookingForm}
            activeBooking={activeBooking}
          />
        </section>

        {/* Right Column: Dynamic Interactive Tabs (7/12 cols) */}
        <section className="lg:col-span-7 w-full space-y-6">
          
          {/* NAVIGATION TAB BAR */}
          <div className="grid grid-cols-4 md:grid-cols-7 gap-1 bg-white p-2 rounded-md border-2 border-editorial-ink shadow-[4px_4px_0px_rgba(26,26,26,0.1)]">
            <button
              id="tab-insights-hub"
              onClick={() => setActiveTab("insights-hub")}
              className={`py-2 px-0.5 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-sm border transition text-center cursor-pointer ${
                activeTab === "insights-hub"
                  ? "bg-[#0B3C5D] text-[#F2B705] border-none shadow-[2px_2px_0px_rgba(11,60,93,0.2)] font-black"
                  : "bg-purple-950/10 text-purple-750 border-purple-500/20 hover:bg-purple-950/20"
              }`}
            >
              🌌 Insights
            </button>
            <button
              id="tab-nakshatras"
              onClick={() => setActiveTab("nakshatras")}
              className={`py-2 px-0.5 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-sm border transition text-center cursor-pointer ${
                activeTab === "nakshatras"
                  ? "bg-[#0B3C5D] text-white border-none shadow-[2px_2px_0px_rgba(11,60,93,0.2)] font-black"
                  : "bg-stone-50 text-slate-700 border-stone-200 hover:bg-stone-100"
              }`}
            >
              🌌 Stars
            </button>
            <button
              id="tab-vastu"
              onClick={() => setActiveTab("vastu")}
              className={`py-2 px-0.5 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-sm border transition text-center cursor-pointer ${
                activeTab === "vastu"
                  ? "bg-[#0B3C5D] text-white border-none shadow-[2px_2px_0px_rgba(11,60,93,0.2)] font-black"
                  : "bg-stone-50 text-slate-700 border-stone-200 hover:bg-stone-100"
              }`}
            >
              🧭 Vastu
            </button>
            <button
              id="tab-horoscope"
              onClick={() => setActiveTab("horoscope")}
              className={`py-2 px-0.5 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-sm border transition text-center cursor-pointer ${
                activeTab === "horoscope"
                  ? "bg-[#0B3C5D] text-white border-none shadow-[2px_2px_0px_rgba(11,60,93,0.2)] font-black"
                  : "bg-stone-50 text-slate-700 border-stone-200 hover:bg-stone-100"
              }`}
            >
              🌟 Zodiac
            </button>
            <button
              id="tab-mantras"
              onClick={() => setActiveTab("mantras")}
              className={`py-2 px-0.5 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-sm border transition text-center cursor-pointer ${
                activeTab === "mantras"
                  ? "bg-[#0B3C5D] text-[#F2B705] border-none shadow-[2px_2px_0px_rgba(11,60,93,0.2)] font-black"
                  : "bg-amber-50 text-amber-950 border-amber-200 hover:bg-amber-100 shadow-[1px_1px_0px_rgba(26,26,26,0.3)]"
              }`}
            >
              🕉️ Mantras
            </button>
            <button
              id="tab-pujas"
              onClick={() => setActiveTab("pujas")}
              className={`py-2 px-0.5 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-sm border transition text-center cursor-pointer ${
                activeTab === "pujas"
                  ? "bg-[#0B3C5D] text-[#F2B705] border-none shadow-[2px_2px_0px_rgba(11,60,93,0.2)] font-black"
                  : "bg-blue-50 text-blue-950 border-blue-200 hover:bg-blue-100 shadow-[1px_1px_0px_rgba(26,26,26,0.3)]"
              }`}
            >
              🔱 Pujas
            </button>
            <button
              id="tab-book"
              onClick={() => setActiveTab("book")}
              className={`py-2 px-0.5 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-sm border transition text-center cursor-pointer ${
                activeTab === "book"
                  ? "bg-[#0B3C5D] text-[#F2B705] border-none shadow-[2px_2px_0px_rgba(11,60,93,0.2)] font-black"
                  : "bg-[#F2B705] text-[#1a1a1a] border-[#1a1a1a] hover:bg-[#dca204] shadow-[1px_1px_0px_rgba(26,26,26,0.5)]"
              }`}
            >
              🗓️ Booking
            </button>
          </div>

          {/* TAB 0: ASTROLOGY INSIGHTS HUB */}
          {activeTab === "insights-hub" && (
            <AstrologyHub />
          )}


          {/* TAB 1: 27 NAKSHATRAS ENCYCLOPEDIA */}
          {activeTab === "nakshatras" && (
            <div className="space-y-6 text-left">
              <div className="bg-white rounded-md border-2 border-editorial-ink shadow-[8px_8px_0px_rgba(26,26,26,0.06)] overflow-hidden">
                <div className="bg-[#0B3C5D] text-white p-5 border-b-2 border-editorial-ink relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="font-serif font-bold text-base md:text-lg flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#F2B705] fill-[#F2B705]/20 animate-pulse" />
                      The 27 Sacred Nakshatras (Lunar Mansions)
                    </h4>
                    <p className="text-xs text-indigo-100 mt-1">Explore precise coordinates, ruling deities, cosmic signatures, and specific ritual remedies for all 27 birth stars.</p>
                  </div>
                  <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
                    <Compass className="w-32 h-32 text-white animate-[spin_40s_linear_infinite]" />
                  </div>
                </div>

                <div className="p-5 space-y-5 bg-white">
                  {/* Search and Filters panel */}
                  <div className="flex flex-col gap-4 border-b border-stone-100 pb-5">
                    <div className="relative w-full">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search by Nakshatra Name, deity, ruling planet, or star sign span..."
                        value={nakshatraSearch}
                        onChange={(e) => setNakshatraSearch(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-sm border-2 border-editorial-ink text-xs focus:ring-1 focus:ring-[#0B3C5D] placeholder:text-slate-400 font-sans"
                      />
                      {nakshatraSearch && (
                        <button
                          onClick={() => setNakshatraSearch("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Filter by Ruling Planet */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        Filter by Planet Ruler:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {["All", "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"].map((ruler) => (
                          <button
                            key={ruler}
                            onClick={() => setSelectedRulerFilter(ruler)}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-sm border transition cursor-pointer ${
                              selectedRulerFilter === ruler
                                ? "bg-[#0B3C5D] text-white border-[#0B3C5D] font-bold"
                                : "bg-stone-50 border-stone-200 text-slate-600 hover:bg-stone-100"
                            }`}
                          >
                            {ruler}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Filter by Gana */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          Filter by Gana (Temperament):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {["All", "Deva", "Manushya", "Rakshasa"].map((gana) => (
                            <button
                              key={gana}
                              onClick={() => setSelectedGanaFilter(gana)}
                              className={`px-2.5 py-1 text-[11px] font-semibold rounded-sm border transition cursor-pointer ${
                                selectedGanaFilter === gana
                                  ? "bg-slate-900 text-white border-slate-900 font-bold"
                                  : "bg-stone-50 border-stone-200 text-slate-600 hover:bg-stone-100"
                              }`}
                            >
                              {gana}
                            </button>
                          ))}
                        </div>
                      </div>

                      {(nakshatraSearch || selectedRulerFilter !== "All" || selectedGanaFilter !== "All") && (
                        <button
                          onClick={() => {
                            setNakshatraSearch("");
                            setSelectedRulerFilter("All");
                            setSelectedGanaFilter("All");
                          }}
                          className="self-end sm:self-auto flex items-center gap-1 text-[11px] font-bold text-editorial-accent hover:underline cursor-pointer py-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Clear All Filters
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Nakshatras Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getFilteredNakshatras().map((nakshatra) => {
                      const isExpanded = selectedNakshatraId === nakshatra.id;
                      return (
                        <div
                          key={nakshatra.id}
                          id={`nakshatra-card-${nakshatra.id}`}
                          onClick={() => setSelectedNakshatraId(isExpanded ? null : nakshatra.id)}
                          className={`bg-white border-2 rounded-sm transition-all duration-200 p-4 flex flex-col justify-between text-left gap-3 cursor-pointer hover:border-[#0B3C5D] relative overflow-hidden ${
                            isExpanded
                              ? "border-[#0B3C5D] ring-1 ring-[#0B3C5D]/10 bg-slate-50/50 shadow-[4px_4px_12px_rgba(11,60,93,0.08)]"
                              : "border-editorial-ink/30 shadow-[3px_3px_0px_rgba(26,26,26,0.03)] hover:shadow-[4px_4px_0px_rgba(26,26,26,0.06)]"
                          }`}
                        >
                          {/* Card Header */}
                          <div className="flex justify-between items-start border-b border-dashed border-stone-100 pb-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded-sm">
                                  {nakshatrasDataList.findIndex((n) => n.id === nakshatra.id) + 1}/27
                                </span>
                                <h5 className="font-serif font-black text-slate-900 text-base flex items-center gap-1.5">
                                  {nakshatra.name}
                                  <span className="text-editorial-accent font-normal italic text-xs font-sans">
                                    ({nakshatra.sanskritName})
                                  </span>
                                </h5>
                              </div>
                              <p className="text-[10px] text-slate-500 font-semibold mt-1 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full inline-block"></span>
                                {nakshatra.span}
                              </p>
                            </div>
                            
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-sm bg-[#F2B705]/10 border border-[#F2B705]/30 text-amber-950 font-extrabold shadow-sm">
                              {nakshatra.ruler}
                            </span>
                          </div>

                          {/* Attributes Table Grid */}
                          <div className="grid grid-cols-2 gap-2 text-[11px] font-sans text-slate-700 bg-white/60 p-2.5 rounded-sm border border-stone-100">
                            <div>
                              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Deity Presence:</span>
                              <span className="font-medium text-slate-800">{nakshatra.deity.split(" (")[0]}</span>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Cosmic Symbol:</span>
                              <span className="font-medium text-slate-800">{nakshatra.symbol}</span>
                            </div>
                            <div className="mt-1">
                              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Gana (Nature):</span>
                              <span className={`px-1.5 py-0.2 rounded-full font-bold text-[9px] ${
                                nakshatra.gana === "Deva" ? "bg-emerald-50 text-emerald-800 border border-emerald-100" :
                                nakshatra.gana === "Manushya" ? "bg-amber-50 text-amber-800 border border-amber-100" :
                                "bg-rose-50 text-rose-800 border border-rose-100"
                              }`}>{nakshatra.gana}</span>
                            </div>
                            <div className="mt-1">
                              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Mahabhuta Element:</span>
                              <span className="font-medium text-slate-800">{nakshatra.element}</span>
                            </div>
                          </div>

                          {/* Expanded detail pane on select */}
                          {isExpanded ? (
                            <div className="space-y-4 pt-2 border-t border-stone-200 mt-2 text-xs text-left">
                              <div className="space-y-1 bg-[#0B3C5D]/5 p-2.5 rounded-sm border border-[#0B3C5D]/10">
                                <span className="text-[9px] uppercase font-bold text-[#0B3C5D] font-mono tracking-wider block">Spiritual Totem Animal:</span>
                                <p className="font-medium text-slate-900 flex items-center gap-1">
                                  🐾 {nakshatra.animal}
                                </p>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[9px] uppercase font-bold text-editorial-accent font-mono tracking-wider block">Key Stellar Characteristics:</span>
                                <p className="text-slate-800 leading-relaxed font-sans">{nakshatra.characteristics}</p>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[9px] uppercase font-bold text-emerald-800 font-mono tracking-wider block">Sacred Initiatives / Best For:</span>
                                <p className="text-slate-800 leading-relaxed font-sans">{nakshatra.bestUse}</p>
                              </div>

                              <div className="bg-emerald-50/50 p-2.5 rounded-sm border border-emerald-200/50 space-y-1 relative">
                                <span className="text-[9px] uppercase font-bold text-emerald-950 font-mono tracking-wider block">Divine Root Seed Mantra chanting:</span>
                                <p className="font-serif font-extrabold text-[#0B3C5D] italic text-xs">
                                  &quot;{nakshatra.mantra}&quot;
                                </p>
                              </div>

                              <button
                                className="w-full text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 pt-1 flex items-center justify-center gap-1 cursor-pointer font-sans"
                              >
                                Collapse Details ▲
                              </button>
                            </div>
                          ) : (
                            <div className="text-center text-[10px] font-bold text-[#0B3C5D] uppercase tracking-wider hover:underline flex items-center justify-center gap-1 fn-sans">
                              View Detailed Astrology Profile <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {getFilteredNakshatras().length === 0 && (
                      <div className="col-span-1 md:col-span-2 p-8 text-center bg-stone-50 border border-dashed border-stone-200 rounded-sm">
                        <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <h6 className="font-sans font-bold text-slate-700 text-sm">No Celestial Alignments Matching Active Filters</h6>
                        <p className="text-xs text-slate-500 mt-1">Try resetting the keyword query or selecting "All" rulers.</p>
                        <button
                          onClick={() => {
                            setNakshatraSearch("");
                            setSelectedRulerFilter("All");
                            setSelectedGanaFilter("All");
                          }}
                          className="mt-3 text-xs font-bold uppercase tracking-widest bg-editorial-ink text-white px-4 py-2 rounded-sm border-2 border-editorial-ink cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOROSCOPES & NUMEROLOGY */}
          {activeTab === "horoscope" && (
            <div className="space-y-6 text-left">
              
              {/* Daily Zodiac forecasts */}
              <div className="bg-white rounded-md border-2 border-editorial-ink shadow-[8px_8px_0px_rgba(26,26,26,0.06)] overflow-hidden">
                <div className="bg-editorial-spirit text-white p-4 border-b-2 border-editorial-ink">
                  <h4 className="font-serif font-bold text-sm md:text-base flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-editorial-accent fill-white/10" />
                    Twelve Zodiac Rashis (Universal Guidance)
                  </h4>
                  <p className="text-[10px] text-indigo-100">Authentic Nakshatra transit commentaries</p>
                </div>

                <div className="p-5 space-y-6 bg-white">
                  {/* Select Zodiac icon grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {zodiacSigns.map((z) => (
                      <button
                        key={z.id}
                        onClick={() => setSelectedZodiac(z)}
                        className={`p-2.5 rounded-sm border-2 flex flex-col items-center gap-1 transition duration-150 cursor-pointer shadow-[2px_2px_0px_rgba(26,26,26,0.05)] ${
                          selectedZodiac.id === z.id
                            ? "bg-editorial-ink text-white border-editorial-ink shadow-[2px_2px_0px_rgba(67,56,202,0.15)]"
                            : "bg-white hover:bg-stone-50 border-editorial-ink/30 text-editorial-ink"
                        }`}
                      >
                        <span className="text-xl">{z.symbol}</span>
                        <span className="text-[10px] font-bold">{z.name}</span>
                        <span className="text-[8px] opacity-75 font-serif">{z.sanskritName}</span>
                      </button>
                    ))}
                  </div>

                  {/* Period selection */}
                  <div className="flex bg-editorial-bg p-1 rounded-sm border border-editorial-ink/30">
                    {(["daily", "weekly", "monthly"] as const).map((period) => (
                      <button
                        key={period}
                        onClick={() => setHoroscopePeriod(period)}
                        className={`flex-1 text-center py-1.5 rounded-sm text-xs font-bold capitalize transition duration-150 cursor-pointer ${
                          horoscopePeriod === period
                            ? "bg-editorial-ink text-white shadow-[1px_1px_0px_rgba(26,26,26,0.1)] font-bold"
                            : "text-slate-600 hover:text-[#4338ca] hover:bg-white"
                        }`}
                      >
                        {period} Read
                      </button>
                    ))}
                  </div>

                  {/* Active selected card reading */}
                  <div className="border-2 border-editorial-ink bg-white rounded-sm p-4 space-y-3 shadow-[4px_4px_0px_rgba(26,26,26,0.04)]">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-stone-100 pb-2 gap-2">
                      <div>
                        <h4 className="text-base font-serif font-bold text-editorial-spirit flex items-center gap-1.5">
                          <span className="text-2xl">{selectedZodiac.symbol}</span>
                          {selectedZodiac.name} ({selectedZodiac.sanskritName}) Forecast
                        </h4>
                        <p className="text-[11px] text-slate-600 font-sans">
                          Ruling Planet: <span className="font-bold text-editorial-accent">{selectedZodiac.ruler}</span> | Element: {selectedZodiac.element}
                        </p>
                      </div>

                      <div className="bg-editorial-accent/15 text-editorial-accent text-[10px] font-mono font-bold px-2.5 py-1 rounded-sm border border-editorial-accent/25 uppercase shadow-sm">
                        Lucky No: {selectedZodiac.luckyNumber} | Color: {selectedZodiac.luckyColor}
                      </div>
                    </div>

                    <p className="text-xs md:text-sm text-slate-800 leading-relaxed font-sans">
                      {horoscopePeriod === "daily" && selectedZodiac.dailyForecast}
                      {horoscopePeriod === "weekly" && selectedZodiac.weeklyForecast}
                      {horoscopePeriod === "monthly" && selectedZodiac.monthlyForecast}
                    </p>

                    <div className="bg-editorial-bg border border-editorial-ink/20 p-2.5 rounded-sm">
                      <span className="text-[9px] font-bold text-slate-400 font-mono tracking-wider block mb-1">
                        SACRED RASHI MANTRA
                      </span>
                      <p className="text-xs font-serif font-bold text-editorial-spirit italic">
                        &quot;{selectedZodiac.mantra}&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pythagorean Numerology engine */}
              <div className="bg-white rounded-md border-2 border-editorial-ink shadow-[8px_8px_0px_rgba(26,26,26,0.06)] overflow-hidden">
                <div className="bg-editorial-spirit text-white p-4 border-b-2 border-editorial-ink">
                  <h4 className="font-serif font-bold text-sm md:text-base flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-editorial-accent fill-white/10" />
                    Chaldean & Pythagorean Numerology
                  </h4>
                  <p className="text-[10px] text-indigo-100">Determine your Soul Blueprint, Life Path & Destiny</p>
                </div>

                <div className="p-5 space-y-4">
                  {/* Two inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-700">Full Name (English letters)</label>
                      <input
                        type="text"
                        value={numName}
                        onChange={(e) => setNumName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-editorial-bg text-xs border border-editorial-ink rounded-sm px-3 py-2 outline-none focus:ring-1 focus:ring-editorial-accent font-semibold text-editorial-ink"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-700">Date of Birth</label>
                      <input
                        type="date"
                        value={numDob}
                        onChange={(e) => setNumDob(e.target.value)}
                        className="w-full bg-editorial-bg text-xs border border-editorial-ink rounded-sm px-3 py-2 outline-none focus:ring-1 focus:ring-editorial-accent font-mono text-editorial-ink"
                      />
                    </div>
                  </div>

                  {numerologyResult && (
                    <div className="bg-editorial-bg p-4 rounded-sm border border-editorial-ink/30 space-y-4 shadow-inner">
                      {/* Numbers badges flex */}
                      <div className="grid grid-cols-3 gap-2.5 text-center">
                        <div className="bg-white text-editorial-ink border border-editorial-ink p-2.5 rounded-sm shadow-[2px_2px_0px_rgba(26,26,26,0.1)]">
                          <span className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500">
                            Life Path
                          </span>
                          <span className="text-2xl font-serif font-black text-editorial-spirit">
                            {numerologyResult.lifePath}
                          </span>
                        </div>
                        <div className="bg-editorial-accent/15 text-editorial-accent border border-editorial-accent/30 p-2.5 rounded-sm shadow-[2px_2px_0px_rgba(180,83,9,0.12)]">
                          <span className="block text-[10px] uppercase font-mono font-bold tracking-wider text-amber-900/80">
                            Destiny
                          </span>
                          <span className="text-2xl font-serif font-black">
                            {numerologyResult.destiny}
                          </span>
                        </div>
                        <div className="bg-white text-editorial-spirit border-2 border-editorial-spirit p-2.5 rounded-sm shadow-[2px_2px_0px_rgba(67,56,202,0.1)]">
                          <span className="block text-[10px] uppercase font-mono font-bold tracking-wider text-indigo-900/80">
                            Soul Urge
                          </span>
                          <span className="text-2xl font-serif font-black text-editorial-spirit">
                            {numerologyResult.soulUrge}
                          </span>
                        </div>
                      </div>

                      {/* Numerology archetype alignment */}
                      <div className="text-left space-y-1">
                        <span className="text-[10px] font-bold text-editorial-accent font-mono tracking-wider uppercase">
                          Celestial Archetype
                        </span>
                        <h4 className="text-sm font-serif font-bold text-editorial-spirit">
                          {numerologyResult.vibe}
                        </h4>
                        <p className="text-xs text-slate-800 leading-relaxed font-sans mt-1">
                          {numerologyResult.details}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VASTU & REMEDIES PANEL */}
          {activeTab === "vastu" && (
            <div className="space-y-6 text-left">
              
              {/* Educational Vastu Tips */}
              <div className="bg-white rounded-md border-2 border-editorial-ink shadow-[8px_8px_0px_rgba(26,26,26,0.06)] overflow-hidden">
                <div className="bg-editorial-spirit text-white p-4 border-b-2 border-editorial-ink">
                  <h4 className="font-serif font-bold text-sm md:text-base flex items-center gap-2">
                    <Compass className="w-5 h-5 text-editorial-accent fill-white/10" />
                    Vastu Shastra Rectification Kit
                  </h4>
                  <p className="text-[10px] text-indigo-100">Harmonize architectural layouts to balance Pancha Bhoota elements</p>
                </div>

                <div className="p-5 space-y-4">
                  {/* Visual selectors of Rooms */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {vastuTipsDataList.map((tip, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedVastuRoom(tip)}
                        className={`p-2.5 rounded-sm border text-center transition cursor-pointer text-xs font-bold shadow-[1px_1px_0px_rgba(26,26,26,0.05)] ${
                          selectedVastuRoom.room === tip.room
                            ? "bg-editorial-ink text-white border-editorial-ink shadow-[2px_2px_0px_rgba(67,56,202,0.15)]"
                            : "bg-editorial-bg hover:bg-white text-editorial-ink border border-editorial-ink/30"
                        }`}
                      >
                        {tip.room.split(" ")[0]}
                      </button>
                    ))}
                  </div>

                  {/* Tips details box */}
                  <div className="bg-editorial-bg p-4 rounded-sm border border-editorial-ink/30 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between border-b pb-1.5 border-stone-200">
                      <span className="text-sm font-serif font-bold text-editorial-spirit">{selectedVastuRoom.room}</span>
                      <span className="text-[10px] font-bold font-mono bg-editorial-accent/15 text-editorial-accent px-2.5 py-1 border border-editorial-accent/20 rounded-sm">
                        Auspicious Direction: {selectedVastuRoom.direction}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="text-xs">
                        <span className="font-bold text-rose-700 flex items-center gap-1 uppercase tracking-wider text-[10px] font-mono">
                          <AlertTriangle className="w-3.5 h-3.5 fill-rose-100" /> Latent Dosha (Defect Effects):
                        </span>
                        <p className="text-slate-800 mt-1 leading-relaxed font-sans">{selectedVastuRoom.dosha}</p>
                      </div>

                      <div className="text-xs bg-white p-3 rounded-sm border-2 border-editorial-ink shadow-[3px_3px_0px_rgba(26,26,26,0.05)]">
                        <span className="font-bold text-editorial-spirit flex items-center gap-1 font-serif text-sm">
                          ✨ Acharya&apos;s Shanti Remedy:
                        </span>
                        <p className="text-slate-800 mt-1 leading-relaxed font-sans font-bold text-xs">{selectedVastuRoom.remedy}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gemstone prescriptions */}
              <div className="bg-white rounded-md border-2 border-editorial-ink shadow-[8px_8px_0px_rgba(26,26,26,0.06)] overflow-hidden">
                <div className="bg-editorial-spirit text-white p-4 border-b-2 border-editorial-ink">
                  <h4 className="font-serif font-bold text-sm md:text-base flex items-center gap-2">
                    <Gem className="w-5 h-5 text-editorial-accent fill-white/10" />
                    Pranic Gemstone advisory prescriptive
                  </h4>
                  <p className="text-[10px] text-indigo-100">Natural minerals certified to re-align subtle energy blockages</p>
                </div>

                <div className="p-5 space-y-4">
                  {/* Category toggler */}
                  <div className="flex flex-wrap gap-2 border-b pb-3.5 border-stone-100">
                    {["Career Growth", "Financial Success", "Health & Protection", "Auspicious Marriage"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedGemCategory(cat)}
                        className={`px-3 py-1.5 rounded-sm text-xs font-bold cursor-pointer transition duration-150 ${
                          selectedGemCategory === cat
                            ? "bg-editorial-ink text-white border-2 border-editorial-ink shadow-[2px_2px_0px_rgba(67,56,202,0.15)]"
                            : "bg-white border border-editorial-ink/30 text-slate-700 hover:bg-stone-50"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Gem card lists Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {getFilteredGemstones().map((gem) => (
                      <div key={gem.name} className="border-2 border-editorial-ink p-3 rounded-sm hover:shadow-[6px_6px_0px_rgba(26,26,26,0.06)] transition duration-150 bg-white flex gap-3 text-xs shadow-[3px_3px_0px_rgba(26,26,26,0.04)]">
                        <img
                          src={gem.image}
                          alt={gem.name}
                          className="w-16 h-16 rounded-sm object-cover bg-stone-50 border border-editorial-ink shrink-0 self-center shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-1 block max-w-full overflow-hidden text-left flex-1">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="font-serif font-bold text-editorial-spirit tracking-tight text-xs leading-none">{gem.name} ({gem.sanskritName})</span>
                            <span className="bg-editorial-accent/15 text-editorial-accent border border-editorial-accent/20 font-bold font-mono text-[9px] px-1.5 py-0.5 rounded-sm shrink-0 uppercase">
                              {gem.planet.split(" ")[0]}
                            </span>
                          </div>
                          
                          <p className="text-[10px] text-slate-600 font-sans italic border-b border-stone-100 pb-1">
                            Metal: {gem.metal} | Wear on {gem.finger}
                          </p>

                          <div className="text-[10px] text-slate-800 space-y-0.5">
                            <span className="font-bold text-editorial-ink">Blessings:</span>
                            <ul className="list-disc pl-3 text-slate-800 space-y-0.5">
                              {gem.benefits.slice(0, 2).map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-editorial-bg p-1.5 rounded-sm font-serif text-[10px] text-editorial-accent leading-tight border border-editorial-ink/25 font-semibold">
                            🎤 <strong>Mantra:</strong> &quot;{gem.mantra.split(" (")[0]}&quot;
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Gemstone warning precaution box */}
                  <div className="bg-white border-2 border-editorial-accent/60 p-4 rounded-sm text-xs text-amber-900 shadow-[6px_6px_0px_rgba(180,83,9,0.03)] space-y-1">
                    <h5 className="font-bold text-editorial-accent font-serif flex items-center gap-1 uppercase tracking-wider text-[11px]">
                      ⚠️ Rigorous Warnings & Guidelines
                    </h5>
                    <p className="leading-relaxed font-sans text-stone-800">
                      Never pair Ruby (Sun) with Blue Sapphire (Saturn), or Diamond with Emerald together. Gemstones emit deep vibrational currents; checking structural compatibility with an expert Acharya or via live meeting is highly recommended prior to wearing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CERTIFIED SCHEDULER */}
          {activeTab === "book" && (
            <div className="space-y-6 text-left">
              <AstroBookingFlow />
            </div>
          )}

          {/* TAB 5: SACRED MANTRAS PORTAL */}
          {activeTab === "mantras" && (
            <div className="space-y-6 text-left animate-fade-in">
              <AstroMantras />
            </div>
          )}

          {/* TAB 6: VEDIC PUJAS AND DOSH SHANTI SANCTUARY */}
          {activeTab === "pujas" && (
            <div className="space-y-6 text-left animate-fade-in">
              <AstroPujas />
            </div>
          )}

          {/* TEMPORARY DISMISSED OLD BILLING SYSTEM */}
          {false && activeTab === "book" && (
            <div className="space-y-6 text-left">
              
              {!activeBooking ? (
                /* Interactive booking Form */
                <div className="bg-white rounded-md border-2 border-editorial-ink shadow-[8px_8px_0px_rgba(26,26,26,0.06)] overflow-hidden">
                  <div className="bg-editorial-spirit text-white p-4 border-b-2 border-editorial-ink">
                    <h4 className="font-serif font-bold text-sm md:text-base flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-editorial-accent fill-white/10" />
                      Schedule Certified Astrologer Consultation
                    </h4>
                    <p className="text-[10px] text-indigo-100">Provide details to schedule an offline face-to-face consultation (Call +91 8806510889 any time)</p>
                  </div>

                  <form onSubmit={handleBookingSubmit} className="p-5 space-y-6">
                    
                    {/* Astro selection grid */}
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-700 block">
                        Select Certified Jyotish Guru:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {astrolgersData.map((astro) => (
                          <div
                            key={astro.id}
                            onClick={() => setBookingForm({ ...bookingForm, selectedAstroId: astro.id })}
                            className={`p-3.5 rounded-sm border transition duration-150 cursor-pointer text-xs space-y-2 relative flex flex-col justify-between shadow-[2px_2px_0px_rgba(26,26,26,0.04)] ${
                              bookingForm.selectedAstroId === astro.id
                                ? "bg-editorial-bg border-editorial-accent border-2 shadow-[2px_2px_0px_rgba(180,83,9,0.12)]"
                                : "bg-white hover:bg-stone-50 border-editorial-ink/30"
                            } ${astro.id === "astro-aanna" ? "ring-1 ring-amber-500/20" : ""}`}
                          >
                            <div className="flex gap-2">
                              <img
                                src={astro.id === "astro-aanna" ? founderPhoto : astro.image}
                                alt={astro.name}
                                className="w-10 h-10 rounded-sm object-cover shrink-0 bg-stone-100 border border-editorial-ink/20"
                                referrerPolicy="no-referrer"
                              />
                              <div className="text-left leading-tight min-w-0 flex-1">
                                <div className="flex items-center gap-1 flex-wrap">
                                  <h5 className="font-serif font-bold text-editorial-spirit truncate max-w-[100px]" title={astro.name}>
                                    {astro.name}
                                  </h5>
                                  {astro.id === "astro-aanna" && (
                                    <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[8px] px-1 py-0.2 rounded-xs font-bold uppercase tracking-wider scale-90 whitespace-nowrap">
                                      Founder
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-500 block font-sans truncate max-w-full" title={astro.title}>
                                  {astro.title}
                                </span>
                              </div>
                            </div>

                            <p className="text-[10px] text-slate-600 border-t pt-1.5 border-stone-200 leading-relaxed max-w-full overflow-hidden" title={astro.specialization}>
                              <span className="font-medium">Exp:</span> {astro.experience} <br />
                              <span className="text-[9px] line-clamp-2" title={astro.specialization}>{astro.specialization}</span>
                            </p>

                            <div className="flex items-center justify-between bg-editorial-bg border border-editorial-ink/10 p-1 px-1.5 rounded-sm text-slate-700 font-mono text-[10px]">
                              <span>Fee:</span>
                              <span className="font-bold text-editorial-accent font-sans">₹{astro.consultationFee}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Inputs fields splits */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1 text-xs">
                        <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700">Full Client Name</label>
                        <div className="relative">
                          <User className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={bookingForm.name}
                            onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                            placeholder="Rahul Kumar Sharma"
                            className="w-full bg-editorial-bg border border-editorial-ink rounded-sm pl-9 pr-3 py-2 outline-none focus:ring-1 focus:ring-editorial-accent text-editorial-ink font-semibold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700">Contact Mobile Number</label>
                        <div className="relative">
                          <Phone className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                          <input
                            type="tel"
                            required
                            value={bookingForm.contactNumber}
                            onChange={(e) => setBookingForm({ ...bookingForm, contactNumber: e.target.value })}
                            placeholder="+91 8806510889"
                            className="w-full bg-editorial-bg border border-editorial-ink rounded-sm pl-9 pr-3 py-2 outline-none focus:ring-1 focus:ring-editorial-accent text-editorial-ink font-semibold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 text-xs sm:col-span-2">
                        <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700">Email Address (For Secure Razorpay Ticket & Invoice)</label>
                        <div className="relative">
                          <Mail className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                          <input
                            type="email"
                            required
                            value={bookingForm.email}
                            onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                            placeholder="rahul.sharma@gmail.com"
                            className="w-full bg-editorial-bg border border-editorial-ink rounded-sm pl-9 pr-3 py-2 outline-none focus:ring-1 focus:ring-editorial-accent text-editorial-ink font-semibold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700">Day of Birth</label>
                        <input
                          type="date"
                          required
                          value={bookingForm.dob}
                          onChange={(e) => setBookingForm({ ...bookingForm, dob: e.target.value })}
                          className="w-full bg-editorial-bg border border-editorial-ink rounded-sm px-3 py-2 outline-none focus:ring-1 focus:ring-editorial-accent text-editorial-ink font-mono"
                        />
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700">Second/Time of Birth</label>
                        <input
                          type="time"
                          required
                          value={bookingForm.tob}
                          onChange={(e) => setBookingForm({ ...bookingForm, tob: e.target.value })}
                          className="w-full bg-editorial-bg border border-editorial-ink rounded-sm px-3 py-2 outline-none focus:ring-1 focus:ring-editorial-accent text-editorial-ink font-mono"
                        />
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700">Exact City (Place of Birth)</label>
                        <div className="relative">
                          <MapPin className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={bookingForm.pob}
                            onChange={(e) => setBookingForm({ ...bookingForm, pob: e.target.value })}
                            placeholder="Varanasi, UP, India"
                            className="w-full bg-editorial-bg border border-editorial-ink rounded-sm pl-9 pr-3 py-2 outline-none focus:ring-1 focus:ring-editorial-accent text-editorial-ink font-semibold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700">Preferred Consultation Date</label>
                        <input
                          type="date"
                          required
                          value={bookingForm.preferredDate}
                          onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                          className="w-full bg-editorial-bg border border-editorial-ink rounded-sm px-3 py-2 outline-none focus:ring-1 focus:ring-editorial-accent text-editorial-ink font-mono"
                        />
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700">Preferred Time Slot (Strictly 60-Min Each)</label>
                        <select
                          value={bookingForm.preferredSlot}
                          onChange={(e) => setBookingForm({ ...bookingForm, preferredSlot: e.target.value })}
                          className="w-full bg-editorial-bg border border-editorial-ink rounded-sm px-3 py-2.5 outline-none focus:ring-1 focus:ring-editorial-accent text-xs font-semibold text-editorial-ink font-mono"
                        >
                          <option value="Slot 1 (09:00 AM - 10:00 AM)">Slot 1 (09:00 AM - 10:00 AM)</option>
                          <option value="Slot 2 (11:00 AM - 12:00 PM)">Slot 2 (11:00 AM - 12:00 PM)</option>
                          <option value="Slot 3 (02:00 PM - 03:00 PM)">Slot 3 (02:00 PM - 03:00 PM)</option>
                          <option value="Slot 4 (04:30 PM - 05:30 PM)">Slot 4 (04:30 PM - 05:30 PM)</option>
                          <option value="Slot 5 (07:00 PM - 08:00 PM)">Slot 5 (07:00 PM - 08:00 PM)</option>
                        </select>

                        {/* Interactive Slot Counter */}
                        {bookingForm.preferredDate && (
                          <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono font-bold bg-[#0B3C5D]/5 p-2 rounded-sm border border-[#0B3C5D]/10">
                            <span className="text-slate-500 uppercase">Daily Slots Taken:</span>
                            <span className={allBookings.filter(b => b.scheduled_at.startsWith(bookingForm.preferredDate)).length >= 5 ? "text-rose-600 font-extrabold" : "text-[#0B3C5D]"}>
                              {allBookings.filter(b => b.scheduled_at.startsWith(bookingForm.preferredDate)).length} / 5 sessions
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700">Consultation Type Axis</label>
                        <select
                          value={bookingForm.consultationType}
                          onChange={(e) => setBookingForm({ ...bookingForm, consultationType: e.target.value })}
                          className="w-full bg-editorial-bg border border-editorial-ink rounded-sm px-3 py-2.5 outline-none focus:ring-1 focus:ring-editorial-accent text-xs font-semibold text-editorial-ink"
                        >
                          <option value="Kundli">Kundli (Full Natal Life Alignment)</option>
                          <option value="Career">Career Progression & Abundance</option>
                          <option value="Marriage">Marriage Delay & Compatibility</option>
                          <option value="Health">Physical & Astral Body Protection</option>
                          <option value="Finance">Business Speculations & Wealth</option>
                          <option value="Numerology">Chaldean Numerology Mapping</option>
                        </select>
                      </div>

                    </div>

                    {bookingError && (
                      <p className="text-xs text-rose-600 font-bold">{bookingError}</p>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-editorial-ink hover:bg-editorial-spirit text-white font-bold py-3.5 px-4 rounded-sm border border-editorial-ink shadow-[4px_4px_0px_rgba(26,26,26,0.15)] transition duration-150 cursor-pointer flex items-center justify-center gap-1.5 active:translate-y-0.5"
                    >
                      <Zap className="w-4 h-4 text-editorial-accent fill-editorial-accent" />
                      Align Cosmic Consultation Now
                    </button>
                  </form>
                </div>
              ) : (
                /* High end Cosmic Journey Invoice summary and JSON */
                <div className="bg-white rounded-md border-2 border-editorial-ink shadow-[8px_8px_0px_rgba(26,26,26,0.06)] overflow-hidden space-y-6">
                  
                  {/* Summary receipt header */}
                  <div className="bg-editorial-spirit text-white p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-editorial-ink">
                    <div className="text-left space-y-1.5">
                      <span className="text-[9px] font-mono tracking-widest uppercase bg-editorial-accent text-white px-2.5 py-1 border border-editorial-accent rounded-sm font-bold shadow-sm inline-block">
                        Booking Status: Pending Payment
                      </span>
                      <h4 className="text-lg font-serif font-bold">Sacred Cosmic Session Scheduled</h4>
                      <p className="text-xs text-indigo-100">Appointment ID: <span className="font-mono text-white text-base underline font-black">{activeBooking.booking_id}</span></p>
                    </div>

                    {/* Countdown Clock */}
                    <div className="bg-white text-editorial-ink p-3 rounded-sm border border-editorial-ink shadow-[2px_2px_0px_rgba(26,26,26,0.1)] text-center font-mono shrink-0">
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 block mb-0.5 font-bold">Payment Deadline</span>
                      <div className="text-lg font-black text-editorial-spirit flex items-center justify-center gap-1.5">
                        <Clock className="w-4.5 h-4.5 text-editorial-accent fill-editorial-accent/5" />
                        <span>
                          {countdownMinutes.toString().padStart(2, "0")}:{countdownSeconds.toString().padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Details Body */}
                  <div className="px-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-editorial-bg p-4 rounded-sm border border-editorial-ink/30 text-xs text-left space-y-2 shadow-inner">
                      <h5 className="font-serif font-bold text-editorial-spirit border-b border-editorial-ink/20 pb-1 flex items-center gap-1 text-sm">Client Birth & Astrological Target</h5>
                      <p><span className="font-bold text-slate-600 block uppercase tracking-wider text-[9px] mb-0.5">Client Name</span> <span className="font-bold text-slate-900 text-sm">{activeBooking.client_name}</span></p>
                      <p><span className="font-semibold text-slate-600 uppercase tracking-wider text-[9px] mr-1">Scheduled Astro Slot:</span> <span className="font-bold text-slate-800">{activeBooking.scheduled_at}</span></p>
                      <p><span className="font-semibold text-slate-600 uppercase tracking-wider text-[9px] mr-1">Reason of Query:</span> <span className="font-bold text-slate-800">{activeBooking.consultation_type}</span></p>
                      <p><span className="font-semibold text-slate-600 uppercase tracking-wider text-[9px] mr-1">Session Expert:</span> <span className="font-bold text-slate-800 font-serif">{activeBooking.astrologer_name}</span></p>
                    </div>

                    <div className="bg-editorial-accent/10 border-2 border-editorial-accent/40 text-editorial-ink p-4 rounded-sm text-xs text-left space-y-2.5 shadow-sm">
                      <h5 className="font-serif font-bold text-amber-900 border-b border-editorial-accent/20 pb-1 text-sm">Financial Energy Balance Summary</h5>
                      <div className="flex justify-between">
                        <span className="text-stone-700 font-semibold">Total Consultation Fee:</span>
                        <span className="font-mono font-bold text-slate-900">INR {activeBooking.total_fee_inr}/-</span>
                      </div>
                      <div className="flex justify-between bg-white px-2 py-1.5 border border-editorial-accent/30 rounded-sm">
                        <span className="text-amber-900 font-extrabold">{activeBooking.advance_percentage}% Required Advance Charge:</span>
                        <span className="font-mono font-black text-editorial-accent">INR {activeBooking.advance_amount_inr}/-</span>
                      </div>
                      <p className="text-[10px] text-stone-700 leading-tight">
                        Note: To safeguard our guru&apos;s astral hours, a 30% advance is mandatory to secure the Panchanga slot. Remainder (70%) resides payable upon completion of meeting.
                      </p>
                    </div>
                  </div>

                  {/* RAZORPAY SECURE GATEWAY CHECKOUT PANEL */}
                  <div className="mx-5 bg-gradient-to-br from-[#0B3C5D]/5 to-white border-2 border-[#0B3C5D] p-5 rounded-sm flex flex-col gap-4 text-xs shadow-md">
                    <div className="flex items-center justify-between border-b pb-2.5 border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="p-1 bg-[#0B3C5D]/10 rounded-sm">
                          <ShieldCheck className="w-5 h-5 text-[#0B3C5D]" />
                        </span>
                        <div className="text-left">
                          <h5 className="font-serif font-black text-slate-900 text-sm">Official Razorpay Booking Gateway</h5>
                          <p className="text-[10px] text-slate-500 font-medium">Instant authentication via Card, Netbanking, UPI, Wallet</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono bg-amber-100 text-amber-950 border border-amber-200 px-2 py-0.5 rounded-sm font-black uppercase tracking-wider">
                        Secure
                      </span>
                    </div>

                    {paymentError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-rose-700 rounded-sm font-semibold text-xs leading-normal text-left">
                        ⚠️ {paymentError}
                      </div>
                    )}

                    {activeBooking.status === "confirmed" ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-sm font-sans flex flex-col items-center justify-center text-center space-y-1.5 shadow-sm">
                        <span className="p-1 px-2 bg-emerald-600 text-white rounded-full text-xs font-bold">
                          ✓ Paid
                        </span>
                        <h6 className="font-bold text-sm tracking-tight text-emerald-900">Celestial Consultation Confirmed!</h6>
                        <p className="text-xs leading-relaxed text-emerald-800 text-center">
                          Your custom geo-astral slot has been successfully scheduled and authenticated. Pathak Aanna will meet you on your preferred slot.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-3 rounded-sm border border-slate-200 shadow-inner gap-3">
                          <div className="text-left">
                            <span className="text-slate-500 uppercase font-mono text-[9px] block">30% Advance Slot Deposit:</span>
                            <span className="text-base font-black text-[#0B3C5D] font-mono">INR {activeBooking.advance_amount_inr}.00</span>
                          </div>
                          
                          <button
                            onClick={handleRazorpayPayment}
                            disabled={isPaying || isVerifying}
                            className="w-full sm:w-auto bg-[#0B3C5D] hover:bg-slate-950 text-[#F2B705] font-black py-2.5 px-5 rounded-sm border-2 border-editorial-ink shadow-[4px_4px_0px_rgba(26,26,26,1)] hover:shadow-none transition duration-150 active:translate-y-0.5 hover:text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-wider shrink-0"
                          >
                            {isPaying ? (
                              <>
                                <span className="animate-spin inline-block w-3 h-3 border-2 border-[#F2B705] border-t-transparent rounded-full" />
                                <span>Starting Secure Pay...</span>
                              </>
                            ) : isVerifying ? (
                              <>
                                <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                                <span>Verifying Token...</span>
                              </>
                            ) : (
                              <>
                                <Zap className="w-4 h-4 text-[#F2B705] fill-[#F2B705] animate-pulse" />
                                <span>Pay Securely with Razorpay</span>
                              </>
                            )}
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 text-center font-mono select-none">
                          <span>🛡️ 256-bit SSL Secure</span>
                          <span>•</span>
                          <span>⚡ Auto-activated slot</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Manual UPI fallback accordion */}
                  {activeBooking.status !== "confirmed" && (
                    <details className="mx-5 border border-editorial-ink/20 rounded-sm bg-white text-xs overflow-hidden">
                      <summary className="bg-slate-50 px-4 py-2.5 font-bold text-slate-700 cursor-pointer hover:bg-slate-100 transition select-none flex items-center justify-between">
                        <span>Alternative Option: Manual UPI Bank QR Code Transfer</span>
                        <span className="text-xs text-[#0B3C5D]">View QR</span>
                      </summary>
                      <div className="p-4 border-t border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-center">
                        <div className="w-20 h-20 bg-white border border-editorial-ink p-1 rounded-sm flex flex-col items-center justify-center shrink-0 shadow-sm">
                          <div className="grid grid-cols-5 gap-0.5 w-[64px] h-[64px]">
                            {[...Array(25)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-full h-full rounded-sm ${
                                  (i % 3 === 0 || i < 5 || i % 6 === 0) && i !== 12 ? "bg-slate-900" : "bg-white"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="text-left space-y-1.5 flex-1">
                          <h6 className="font-bold text-amber-950 text-xs">Direct UPI Node Link (Manual Verification Required):</h6>
                          <p className="text-slate-600 leading-normal text-[11px]">
                            Scan or copy transfer ID below:
                          </p>
                          <div className="bg-stone-50 border border-editorial-ink p-1.5 px-3 rounded-sm font-mono font-bold text-slate-800 shadow-sm inline-block select-all text-xs">
                            {activeBooking.upi_id}
                          </div>
                        </div>
                      </div>
                    </details>
                  )}

                  {/* Refund Policy Area */}
                  <div className="mx-5 border border-editorial-ink/20 bg-stone-50 p-4 rounded-sm text-left text-xs space-y-2.5">
                    <h5 className="font-bold text-editorial-spirit flex items-center gap-1 font-serif">
                      🛡️ Strict Cancellation Aura Refund Policy
                    </h5>
                    <div className="grid grid-cols-3 gap-2.5 text-center text-[11px] font-mono">
                      <div className="p-1 px-1.5 bg-white text-emerald-800 rounded-sm border border-emerald-600 shadow-sm">
                        <strong className="text-[10px]">&gt;24 hrs before</strong>
                        <span className="block font-bold">100% refund</span>
                      </div>
                      <div className="p-1 px-1.5 bg-white text-amber-900 rounded-sm border border-amber-600 shadow-sm">
                        <strong className="text-[10px]">&gt;12 hrs before</strong>
                        <span className="block font-bold">50% refund</span>
                      </div>
                      <div className="p-1 px-1.5 bg-white text-rose-800 rounded-sm border border-rose-600 shadow-sm">
                        <strong className="text-[10px]">&lt;2 hrs before</strong>
                        <span className="block font-bold">No refund</span>
                      </div>
                    </div>
                  </div>

                  {/* Exact requested raw JSON Block output */}
                  <div className="mx-5 bg-stone-900 p-4 rounded-sm text-left border border-editorial-ink font-mono">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <FileCheck className="w-4 h-4 text-emerald-400" /> Confirmational Booking JSON String
                      </span>

                      <button
                        onClick={copyInvoiceText}
                        className="text-[10px] text-amber-400 font-bold hover:text-white transition flex items-center gap-1 cursor-pointer"
                      >
                        {copiedInvoiceJson ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Copied Json Block!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy JSON
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="text-emerald-400 text-[10px] md:text-xs font-mono overflow-auto select-all max-h-[190px] leading-tight select-all selection:bg-slate-800">
                      {JSON.stringify(activeBooking, null, 2)}
                    </pre>
                  </div>

                  {/* Actions buttons invoice footer */}
                  <div className="p-5 border-t border-stone-100 flex flex-col sm:flex-row gap-3 justify-between items-center text-left">
                    <button
                      onClick={cancelActiveBooking}
                      className="text-xs text-rose-700 hover:text-rose-800 font-bold border border-rose-700/30 bg-white px-3 py-1.5 hover:bg-rose-50 transition rounded-sm cursor-pointer"
                    >
                      ↩️ Reset / Cancel Appointment Consultation
                    </button>

                    <div className="flex items-center gap-1.5 text-editorial-ink font-serif font-bold text-xs bg-editorial-bg p-2 px-3 border border-editorial-ink/30 rounded-sm shadow-sm">
                      {activeBooking.confirmation_message}
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

        </section>

      </main>

      {/* FREQUENTLY ASKED CELESTIAL QUESTIONS */}
      <AstroFaq />

      {/* Educational branding/trust indicators */}
      <section className="bg-white border-t-2 border-editorial-ink mt-12 py-10 px-4 md:px-8 text-center text-xs">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-sm bg-editorial-bg border border-editorial-ink/30 space-y-1.5 shadow-[4px_4px_0px_rgba(26,26,26,0.05)] text-left">
              <span className="text-lg">🏆</span>
              <h5 className="font-serif font-bold text-editorial-spirit">100% Certified Gurus</h5>
              <p className="text-slate-600 text-[11px] leading-snug">Strictly verified credentials & Sanskrit degrees.</p>
            </div>
            <div className="p-4 rounded-sm bg-editorial-bg border border-editorial-ink/30 space-y-1.5 shadow-[4px_4px_0px_rgba(26,26,26,0.05)] text-left">
              <span className="text-lg">☀️</span>
              <h5 className="font-serif font-bold text-editorial-spirit">Sayana Astrology</h5>
              <p className="text-slate-600 text-[11px] leading-snug">Aligns calculations directly to geo-ephemeris data.</p>
            </div>
            <div className="p-4 rounded-sm bg-editorial-bg border border-editorial-ink/30 space-y-1.5 shadow-[4px_4px_0px_rgba(26,26,26,0.05)] text-left">
              <span className="text-lg">🔒</span>
              <h5 className="font-serif font-bold text-editorial-spirit">Secure Consults</h5>
              <p className="text-slate-600 text-[11px] leading-snug">No third party leaks, keeping private bio-data protected.</p>
            </div>
            <div className="p-4 rounded-sm bg-editorial-bg border border-editorial-ink/30 space-y-1.5 shadow-[4px_4px_0px_rgba(26,26,26,0.05)] text-left">
              <span className="text-lg">🙏</span>
              <h5 className="font-serif font-bold text-editorial-spirit">Shanti Remedies</h5>
              <p className="text-slate-600 text-[11px] leading-snug">Ethical Vedic practices with zero fear-mongering.</p>
            </div>
          </div>

          <div className="border-t border-stone-200 pt-6 max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center text-slate-500 text-[11px] gap-4">
            <p>&copy; 2026 pathakaanna @ Pathak Aanna. Powered by NakshatraAI. All celestial remedies guided by pure Sanatana values.</p>
            <div className="flex gap-4">
              <span className="hover:text-slate-800 hover:underline cursor-pointer">Terms of Service</span>
              <span className="hover:text-slate-800 hover:underline cursor-pointer">Cancellation Policy</span>
              <span className="hover:text-slate-800 hover:underline cursor-pointer">Privacy Blueprint</span>
            </div>
          </div>
        </div>
      </section>

      {/* PERSISTENT NON-SCROLLING MODAL: ABOUT FOUNDER & ASTROLOGER */}
      {isAboutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#13112c]/82 backdrop-blur-xs p-4 overflow-y-auto text-left">
          <div className="relative max-w-2xl w-full bg-white rounded-md border-3 border-editorial-ink shadow-[8px_8px_0px_rgba(26,26,26,1)] overflow-hidden my-8">
            
            {/* Close Button Banner */}
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => {
                  setIsAboutModalOpen(false);
                  setIsEditingPhoto(false);
                }}
                className="bg-white/90 text-[#1a1a1a] hover:bg-slate-100 hover:text-slate-900 border-2 border-editorial-ink p-1.5 rounded-sm shadow-md cursor-pointer transition flex items-center justify-center font-bold text-sm w-8 h-8 font-sans"
              >
                ✕
              </button>
            </div>

            {/* Premium Gold Header Banner */}
            <div className="bg-[#0B3C5D] text-white p-6 border-b-3 border-editorial-ink relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0B3C5D 0%, #1e1b4b 100%)" }}>
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#F2B705] opacity-5 rounded-full -mr-12 -mt-12 animate-pulse"></div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                <div>
                  <span className="bg-[#F2B705]/20 text-[#F2B705] border border-[#F2B705]/40 text-[9px] px-2.5 py-1 rounded-sm uppercase font-mono font-bold tracking-widest block w-fit mb-1.5 shadow-sm">
                    Executive Leadership & Divinity
                  </span>
                  <h4 className="font-serif font-bold text-xl md:text-2xl text-white">Pathak Anna</h4>
                  <p className="text-xs text-stone-300">Jyotish & Founder, Pathak Anna Jyotish Karyalay</p>
                </div>
                <div className="bg-[#F2B705] text-[#1a1a1a] text-[10px] px-3.5 py-2 rounded-sm border-2 border-[#1a1a1a] font-mono lowercase tracking-tight font-black shadow-[3px_3px_0px_rgba(26,26,26,1)] animate-bounce">
                  consultation-expert
                </div>
              </div>
            </div>

            {/* Modal Body with Scroll (if needed) but fits max-h */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Avatar, Brief & Dynamic Image Replacement Option */}
              <div className="flex flex-col md:flex-row items-start gap-6 border-b border-stone-100 pb-6">
                <div className="relative shrink-0 mx-auto md:mx-0 text-center">
                  <div className="relative group">
                    <img
                      src={founderPhoto}
                      alt="Pathak Aanna"
                      className="w-32 h-32 object-cover rounded-sm border-2 border-editorial-ink shadow-[4px_4px_0px_rgba(26,26,26,0.15)] bg-slate-100 mx-auto"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      onClick={() => {
                        setPhotoUrlInput(founderPhoto);
                        setIsEditingPhoto(!isEditingPhoto);
                      }}
                      className="absolute bottom-1 right-1 bg-white hover:bg-slate-100 text-[#1a1a1a] border border-[#1a1a1a] text-[9px] font-bold py-1 px-2 rounded-xs flex items-center justify-center gap-1 shadow-md transition cursor-pointer"
                    >
                      📷 Edit
                    </button>
                  </div>
                  
                  {isEditingPhoto && (
                    <div className="mt-3 p-3 bg-stone-50 border border-stone-200 rounded-sm text-left space-y-2 max-w-[200px] mx-auto text-xs">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">
                        Paste Photo URL:
                      </label>
                      <input
                        type="text"
                        value={photoUrlInput}
                        onChange={(e) => setPhotoUrlInput(e.target.value)}
                        placeholder="Paste image URL..."
                        className="w-full text-[10px] p-1 border border-stone-300 rounded-xs font-sans text-slate-700 focus:outline-[#0B3C5D]"
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            const trimmedUrl = photoUrlInput.trim();
                            if (trimmedUrl) {
                              setFounderPhoto(trimmedUrl);
                              try {
                                localStorage.setItem("astro_founder_photo", trimmedUrl);
                              } catch(e) {}
                              // Sync to backend file storage globally
                              fetch("/api/settings", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ founderPhoto: trimmedUrl })
                              }).catch((err) => console.log("Failed to sync settings:", err));
                            }
                            setIsEditingPhoto(false);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold px-2 py-1 rounded-xs flex-1 transition cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setIsEditingPhoto(false)}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[9px] px-2 py-1 rounded-xs flex-1 transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <span className="inline-block mt-3.5 bg-amber-500 text-[#1a1a1a] border-2 border-[#1a1a1a] text-[9px] font-bold py-0.5 px-2.5 rounded-sm uppercase tracking-wider shadow-sm">
                    Rating: 5.0 ★
                  </span>
                </div>

                <div className="space-y-3 flex-1 text-left">
                  <h5 className="font-serif text-lg font-bold text-editorial-spirit flex items-center gap-1.5 leading-tight text-[#0B3C5D]">
                    Pathak Anna – Astrologer & Life Guidance Consultant
                  </h5>
                  <span className="inline-flex bg-amber-100 text-[#78350f] font-mono border border-amber-300 text-[10px] px-2.5 py-0.5 rounded-sm font-bold uppercase tracking-wide">
                    🏆 Trusted Vedic Astrologer & Spiritual Mentor
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans mt-1">
                    <strong>Pathak Anna</strong> is a trusted astrologer dedicated to helping individuals and families gain clarity, confidence, and direction in life through the wisdom of Vedic Astrology. With years of experience in horoscope analysis, planetary studies, and spiritual guidance, he has guided numerous people in making informed decisions related to career, finance, education, relationships, marriage, and personal growth.
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    His approach combines traditional astrological knowledge with practical life guidance, enabling clients to understand challenges, identify opportunities, and move forward with greater confidence. Rather than focusing only on predictions, Pathak Anna believes in providing meaningful insights and actionable guidance that help people make better decisions and achieve long-term stability.
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    Through <strong>Pathak Anna Jyotish Karyalay</strong>, he continues his mission of making authentic astrological guidance accessible to everyone seeking clarity about their future. His commitment to integrity, personalized consultation, and client satisfaction has earned the trust of people from diverse backgrounds.
                  </p>
                </div>
              </div>

              {/* Core Diagnostic Mastery Modules */}
              <div className="space-y-4 text-left">
                <h5 className="text-[10px] uppercase font-bold tracking-widest text-[#1a1a1a]/60 border-b pb-1">
                  Highly Exclusive Specialties & Diagnostic Portfolios
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Special 1 */}
                  <div className="p-4 bg-stone-50 rounded-sm border border-editorial-ink/20 flex gap-3">
                    <span className="text-2xl mt-0.5">🧠</span>
                    <div>
                      <h6 className="font-bold text-xs text-editorial-spirit uppercase tracking-tight font-serif mb-1">Advanced Brain Development</h6>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        A unique synthetic system integrating astrology and cognitive psychology to map intelligence patterns in children and professionals, matching brain hemisphere strengths with corresponding celestial dashas.
                      </p>
                    </div>
                  </div>

                  {/* Special 2 */}
                  <div className="p-4 bg-stone-50 rounded-sm border border-editorial-ink/20 flex gap-3">
                    <span className="text-2xl mt-0.5">✒️</span>
                    <div>
                      <h6 className="font-bold text-xs text-editorial-spirit uppercase tracking-tight font-serif mb-1">Sacred Signature & Handwriting Analysis</h6>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Every curve, slant, and dot in your handwriting reveals sub-conscious filters. Pathak Aanna corrects handwriting layouts to realign confidence, attract wealth, and dissolve career delays.
                      </p>
                    </div>
                  </div>

                  {/* Special 3 */}
                  <div className="p-4 bg-stone-50 rounded-sm border border-editorial-ink/20 flex gap-3">
                    <span className="text-2xl mt-0.5">👤</span>
                    <div>
                      <h6 className="font-bold text-xs text-editorial-spirit uppercase tracking-tight font-serif mb-1">Vedic Face Reading (Mukha Samudrika)</h6>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Diagnostic scanning of bone structures, eye contours, forehead lineages, and structural symmetries to determine deep character, core health configurations, and immediate transit effects.
                      </p>
                    </div>
                  </div>

                  {/* Special 4 */}
                  <div className="p-4 bg-stone-50 rounded-sm border border-editorial-ink/20 flex gap-3">
                    <span className="text-2xl mt-0.5">🔢</span>
                    <div>
                      <h6 className="font-bold text-xs text-editorial-spirit uppercase tracking-tight font-serif mb-1">Chaldean Numerology Mapping</h6>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Analyzing name vibrations and date of birth numbers to construct cosmic life blueprint grids, recommending pristine spelling corrections and color vibrations to unlock career luck.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vision and Mission Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-stone-100 pt-4 text-left">
                <div className="p-4 bg-blue-50/50 rounded-sm border border-blue-200/50">
                  <span className="text-xl">👁️</span>
                  <h6 className="font-serif font-bold text-[#0B3C5D] text-xs uppercase tracking-wider mt-1 mb-1">
                    Vision
                  </h6>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                    To empower individuals with accurate astrological insights and practical guidance so they can make confident decisions, overcome uncertainty, and create a balanced, successful, and fulfilling life.
                  </p>
                </div>
                <div className="p-4 bg-amber-50/50 rounded-sm border border-amber-200/50">
                  <span className="text-xl">🎯</span>
                  <h6 className="font-serif font-bold text-amber-800 text-xs uppercase tracking-wider mt-1 mb-1">
                    Mission
                  </h6>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                    To provide reliable, ethical, and personalized astrology consultations that help people gain clarity in career, finances, relationships, education, and life planning while preserving the rich traditions of Vedic Astrology.
                  </p>
                </div>
              </div>

              {/* Trust Badge Section */}
              <div className="bg-editorial-bg border-l-4 border-amber-500 p-4 rounded-sm text-xs text-left">
                <h6 className="font-serif font-bold text-[#0B3C5D] mb-1">🌠 The Pathak Lineage Philosophy</h6>
                <p className="text-slate-700 italic font-sans leading-relaxed">
                  &quot;We do not merely predict fate—we align the internal energetic architecture. Through correcting signatures, analyzing cognitive trends, and timing decisions correctly, we dissolve planetary resistance and empower souls to manifest their celestial birthrights.&quot;
                </p>
              </div>

              {/* Call to Action Booking Module */}
              <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Personal Consultation:</span>
                  <span className="text-lg font-bold text-amber-600 font-serif">₹2,100 <span className="text-xs text-slate-500 font-sans font-normal">/ 30-Min Private Session</span></span>
                </div>

                <button
                  onClick={() => {
                    setBookingForm({
                      ...bookingForm,
                      selectedAstroId: "astro-aanna",
                      consultationType: "Numerology"
                    });
                    setIsBookingModalOpen(true);
                    setIsAboutModalOpen(false); // Close the modal too
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0B3C5D] text-white hover:bg-slate-950 border-2 border-editorial-ink px-5 py-2.5 font-bold text-xs rounded-sm tracking-wide uppercase transition duration-150 shadow-[4px_4px_0px_rgba(26,26,26,1)] active:translate-y-0.5 cursor-pointer hover:shadow-none"
                >
                  <span>⚡</span> Book Private Session with Aanna
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PERSISTENT NON-SCROLLING MODAL: DIRECT BOOKING PORTAL */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#13112c]/82 backdrop-blur-xs p-4 overflow-y-auto text-left">
          <div className="relative max-w-2xl w-full bg-white rounded-md border-3 border-editorial-ink shadow-[8px_8px_0px_rgba(26,26,26,1)] overflow-hidden my-8">
            
            {/* Close Button Pin */}
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => {
                  setIsBookingModalOpen(false);
                }}
                className="bg-white/90 text-[#1a1a1a] hover:bg-slate-100 hover:text-slate-900 border-2 border-editorial-ink p-1.5 rounded-sm shadow-md cursor-pointer transition flex items-center justify-center font-bold text-sm w-8 h-8 font-sans"
              >
                ✕
              </button>
            </div>

            {/* Premium Gold Header Banner */}
            <div className="bg-[#0B3C5D] text-white p-6 border-b-3 border-editorial-ink relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0B3C5D 0%, #1e1b4b 100%)" }}>
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#F2B705] opacity-5 rounded-full -mr-12 -mt-12 animate-pulse"></div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                <div>
                  <span className="bg-[#F2B705]/20 text-[#F2B705] border border-[#F2B705]/40 text-[9px] px-2.5 py-1 rounded-sm uppercase font-mono font-bold tracking-widest block w-fit mb-1.5 shadow-sm">
                    Premium Vedic Consultation
                  </span>
                  <h4 className="font-serif font-bold text-xl md:text-2xl text-white flex items-center gap-1.5">
                    <Calendar className="w-5 h-5 text-[#F2B705]" /> Direct Scheduling Panel
                  </h4>
                  <p className="text-xs text-stone-300">Book private offline face-to-face consultation with Pathak Aanna (Call +91 8806510889)</p>
                </div>
                <div className="bg-[#F2B705] text-[#1a1a1a] text-[10px] px-3.5 py-2 rounded-sm border-2 border-[#1a1a1a] font-mono lowercase tracking-tight font-black shadow-[3px_3px_0px_rgba(26,26,26,1)] animate-bounce">
                  Session Fee: ₹2,100 / 30-Min
                </div>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <AstroBookingFlow isModal={true} onBookingChanged={() => {}} />
            </div>

            {/* TEMPORARY BYPASSED MODAL REPLICA */}
            {false && (
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {!activeBooking ? (
                /* Interactive booking Form */
                <form
                  onSubmit={(e) => {
                    handleBookingSubmit(e);
                  }}
                  className="space-y-4"
                >
                  <div className="p-3 bg-editorial-bg border-l-4 border-[#F2B705] rounded-sm text-xs leading-relaxed text-slate-700">
                    <strong className="text-stone-900 block font-serif">⚡ High-Value Expert Services included:</strong>
                    Advanced brain development profiling, signature correction, Chaldean numerology vibrations, and deep Mukha Samudrika face-mapping, tailored specifically to clear life obstacles.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1 text-xs">
                      <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700">Full Client Name</label>
                      <div className="relative">
                        <User className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={bookingForm.name}
                          onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                          placeholder="Rahul Kumar Sharma"
                          className="w-full bg-editorial-bg border border-editorial-ink rounded-sm pl-9 pr-3 py-2 outline-none focus:ring-1 focus:ring-editorial-accent text-editorial-ink font-semibold"
                        />
                      </div>
                    </div>

                    {/* Contact Number */}
                    <div className="space-y-1 text-xs">
                      <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700">Contact Mobile Number</label>
                      <div className="relative">
                        <Phone className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={bookingForm.contactNumber}
                          onChange={(e) => setBookingForm({ ...bookingForm, contactNumber: e.target.value })}
                          placeholder="+91 8806510889"
                          className="w-full bg-editorial-bg border border-editorial-ink rounded-sm pl-9 pr-3 py-2 outline-none focus:ring-1 focus:ring-editorial-accent text-editorial-ink font-semibold"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1 text-xs sm:col-span-2">
                      <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700">Email Address (For Secure Razorpay Ticket & Invoice)</label>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={bookingForm.email}
                          onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                          placeholder="rahul.sharma@gmail.com"
                          className="w-full bg-editorial-bg border border-editorial-ink rounded-sm pl-9 pr-3 py-2 outline-none focus:ring-1 focus:ring-editorial-accent text-editorial-ink font-semibold"
                        />
                      </div>
                    </div>

                    {/* Date Of Birth */}
                    <div className="space-y-1 text-xs">
                      <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700">Day of Birth</label>
                      <input
                        type="date"
                        required
                        value={bookingForm.dob}
                        onChange={(e) => setBookingForm({ ...bookingForm, dob: e.target.value })}
                        className="w-full bg-editorial-bg border border-editorial-ink rounded-sm px-3 py-2 outline-none focus:ring-1 focus:ring-editorial-accent text-editorial-ink font-mono"
                      />
                    </div>

                    {/* Time Of Birth */}
                    <div className="space-y-1 text-xs">
                      <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700">Time of Birth</label>
                      <input
                        type="time"
                        required
                        value={bookingForm.tob}
                        onChange={(e) => setBookingForm({ ...bookingForm, tob: e.target.value })}
                        className="w-full bg-editorial-bg border border-editorial-ink rounded-sm px-3 py-2 outline-none focus:ring-1 focus:ring-editorial-accent text-editorial-ink font-mono"
                      />
                    </div>

                    {/* Place Of Birth */}
                    <div className="space-y-1 text-xs">
                      <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700">Exact Place of Birth</label>
                      <div className="relative">
                        <MapPin className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={bookingForm.pob}
                          onChange={(e) => setBookingForm({ ...bookingForm, pob: e.target.value })}
                          placeholder="Varanasi, UP, India"
                          className="w-full bg-editorial-bg border border-editorial-ink rounded-sm pl-9 pr-3 py-2 outline-none focus:ring-1 focus:ring-editorial-accent text-editorial-ink font-semibold"
                        />
                      </div>
                    </div>

                    {/* Preferred Date */}
                    <div className="space-y-1 text-xs">
                      <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700">Preferred Consultation Date</label>
                      <input
                        type="date"
                        required
                        value={bookingForm.preferredDate}
                        onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                        className="w-full bg-editorial-bg border border-editorial-ink rounded-sm px-3 py-2 outline-none focus:ring-1 focus:ring-editorial-accent text-editorial-ink font-mono"
                      />
                    </div>

                    {/* Preferred Slot */}
                    <div className="space-y-1 text-xs">
                      <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700">Preferred Time Slot (Strictly 60-Min Each)</label>
                      <select
                        value={bookingForm.preferredSlot}
                        onChange={(e) => setBookingForm({ ...bookingForm, preferredSlot: e.target.value })}
                        className="w-full bg-editorial-bg border border-editorial-ink rounded-sm px-3 py-2.5 outline-none focus:ring-1 focus:ring-editorial-accent text-xs font-semibold text-editorial-ink font-mono"
                      >
                        <option value="Slot 1 (09:00 AM - 10:00 AM)">Slot 1 (09:00 AM - 10:00 AM)</option>
                        <option value="Slot 2 (11:00 AM - 12:00 PM)">Slot 2 (11:00 AM - 12:00 PM)</option>
                        <option value="Slot 3 (02:00 PM - 03:00 PM)">Slot 3 (02:00 PM - 03:00 PM)</option>
                        <option value="Slot 4 (04:30 PM - 05:30 PM)">Slot 4 (04:30 PM - 05:30 PM)</option>
                        <option value="Slot 5 (07:00 PM - 08:00 PM)">Slot 5 (07:00 PM - 08:00 PM)</option>
                      </select>

                      {/* Interactive Slot Counter for Mobile */}
                      {bookingForm.preferredDate && (
                        <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono font-bold bg-[#0B3C5D]/5 p-2 rounded-sm border border-[#0B3C5D]/10">
                          <span className="text-slate-500 uppercase">Daily Slots Taken:</span>
                          <span className={allBookings.filter(b => b.scheduled_at.startsWith(bookingForm.preferredDate)).length >= 5 ? "text-rose-600 font-extrabold" : "text-[#0B3C5D]"}>
                            {allBookings.filter(b => b.scheduled_at.startsWith(bookingForm.preferredDate)).length} / 5 sessions
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Consultation Type */}
                    <div className="space-y-1 text-xs">
                      <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700">Query Focus Axis</label>
                      <select
                        value={bookingForm.consultationType}
                        onChange={(e) => setBookingForm({ ...bookingForm, consultationType: e.target.value })}
                        className="w-full bg-editorial-bg border border-editorial-ink rounded-sm px-3 py-2.5 outline-none focus:ring-1 focus:ring-editorial-accent text-xs font-semibold text-editorial-ink"
                      >
                        <option value="Kundli">Kundli (Full Natal Life Alignment)</option>
                        <option value="Career">Career Progression & Abundance</option>
                        <option value="Marriage">Marriage Delay & Compatibility</option>
                        <option value="Health">Physical & Astral Body Protection</option>
                        <option value="Finance">Business Speculations & Wealth</option>
                        <option value="Numerology">Chaldean Numerology Mapping</option>
                      </select>
                    </div>
                  </div>

                  {bookingError && (
                    <p className="text-xs text-rose-600 font-bold">{bookingError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-[#0B3C5D] text-white font-bold py-3.5 px-4 rounded-sm border border-editorial-ink shadow-[4px_4px_0px_rgba(26,26,26,0.15)] transition duration-150 cursor-pointer flex items-center justify-center gap-1.5 active:translate-y-0.5"
                  >
                    <Zap className="w-4 h-4 text-[#F2B705] fill-[#F2B705]" />
                    Secure Meeting with Pathak Aanna
                  </button>
                </form>
              ) : (
                /* Interactive Receipt */
                <div className="space-y-6">
                  <div className="bg-editorial-spirit text-white p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-editorial-ink rounded-sm">
                    <div className="text-left space-y-1.5">
                      <span className="text-[9px] font-mono tracking-widest uppercase bg-[#F2B705] text-[#1a1a1a] px-2.5 py-1 border border-editorial-ink rounded-sm font-bold shadow-sm inline-block">
                        Booking Confirmed: Pending Payment
                      </span>
                      <h4 className="text-lg font-serif font-bold">Appointment ID: <span className="underline text-[#F2B705] font-black">{activeBooking.booking_id}</span></h4>
                      <p className="text-xs text-indigo-100">Consultation set with Pathak Aanna</p>
                    </div>

                    {/* Countdown Clock */}
                    <div className="bg-white text-editorial-ink p-3 rounded-sm border border-editorial-ink shadow-[2px_2px_0px_rgba(26,26,26,0.1)] text-center font-mono shrink-0">
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 block mb-0.5 font-bold font-sans">Time Left to Pay</span>
                      <div className="text-sm font-black text-rose-600 flex items-center justify-center gap-1 font-mono">
                        <Clock className="w-4 h-4 text-rose-600" />
                        <span>
                          {countdownMinutes.toString().padStart(2, "0")}:{countdownSeconds.toString().padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-editorial-bg p-4 rounded-sm border border-editorial-ink/30 text-xs text-left space-y-2 shadow-inner">
                      <h5 className="font-serif font-bold text-editorial-spirit border-b border-editorial-ink/20 pb-1 flex items-center gap-1 text-sm">Target & Coordinates</h5>
                      <p><span className="font-bold text-slate-600 block uppercase tracking-wider text-[9px] mb-0.5">Client Full Name</span> <span className="font-bold text-slate-900 text-sm">{activeBooking.client_name}</span></p>
                      <p><span className="font-semibold text-slate-600 uppercase tracking-wider text-[9px] mr-1">Scheduled Slot:</span> <span className="font-bold text-slate-800">{activeBooking.scheduled_at}</span></p>
                      <p><span className="font-semibold text-slate-600 uppercase tracking-wider text-[9px] mr-1">Query Focus:</span> <span className="font-bold text-slate-800">{activeBooking.consultation_type}</span></p>
                      <p><span className="font-semibold text-slate-600 uppercase tracking-wider text-[9px] mr-1">Session Expert:</span> <span className="font-bold text-slate-800 font-serif">{activeBooking.astrologer_name}</span></p>
                    </div>

                    <div className="bg-[#fbbf24]/10 border-2 border-[#fbbf24]/40 text-[#1a1a1a] p-4 rounded-sm text-xs text-left space-y-2.5 shadow-sm">
                      <h5 className="font-serif font-bold text-amber-950 border-b border-[#fbbf24]/20 pb-1 text-sm">Advance Financial Balance</h5>
                      <div className="flex justify-between">
                        <span className="text-stone-700 font-semibold">Total Consultation Fee:</span>
                        <span className="font-mono font-bold text-slate-950">INR {activeBooking.total_fee_inr}/-</span>
                      </div>
                      <div className="flex justify-between bg-white px-2 py-1.5 border border-[#fbbf24]/30 rounded-sm">
                        <span className="text-amber-900 font-extrabold">{activeBooking.advance_percentage}% Required Advance:</span>
                        <span className="font-mono font-black text-editorial-accent">INR {activeBooking.advance_amount_inr}/-</span>
                      </div>
                      <p className="text-[9px] text-stone-700 leading-tight">
                        Note: 30% advance secures the Panchanga hours. Remaining 70% is settled upon consultation completion.
                      </p>
                    </div>
                  </div>

                  {/* RAZORPAY SECURE GATEWAY CHECKOUT PANEL */}
                  <div className="bg-gradient-to-br from-[#0B3C5D]/5 to-white border-2 border-[#0B3C5D] p-5 rounded-sm flex flex-col gap-4 text-xs shadow-md">
                    <div className="flex items-center justify-between border-b pb-2.5 border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="p-1 bg-[#0B3C5D]/10 rounded-sm">
                          <ShieldCheck className="w-5 h-5 text-[#0B3C5D]" />
                        </span>
                        <div className="text-left">
                          <h5 className="font-serif font-black text-slate-900 text-sm">Official Razorpay Booking Gateway</h5>
                          <p className="text-[10px] text-slate-500 font-medium">Instant authentication via Card, Netbanking, UPI, Wallet</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono bg-amber-100 text-amber-950 border border-amber-200 px-2 py-0.5 rounded-sm font-black uppercase tracking-wider">
                        Secure
                      </span>
                    </div>

                    {paymentError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-rose-700 rounded-sm font-semibold text-xs leading-normal text-left">
                        ⚠️ {paymentError}
                      </div>
                    )}

                    {activeBooking.status === "confirmed" ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-sm font-sans flex flex-col items-center justify-center text-center space-y-1.5 shadow-sm">
                        <span className="p-1 px-2 bg-emerald-600 text-white rounded-full text-xs font-bold">
                          ✓ Paid
                        </span>
                        <h6 className="font-bold text-sm tracking-tight text-emerald-900">Celestial Consultation Confirmed!</h6>
                        <p className="text-xs leading-relaxed text-emerald-800 text-center">
                          Your custom geo-astral slot has been successfully scheduled and authenticated. Pathak Aanna will meet you on your preferred slot.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-3 rounded-sm border border-slate-200 shadow-inner gap-3">
                          <div className="text-left">
                            <span className="text-slate-500 uppercase font-mono text-[9px] block">30% Advance Slot Deposit:</span>
                            <span className="text-base font-black text-[#0B3C5D] font-mono">INR {activeBooking.advance_amount_inr}.00</span>
                          </div>
                          
                          <button
                            onClick={handleRazorpayPayment}
                            disabled={isPaying || isVerifying}
                            className="w-full sm:w-auto bg-[#0B3C5D] hover:bg-slate-950 text-[#F2B705] font-black py-2.5 px-5 rounded-sm border-2 border-editorial-ink shadow-[4px_4px_0px_rgba(26,26,26,1)] hover:shadow-none transition duration-150 active:translate-y-0.5 hover:text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-wider shrink-0"
                          >
                            {isPaying ? (
                              <>
                                <span className="animate-spin inline-block w-3 h-3 border-2 border-[#F2B705] border-t-transparent rounded-full" />
                                <span>Starting Secure Pay...</span>
                              </>
                            ) : isVerifying ? (
                              <>
                                <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                                <span>Verifying Token...</span>
                              </>
                            ) : (
                              <>
                                <Zap className="w-4 h-4 text-[#F2B705] fill-[#F2B705] animate-pulse" />
                                <span>Pay Securely with Razorpay</span>
                              </>
                            )}
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 text-center font-mono select-none">
                          <span>🛡️ 256-bit SSL Secure</span>
                          <span>•</span>
                          <span>⚡ Auto-activated slot</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Manual UPI fallback accordion */}
                  {activeBooking.status !== "confirmed" && (
                    <details className="border border-editorial-ink/20 rounded-sm bg-white text-xs overflow-hidden">
                      <summary className="bg-slate-50 px-4 py-2.5 font-bold text-slate-700 cursor-pointer hover:bg-slate-100 transition select-none flex items-center justify-between">
                        <span>Alternative Option: Manual UPI Bank QR Code Transfer</span>
                        <span className="text-xs text-[#0B3C5D]">View QR</span>
                      </summary>
                      <div className="p-4 border-t border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-center">
                        <div className="w-20 h-20 bg-white border border-editorial-ink p-1 rounded-sm flex flex-col items-center justify-center shrink-0 shadow-sm">
                          <div className="grid grid-cols-5 gap-0.5 w-[64px] h-[64px]">
                            {[...Array(25)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-full h-full rounded-sm ${
                                  (i % 3 === 0 || i < 5 || i % 6 === 0) && i !== 12 ? "bg-slate-900" : "bg-white"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="text-left space-y-1.5 flex-1">
                          <h6 className="font-bold text-amber-950 text-xs">Direct UPI Node Link (Manual Verification Required):</h6>
                          <p className="text-slate-600 leading-normal text-[11px]">
                            Scan or copy transfer ID below:
                          </p>
                          <div className="bg-stone-50 border border-editorial-ink p-1.5 px-3 rounded-sm font-mono font-bold text-slate-800 shadow-sm inline-block select-all text-xs">
                            {activeBooking.upi_id}
                          </div>
                        </div>
                      </div>
                    </details>
                  )}

                  {/* Raw JSON block */}
                  <div className="bg-stone-900 p-4 rounded-sm text-left border border-editorial-ink font-mono">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <FileCheck className="w-4 h-4 text-emerald-400" /> Confirmational Booking String
                      </span>
                      <button
                        onClick={copyInvoiceText}
                        className="text-[10px] text-amber-400 font-bold hover:text-white transition flex items-center gap-1 cursor-pointer"
                      >
                        {copiedInvoiceJson ? "Copied!" : "Copy JSON"}
                      </button>
                    </div>
                    <pre className="text-emerald-400 text-[10px] font-mono overflow-auto max-h-[120px] leading-tight select-all">
                      {JSON.stringify(activeBooking, null, 2)}
                    </pre>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-between items-center text-left pt-4 border-t border-stone-100">
                    <button
                      onClick={cancelActiveBooking}
                      className="text-xs text-rose-700 hover:text-rose-800 font-bold border border-rose-700/30 bg-white px-3 py-1.5 hover:bg-rose-50 transition rounded-sm cursor-pointer"
                    >
                      ↩️ Cancel & Start New Booking
                    </button>
                    <div className="text-xs text-editorial-ink font-serif font-bold bg-editorial-bg p-2 px-3 border border-editorial-ink/30 rounded-sm shadow-sm">
                      {activeBooking.confirmation_message}
                    </div>
                  </div>
                </div>
              )}
            </div>
            )}

          </div>
        </div>
      )}

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href="https://wa.me/918806510889?text=Hello%20Pathak%20Aanna%2C%20I%2520would%2520like%2520to%2520inquire%2520about%2520astrology%2520consultation."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full border-2 border-editorial-ink shadow-[4px_4px_0px_rgba(26,26,26,1)] hover:shadow-[1px_1px_0px_rgba(26,26,26,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all group scale-100 active:scale-95 duration-150"
      >
        <span className="absolute right-14 bg-white text-editorial-ink text-[11px] font-sans font-bold py-1 px-3.5 rounded-sm border-2 border-editorial-ink shadow-[2px_2px_0px_rgba(26,26,26,1)] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Chat with Pathak Aanna 🌟
        </span>
        <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
        {/* Animated pulsing indicator badge */}
        <span className="absolute top-0 right-0 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      </a>

    </div>
  );
}
