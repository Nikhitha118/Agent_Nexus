// Campus Sentinel AI - Interactive Judge Demonstration Tour Guide
import React, { useState, useEffect } from "react";
import { useSentinel } from "../context/SentinelContext";
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Sparkles,
  Flame,
  Navigation,
  Shield,
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  X,
  Bot
} from "lucide-react";

export const GuidedDemoTour = ({ isOpen, onClose }) => {
  const {
    triggerSimulation,
    triggerRoadBlockage,
    handleApprovalDecision,
    setActiveTab,
    resetSystem,
    activeIncident
  } = useSentinel();

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    {
      title: "1. Campus Digital Twin at 2:30 PM (Peacetime Baseline)",
      narrative: "Imagine it is 2:30 PM on a typical university afternoon. Hundreds of students and faculty are in academic halls, labs, and the library. 8 optical CCTV edge cameras continuously monitor all campus sectors.",
      agentHighlight: "Camera Vision Agent • Digital Twin Sensors",
      actionLabel: "Observe Peacetime Campus",
      action: async () => {
        await resetSystem();
        setActiveTab("MAP");
      }
    },
    {
      title: "2. CCTV Camera CAM-02 Detects Flame & Thermal Anomaly",
      narrative: "An anomaly is perceived in Main Academic Block (Floor 2). The Camera Vision Agent captures consecutive frames to eliminate false positives. Once confidence passes 80% across 3 consecutive frames, the emergency is verified.",
      agentHighlight: "Camera Vision Agent • Temporal Confirmation Buffer",
      actionLabel: "Switch to Camera Studio & Trigger Fire",
      action: async () => {
        setActiveTab("LIVE_CAMERAS");
        await triggerSimulation("FIRE");
      }
    },
    {
      title: "3. Incident Commander Activates Specialized AI Agents",
      narrative: "The Incident Commander classifies the emergency as CRITICAL. It immediately mobilizes the Security Agent (S-04), Medical Agent (Ambulance A-02 & EMT M-03), and Facilities Agent (FSU-03 Tender & Gas Valve Isolation).",
      agentHighlight: "Incident Commander • Security • Medical • Facilities Agents",
      actionLabel: "View Multi-Agent Network & Dispatch",
      action: async () => {
        setActiveTab("AGENTS");
      }
    },
    {
      title: "4. A* Evacuation Algorithm Calculates the Safest Path",
      narrative: "The Evacuation Agent calculates the SAFEST route rather than blindly choosing the shortest. It evaluates the 85m thermal hazard radius and crowd density, routing evacuees to Central Quadrangle Green (Zone B).",
      agentHighlight: "Evacuation / Route Agent • Dynamic Safety A*",
      actionLabel: "View Glowing Safe Route on Map",
      action: async () => {
        setActiveTab("COMMAND_CENTER");
      }
    },
    {
      title: "5. Unexpected Route Blockage Triggers Dynamic Re-Planning (WOW Moment)",
      narrative: "Now suppose the main south road becomes impassable due to spreading debris. The AI detects the obstruction, re-evaluates the 32-node campus graph, re-routes evacuees, and pushes live updates to all connected devices.",
      agentHighlight: "Autonomous Dynamic Re-Planning Engine",
      actionLabel: "Simulate Road Blockage & Re-Route",
      action: async () => {
        setActiveTab("COMMAND_CENTER");
        await triggerRoadBlockage("E-07");
      }
    },
    {
      title: "6. Human-In-The-Loop Governance Gate",
      narrative: "AI provides rapid decision support but high-impact actions (e.g. Gas Main Isolation GV-01 and access door lockouts) require authorized human operator approval with tamper-evident audit logging.",
      agentHighlight: "Human-In-The-Loop Operator Authorization Gate",
      actionLabel: "Approve Gas Isolation Action",
      action: async () => {
        setActiveTab("COMMAND_CENTER");
      }
    },
    {
      title: "7. Tailored Civilian & First Responder HUDs",
      narrative: "Each user sees what they need: Students receive clear evacuation routes and calm instructions; Security officers receive perimeter cordons; Paramedics receive triage staging ETAs.",
      agentHighlight: "Communication Agent • Role-Based Multichannel HUDs",
      actionLabel: "Inspect Student View",
      action: async () => {
        setCurrentRole("STUDENT");
      }
    },
    {
      title: "8. Post-Incident Debrief & Tamper-Evident Ledger",
      narrative: "Every single agent decision, human authorization, and second of elapsed time is permanently recorded in a cryptographic audit ledger for complete institutional accountability.",
      agentHighlight: "Audit Ledger • Cryptographic Verification Hashes",
      actionLabel: "View Audit Ledger & Return to Commander",
      action: async () => {
        setCurrentRole("COMMANDER");
        setActiveTab("AUDIT_LOGS");
      }
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      const nextIdx = currentStep + 1;
      setCurrentStep(nextIdx);
      await steps[nextIdx].action();
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrev = async () => {
    if (currentStep > 0) {
      const prevIdx = currentStep - 1;
      setCurrentStep(prevIdx);
      await steps[prevIdx].action();
    }
  };

  const executeCurrentStepAction = async () => {
    await currentStepData.action();
  };

  // Auto play presentation timer
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setTimeout(async () => {
        if (currentStep < steps.length - 1) {
          await handleNext();
        } else {
          setIsPlaying(false);
        }
      }, 7000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-xl w-full p-5 rounded-2xl bg-[#0B101D]/95 backdrop-blur-xl border-2 border-cyan-500/70 shadow-2xl shadow-cyan-950/50 text-white space-y-4 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1E2C48]">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-wide text-cyan-300 uppercase">
              Judge Demonstration Story Mode
            </h3>
            <p className="text-[11px] text-slate-400">
              Interactive narrative walkthrough of Campus Sentinel AI
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
            Step {currentStep + 1} of {steps.length}
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Narrative Card */}
      <div className="space-y-2">
        <h4 className="text-sm font-black text-white">{currentStepData.title}</h4>
        <p className="text-xs text-slate-200 leading-relaxed bg-[#141D32] p-3 rounded-xl border border-[#1E2C48]">
          {currentStepData.narrative}
        </p>
        <div className="flex items-center space-x-2 text-[11px] text-cyan-400 font-mono">
          <Bot className="w-3.5 h-3.5" />
          <span>Active Agents: <strong>{currentStepData.agentHighlight}</strong></span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={executeCurrentStepAction}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition-all active:scale-95"
          >
            ▶ {currentStepData.actionLabel}
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 border transition-all ${
              isPlaying
                ? "bg-amber-600 text-white border-amber-400"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? "Pause Tour" : "Auto-Play Story"}</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold disabled:opacity-40"
          >
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow flex items-center space-x-1 disabled:opacity-40"
          >
            <span>Next Step</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
