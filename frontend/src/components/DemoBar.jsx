// Campus Sentinel AI - Hackathon Demo Control Bar
import React from "react";
import { useSentinel } from "../context/SentinelContext";
import {
  Flame,
  HeartPulse,
  ShieldAlert,
  CloudRain,
  AlertTriangle,
  RotateCcw,
  Zap
} from "lucide-react";

export const DemoBar = () => {
  const {
    activeIncident,
    triggerSimulation,
    triggerRoadBlockage,
    resetSystem,
    isSimulating
  } = useSentinel();

  return (
    <div className="bg-[#0B101D] border-b border-[#1E2C48] px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs z-40 sticky top-0 shadow-md">
      {/* Demo Label & Full Simulation Controls */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 flex items-center space-x-1">
          <Zap className="w-3.5 h-3.5" />
          <span>🎬 DEMO MODE:</span>
        </span>

        {/* 1. TEST FIRE */}
        <button
          onClick={() => triggerSimulation("FIRE")}
          disabled={isSimulating}
          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-black flex items-center space-x-1 shadow-md shadow-red-600/30 transition-all active:scale-95 border border-red-400/40"
          title="Start Fire Emergency Demonstration"
        >
          <Flame className="w-3.5 h-3.5 text-amber-200" />
          <span>🔥 TEST FIRE</span>
        </button>

        {/* 2. TEST MEDICAL */}
        <button
          onClick={() => triggerSimulation("MEDICAL")}
          disabled={isSimulating}
          className="px-2.5 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-bold flex items-center space-x-1 transition-all active:scale-95 border border-rose-500/40"
          title="Start Medical Trauma Emergency Demonstration"
        >
          <HeartPulse className="w-3.5 h-3.5 text-rose-200" />
          <span>🚑 TEST MEDICAL</span>
        </button>

        {/* 3. TEST SECURITY */}
        <button
          onClick={() => triggerSimulation("SECURITY")}
          disabled={isSimulating}
          className="px-2.5 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white font-bold flex items-center space-x-1 transition-all active:scale-95 border border-sky-500/40"
          title="Start Security Breach Incident Demonstration"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-sky-200" />
          <span>🛡 TEST SECURITY</span>
        </button>

        {/* 4. TEST WEATHER */}
        <button
          onClick={() => triggerSimulation("WEATHER")}
          disabled={isSimulating}
          className="px-2.5 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white font-bold flex items-center space-x-1 transition-all active:scale-95 border border-indigo-500/40"
          title="Start Severe Weather / Flood Alert Demonstration"
        >
          <CloudRain className="w-3.5 h-3.5 text-indigo-200" />
          <span>🌧 TEST WEATHER</span>
        </button>

        {/* 5. BLOCK ROUTE */}
        <button
          onClick={() => triggerRoadBlockage("E-07")}
          disabled={!activeIncident}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1 border transition-all ${
            activeIncident
              ? "bg-amber-600/30 hover:bg-amber-600 text-amber-200 border-amber-500/50 shadow"
              : "bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed"
          }`}
          title="Simulate road obstacle to demonstrate dynamic A* re-routing"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>🚧 BLOCK ROUTE</span>
        </button>

        {/* 6. RESET */}
        <button
          onClick={resetSystem}
          className="px-2.5 py-1.5 rounded-lg bg-[#141D32] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#1E2C48] flex items-center space-x-1 transition-all"
          title="Reset campus to peacetime safe baseline"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>🔄 RESET</span>
        </button>
      </div>

      {/* Right: Peacetime Status Badge */}
      <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
        <span className="hidden sm:inline">LIVE DIGITAL TWIN READY</span>
      </div>
    </div>
  );
};
