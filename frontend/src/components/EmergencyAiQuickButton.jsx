// Campus Sentinel - Compact Emergency AI Quick Action Button
import React from "react";
import { useSentinel } from "../context/SentinelContext";
import { ShieldAlert } from "lucide-react";

export const EmergencyAiQuickButton = () => {
  const { openEmergencyAiModal, activeIncident } = useSentinel();

  return (
    <div className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-40 select-none">
      <button
        type="button"
        onClick={openEmergencyAiModal}
        className="group relative flex items-center space-x-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs tracking-wider uppercase shadow-xl shadow-red-600/40 hover:shadow-red-500/60 border border-red-300/40 transition-all duration-200 hover:scale-105 active:scale-95"
        title="Quick Emergency Incident Reporting (No login required)"
      >
        {/* Subtle Pulse Dot */}
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
        </span>

        {/* Icon & Compact Label */}
        <ShieldAlert className="w-4 h-4 text-white shrink-0" />
        <span className="font-black drop-shadow whitespace-nowrap">
          EMERGENCY AI
        </span>

        {activeIncident && (
          <span className="px-1.5 py-0.2 rounded-full bg-red-950 text-red-200 text-[9px] font-mono border border-red-500/50 font-bold animate-pulse shrink-0">
            LIVE
          </span>
        )}
      </button>
    </div>
  );
};
