// Campus Sentinel - Emergency AI Quick Alert Interface
import React, { useState, useRef } from "react";
import { useSentinel } from "../context/SentinelContext";
import {
  ShieldAlert,
  Flame,
  HeartPulse,
  CloudLightning,
  Car,
  Shield,
  Users,
  HelpCircle,
  Camera,
  Video,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  ArrowRight,
  Upload,
  Radio,
  Truck,
  Ambulance,
  Compass,
  FileText
} from "lucide-react";

export const EmergencyAiQuickModal = () => {
  const {
    isEmergencyAiModalOpen,
    closeEmergencyAiModal,
    submitEmergencyQuickAlert,
    analyzeEmergencyQuickReport,
    buildings,
    currentUser
  } = useSentinel();

  // Form State
  const [incidentType, setIncidentType] = useState("FIRE");
  const [description, setDescription] = useState("");
  const [locationBuilding, setLocationBuilding] = useState("Main Academic Block");
  const [specificLocation, setSpecificLocation] = useState("Room 302, 3rd Floor");
  const [gpsLocation, setGpsLocation] = useState(null);
  const [isGpsLoading, setIsGpsLoading] = useState(false);

  // Media State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAssessment, setAiAssessment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  if (!isEmergencyAiModalOpen) return null;

  // 7 Incident Type Cards
  const INCIDENT_TYPES = [
    {
      id: "FIRE",
      label: "Fire",
      icon: Flame,
      color: "from-red-600 to-amber-700",
      border: "border-red-500",
      desc: "Smoke, flame, explosion, thermal hazard"
    },
    {
      id: "MEDICAL",
      label: "Medical Emergency",
      icon: HeartPulse,
      color: "from-rose-600 to-red-700",
      border: "border-rose-500",
      desc: "Acute illness, collapse, bleeding, trauma"
    },
    {
      id: "WEATHER",
      label: "Severe Weather",
      icon: CloudLightning,
      color: "from-amber-600 to-orange-700",
      border: "border-amber-500",
      desc: "Cyclone, flooding, lightning, fallen trees"
    },
    {
      id: "ACCIDENT",
      label: "Accident",
      icon: Car,
      color: "from-purple-600 to-indigo-700",
      border: "border-purple-500",
      desc: "Vehicle crash, transit collision, corridor crush"
    },
    {
      id: "SECURITY",
      label: "Security Incident",
      icon: Shield,
      color: "from-sky-600 to-blue-700",
      border: "border-sky-500",
      desc: "Intruder, weapon, trespass, physical threat"
    },
    {
      id: "CROWD",
      label: "Crowd / Public Safety",
      icon: Users,
      color: "from-teal-600 to-cyan-700",
      border: "border-teal-500",
      desc: "Stampede risk, bottleneck, blocked exit turnstiles"
    },
    {
      id: "OTHER",
      label: "Other Emergency",
      icon: HelpCircle,
      color: "from-slate-600 to-slate-700",
      border: "border-slate-500",
      desc: "Any other urgent campus hazard or situation"
    }
  ];

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle Video Upload
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  // GPS Location Trigger
  const handleUseLocation = () => {
    setIsGpsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsGpsLoading(false);
        },
        (err) => {
          // Fallback to simulated campus GPS
          setGpsLocation({ lat: 16.2335, lng: 80.5484 });
          setIsGpsLoading(false);
        },
        { timeout: 5000 }
      );
    } else {
      setGpsLocation({ lat: 16.2335, lng: 80.5484 });
      setIsGpsLoading(false);
    }
  };

  // Trigger AI Analysis
  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    const fullLoc = `${locationBuilding} — ${specificLocation}`;
    const res = await analyzeEmergencyQuickReport({
      incidentType,
      location: fullLoc,
      description,
      hasImage: !!imageFile || !!imagePreview,
      hasVideo: !!videoFile || !!videoPreview,
      gpsCoords: gpsLocation
    });
    setIsAnalyzing(false);
    if (res && res.assessment) {
      setAiAssessment(res.assessment);
    }
  };

  // Submit Final Emergency Alert
  const handleSubmitAlert = async () => {
    setIsSubmitting(true);
    const fullLoc = `${locationBuilding} — ${specificLocation}`;
    const payload = {
      incidentType: aiAssessment ? aiAssessment.type : incidentType,
      location: fullLoc,
      description,
      attachments: {
        imageUrl: imagePreview,
        imageName: imageFile ? imageFile.name : null,
        videoUrl: videoPreview,
        videoName: videoFile ? videoFile.name : null
      },
      aiAssessment: aiAssessment || {
        type: incidentType,
        severity: "HIGH",
        confidence: 88,
        severityReason: "Urgent emergency report submitted from campus portal."
      },
      reportedBy: currentUser || {
        id: `ANON-${Date.now()}`,
        name: "Anonymous Reporter",
        role: "STUDENT"
      },
      gpsCoords: gpsLocation
    };

    await submitEmergencyQuickAlert(payload);
    setIsSubmitting(false);
    setSubmitSuccess(true);

    setTimeout(() => {
      setSubmitSuccess(false);
      closeEmergencyAiModal();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#0F1626] border-2 border-red-500/70 rounded-3xl shadow-2xl shadow-red-950/80 overflow-hidden flex flex-col max-h-[92vh]">
        {/* 1. Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-b border-red-500/40 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/40 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-wider uppercase">
                  EMERGENCY AI
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-600 text-white animate-pulse">
                  RAPID ALERT
                </span>
              </div>
              <p className="text-xs text-red-200">
                Rapid Incident Reporting & Autonomous Resource Dispatch • Vignan University
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeEmergencyAiModal}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-xs sm:text-sm">
          {submitSuccess ? (
            <div className="py-16 text-center space-y-4 animate-scale-in">
              <div className="w-20 h-20 rounded-full bg-emerald-600/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-white">
                EMERGENCY ALERT BROADCASTED
              </h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Incident logged, first responders dispatched, and real-time safe evacuation routes generated across campus.
              </p>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-mono font-bold border border-emerald-700">
                Campus Sentinel Network Active
              </span>
            </div>
          ) : (
            <>
              {/* STEP 1: Select Incident Type */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white inline-flex items-center justify-center text-[10px]">1</span>
                    <span>SELECT INCIDENT TYPE</span>
                  </label>
                  <span className="text-[11px] font-mono text-cyan-400">Direct Command Classification</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {INCIDENT_TYPES.map((t) => {
                    const Icon = t.icon;
                    const isSelected = incidentType === t.id;
                    return (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => {
                          setIncidentType(t.id);
                          setAiAssessment(null);
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                          isSelected
                            ? `bg-gradient-to-br ${t.color} text-white ${t.border} shadow-lg scale-[1.02]`
                            : "bg-[#141D32] border-[#1E2C48] text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-slate-400"}`} />
                          {isSelected && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
                        </div>
                        <div>
                          <p className="font-black text-xs">{t.label}</p>
                          <p className="text-[9px] opacity-80 line-clamp-1">{t.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: Location Selection */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#141D32] border border-[#1E2C48]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white inline-flex items-center justify-center text-[10px]">2</span>
                    <span>LOCATION (AUTHORITATIVE PRIMARY SOURCE)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleUseLocation}
                    disabled={isGpsLoading}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-blue-950 text-cyan-400 border border-blue-700 hover:bg-blue-900 flex items-center space-x-1"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{isGpsLoading ? "Locating..." : gpsLocation ? "GPS Locked (✓)" : "Use My GPS"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Campus Building / Zone</span>
                    <select
                      value={locationBuilding}
                      onChange={(e) => {
                        setLocationBuilding(e.target.value);
                        setAiAssessment(null);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-[#0B101D] border border-[#1E2C48] text-white text-xs focus:outline-none focus:border-red-500 font-mono"
                    >
                      <option value="Main Academic Block">Main Academic Block (A-Block)</option>
                      <option value="CSE & IT Block">CSE & IT Block (B-Block)</option>
                      <option value="Main Central Library">Central Library</option>
                      <option value="Pharmacy & Biotech Block">Pharmacy & Biotech Block</option>
                      <option value="Mechanical & Civil Workshop">Mechanical & Civil Workshop</option>
                      <option value="Student Activity Center">Student Activity Center / Cafeteria</option>
                      <option value="Boys Hostel Complex">Boys Hostel Complex</option>
                      <option value="Girls Hostel Complex">Girls Hostel Complex</option>
                      <option value="Central Quadrangle Green">Central Quadrangle Green</option>
                      <option value="North Gate Checkpoint">North Gate Checkpoint</option>
                      <option value="South Transit Depot">South Transit Depot</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Specific Room / Floor / Area</span>
                    <input
                      type="text"
                      value={specificLocation}
                      onChange={(e) => {
                        setSpecificLocation(e.target.value);
                        setAiAssessment(null);
                      }}
                      placeholder="e.g. Room 302, 3rd Floor, West Wing"
                      className="w-full px-3 py-2 rounded-xl bg-[#0B101D] border border-[#1E2C48] text-white text-xs focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  * Note: Map and GPS location are authoritative. AI visual clues serve as secondary verification.
                </p>
              </div>

              {/* STEP 3: Media Upload & Description */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#141D32] border border-[#1E2C48]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white inline-flex items-center justify-center text-[10px]">3</span>
                    <span>EVIDENCE: IMAGE, VIDEO, OR DESCRIPTION</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Any 1 source is sufficient</span>
                </div>

                {/* Description Input */}
                <div>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setAiAssessment(null);
                    }}
                    placeholder="Describe what is happening (e.g. Heavy black smoke coming from the electrical lab, alarms sounding, students moving out)..."
                    className="w-full p-3 rounded-xl bg-[#0B101D] border border-[#1E2C48] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Media Buttons & Previews */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Photo Upload */}
                  <div className="p-3 rounded-xl bg-[#0B101D] border border-[#1E2C48] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 flex items-center space-x-1">
                        <Camera className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Upload Photo</span>
                      </span>
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="text-[10px] text-red-400 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <input
                      type="file"
                      ref={imageInputRef}
                      onChange={handleImageChange}
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                    />

                    {imagePreview ? (
                      <div className="relative rounded-lg overflow-hidden border border-[#1E2C48] h-28 bg-black">
                        <img src={imagePreview} alt="Evidence" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => imageInputRef.current.click()}
                          className="absolute bottom-1 right-1 px-2 py-0.5 rounded bg-black/80 text-[9px] text-cyan-300"
                        >
                          Replace
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => imageInputRef.current.click()}
                        className="w-full py-4 border border-dashed border-[#1E2C48] rounded-lg text-slate-400 hover:text-cyan-400 hover:border-cyan-500 text-xs flex flex-col items-center justify-center space-y-1 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        <span>+ Upload Image (JPG/PNG)</span>
                      </button>
                    )}
                  </div>

                  {/* Video Upload */}
                  <div className="p-3 rounded-xl bg-[#0B101D] border border-[#1E2C48] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 flex items-center space-x-1">
                        <Video className="w-3.5 h-3.5 text-red-400" />
                        <span>Upload Video</span>
                      </span>
                      {videoPreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setVideoFile(null);
                            setVideoPreview(null);
                          }}
                          className="text-[10px] text-red-400 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <input
                      type="file"
                      ref={videoInputRef}
                      onChange={handleVideoChange}
                      accept="video/mp4,video/mov,video/webm"
                      className="hidden"
                    />

                    {videoPreview ? (
                      <div className="relative rounded-lg overflow-hidden border border-[#1E2C48] h-28 bg-black flex items-center justify-center">
                        <video src={videoPreview} controls className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => videoInputRef.current.click()}
                        className="w-full py-4 border border-dashed border-[#1E2C48] rounded-lg text-slate-400 hover:text-red-400 hover:border-red-500 text-xs flex flex-col items-center justify-center space-y-1 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        <span>+ Upload Video (MP4/WebM)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* STEP 4: AI Analysis Button */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleRunAiAnalysis}
                  disabled={isAnalyzing}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center space-x-2 mx-auto transition-all active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-cyan-300 animate-spin-slow" />
                  <span>{isAnalyzing ? "AI ANALYZING EVIDENCE..." : "ANALYZE WITH EMERGENCY AI"}</span>
                </button>
              </div>

              {/* STEP 5: AI Assessment Card Output */}
              {aiAssessment && (
                <div className="p-5 rounded-3xl bg-gradient-to-br from-[#141D32] via-[#0F1626] to-[#141D32] border-2 border-cyan-500/50 shadow-2xl space-y-4 animate-scale-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1E2C48]">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span className="font-black text-white uppercase text-xs sm:text-sm">
                        AI Incident Risk & Threat Assessment
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-cyan-300 border border-blue-700 font-bold">
                        CONFIDENCE: {aiAssessment.confidence}%
                      </span>
                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold border ${
                        aiAssessment.severity === "CRITICAL"
                          ? "bg-red-950 text-red-300 border-red-600"
                          : "bg-amber-950 text-amber-300 border-amber-600"
                      }`}>
                        {aiAssessment.severity} SEVERITY
                      </span>
                    </div>
                  </div>

                  {/* Why this severity explanation */}
                  <div className="p-3 rounded-xl bg-black/40 border border-[#1E2C48] space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">WHY THIS SEVERITY?</span>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {aiAssessment.severityReason}
                    </p>
                  </div>

                  {/* Affected Area & Visible Hazards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#0B101D] border border-[#1E2C48] space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">ESTIMATED AFFECTED AREA</span>
                      <p className="font-bold text-white">{aiAssessment.affectedArea}</p>
                      <p className="text-[10px] text-slate-400">Occupants at Risk: ~{aiAssessment.peopleAtRisk}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0B101D] border border-[#1E2C48] space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">DETECTED HAZARDS</span>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {aiAssessment.visibleHazards?.map((h, i) => (
                          <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/70 text-red-300 border border-red-800">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommended Response Units */}
                  <div className="p-3 rounded-xl bg-[#0B101D] border border-[#1E2C48] space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">RECOMMENDED RESPONSE UNITS</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-sky-950 text-sky-300 border border-sky-700 font-mono text-xs font-bold flex items-center space-x-1">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Security: {aiAssessment.recommendedUnits?.security || 2}</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-700 font-mono text-xs font-bold flex items-center space-x-1">
                        <HeartPulse className="w-3.5 h-3.5" />
                        <span>Medical: {aiAssessment.recommendedUnits?.medical || 1}</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-red-950 text-red-300 border border-red-700 font-mono text-xs font-bold flex items-center space-x-1">
                        <Ambulance className="w-3.5 h-3.5" />
                        <span>Ambulance: {aiAssessment.recommendedUnits?.ambulance || 1}</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono text-xs font-bold flex items-center space-x-1">
                        <Truck className="w-3.5 h-3.5" />
                        <span>Transport: {aiAssessment.recommendedUnits?.transport || 1}</span>
                      </span>
                      {aiAssessment.recommendedUnits?.fireSafety > 0 && (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-700 font-mono text-xs font-bold flex items-center space-x-1">
                          <Flame className="w-3.5 h-3.5" />
                          <span>Fire Tender: {aiAssessment.recommendedUnits?.fireSafety}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 text-center italic">
                    {aiAssessment.disclaimer || "AI Assessment — Human Verification Recommended"}
                  </p>
                </div>
              )}

              {/* STEP 6: Final Confirmation & Dispatch */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border border-red-500/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-black text-white uppercase text-xs sm:text-sm">
                      READY TO DISPATCH EMERGENCY ALERT
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      Target Location: <strong className="text-white">{locationBuilding} ({specificLocation})</strong>
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-red-600 text-white font-mono text-xs font-black">
                    {aiAssessment ? aiAssessment.type : incidentType}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSubmitAlert}
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm uppercase tracking-wider shadow-2xl shadow-red-600/50 border border-white/20 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  <ShieldAlert className="w-5 h-5 animate-bounce" />
                  <span>{isSubmitting ? "BROADCASTING EMERGENCY ALERT..." : "🚨 SUBMIT EMERGENCY ALERT"}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
