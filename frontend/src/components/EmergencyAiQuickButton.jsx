// Campus Sentinel - Compact Emergency AI Quick Action Button
import React from "react";
import { useSentinel } from "../context/SentinelContext";
import { ShieldAlert } from "lucide-react";

export const EmergencyAiQuickButton = () => {
  const { openEmergencyAiModal, activeIncident } = useSentinel();

  const bottomPosition = activeIncident ? "bottom-20 right-5" : "bottom-5 right-5";

  return (
    <div className={`fixed ${bottomPosition} z-40 select-none transition-all duration-300`}>
      <button
        type="button"
        onClick={openEmergencyAiModal}
        className="group relative flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-bold text-[11px] tracking-wider uppercase shadow-md shadow-red-600/30 hover:shadow-red-500/40 border border-red-300/40 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        title="Autonomous Emergency AI Agent Quick Control"
      >
        {/* Subtle Pulse Dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>

        {/* Shield Icon & Label */}
        <ShieldAlert className="w-3 h-3 text-white shrink-0" />
        <span className="font-bold drop-shadow whitespace-nowrap">
          Emergency AI
        </span>

        {activeIncident && (
          <span className="px-1 py-0.5 rounded-full bg-red-950 text-red-200 text-[7.5px] font-mono border border-red-500/50 font-bold animate-pulse shrink-0">
            LIVE
          </span>
        )}
      </button>
    </div>
  );
};
