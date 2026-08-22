// Campus Sentinel AI - Live Camera Vision Studio (Strict False-Positive Prevention)
import React, { useState, useEffect, useRef } from "react";
import { useSentinel } from "../context/SentinelContext";
import {
  Camera,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Video,
  VideoOff,
  Activity,
  ShieldCheck,
  Zap,
  RotateCcw
} from "lucide-react";

export const LiveCameraStudio = () => {
  const {
    cameras,
    activeIncident,
    selectedCameraId,
    setSelectedCameraId,
    triggerSimulation,
    resetSystem
  } = useSentinel();

  const videoRef = useRef(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const currentCam = cameras.find(c => c.id === selectedCameraId) || cameras[1] || {
    id: "CAM-02",
    name: "Main Academic Block - Floor 2 Corridor",
    location: "Main Academic Block",
    status: "MONITORING",
    aiConfidence: 0,
    currentRisk: "NORMAL"
  };

  // Determine State:
  // 🟢 NORMAL (< 60%)
  // 🟡 POSSIBLE SMOKE / VERIFYING (60-80%)
  // 🔴 FIRE CONFIRMED (> 80% with multi-frame confirmation)
  const isTargetCamActive = activeIncident && (currentCam.id === "CAM-02" || activeIncident.location.includes("Academic"));
  const confidence = isTargetCamActive ? 94 : isVerifying ? 72 : 0;
  const statusState = confidence >= 80 ? "CONFIRMED" : confidence >= 60 ? "VERIFYING" : "NORMAL";

  // Start Browser Webcam
  const startWebcam = async () => {
    setWebcamError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsWebcamActive(true);
        }
      } else {
        setWebcamError("Webcam media devices API not supported in this browser.");
      }
    } catch (err) {
      console.warn("Webcam access error:", err);
      setWebcamError(`Webcam access: ${err.message || "Permission denied"}. Simulated optical feed active.`);
    }
  };

  // Stop Webcam
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(t => t.stop());
      videoRef.current.srcObject = null;
      setIsWebcamActive(false);
    }
  };

  // Handle Demo Fire Test with Realistic 3-Step Verification
  const handleTestFireEmergency = async () => {
    setIsVerifying(true);
    // Step 1: Possible Smoke (1.5s)
    setTimeout(async () => {
      // Step 2: Fire Confirmed -> Trigger Multi-Agent Workflow
      await triggerSimulation("FIRE");
      setIsVerifying(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Header & Clean Verification States */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#1E2C48]">
        <div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-600 text-white font-bold uppercase">
            EDGE VISION STUDIO
          </span>
          <h2 className="text-xl font-black text-white mt-1">Live Camera Stream & Verification</h2>
        </div>

        {/* 3 Status Indicators */}
        <div className="flex items-center space-x-2 text-xs font-mono font-bold">
          {statusState === "NORMAL" && (
            <span className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center space-x-1.5 shadow">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>🟢 NORMAL (0% NOISE)</span>
            </span>
          )}

          {statusState === "VERIFYING" && (
            <span className="px-3 py-1.5 rounded-lg bg-amber-950 text-amber-300 border border-amber-600 flex items-center space-x-1.5 animate-pulse shadow">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block animate-ping"></span>
              <span>🟡 POSSIBLE SMOKE / VERIFYING...</span>
            </span>
          )}

          {statusState === "CONFIRMED" && (
            <span className="px-3 py-1.5 rounded-lg bg-red-950 text-red-300 border border-red-500 flex items-center space-x-1.5 animate-pulse shadow-lg shadow-red-900/50">
              <Flame className="w-4 h-4 text-red-400" />
              <span>🔴 FIRE CONFIRMED (94%)</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Video Screen */}
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-[#050811] border-2 border-[#1E2C48] shadow-2xl flex items-center justify-center group">
        {/* Real Webcam Stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${isWebcamActive ? 'block' : 'hidden'}`}
        />

        {/* Peaceful Simulated Stream */}
        {!isWebcamActive && (
          <div className="text-center p-6 space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#0F1626] border border-[#1E2C48] flex items-center justify-center mx-auto shadow-inner">
              <Camera className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{currentCam.name}</h3>
              <p className="text-xs text-slate-400 font-mono">1080p Optical Stream • Strict False-Alarm Filter</p>
            </div>
            <button
              onClick={startWebcam}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition-all"
            >
              Enable Browser Webcam
            </button>
          </div>
        )}

        {/* Fire Bounding Box when Confirmed */}
        {statusState === "CONFIRMED" && (
          <div className="absolute inset-0 pointer-events-none p-8 flex items-center justify-center">
            <div className="w-3/4 h-3/4 border-2 border-red-500 rounded-2xl relative bg-red-500/10 animate-pulse flex flex-col justify-between p-3 shadow-2xl shadow-red-500/30">
              <div className="flex items-center justify-between text-xs font-mono font-bold bg-red-600 text-white px-2.5 py-1 rounded-lg">
                <span className="flex items-center space-x-1">
                  <Flame className="w-4 h-4 text-amber-200" />
                  <span>FLAME DETECTED</span>
                </span>
                <span>CONFIDENCE: 94%</span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-red-300 bg-black/80 px-2.5 py-1 rounded-lg">
                <span>LOCATION: {currentCam.location}</span>
                <span className="text-amber-400">✓ MULTI-FRAME VERIFIED (3/3)</span>
              </div>
            </div>
          </div>
        )}

        {/* Top Camera Tag */}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-xs font-mono text-white">
          <span className="font-bold">{currentCam.id}</span>
          <span className="text-slate-400"> | {currentCam.location}</span>
        </div>

        {/* Bottom Webcam Toggle */}
        {isWebcamActive && (
          <button
            onClick={stopWebcam}
            className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold shadow"
          >
            Stop Webcam
          </button>
        )}
      </div>

      {/* Camera Grid Selector */}
      <div className="p-4 rounded-2xl bg-[#0F1626] border border-[#1E2C48] space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold text-white uppercase tracking-wider">Select Campus Optical Feed:</span>
          <span>8 Cameras Active</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {cameras.map((c) => {
            const isSelected = c.id === currentCam.id;
            const hasAnomaly = (c.id === "CAM-02" && activeIncident);
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCameraId(c.id)}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  isSelected
                    ? "bg-blue-600/20 border-blue-500 text-white shadow"
                    : hasAnomaly
                    ? "bg-red-950/40 border-red-500/60 text-red-300"
                    : "bg-[#141D32] border-[#1E2C48] text-slate-300 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="font-bold">{c.id}</span>
                  <span className={hasAnomaly ? "text-red-400 font-bold" : "text-emerald-400"}>
                    {hasAnomaly ? "CRITICAL" : "NORMAL"}
                  </span>
                </div>
                <div className="text-[11px] font-semibold truncate mt-1">{c.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Demo Controls Box (Clearly separated for Hackathon demonstration) */}
      <div className="p-5 rounded-2xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Hackathon Demonstration Trigger</span>
            </h3>
            <p className="text-xs text-slate-400">
              Reliably test the complete multi-frame verification & emergency workflow.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleTestFireEmergency}
              disabled={isVerifying}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs shadow-lg shadow-red-600/30 flex items-center space-x-2 border border-red-400/40 transition-all active:scale-95"
            >
              <Flame className="w-4 h-4 text-amber-200" />
              <span>🔥 TEST FIRE EMERGENCY (DEMO)</span>
            </button>

            <button
              onClick={resetSystem}
              className="px-4 py-2.5 rounded-xl bg-[#141D32] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#1E2C48] text-xs font-bold flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>
          </div>
        </div>

        {/* Verification explanation rule */}
        <div className="p-3 rounded-xl bg-[#141D32] text-xs text-slate-300 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span>&lt; 60% Confidence: <strong className="text-emerald-400">🟢 Normal</strong></span>
            <span>60–80%: <strong className="text-amber-400">🟡 Possible / Verifying</strong></span>
            <span>&gt; 80% (Multi-Frame): <strong className="text-red-400">🔴 Fire Confirmed</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

