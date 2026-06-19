import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Sparkles, 
  Upload, 
  CheckCircle, 
  Check, 
  MessageSquare, 
  QrCode, 
  Smartphone, 
  User, 
  Mail, 
  Phone, 
  Clock, 
  Search, 
  CalendarDays, 
  AlertCircle,
  FileImage,
  ArrowRight
} from "lucide-react";
import { BookingDetails } from "../types";

interface AstroBookingFlowProps {
  onBookingChanged?: () => void;
  initialSelectedAstroId?: string;
  isModal?: boolean;
}

export default function AstroBookingFlow({ onBookingChanged, initialSelectedAstroId = "astro-aanna", isModal = false }: AstroBookingFlowProps) {
  // Syncing with local bookings
  const [allBookings, setAllBookings] = useState<BookingDetails[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync admin state from localStorage
  const [isAdminMode, setIsAdminMode] = useState(() => {
    try {
      return localStorage.getItem("astro_admin_active") === "true";
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    const checkAdmin = () => {
      const active = localStorage.getItem("astro_admin_active") === "true";
      if (active !== isAdminMode) {
        setIsAdminMode(active);
      }
    };
    checkAdmin();
    const interval = setInterval(checkAdmin, 1000);
    return () => clearInterval(interval);
  }, [isAdminMode]);

  // Form State - Step 1
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    emailAddress: "",
    serviceRequired: "Kundli Analysis & Life Chart",
    preferredDate: new Date(Date.now() + 86400000).toISOString().split("T")[0], // default tomorrow
    preferredTime: "10:00 AM - 11:00 AM",
    additionalMessage: ""
  });

  // Flow step tracker
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [generatedBookingId, setGeneratedBookingId] = useState<string>("");
  const [screenshotPreview, setScreenshotPreview] = useState<string>("");
  const [bookingError, setBookingError] = useState("");
  const [successInfo, setSuccessInfo] = useState<BookingDetails | null>(null);

  // Admin filter by date state
  const [adminFilterDate, setAdminFilterDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [adminSuccessMsg, setAdminSuccessMsg] = useState("");

  // Load bookings on mount
  useEffect(() => {
    loadBookingsFromStorage();
  }, []);

  const loadBookingsFromStorage = () => {
    const saved = localStorage.getItem("astro_bookings_history");
    if (saved) {
      try {
        setAllBookings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse bookings:", e);
      }
    }
    setLoading(false);
  };

  const saveBookingsToStorage = (updatedBookings: BookingDetails[]) => {
    localStorage.setItem("astro_bookings_history", JSON.stringify(updatedBookings));
    setAllBookings(updatedBookings);
    if (onBookingChanged) {
      onBookingChanged();
    }
  };

  // Step 1: Submit Booking Details
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError("");

    if (!formData.fullName.trim()) {
      setBookingError("Please enter your full name.");
      return;
    }
    if (!formData.mobileNumber.trim() || formData.mobileNumber.length < 10) {
      setBookingError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!formData.emailAddress.trim()) {
      setBookingError("Please enter your email address.");
      return;
    }
    if (!formData.preferredDate) {
      setBookingError("Please select a preferred date.");
      return;
    }

    // Limit Check: Maximum 5 sessions per day limit of Acharya
    const bookingsOnDate = allBookings.filter(b => b.scheduled_at.startsWith(formData.preferredDate));
    if (bookingsOnDate.length >= 5) {
      setBookingError(`⚠️ Divine Daily Cap Reached: Pathak Aanna caps session bookings at strictly 5 per day to maintain intense spiritual focus. Date "${formData.preferredDate}" is fully booked. Please select another date.`);
      return;
    }

    // New Booking ID
    const bookingId = "ASTRO-" + Math.floor(100000 + Math.random() * 900000);
    setGeneratedBookingId(bookingId);

    // Initial draft setup
    const newDraftBooking: BookingDetails = {
      booking_id: bookingId,
      status: "pending_payment",
      client_name: formData.fullName,
      client_email: formData.emailAddress,
      client_mobile: formData.mobileNumber,
      astrologer_name: "Acharya Pathak Aanna",
      astrologer_specialization: "Vedic Astrology, Kundli Milan & Vastu Expert",
      consultation_type: formData.serviceRequired,
      scheduled_at: `${formData.preferredDate} (${formData.preferredTime})`,
      duration_minutes: 30,
      total_fee_inr: 2100,
      advance_amount_inr: 630,
      advance_percentage: 30,
      payment_deadline: new Date(Date.now() + 15 * 60000).toISOString(), // 15 mins countdown
      payment_methods: ["UPI"],
      upi_id: "vijaykumar4@ptyes",
      refund_policy: {
        "24hr_before": "100% refund",
        "12hr_before": "50% refund",
        "2hr_before": "No refund"
      },
      confirmation_message: "🙏 Astro slot requested.",
      additional_message: formData.additionalMessage
    };

    setSuccessInfo(newDraftBooking);
    
    // Insert into local bookkeeping history as pending draft
    const updated = [newDraftBooking, ...allBookings.filter(b => b.booking_id !== bookingId)];
    saveBookingsToStorage(updated);

    // Transition to payment info step
    setCurrentStep(2);
  };

  // Standard UPI URI representation for actual scanning
  const upiUri = `upi://pay?pa=vijaykumar4@ptyes&pn=Pathak%20Aanna&am=630&cu=INR&tn=Astro_Booking_${generatedBookingId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUri)}`;

  // Step 3: Handle Screenshot Upload & File reading
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("The image is too large. Please select an image smaller than 5MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setScreenshotPreview(base64String);
        
        // Transition to Step 4 on successful file detection & rendering
        setCurrentStep(4);
        
        // Save the screenshot string in local state
        if (successInfo) {
          const updatedWithScreenshot: BookingDetails = {
            ...successInfo,
            screenshot_url: base64String
          };
          setSuccessInfo(updatedWithScreenshot);
          const updatedList = allBookings.map(b => b.booking_id === generatedBookingId ? updatedWithScreenshot : b);
          saveBookingsToStorage(updatedList);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 5: Automatically format & open prefilled WhatsApp thread
  const triggerWhatsAppRedirect = () => {
    if (!successInfo) return;

    const whatsappNumber = "8806510889";
    const fullText = `Hello Pathak Aanna ,

Name: ${successInfo.client_name}
Mobile: ${successInfo.client_mobile || "N/A"}
Service: ${successInfo.consultation_type}
Date: ${formData.preferredDate}
Time: ${formData.preferredTime}

I have paid the advance booking fee and uploaded the payment screenshot.

Please confirm my appointment.`;

    const encodedText = encodeURIComponent(fullText);
    const targetUrl = `https://api.whatsapp.com/send?phone=91${whatsappNumber}&text=${encodedText}`;
    
    // Attempt automatic window.open
    window.open(targetUrl, "_blank", "noopener,noreferrer");
    
    // Update step tracker
    setCurrentStep(5);
  };

  // Admin / Manager action: Confirm a pending local storage booking
  const confirmBookingAdmin = (bId: string) => {
    const updated = allBookings.map(b => {
      if (b.booking_id === bId) {
        return {
          ...b,
          status: "confirmed" as const,
          confirmation_message: "✨ Approved & Scheduled! Booking is active."
        };
      }
      return b;
    });
    saveBookingsToStorage(updated);
    setAdminSuccessMsg(`Successfully confirmed booking ID ${bId}! Slot is locked.`);
    setTimeout(() => setAdminSuccessMsg(""), 5000);
  };

  // Reset form and go back to Step 1
  const restartBookingFlow = () => {
    setFormData({
      fullName: "",
      mobileNumber: "",
      emailAddress: "",
      serviceRequired: "Kundli Analysis & Life Chart",
      preferredDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      preferredTime: "10:00 AM - 11:00 AM",
      additionalMessage: ""
    });
    setGeneratedBookingId("");
    setScreenshotPreview("");
    setBookingError("");
    setSuccessInfo(null);
    setCurrentStep(1);
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Step Header */}
      <div className="bg-gradient-to-r from-[#0B3C5D] to-indigo-950 text-white p-5 rounded-md border-b-4 border-[#F2B705] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F2B705]/10 rounded-full -mr-10 -mt-10 animate-pulse"></div>
        <div className="relative z-10">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#F2B705] bg-[#F2B705]/10 px-2 py-0.5 rounded border border-[#F2B705]/20 font-extrabold">
            Panchanga Advanced Slot Allocation
          </span>
          <h3 className="font-serif font-bold text-lg md:text-xl text-white mt-1.5 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#F2B705]" />
            Fast-Track Consultation Scheduler
          </h3>
          <p className="text-[11px] text-stone-300 leading-normal mt-1">
            Pathak Aanna takes exactly 5 focused Vedic sessions per day. Reserve your high-fidelity spiritual analysis slot smoothly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVE SCHEDULER WIZARD */}
        <div className={`col-span-1 ${(isModal || !isAdminMode) ? "lg:col-span-12" : "lg:col-span-7"} bg-white rounded-md border-2 border-slate-900 shadow-[4px_4px_0px_rgba(26,26,26,0.06)] p-5 relative overflow-hidden`}>
          
          {/* Form Wizard Progress Indicators */}
          <div className="flex items-center justify-between border-b pb-4 mb-5 border-slate-100 text-[10px] md:text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            <div className={`flex items-center gap-1.5 ${currentStep === 1 ? "text-[#0B3C5D]" : "text-emerald-600"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep === 1 ? "bg-[#0B3C5D] text-white" : "bg-emerald-100 text-emerald-800"}`}>
                {currentStep > 1 ? "✓" : "1"}
              </span>
              <span>Details</span>
            </div>
            <div className="h-0.5 bg-slate-200 flex-1 mx-2"></div>
            <div className={`flex items-center gap-1.5 ${currentStep === 2 || currentStep === 3 ? "text-[#0B3C5D]" : currentStep > 3 ? "text-emerald-600" : "text-stone-300"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${(currentStep === 2 || currentStep === 3) ? "bg-[#0B3C5D] text-white" : currentStep > 3 ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-300"}`}>
                {currentStep > 3 ? "✓" : "2"}
              </span>
              <span>Payment</span>
            </div>
            <div className="h-0.5 bg-slate-200 flex-1 mx-2"></div>
            <div className={`flex items-center gap-1.5 ${currentStep >= 4 ? "text-[#0B3C5D]" : "text-stone-300"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 4 ? "bg-[#0B3C5D] text-white" : "bg-stone-100 text-stone-300"}`}>
                3
              </span>
              <span>Verify & Share</span>
            </div>
          </div>

          {/* STEP 1: FILL BOOKING FORM */}
          {currentStep === 1 && (
            <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
              <div className="bg-amber-50 border-l-4 border-[#F2B705] p-3 rounded text-[11px] text-[#0B3C5D] leading-relaxed">
                <strong>💡 Quick Instructions:</strong> Complete all details. The advanced reservation fee is strictly <strong>₹630</strong>, with the leftover balance payable after meeting completion.
              </div>

              {bookingError && (
                <div className="p-3 bg-red-50 border border-red-200 text-rose-700 rounded text-xs font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{bookingError}</span>
                </div>
              )}

              <div className="space-y-3">
                
                {/* Full name */}
                <div>
                  <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-700 block mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra Pathak"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded border border-slate-300 bg-stone-50 text-xs text-slate-800 focus:outline-none focus:border-[#0B3C5D] transition shadow-inner font-sans"
                    />
                  </div>
                </div>

                {/* Grid for Contact & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-700 block mb-1">
                      Mobile number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 8806510889"
                        value={formData.mobileNumber}
                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded border border-slate-300 bg-stone-50 text-xs text-slate-800 focus:outline-none focus:border-[#0B3C5D] transition shadow-inner font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-700 block mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. ramesh@gmail.com"
                        value={formData.emailAddress}
                        onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded border border-slate-300 bg-stone-50 text-xs text-slate-800 focus:outline-none focus:border-[#0B3C5D] transition shadow-inner font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* Dropdown Consultation Type */}
                <div>
                  <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-700 block mb-1">
                    Service Required <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.serviceRequired}
                    onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                    className="w-full px-3 py-2.5 rounded border border-slate-300 bg-stone-50 text-xs text-slate-800 focus:outline-none focus:border-[#0B3C5D] transition shadow-inner"
                  >
                    <option value="Kundli Analysis & Life Chart">Kundli Analysis & Life Chart (Vedic Devjyotish)</option>
                    <option value="Kundli Milan & Compatibility">Kundli Milan & Compatibility Matchmaking</option>
                    <option value="Shani Sade Sati Remediations">Shani Sade Sati Remediations & Graha Shanti</option>
                    <option value="Career & Wealth Alignment">Career Direction & Wealth Alignment Transit</option>
                    <option value="Gemstone Recommendation">Structural Gemstone Vibration Counseling</option>
                    <option value="Residential Vastu Consultation">Residential / Commercial Vastu Shastra Audit</option>
                    <option value="Custom Spiritual Consultation">Custom Personal Guidance with Acharya Aanna</option>
                  </select>
                </div>

                {/* Grid for Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-700 block mb-1">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-stone-50 text-slate-800 focus:outline-none focus:border-[#0B3C5D] transition shadow-inner font-sans"
                    />
                    {formData.preferredDate && (
                      <span className="text-[9px] font-semibold text-slate-500 block mt-1">
                        Current bookings on selected date: <strong className="text-slate-800">{allBookings.filter(b => b.scheduled_at.startsWith(formData.preferredDate)).length} / 5</strong>
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-700 block mb-1">
                      Preferred Time Slot <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full px-3 py-2.5 rounded border border-slate-300 bg-stone-50 text-xs text-slate-800 focus:outline-none focus:border-[#0B3C5D] transition shadow-inner"
                    >
                      <option value="09:00 AM - 10:00 AM">Slot 1 (09:00 AM - 10:00 AM)</option>
                      <option value="11:30 AM - 12:30 PM">Slot 2 (11:30 AM - 12:30 PM)</option>
                      <option value="02:30 PM - 03:30 PM">Slot 3 (02:30 PM - 03:30 PM)</option>
                      <option value="04:30 PM - 05:30 PM">Slot 4 (04:30 PM - 05:30 PM)</option>
                      <option value="06:30 PM - 07:30 PM">Slot 5 (06:30 PM - 07:30 PM)</option>
                    </select>
                  </div>
                </div>

                {/* Additional message */}
                <div>
                  <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-700 block mb-1">
                    Additional Message / Astrological Concerns
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter birth specs (Date/Time/Place of birth if available) or list specific queries for Acharya..."
                    value={formData.additionalMessage}
                    onChange={(e) => setFormData({ ...formData, additionalMessage: e.target.value })}
                    className="w-full p-2.5 rounded border border-slate-300 bg-stone-50 text-xs text-slate-800 focus:outline-none focus:border-[#0B3C5D] transition shadow-inner font-sans resize-none"
                  />
                </div>

              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-[#0B3C5D] hover:bg-slate-950 text-[#F2B705] font-extrabold py-3 rounded-md border-2 border-slate-900 shadow-[4px_4px_0px_rgba(26,26,26,1)] hover:shadow-none transition duration-150 active:translate-y-0.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>Continue to Secure UPI Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2 & 3: SCAN QR CODE AND UPLOAD SCREENSHOT */}
          {(currentStep === 2 || currentStep === 3) && successInfo && (
            <div className="space-y-5 text-left">
              
              {/* Payment Info Card */}
              <div className="border border-[#F2B705]/40 bg-[#F2B705]/5 p-4 rounded text-xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-[#F2B705]/20 pb-1.5">
                  <span className="font-bold text-[#0B3C5D]">Booking Draft Verified</span>
                  <span className="font-mono bg-slate-900 text-[#F2B705] px-2 py-0.5 rounded text-[9px] font-black">{generatedBookingId}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-stone-700 font-sans">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider block text-stone-500">Seeker:</span>
                    <strong className="text-slate-900">{successInfo.client_name}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider block text-stone-500">Service:</span>
                    <strong className="text-slate-900">{successInfo.consultation_type}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9px] uppercase tracking-wider block text-stone-500">Astro Slot Lock Time:</span>
                    <strong className="text-indigo-950">{successInfo.scheduled_at}</strong>
                  </div>
                </div>
              </div>

              {/* Step 2 UPI display component */}
              <div className="border-2 border-slate-900 rounded bg-[#fcfbf9] p-5.5 space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-mono font-extrabold px-2.5 py-1 bg-amber-100 text-amber-950 border border-amber-300 rounded-full tracking-wider uppercase">
                    Step 2: Advance Booking Payment
                  </span>
                  <h4 className="font-serif font-black text-slate-900 text-sm md:text-base mt-2">Scan QR Code or copy UPI ID</h4>
                  <p className="text-[10px] text-stone-500">Please pay the following commitment charge using any UPI application (GPay, PhonePe, Paytm, BHIM).</p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-2 border-y border-dashed border-slate-200">
                  
                  {/* Real Live-Generated UPI QR Code */}
                  <div className="bg-white p-2.5 border-2 border-slate-900 rounded shadow-md relative shrink-0">
                    <img 
                      src={qrCodeUrl} 
                      alt="UPI QR Code Placeholder" 
                      className="w-36 h-36 object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-[0.5px] pointer-events-none flex items-center justify-center">
                      <span className="text-[8px] uppercase tracking-widest font-mono bg-slate-950 text-[#F2B705] p-1 font-extrabold rounded shadow border border-[#F2B705]/20">Scan with UPI App</span>
                    </div>
                  </div>

                  <div className="text-left space-y-3 flex-1 min-w-0">
                    <div>
                      <span className="text-[10px] font-mono text-stone-400 block uppercase font-bold">UPI ID:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-[#0B3C5D] text-xs underline bg-slate-100 px-2 py-1 rounded select-all truncate">{successInfo.upi_id}</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(successInfo.upi_id);
                            alert("UPI ID Copied to clipboard!");
                          }}
                          className="bg-slate-950 hover:bg-slate-800 text-white font-serif text-[9px] font-extrabold px-2 py-1 cursor-pointer rounded shrink-0 transition"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-stone-400 block uppercase font-bold">Advance Booking Fee:</span>
                      <div className="flex items-center gap-1 text-[#F2B705]">
                        <span className="text-2xl font-mono font-black text-slate-900">₹630</span>
                        <span className="text-[10px] font-semibold text-stone-500 font-sans">(Commitment deposit)</span>
                      </div>
                    </div>

                    <div className="bg-indigo-50 border-l-2 border-[#0B3C5D] p-2.5 text-[10px] text-stone-700 leading-relaxed rounded-r shadow-inner">
                      <strong>Instructions:</strong> Please pay the advance fee of ₹630 to confirm this appointment. Once payment completes, <strong>take a screenshot of the confirmation page</strong> on your device.
                    </div>
                  </div>

                </div>

                {/* Step 3 Screenshot Upload Container */}
                <div className="space-y-2 text-left pt-2">
                  <span className="text-[10px] font-mono font-extrabold px-2.5 py-1 bg-amber-100 text-amber-950 border border-amber-300 rounded-full tracking-wider uppercase">
                    Step 3: Upload Payment Screenshot
                  </span>
                  
                  <div className="border-2 border-dashed border-slate-300 rounded-md bg-stone-50 p-4 hover:bg-stone-100/50 transition cursor-pointer relative flex flex-col items-center justify-center text-center group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleScreenshotChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-15"
                    />
                    <Upload className="w-8 h-8 text-indigo-900 mb-2 group-hover:scale-110 transition" />
                    <span className="font-serif font-extrabold text-xs text-slate-800">
                      Click to Select or Drag & Drop Screenshot
                    </span>
                    <span className="text-[9px] text-stone-500 block mt-0.5">
                      Supports PNG, JPG, JPEG formats up to 5MB
                    </span>
                  </div>
                </div>

              </div>

              {/* Reset button to change fields */}
              <button 
                onClick={restartBookingFlow}
                className="text-xs text-stone-500 hover:text-rose-600 font-bold flex items-center gap-1 transition mx-auto cursor-pointer"
              >
                ← Back & Reset Booking Details
              </button>

            </div>
          )}

          {/* STEP 4: THANK YOU MESSAGE AND REDIRECT */}
          {currentStep === 4 && successInfo && (
            <div className="space-y-5 text-center py-6">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-black text-xl text-emerald-900 leading-tight">
                  Screenshot Uploaded Successfully!
                </h4>
                <p className="text-xs text-slate-700 max-w-md mx-auto leading-relaxed">
                  Thank you. Your booking request has been received. We will verify your payment and confirm your appointment shortly.
                </p>
              </div>

              {/* Screenshot Preview Card */}
              {screenshotPreview && (
                <div className="max-w-[140px] mx-auto border-2 border-slate-900 rounded overflow-hidden shadow-md">
                  <div className="bg-slate-900 text-white text-[8px] font-mono p-1 uppercase tracking-wider">
                    Uploaded Proof
                  </div>
                  <img 
                    src={screenshotPreview} 
                    alt="Uploaded Proof" 
                    className="w-full h-24 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Automatic Trigger or Button block for WhatsApp Step 5 */}
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-md inline-block max-w-md">
                <h5 className="text-xs font-bold text-emerald-950 uppercase tracking-wide mb-1 flex items-center justify-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  Final Required Action (Step 5)
                </h5>
                <p className="text-[10px] text-emerald-900 leading-relaxed mb-3">
                  Please click the button below to automatically share your payment screenshot and booking details directly with Pathak Aanna on WhatsApp for faster instant verification!
                </p>

                <button
                  onClick={triggerWhatsAppRedirect}
                  className="w-full bg-[#25D366] text-slate-950 hover:bg-[#20ba5a] font-black py-3 px-5 rounded border-2 border-slate-950 uppercase tracking-wider text-xs shadow-md transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Verify on WhatsApp (+91 8806510889)</span>
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-2">
                <button 
                  onClick={restartBookingFlow}
                  className="text-xs text-indigo-900 hover:underline font-bold"
                >
                  Reserve Another Slot
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: REDIRECTED CONFIRMATION SCREEN */}
          {currentStep === 5 && successInfo && (
            <div className="space-y-5 text-center py-6">
              <div className="w-12 h-12 bg-indigo-100 text-[#0B3C5D] rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-6 h-6 text-[#F2B705]" />
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-black text-xl text-slate-900 leading-tight">
                  Divine Order Synced & Sent!
                </h4>
                <p className="text-xs text-slate-700 max-w-md mx-auto leading-relaxed">
                  Excellent! We have opened the WhatsApp conversation thread with Pathak Aanna containing your birth specs and proof of the commitment charge. Please send the screenshot and message to lock your chosen slot right away.
                </p>
                <div className="p-3 bg-[#F2B705]/10 border border-[#F2B705]/30 rounded text-[11px] text-slate-800 leading-relaxed max-w-sm mx-auto">
                  💡 <strong>What happens next?</strong> Pathak Aanna will confirm your appointment in the verification console shortly after seeing your transaction receipt.
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    const whatsappNumber = "8806510889";
                    const fullText = `Hello Pathak Aanna ,

Name: ${successInfo.client_name}
Mobile: ${successInfo.client_mobile || "N/A"}
Service: ${successInfo.consultation_type}
Date: ${formData.preferredDate}
Time: ${formData.preferredTime}

I have paid the advance booking fee and uploaded the payment screenshot.

Please confirm my appointment.`;
                    window.open(`https://api.whatsapp.com/send?phone=91${whatsappNumber}&text=${encodeURIComponent(fullText)}`, "_blank");
                  }}
                  className="text-xs bg-slate-950 text-white font-mono uppercase px-4 py-2 rounded border border-slate-900 hover:bg-slate-800 transition"
                >
                  Re-Open WhatsApp Thread
                </button>
                <button 
                  onClick={restartBookingFlow}
                  className="text-xs text-[#0B3C5D] font-bold py-2 px-4 hover:underline"
                >
                  Create New Booking
                </button>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: BOOKINGS HISTORY & VERIFICATION CONSOLE */}
        {isAdminMode && !isModal && (
          <div className={`col-span-1 ${isModal ? "lg:col-span-12" : "lg:col-span-5"} bg-slate-950 text-white rounded-md border-2 border-slate-900 shadow-[4px_4px_0px_rgba(26,26,26,0.06)] p-5 space-y-5 text-left`}>
            
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h4 className="font-serif font-bold text-sm text-[#F2B705] flex items-center gap-1.5">
                <CalendarDays className="w-5 h-5 text-[#F2B705]" />
                Verification & Admin Console
              </h4>
              <span className="animate-pulse w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>

            <p className="text-[11px] text-stone-400 leading-normal">
              To whom the screenshot of payment and booking details have been sent, you can verify, review screenshot details, and approve below.
            </p>

            {/* Quick Filter Panel */}
            <div className="bg-slate-900 p-3 rounded border border-stone-800 space-y-2">
              <label className="text-[9px] font-mono text-[#F2B705] block uppercase tracking-wider font-extrabold">
                Select Day to audit:
              </label>
              <div className="flex gap-2">
                <input 
                  type="date"
                  value={adminFilterDate}
                  onChange={(e) => setAdminFilterDate(e.target.value)}
                  className="bg-slate-950 border border-stone-700 rounded text-xs px-2 py-1 flex-1 text-stone-200 outline-none focus:border-[#F2B705] transition font-mono"
                />
                <button 
                  onClick={() => setAdminFilterDate(new Date().toISOString().split("T")[0])}
                  className="bg-[#0B3C5D] hover:bg-indigo-950 text-white font-mono text-[9px] font-bold px-2 rounded cursor-pointer transition uppercase"
                >
                  Today
                </button>
              </div>
            </div>

            {adminSuccessMsg && (
              <div className="p-2.5 bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-[10px] rounded leading-relaxed">
                ✓ {adminSuccessMsg}
              </div>
            )}

            {/* Render Bookings Filtered by selected day */}
            <div className="space-y-3">
              <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest block font-bold">
                Appointments scheduled on selected date ({adminFilterDate}):
              </span>

              {loading ? (
                <span className="text-[10px] text-stone-500">Loading planetary registers...</span>
              ) : allBookings.filter(b => b.scheduled_at.startsWith(adminFilterDate)).length === 0 ? (
                <div className="text-center py-6 border border-stone-800 rounded bg-slate-900/50">
                  <AlertCircle className="w-7 h-7 text-stone-600 mx-auto mb-2" />
                  <span className="text-[10px] text-stone-500 block">No requests found on this day.</span>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {allBookings
                    .filter(b => b.scheduled_at.startsWith(adminFilterDate))
                    .map((booking) => {
                      return (
                        <div 
                          key={booking.booking_id} 
                          className={`p-3 rounded border-2 text-stone-100 flex flex-col gap-2.5 transition shadow-[2px_2px_0px_rgba(26,26,26,0.06)] ${
                            booking.status === "confirmed" 
                              ? "bg-emerald-950/30 border-emerald-600/40" 
                              : "bg-slate-900 border-stone-800"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-1">
                            <div className="leading-tight">
                              <span className="text-[9px] font-mono text-amber-500 block font-black">{booking.booking_id}</span>
                              <h5 className="font-serif font-extrabold text-xs text-white">{booking.client_name}</h5>
                              <span className="text-[9px] text-stone-400 block">{booking.consultation_type}</span>
                            </div>
                            
                            <span className={`text-[8px] font-mono px-2 py-0.5 rounded uppercase font-black shrink-0 tracking-wider border ${
                              booking.status === "confirmed" 
                                ? "bg-emerald-950 border-emerald-500 text-emerald-400" 
                                : "bg-amber-950 border-[#F2B705] text-[#F2B705] animate-pulse"
                            }`}>
                              {booking.status === "confirmed" ? "Verified" : "Pending UPI Proof"}
                            </span>
                          </div>

                          <div className="text-[10px] text-stone-300 font-sans space-y-1 bg-slate-950/50 p-2 rounded border border-stone-800/80">
                            <p><strong className="text-white">Mobile:</strong> {booking.client_mobile || "N/A"}</p>
                            <p><strong className="text-white">Time:</strong> {booking.scheduled_at}</p>
                            {booking.additional_message && (
                              <p className="text-[9px] italic border-t border-stone-900 pt-1 text-stone-400 line-clamp-2">
                                &ldquo;{booking.additional_message}&rdquo;
                              </p>
                            )}
                          </div>

                          {/* Screenshot Visual verification proof */}
                          {booking.screenshot_url && (
                            <div className="flex items-center gap-2.5 bg-slate-900/60 p-1.5 rounded border border-[#F2B705]/10">
                              <div className="w-10 h-10 border border-stone-700 bg-black rounded overflow-hidden shrink-0">
                                <img 
                                  src={booking.screenshot_url} 
                                  alt="screenshot proof" 
                                  className="w-full h-full object-cover cursor-zoom-in" 
                                  onClick={() => {
                                    const w = window.open();
                                    w?.document.write(`<img src="${booking.screenshot_url}" style="max-width:100%; max-height:100vh; display:block; margin:auto;"/>`);
                                  }}
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="text-left text-[9px] leading-tight flex-1">
                                <span className="text-[#F2B705] font-extrabold uppercase font-mono block">Screenshot Proof Uploaded</span>
                                <span className="text-stone-400 block mt-0.5">Click tile to enlarge. Verify match with UPI reference ID carefully.</span>
                              </div>
                            </div>
                          )}

                          {booking.status === "pending_payment" && (
                            <div className="flex gap-2 border-t border-stone-800/50 pt-2.5 items-center">
                              <button
                                onClick={() => confirmBookingAdmin(booking.booking_id)}
                                className="w-full bg-[#0B3C5D] hover:bg-slate-900 text-white hover:text-[#F2B705] py-1.5 rounded border border-indigo-500 font-mono text-[9px] font-extrabold uppercase transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Verify & Confirm Booking</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            <div className="border-t border-stone-800 pt-3 text-[10px] text-stone-400 font-mono text-center">
              * Storage is local but resilient to browser session clears.
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
