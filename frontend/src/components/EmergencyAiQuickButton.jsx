// Campus Sentinel - Emergency AI Quick Floating Action Button
import React from "react";
import { useSentinel } from "../context/SentinelContext";
import { ShieldAlert, Flame, Radio } from "lucide-react";

export const EmergencyAiQuickButton = () => {
  const { openEmergencyAiModal, activeIncident } = useSentinel();

  return (
    <div className="fixed right-4 bottom-4 sm:right-7 sm:bottom-7 z-50 select-none">
      <button
        type="button"
        onClick={openEmergencyAiModal}
        className="group relative flex items-center space-x-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-red-600 via-red-500 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-2xl shadow-red-600/50 hover:shadow-red-500/70 border-2 border-red-300/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95"
        title="Quick Emergency Incident Reporting (No login required)"
      >
        {/* Subtle Pulse Rings */}
        <span className="absolute -inset-1 rounded-full bg-red-500/30 animate-ping opacity-60 pointer-events-none" />
        <span className="absolute -inset-0.5 rounded-full bg-red-400/20 blur-sm pointer-events-none" />

        {/* Status Indicator Dot */}
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>

        {/* Icon & Label */}
        <div className="relative flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-white animate-bounce-subtle shrink-0" />
          <span className="font-black drop-shadow-md whitespace-nowrap">
            EMERGENCY AI
          </span>
        </div>

        {activeIncident && (
          <span className="relative ml-1 px-1.5 py-0.5 rounded-full bg-red-950 text-red-200 text-[10px] font-mono border border-red-500/50 font-bold animate-pulse">
            LIVE
          </span>
        )}
      </button>
    </div>
  );
};
