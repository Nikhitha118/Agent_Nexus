// Campus Sentinel - Comprehensive Issue Reporting & AI Transformation Modal / View
import React, { useState, useEffect, useRef } from "react";
import { useSentinel } from "../context/SentinelContext";
import { CAMPUS_LOCATIONS } from "../data/vignanCampusLocations";
import { parseEmergencySpeech } from "../utils/emergencySpeechParser";
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send,
  Building,
  MapPin,
  FileText,
  Clock,
  Layers,
  HelpCircle,
  Eye,
  Trash2,
  RotateCw,
  Mic,
  MicOff,
  Bot
} from "lucide-react";

export const IssueReportingModal = ({ defaultCategory = null, onClose = null, inline = false }) => {
  const {
    currentUser,
    currentRole,
    submitNewReport,
    generateAiReport,
    activeReportingCategory,
    setActiveReportingCategory,
    setActiveTab
  } = useSentinel();

  const activeCat = defaultCategory || activeReportingCategory || "CLASSROOM";

  // Form fields
  const [category, setCategory] = useState(activeCat);
  const [location, setLocation] = useState("A-BLOCK");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState("");
  const recognitionRef = useRef(null);

  // Media files
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  // AI Generated Report State
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [generatedAiReport, setGeneratedAiReport] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successSubmission, setSuccessSubmission] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    if (activeReportingCategory) {
      setCategory(activeReportingCategory);
    }
  }, [activeReportingCategory]);

  // Web Speech API Voice Recognition
  const handleToggleVoice = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. You can type your issue description.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSpeechTranscript(transcript);
        setDescription(transcript);
        setIsListening(false);

        const parsed = parseEmergencySpeech(transcript, {
          locationBuilding: location
        });

        if (parsed.campusBlock) {
          setLocation(parsed.campusBlock);
        }

        const lower = transcript.toLowerCase();
        if (parsed.incidentType === "MEDICAL") {
          setCategory("MEDICAL");
        } else if (parsed.incidentType === "SECURITY") {
          setCategory("SECURITY");
        } else if (parsed.incidentType === "ACCIDENT" || lower.includes("bus") || lower.includes("transport") || lower.includes("route")) {
          setCategory("TRANSPORTATION");
        } else if (lower.includes("ac") || lower.includes("projector") || lower.includes("fan") || lower.includes("bench") || lower.includes("light") || lower.includes("board")) {
          setCategory("CLASSROOM");
        } else if (lower.includes("salary") || lower.includes("leave") || lower.includes("payroll") || lower.includes("admin")) {
          setCategory("SALARY_ADMIN");
        } else if (lower.includes("cabin") || lower.includes("office") || lower.includes("chair")) {
          setCategory("CABIN_OFFICE");
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.error("Speech recognition error:", e);
      setIsListening(false);
    }
  };

  // Handle Image File Selection
  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setErrorMsg("Please upload a valid image file (JPG, PNG, WEBP).");
        return;
      }
      setImageFile(file);
      setErrorMsg("");
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Video File Selection
  const handleVideoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov)$/i)) {
        setErrorMsg("Please upload a valid video file (MP4, WEBM, MOV).");
        return;
      }
      setVideoFile(file);
      setErrorMsg("");
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  // Trigger AI Report Generation
  const handleGenerateAiReport = async () => {
    if (!description.trim()) {
      setErrorMsg("Please enter an issue description first.");
      return;
    }

    setErrorMsg("");
    setIsGeneratingAi(true);

    try {
      const aiResult = await generateAiReport({
        category,
        location: location.trim() || "Campus Location",
        description: description.trim(),
        imageAttached: !!imagePreview,
        videoAttached: !!videoPreview,
        reporterRole: currentRole,
        reporterName: currentUser ? currentUser.name : "Campus Reporter"
      });

      setGeneratedAiReport(aiResult);
      if (aiResult.priority) {
        setPriority(aiResult.priority);
      }
    } catch (e) {
      setErrorMsg("AI generation encountered an issue. Please review details manually.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Final Report Submission
  const handleSubmitReport = async () => {
    if (!description.trim()) {
      setErrorMsg("Please provide an issue description before submitting.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const payload = {
      category,
      title: generatedAiReport ? generatedAiReport.title : `Campus ${category.replace("_", " ")} Issue`,
      location: location.trim() || (generatedAiReport ? generatedAiReport.location : "Campus Area"),
      description: description.trim(),
      priority,
      additionalNotes: additionalNotes.trim(),
      submittedBy: currentUser || {
        id: "U-STU-2026",
        name: "Rahul Verma",
        role: currentRole || "STUDENT"
      },
      aiReport: generatedAiReport || {
        title: `Campus ${category.replace("_", " ")} Report`,
        location: location.trim() || "Campus Area",
        summary: description.trim(),
        problem: description.trim(),
        requestedAction: "Departmental review requested.",
        priority,
        attachmentsNote: imageFile ? "Image attached" : "None",
        routedDepartment: category.includes("TRANS") ? "TRANSPORT" : (category.includes("MED") ? "MEDICAL" : (category.includes("SEC") ? "SECURITY" : "ADMIN"))
      },
      attachments: {
        imageUrl: imagePreview || null,
        videoUrl: videoPreview || null,
        imageName: imageFile ? imageFile.name : null,
        videoName: videoFile ? videoFile.name : null
      }
    };

    const res = await submitNewReport(payload);
    setIsSubmitting(false);

    if (res && res.success) {
      setSuccessSubmission(res.report);
    } else {
      setErrorMsg("Failed to submit report. Please try again.");
    }
  };

  const getCategoryTitle = (cat) => {
    switch (cat) {
      case "CLASSROOM": return "REPORT CLASSROOM ISSUE";
      case "TRANSPORTATION": return "REPORT TRANSPORTATION ISSUE";
      case "MEDICAL": return "REQUEST MEDICAL ASSISTANCE";
      case "CABIN_OFFICE": return "REPORT CABIN / OFFICE ISSUE";
      case "SALARY_ADMIN": return "REPORT SALARY / ADMINISTRATIVE ISSUE";
      case "SECURITY": return "REPORT CAMPUS SECURITY INCIDENT";
      case "OTHER":
      default: return "REPORT CAMPUS ISSUE";
    }
  };

  // If already submitted successfully:
  if (successSubmission) {
    return (
      <div className="bg-[#0F1626] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto text-center space-y-5 shadow-2xl animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-900/40">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            REPORT LOGGED & DISPATCHED
          </span>
          <h2 className="text-2xl font-black text-white">{successSubmission.title}</h2>
          <p className="text-xs text-slate-400 font-mono">
            REPORT ID: <strong className="text-cyan-400">{successSubmission.id}</strong> • ROUTED TO: <strong className="text-amber-400">{successSubmission.routedDepartment}</strong>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#141D32] border border-[#1E2C48] text-left text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between border-b border-[#1E2C48] pb-2">
            <span className="text-slate-400">Current Status:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-600 font-bold font-mono">
              NEW (DISPATCHED)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            The {successSubmission.routedDepartment} department has been notified. You can track real-time progress and resolution updates in your <strong>My Reports</strong> dashboard.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              if (onClose) onClose();
              setActiveReportingCategory(null);
              setActiveTab("MY_REPORTS");
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg"
          >
            <span>VIEW IN MY REPORTS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSuccessSubmission(null);
              setGeneratedAiReport(null);
              setDescription("");
              setLocation("");
              setImageFile(null);
              setImagePreview(null);
              setVideoFile(null);
              setVideoPreview(null);
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
          >
            SUBMIT ANOTHER REPORT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0F1626] border border-[#1E2C48] rounded-2xl p-4 sm:p-5 max-w-2xl w-full mx-auto space-y-3.5 shadow-2xl">
      {/* Header */}
      <div className="flex items-start justify-between pb-2.5 border-b border-[#1E2C48]">
        <div className="space-y-0.5">
          <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-blue-950/80 border border-blue-700/60 text-cyan-400 text-[9.5px] font-mono font-bold uppercase tracking-wider">
            <Building className="w-2.5 h-2.5" />
            <span>CAMPUS ISSUE DISPATCH</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
            {getCategoryTitle(category)}
          </h2>
          <p className="text-[11px] text-slate-400">
            Provide details below. You can write informal notes and click <strong>GENERATE AI REPORT</strong> for automatic structured formatting.
          </p>
        </div>

        {onClose && (
          <button
            onClick={() => {
              onClose();
              setActiveReportingCategory(null);
            }}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-500/60 text-red-300 text-xs flex items-center space-x-2 animate-shake">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Voice Recognition Quick Speak Bar */}
      <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-950/80 via-[#141D32] to-cyan-950/80 border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleToggleVoice}
          className={`w-full sm:w-auto px-3 py-1.5 rounded-lg font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-95 ${
            isListening
              ? "bg-red-600 text-white animate-pulse border border-red-400"
              : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border border-cyan-400/40"
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-3 h-3 animate-bounce" />
              <span>🎤 LISTENING... (SPEAK NOW)</span>
            </>
          ) : (
            <>
              <Mic className="w-3 h-3" />
              <span>🎤 SPEAK ISSUE (VOICE INPUT)</span>
            </>
          )}
        </button>

        <p className="text-[10px] text-slate-300 italic text-center sm:text-left flex-1">
          {isListening
            ? "Speak clearly: e.g. 'Projector is not working in H block room 204'"
            : speechTranscript
            ? `Transcribed: "${speechTranscript}"`
            : "Click microphone and speak naturally, or type below."}
        </p>
      </div>

      {/* Main Form Fields */}
      <div className="space-y-3">
        {/* Category & Location Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300 flex items-center space-x-1.5">
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>Issue Category</span>
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setGeneratedAiReport(null);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#141D32] border border-[#1E2C48] text-white text-xs font-semibold focus:outline-none focus:border-cyan-500"
            >
              <option value="CLASSROOM">CLASSROOM ISSUES</option>
              <option value="TRANSPORTATION">TRANSPORTATION ISSUES</option>
              <option value="MEDICAL">MEDICAL ASSISTANCE</option>
              <option value="CABIN_OFFICE">CABIN / OFFICE ISSUES (FACULTY)</option>
              <option value="SALARY_ADMIN">SALARY / ADMINISTRATIVE ISSUES (FACULTY)</option>
              <option value="SECURITY">CAMPUS SECURITY & SAFETY</option>
              <option value="OTHER">OTHER CAMPUS ISSUES</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300 flex items-center space-x-1.5">
              <MapPin className="w-3 h-3 text-rose-400" />
              <span>Vignan Campus Location</span>
            </label>
            <select
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setGeneratedAiReport(null);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#141D32] border border-[#1E2C48] text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
            >
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name} {loc.isSafeZone ? "(Safe Zone)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Informal Text Description Field */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-300 flex items-center space-x-1.5">
              <FileText className="w-3 h-3 text-amber-400" />
              <span>Description (Informal Language Supported)</span>
            </label>
            <span className="text-[9.5px] font-mono text-cyan-400/80">AI will format this cleanly</span>
          </div>
          <textarea
            rows={2}
            required
            placeholder="Type your issue naturally, e.g.: AC not working in classroom B204. It is not cooling properly."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setGeneratedAiReport(null);
            }}
            className="w-full px-2.5 py-1.5 rounded-lg bg-[#141D32] border border-[#1E2C48] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none font-sans"
          />
        </div>

        {/* Media Attachments Section (Image + Video Upload) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
          {/* IMAGE UPLOAD */}
          <div className="p-2.5 rounded-xl bg-[#141D32]/80 border border-[#1E2C48] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 flex items-center space-x-1">
                <ImageIcon className="w-3 h-3 text-emerald-400" />
                <span>Upload Image</span>
              </span>
              <span className="text-[9px] text-slate-400 font-mono">JPG, PNG</span>
            </div>

            <input
              type="file"
              ref={imageInputRef}
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleImageChange}
              className="hidden"
            />

            {!imagePreview ? (
              <button
                type="button"
                onClick={() => imageInputRef.current && imageInputRef.current.click()}
                className="w-full py-2 px-2.5 rounded-lg bg-[#0F1626] hover:bg-[#1A253E] border border-dashed border-[#1E2C48] hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 text-[11px] font-semibold flex items-center justify-center space-x-1.5 transition-all"
              >
                <Upload className="w-3 h-3" />
                <span>SELECT PHOTO</span>
              </button>
            ) : (
              <div className="space-y-1.5">
                <div className="relative rounded-lg overflow-hidden border border-[#1E2C48] bg-black/60 h-20 flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Uploaded preview"
                    className="max-h-full max-w-full object-contain"
                  />
                  <span className="absolute bottom-1 left-1.5 text-[8px] font-mono bg-black/80 px-1 py-0.2 rounded text-emerald-300">
                    ATTACHED
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 truncate max-w-[120px]">
                    {imageFile ? imageFile.name : "Photo attached"}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => imageInputRef.current && imageInputRef.current.click()}
                      className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 hover:bg-slate-700 text-[9.5px]"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="p-1 rounded bg-red-950 text-red-400 hover:bg-red-900"
                      title="Remove image"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* VIDEO UPLOAD */}
          <div className="p-2.5 rounded-xl bg-[#141D32]/80 border border-[#1E2C48] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 flex items-center space-x-1">
                <VideoIcon className="w-3 h-3 text-cyan-400" />
                <span>Upload Video</span>
              </span>
              <span className="text-[9px] text-slate-400 font-mono">MP4, WEBM</span>
            </div>

            <input
              type="file"
              ref={videoInputRef}
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleVideoChange}
              className="hidden"
            />

            {!videoPreview ? (
              <button
                type="button"
                onClick={() => videoInputRef.current && videoInputRef.current.click()}
                className="w-full py-2 px-2.5 rounded-lg bg-[#0F1626] hover:bg-[#1A253E] border border-dashed border-[#1E2C48] hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-[11px] font-semibold flex items-center justify-center space-x-1.5 transition-all"
              >
                <Upload className="w-3 h-3" />
                <span>SELECT VIDEO</span>
              </button>
            ) : (
              <div className="space-y-1.5">
                <div className="relative rounded-lg overflow-hidden border border-[#1E2C48] bg-black/60 h-20 flex items-center justify-center">
                  <video
                    src={videoPreview}
                    muted
                    controls
                    className="max-h-full max-w-full"
                  />
                  <span className="absolute bottom-1 left-1.5 text-[8px] font-mono bg-black/80 px-1 py-0.2 rounded text-cyan-300">
                    ATTACHED
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 truncate max-w-[120px]">
                    {videoFile ? videoFile.name : "Video attached"}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => videoInputRef.current && videoInputRef.current.click()}
                      className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 hover:bg-slate-700 text-[9.5px]"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoFile(null);
                        setVideoPreview(null);
                      }}
                      className="p-1 rounded bg-red-950 text-red-400 hover:bg-red-900"
                      title="Remove video"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Priority & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">Priority Level</label>
            <div className="grid grid-cols-4 gap-1">
              {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => {
                const isSel = priority === p;
                const colors = {
                  LOW: "bg-slate-800 text-slate-300 border-slate-700",
                  MEDIUM: "bg-amber-950/80 text-amber-300 border-amber-600/80",
                  HIGH: "bg-orange-950/80 text-orange-300 border-orange-600/80",
                  CRITICAL: "bg-red-950/80 text-red-300 border-red-600/80"
                };
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-1 rounded-md text-[9.5px] font-bold uppercase font-mono border transition-all ${
                      isSel ? `${colors[p]} ring-1 ring-white/30 shadow` : "bg-[#141D32] text-slate-400 border-[#1E2C48] hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">Additional Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Alternate room or time"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#141D32] border border-[#1E2C48] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        {/* AI GENERATE REPORT BUTTON */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleGenerateAiReport}
            disabled={isGeneratingAi || !description.trim()}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-md shadow-cyan-600/20 border border-cyan-400/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 text-cyan-200 ${isGeneratingAi ? "animate-spin" : ""}`} />
            <span>{isGeneratingAi ? "TRANSFORMING WITH SENTINEL AI..." : "GENERATE AI REPORT"}</span>
          </button>
        </div>

        {/* AI GENERATED REPORT PREVIEW CARD */}
        {generatedAiReport && (
          <div className="p-3.5 rounded-xl bg-[#090D17] border-2 border-cyan-500/50 shadow-xl space-y-2.5 animate-fade-in relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E2C48]">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <h4 className="text-[11px] font-black text-white uppercase tracking-wider">
                  SENTINEL AI STRUCTURED REPORT PREVIEW
                </h4>
              </div>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                AUTO-ROUTED: {generatedAiReport.routedDepartment}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-slate-400 uppercase">TITLE:</span>
                <p className="font-bold text-white text-[11.5px]">{generatedAiReport.title}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-slate-400 uppercase">LOCATION:</span>
                <p className="font-bold text-cyan-300 text-[11.5px]">{generatedAiReport.location}</p>
              </div>

              <div className="space-y-0.5 sm:col-span-2">
                <span className="text-[9px] font-mono text-slate-400 uppercase">ISSUE SUMMARY:</span>
                <p className="text-slate-200 text-[11px] leading-relaxed bg-[#141D32] p-2 rounded-lg border border-[#1E2C48]">
                  {generatedAiReport.summary}
                </p>
              </div>

              <div className="space-y-0.5 sm:col-span-2">
                <span className="text-[9px] font-mono text-slate-400 uppercase">REQUESTED ACTION:</span>
                <p className="text-amber-200 text-[11px] leading-relaxed bg-amber-950/40 p-2 rounded-lg border border-amber-600/30">
                  {generatedAiReport.requestedAction}
                </p>
              </div>
            </div>

            {/* Action Buttons inside Preview */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#1E2C48]">
              <button
                type="button"
                onClick={() => setGeneratedAiReport(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                EDIT DETAILS
              </button>
              <button
                type="button"
                onClick={handleSubmitReport}
                disabled={isSubmitting}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-md shadow-emerald-600/20"
              >
                <Send className="w-3 h-3" />
                <span>{isSubmitting ? "DISPATCHING..." : "SUBMIT REPORT"}</span>
              </button>
            </div>
          </div>
        )}

        {/* DIRECT SUBMIT (If user chooses not to preview AI) */}
        {!generatedAiReport && (
          <div className="flex items-center justify-end space-x-2 pt-1">
            {onClose && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setActiveReportingCategory(null);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                CANCEL
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmitReport}
              disabled={isSubmitting || !description.trim()}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
              <span>{isSubmitting ? "SUBMITTING..." : "SUBMIT DIRECTLY"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
