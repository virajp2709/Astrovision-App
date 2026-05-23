import React, { useState, useRef, useEffect } from "react";
import { Message, BookingDetails } from "../types";
import { astrolgersData } from "../data/astrologyData";
import { Copy, Check, Send, Sparkles } from "lucide-react";

interface AstroChatProps {
  onBookingDetected: (booking: BookingDetails) => void;
  bookingFormDetails: any; // Optional, can sync with form
  activeBooking: BookingDetails | null;
}

export default function AstroChat({ onBookingDetected, activeBooking }: AstroChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "nakshatra",
      text: "🙏 Jay Shree Ram! I am NakshatraAI, your spiritual guide and astrology companion at Braincord Solution. I can analyze your Kundli, match compatibility, align Vastu elements, or prescribe divine gemstones. \n\nIf you seek an in-depth reading, you can book a sacred consultation with our certified Jyotish Pathak Aanna. Simply let me know, or use the dedicated booking form directly on this page!",
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [bookingStep, setBookingStep] = useState<number>(0);
  const [draft, setDraft] = useState({
    name: "",
    dob: "",
    tob: "",
    pob: "",
    preferredDate: "",
    preferredSlot: "",
    consultationType: "",
    contactNumber: ""
  });

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle Copy of JSON
  const handleCopy = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Pre-configured questions
  const SUGGESTED_PROMPTS = [
    {
      label: "🔮 Check Kundli",
      text: "Please guide me on how to generate and read my Birth Chart (Kundli)."
    },
    {
      label: "👩‍❤️‍👨 compatibility check",
      text: "How does Vedic Kundli Milan determine marital compatibility?"
    },
    {
      label: "🗓️ Book Consultation",
      text: "I want to book a consultation with an astrologer."
    },
    {
      label: "💎 Gemstone Remedy",
      text: "Suggest a gemstone for professional growth."
    }
  ];

  // Helper parser for pasted booking details
  const parseBookingDetails = (text: string): BookingDetails | null => {
    const isBookingRequest =
      text.toLowerCase().includes("book a consultation") ||
      text.toLowerCase().includes("my details:") ||
      text.toLowerCase().includes("consultation type");

    if (!isBookingRequest) return null;

    // Default mock data that updates if matched
    let clientName = "Astro Seekor";
    let dob = "27/09/1993";
    let tob = "17:45 PM";
    let pob = "Mumbai, MH, India";
    let preferredDate = "30/05/2026";
    let preferredSlot = "Evening";
    let type = "Kundli";
    let phone = "+91 8806510889";

    // Match lines
    const nameMatch = text.match(/Name:\s*(.*)/i);
    const dobMatch = text.match(/Date of Birth:\s*(.*)/i);
    const tobMatch = text.match(/Time of Birth:\s*(.*)/i);
    const pobMatch = text.match(/Place of Birth:\s*(.*)/i);
    const dateMatch = text.match(/Preferred Date:\s*(.*)/i);
    const slotMatch = text.match(/Preferred Time Slot:\s*(.*)/i);
    const typeMatch = text.match(/Consultation Type:\s*(.*)/i);
    const phoneMatch = text.match(/Contact Number:\s*(.*)/i);

    if (nameMatch) clientName = nameMatch[1].trim();
    if (dobMatch) dob = dobMatch[1].trim();
    if (tobMatch) tob = tobMatch[1].trim();
    if (pobMatch) pob = pobMatch[1].trim();
    if (dateMatch) preferredDate = dateMatch[1].trim();
    if (slotMatch) preferredSlot = slotMatch[1].trim();
    if (typeMatch) type = typeMatch[1].trim();
    if (phoneMatch) phone = phoneMatch[1].trim();

    // Map astrologer to consultation type (only Pathak Aanna is available)
    const astrologer = astrolgersData[0];

    const bookingId = "ASTRO-" + Math.floor(100000 + Math.random() * 900000);
    const totalFee = astrologer.consultationFee;
    const advancePercentage = 30;
    const advanceAmount = Math.round((totalFee * advancePercentage) / 100);

    const todayStr = new Date().toISOString().split("T")[0];
    const deadlineTime = "18:00";

    const details: BookingDetails = {
      booking_id: bookingId,
      status: "pending_payment",
      client_name: clientName,
      astrologer_name: astrologer.name,
      astrologer_specialization: astrologer.specialization,
      consultation_type: type,
      scheduled_at: `${preferredDate} (${preferredSlot})`,
      duration_minutes: 45,
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

    return details;
  };

  const handleMessageSubmit = (messageText: string) => {
    if (!messageText.trim()) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");

    // Conversational booking logic
    if (bookingStep > 0) {
      setTimeout(() => {
        const lowerText = messageText.toLowerCase().trim();
        if (lowerText === "exit" || lowerText === "cancel") {
          setBookingStep(0);
          setDraft({
            name: "",
            dob: "",
            tob: "",
            pob: "",
            preferredDate: "",
            preferredSlot: "",
            consultationType: "",
            contactNumber: ""
          });
          setMessages((prev) => [
            ...prev,
            {
              id: Math.random().toString(),
              sender: "nakshatra",
              text: "🙏 Shanti. I have cancelled the active booking progression. How else can NakshatraAI guide your celestial path?",
              timestamp: new Date()
            }
          ]);
          return;
        }

        let nextStep = bookingStep + 1;
        let updateDraft = { ...draft };
        let questionText = "";

        switch (bookingStep) {
          case 1:
            updateDraft.name = messageText;
            questionText = `Dhanyawad, **${messageText}**! What is your **Date of Birth**? (e.g. 27/09/1993)`;
            break;
          case 2:
            updateDraft.dob = messageText;
            questionText = `Pranams. What is your precise **Time of Birth**? (e.g. 05:45 PM)`;
            break;
          case 3:
            updateDraft.tob = messageText;
            questionText = `Auspicious. What is your **Place of Birth**? (e.g. Mumbai, Maharashtra, India)`;
            break;
          case 4:
            updateDraft.pob = messageText;
            questionText = `We are aligning the cosmic houses for ${updateDraft.name || "you"}. What is your **Preferred Consultation Date**? (e.g. 30/05/2026)`;
            break;
          case 5:
            updateDraft.preferredDate = messageText;
            questionText = `Auspicious date! What is your **Preferred Time Slot**? (Type: **Morning**, **Afternoon**, or **Evening**)`;
            break;
          case 6:
            updateDraft.preferredSlot = messageText;
            questionText = `Excellent. What is the **Consultation Type** or main life topic/difficulty to address with our Guru? (e.g. **Marriage**, **Career**, **Vastu**, **Health**, or **General Kundli**)`;
            break;
          case 7:
            updateDraft.consultationType = messageText;
            questionText = `Lastly, please enter your **Contact Mobile Number** to deliver your Zoom consultation links and alerts:`;
            break;
          case 8:
            updateDraft.contactNumber = messageText;

            const finalType = updateDraft.consultationType || "Kundli";
            const astrologer = astrolgersData[0];

            const bookingId = "ASTRO-" + Math.floor(100000 + Math.random() * 900000);
            const totalFee = astrologer.consultationFee;
            const advancePercentage = 30;
            const advanceAmount = Math.round((totalFee * advancePercentage) / 100);
            const todayStr = new Date().toISOString().split("T")[0];
            const deadlineTime = "18:00";

            const bookingData: BookingDetails = {
              booking_id: bookingId,
              status: "pending_payment",
              client_name: updateDraft.name,
              astrologer_name: astrologer.name,
              astrologer_specialization: astrologer.specialization,
              consultation_type: updateDraft.consultationType,
              scheduled_at: `${updateDraft.preferredDate} (${updateDraft.preferredSlot})`,
              duration_minutes: 45,
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
              confirmation_message: `🙏 Jai Shree Ram! Astrologer ${astrologer.name} is aligned for your destiny inquiry.`
            };

            onBookingDetected(bookingData);

            const responseText = JSON.stringify(bookingData, null, 2);

            setMessages((prev) => [
              ...prev,
              {
                id: Math.random().toString(),
                sender: "nakshatra",
                text: `🙏 Dhanyawad! I have parsed your sacred answers with care. Placing this inquiry before our astrologer **${bookingData.astrologer_name}**.\n\nBelow is your secure cosmic booking summary dynamically compiled for you:`,
                timestamp: new Date(),
              },
              {
                id: Math.random().toString(),
                sender: "nakshatra",
                text: responseText,
                timestamp: new Date(),
                isJson: true,
                bookingData: bookingData,
              }
            ]);

            setBookingStep(0);
            setDraft({
              name: "",
              dob: "",
              tob: "",
              pob: "",
              preferredDate: "",
              preferredSlot: "",
              consultationType: "",
              contactNumber: ""
            });
            return;
          default:
            break;
        }

        setDraft(updateDraft);
        setBookingStep(nextStep);

        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: "nakshatra",
            text: questionText,
            timestamp: new Date(),
          }
        ]);
      }, 1000);
      return;
    }

    // 2. Generate Simulated Astro response for other inquiries
    setTimeout(() => {
      const lowerText = messageText.toLowerCase();

      // Check key intents
      let botResponse = "";

      if (
        lowerText.includes("i want to book a consultation with an astrologer") ||
        (lowerText.includes("book") && lowerText.includes("consultation")) ||
        lowerText.includes("schedule") ||
        lowerText.includes("appointment") ||
        lowerText.includes("details:")
      ) {
        setBookingStep(1);
        setDraft({
          name: "",
          dob: "",
          tob: "",
          pob: "",
          preferredDate: "",
          preferredSlot: "",
          consultationType: "",
          contactNumber: ""
        });

        botResponse = `🙏 Jay Shree Ram! I will happily guide you through scheduling your face-to-face sacred meeting with Pathak Aanna. Let's register your birth and slot coordinates step-by-step.

To begin, what is your **Full Name (English letters)**?

*(Type 'exit' anytime to cancel this booking progress)*`;
      } else if (lowerText.includes("cancel") || lowerText.includes("refund")) {
        botResponse = `Shanti - We completely respect your changing spiritual paths. Regarding cancellations and refunds, the Temple holds these rules:
        
🌸 **100% refund** if cancelled 24 hours prior to the slot.
🌸 **50% refund** if cancelled within 12 hours.
🌸 *No refund* under 2 hours because the Acharya establishes deep dhyana preparations for your specific biofields beforehand.
        
To request a refund, please send your Booking ID to our billing line or contact support.`;
      } else if (lowerText.includes("kundli") || lowerText.includes("birth chart")) {
        botResponse = `A Kundli (An-Nasb) is a sacred mathematical projection of the heavens at the absolute second you entered this earthly body.
        
To generate your chart:
1. Tap the **Kundli & Milan** tab on the right panel.
2. Provide your precise Date, Time, and Place of Birth in the generator.
3. Our system will plot the precise North Indian style geometrical house charts, planet alignments, and present your core Lagna predictions.
        
"Yatha Pinde Tatha Brahmande" — We are but mirrors of the solar constellations!`;
      } else if (lowerText.includes("milan") || lowerText.includes("compatibility")) {
        botResponse = `Kundli Milan (Ashta Koota Matching) maps 36 energetic points between two souls to analyze marriage sustenance. 
        
We calculate alignments across eight celestial domains (Varna, Vashya, Tara, Yoni, Maitri, Gana, Bhakoot, and Nadi). A score exceeding 18 gunas is highly favorable. 
        
Use the **Kundli Milan** section on the right side of your page to enter partner details and view a beautiful match compatibility score dynamically!`;
      } else if (lowerText.includes("gemstone") || lowerText.includes("gems")) {
        botResponse = `Natural organic minerals act as energetic lenses, amplifying the weak planetary fields in your aura. 
        
🪐 **Emerald (Panna):** Refines mercantile speech & intelligence (Mercury).
🪐 **Yellow Sapphire (Pukhraj):** Invites high financial abundance & spiritual guidance (Jupiter).
🪐 **Ruby (Manik):** Enhances commanding leadership and physical stamina (Sun).
        
For a complete recommendation list, browse the **Vastu & Gemstones** section or ask me here which life desire (e.g. Finance, Health, Marriage) you want to align!`;
      } else if (lowerText.includes("vastu")) {
        botResponse = `Vastu Shastra balances the Pancha Bhootas (Five Elements) inside your architecture to invite positive energy. 
        
For example, the North-East (Ishan Kona) must remain light, watery and used for Pooja altars, whereas the South-East is ruled by Fire (Agni) and is pristine for kitchens.
        
Go to the **Vastu & Gemstones** tab to play with our interactive Room layout remedy kit!`;
      } else if (lowerText.includes("dasha") || lowerText.includes("planetary")) {
        botResponse = `The Vimshottari Mahadasha system outlines your destiny in continuous cycles of 120 years ruled by different planets. 
        
Rahu Mahadasha triggers highly worldly ambition and spiritual transformation, while Jupiter (Guru) Dasha instills learning, domestic joy and status. 
        
Provide your DOB details in the "Kundli" tab to view your current active Mahadasha alignments!`;
      } else {
        botResponse = `Auspicious greeting, seeker. Your thoughts carry a rare divine curiosity today. 
        
I am here to guide you with any question regarding Kundli Analysis, Kundli Milan compatibility, daily Horoscopes, gemstone prescriptions, or Vastu tips.
        
If you wish to schedule a personal online face-to-face meet with Pathak Aanna Let me know or click "I want to book an appointment".`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "nakshatra",
          text: botResponse,
          timestamp: new Date(),
        }
      ]);
    }, 1000);
  };

  const startInteractiveBooking = () => {
    setBookingStep(1);
    setDraft({
      name: "",
      dob: "",
      tob: "",
      pob: "",
      preferredDate: "",
      preferredSlot: "",
      consultationType: "",
      contactNumber: ""
    });

    const triggerMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: "I want to start conversational booking",
      timestamp: new Date()
    };

    setMessages((prev) => [
      ...prev,
      triggerMsg,
      {
        id: Math.random().toString(),
        sender: "nakshatra",
        text: `🙏 Jay Shree Ram! I will happily guide you through scheduling your face-to-face sacred meeting with Pathak Aanna. Let's register your birth and slot coordinates step-by-step.

To begin, what is your **Full Name (English letters)**?

*(Type 'exit' anytime to cancel this booking progress)*`,
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[540px] md:h-[620px] bg-editorial-bg border-2 border-editorial-ink rounded-md shadow-[8px_8px_0px_rgba(26,26,26,0.06)] relative overflow-hidden">
      {/* Bot Header */}
      <div className="bg-editorial-spirit border-b-2 border-editorial-ink p-4 shrink-0 flex items-center justify-between shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-editorial-accent border border-editorial-ink flex items-center justify-center font-bold text-white text-lg shadow-[2px_2px_0px_rgba(26,26,26,0.15)]">
            ✨
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif font-bold text-white tracking-tight text-sm md:text-base">
                NakshatraAI
              </h3>
              <span className="text-[9px] bg-white/20 text-white px-2 py-0.5 rounded-sm font-mono border border-white/25">
                GURU LIVE
              </span>
            </div>
            <p className="text-[10px] text-indigo-100">Wise Vedic Astrology Companion</p>
          </div>
        </div>

        <button
          onClick={startInteractiveBooking}
          className="text-[10px] bg-white hover:bg-editorial-bg text-[#B45309] border-[#B45309]/30 border px-3 py-1.5 rounded-sm font-bold tracking-tight transition duration-150 cursor-pointer shadow-[2px_2px_0px_rgba(180,83,9,0.12)] hover:shadow-none"
        >
          🔮 Interactive Booking
        </button>
      </div>

      {/* Messages body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-sm px-4 py-3 text-sm leading-relaxed text-left transition-all ${
                msg.sender === "user"
                  ? "bg-editorial-accent border border-editorial-ink text-white font-medium shadow-[3px_3px_0px_rgba(26,26,26,0.12)]"
                  : "bg-white border border-editorial-ink text-editorial-ink shadow-[3px_3px_0px_rgba(26,26,26,0.06)]"
              }`}
            >
              {msg.isJson ? (
                <div className="space-y-2 relative">
                  <div className="flex items-center justify-between text-[11px] text-editorial-accent font-bold font-mono border-b border-stone-200 pb-1.5 mb-2">
                    <span>Generated Booking JSON Block</span>
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="hover:text-editorial-spirit flex items-center gap-1 cursor-pointer"
                      title="Copy JSON Block"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="font-mono text-[10px] md:text-xs text-emerald-800 bg-stone-50 p-3 border border-stone-200 rounded overflow-x-auto select-all max-h-[220px] leading-tight">
                    {msg.text}
                  </pre>
                </div>
              ) : (
                <p className="whitespace-pre-line text-xs font-sans md:text-sm leading-relaxed">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Recommended Triggers helper */}
      <div className="px-3 py-2.5 border-t border-editorial-ink overflow-x-auto flex gap-1.5 whitespace-nowrap bg-white/60 no-scrollbar max-w-full">
        {SUGGESTED_PROMPTS.map((prompt, id) => (
          <button
            key={id}
            onClick={() => handleMessageSubmit(prompt.text)}
            className="text-[11px] bg-editorial-bg hover:bg-white text-editorial-ink border border-editorial-ink px-3 py-1.5 rounded-sm font-bold tracking-tight shadow-[1px_1px_0px_rgba(26,26,26,0.1)] transition duration-100 cursor-pointer active:translate-y-0.5"
          >
            {prompt.label}
          </button>
        ))}
      </div>

      {/* Input container */}
      <div className="p-3 border-t-2 border-editorial-ink bg-white shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleMessageSubmit(inputMessage);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask NakshatraAI... (e.g. 'Generate my Kundli')"
            className="flex-1 bg-editorial-bg text-editorial-ink placeholder-slate-400 rounded-sm px-4 py-2 text-xs md:text-sm border border-editorial-ink focus:outline-none focus:ring-1 focus:ring-editorial-accent w-full"
          />
          <button
            type="submit"
            className="bg-editorial-ink h-10 w-10 shrink-0 rounded-sm border border-editorial-ink flex items-center justify-center text-white hover:bg-editorial-spirit transition duration-150 cursor-pointer active:translate-y-0.5 shadow-[2px_2px_0px_rgba(26,26,26,0.15)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
