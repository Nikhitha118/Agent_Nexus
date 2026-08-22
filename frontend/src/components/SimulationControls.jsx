// Campus Sentinel AI - Emergency Simulation & Dynamic Re-Planning Toolbar
import React from "react";
import { useSentinel } from "../context/SentinelContext";
import {
  Flame,
  HeartPulse,
  ShieldAlert,
  CloudRain,
  Users,
  AlertTriangle,
  RefreshCw,
  Zap
} from "lucide-react";

export const SimulationControls = () => {
  const {
    triggerSimulation,
    triggerRoadBlockage,
    resetSystem,
    isSimulating,
    activeIncident,
    isFastDemo,
    setIsFastDemo
  } = useSentinel();

  return (
    <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#0F1626] via-[#141D32] to-[#0F1626] border border-[#1E2C48] shadow-xl space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Emergency Simulator:</span>
          </span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">
            (One-click autonomous agent triggers for live judge demo)
          </span>
        </div>

        {/* Fast Demo Toggle */}
        <div className="flex items-center space-x-2 text-[11px] text-slate-300">
          <span>Fast Mode:</span>
          <button
            onClick={() => setIsFastDemo(!isFastDemo)}
            className={`w-7 h-3.5 rounded-full p-0.5 transition-all ${isFastDemo ? 'bg-amber-500' : 'bg-slate-700'}`}
          >
            <div className={`w-2.5 h-2.5 rounded-full bg-white transition-all transform ${isFastDemo ? 'translate-x-3.5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Button Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 1. FIRE (PRIMARY DEMO) */}
        <button
          onClick={() => triggerSimulation("FIRE")}
          disabled={isSimulating}
          className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs shadow-md shadow-red-600/30 flex items-center space-x-1.5 border border-red-400/30 transition-all active:scale-95 disabled:opacity-50"
        >
          <Flame className="w-4 h-4 text-amber-200" />
          <span>🔥 Simulate Fire (Primary)</span>
        </button>

        {/* 2. MEDICAL */}
        <button
          onClick={() => triggerSimulation("MEDICAL")}
          disabled={isSimulating}
          className="px-3 py-2 rounded-lg bg-[#141D32] hover:bg-rose-950/60 text-slate-200 hover:text-rose-300 font-semibold text-xs border border-[#1E2C48] hover:border-rose-600/50 flex items-center space-x-1.5 transition-all"
        >
          <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
          <span>🚑 Medical</span>
        </button>

        {/* 3. SECURITY */}
        <button
          onClick={() => triggerSimulation("SECURITY")}
          disabled={isSimulating}
          className="px-3 py-2 rounded-lg bg-[#141D32] hover:bg-blue-950/60 text-slate-200 hover:text-blue-300 font-semibold text-xs border border-[#1E2C48] hover:border-blue-600/50 flex items-center space-x-1.5 transition-all"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
          <span>🔒 Security</span>
        </button>

        {/* 4. FLOOD */}
        <button
          onClick={() => triggerSimulation("FLOOD")}
          disabled={isSimulating}
          className="px-3 py-2 rounded-lg bg-[#141D32] hover:bg-cyan-950/60 text-slate-200 hover:text-cyan-300 font-semibold text-xs border border-[#1E2C48] hover:border-cyan-600/50 flex items-center space-x-1.5 transition-all"
        >
          <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
          <span>🌧️ Flood</span>
        </button>

        {/* 5. CROWD */}
        <button
          onClick={() => triggerSimulation("CROWD")}
          disabled={isSimulating}
          className="px-3 py-2 rounded-lg bg-[#141D32] hover:bg-purple-950/60 text-slate-200 hover:text-purple-300 font-semibold text-xs border border-[#1E2C48] hover:border-purple-600/50 flex items-center space-x-1.5 transition-all"
        >
          <Users className="w-3.5 h-3.5 text-purple-400" />
          <span>👥 Crowd</span>
        </button>

        {/* 6. DYNAMIC RE-PLANNING: SIMULATE ROAD BLOCKAGE */}
        <button
          onClick={() => triggerRoadBlockage("E-07")}
          disabled={!activeIncident}
          className={`px-3.5 py-2 rounded-lg font-bold text-xs flex items-center space-x-1.5 border transition-all ${
            activeIncident
              ? "bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border-amber-500/60 shadow-lg shadow-amber-600/20 active:scale-95 animate-pulse"
              : "bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed"
          }`}
          title="Simulate road blockage to demonstrate live A* dynamic re-routing"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>⚠️ Simulate Route Blockage (Re-Plan)</span>
        </button>

        {/* 7. RESET */}
        <button
          onClick={resetSystem}
          className="px-3 py-2 rounded-lg bg-[#141D32] hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs border border-[#1E2C48] flex items-center space-x-1.5 transition-all ml-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
