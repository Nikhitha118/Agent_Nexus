// Campus Sentinel AI - Academic Engineering Footer
import React, { useState } from "react";
import { EngineeringSpecsModal } from "./EngineeringSpecsModal";
import {
  GraduationCap,
  Cpu,
  Code,
  ShieldCheck,
  Activity,
  Sparkles
} from "lucide-react";

export const Footer = () => {
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);

  return (
    <>
      <footer className="bg-[#070A12] border-t border-[#1E2C48] py-4 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Department & University Info */}
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="w-8 h-8 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400 shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-200">
                Department of Computer Science & Engineering
              </p>
              <p className="text-[11px] text-slate-500">
                Vignan's Foundation for Science, Technology & Research (Deemed to be University)
              </p>
            </div>
          </div>

          {/* Center: Live Engineering Telemetry */}
          <div className="flex items-center space-x-3 font-mono text-[11px]">
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Node.js Core Gateway: ONLINE</span>
            </span>

            <span className="hidden sm:inline text-slate-500">•</span>

            <span className="hidden sm:flex items-center space-x-1 text-slate-400">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>WebSocket Latency: 12ms</span>
            </span>
          </div>

          {/* Right: Technical Specs Trigger */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsSpecsOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#141D32] hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all shadow"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>System Architecture & Specs</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Engineering Specs Modal */}
      <EngineeringSpecsModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
      />
    </>
  );
};
