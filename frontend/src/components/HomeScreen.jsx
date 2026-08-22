// Campus Sentinel AI - Simple High-Impact Home Screen
import React from "react";
import { useSentinel } from "../context/SentinelContext";
import {
  ShieldCheck,
  Flame,
  Camera,
  MapPin,
  AlertTriangle,
  ArrowRight,
  Navigation,
  Sparkles,
  Info
} from "lucide-react";

export const HomeScreen = () => {
  const { activeIncident, setActiveTab, currentRole } = useSentinel();
  const isEmergency = !!activeIncident;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-8">
      {/* 10-Second Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800 text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vignan University • Emergency Response Digital Twin</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          CAMPUS SENTINEL
        </h1>
        <p className="text-sm sm:text-base font-semibold text-cyan-400">
          See. Understand. Decide. Alert. Guide.
        </p>
      </div>

      {/* Primary Campus Status Indicator */}
      {isEmergency ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-red-950 via-red-900/60 to-slate-900 border-2 border-red-500 shadow-2xl shadow-red-900/50 space-y-4 animate-pulse-slow">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/50 animate-bounce">
                <Flame className="w-8 h-8 text-amber-200" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-red-300">
                  🔴 ACTIVE CAMPUS EMERGENCY
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Fire Detected near {activeIncident.location}
                </h2>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("MAP")}
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-red-600 font-black text-xs sm:text-sm flex items-center space-x-2 shadow-xl shadow-white/20 transition-all active:scale-95 shrink-0"
            >
              <Navigation className="w-4 h-4 text-emerald-600" />
              <span>SHOW SAFE ROUTE</span>
            </button>
          </div>

          {/* 5 Simple Questions Answered Immediately */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-3 border-t border-red-800/60 text-xs">
            <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block">👁 WHAT?</span>
              <strong className="text-red-400 font-black text-xs">{activeIncident.type}</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block">🧠 SEVERITY?</span>
              <strong className="text-amber-400 font-black text-xs">{activeIncident.severity}</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block">📍 WHERE?</span>
              <strong className="text-white font-black text-xs truncate block">{activeIncident.location}</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block">📢 WHO?</span>
              <strong className="text-cyan-400 font-black text-xs">All Students & Staff</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-emerald-300 font-bold block">🗺 WHERE TO GO?</span>
              <strong className="text-white font-black text-xs">Assembly Point B</strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0F1626] border border-emerald-500/40 shadow-2xl text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">
            🟢 CAMPUS IS SAFE
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            All buildings, pathways, and assembly points are clear. Optical edge cameras are continuously monitoring.
          </p>
        </div>
      )}

      {/* 3 Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* LIVE CAMERA */}
        <div
          onClick={() => setActiveTab("LIVE_CAMERAS")}
          className="p-6 rounded-2xl bg-[#0F1626] border border-[#1E2C48] hover:border-cyan-500 shadow-xl hover:shadow-2xl transition-all cursor-pointer space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Camera className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-white">Live Camera Feeds</h3>
          <p className="text-xs text-slate-400">
            Monitor optical camera feeds with automatic multi-frame flame & smoke verification.
          </p>
          <div className="flex items-center space-x-1 text-xs font-bold text-cyan-400 pt-1">
            <span>Open Cameras</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* CAMPUS MAP */}
        <div
          onClick={() => setActiveTab("MAP")}
          className="p-6 rounded-2xl bg-[#0F1626] border border-[#1E2C48] hover:border-emerald-500 shadow-xl hover:shadow-2xl transition-all cursor-pointer space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-white">Campus Digital Map</h3>
          <p className="text-xs text-slate-400">
            Explore safe evacuation routes, 5 assembly safe zones, and responder paths.
          </p>
          <div className="flex items-center space-x-1 text-xs font-bold text-emerald-400 pt-1">
            <span>Open Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* EMERGENCY HUB */}
        <div
          onClick={() => setActiveTab("EMERGENCY")}
          className="p-6 rounded-2xl bg-[#0F1626] border border-[#1E2C48] hover:border-red-500 shadow-xl hover:shadow-2xl transition-all cursor-pointer space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-white">Emergency Response Hub</h3>
          <p className="text-xs text-slate-400">
            View active alerts, responder assignments, and human operator approvals.
          </p>
          <div className="flex items-center space-x-1 text-xs font-bold text-red-400 pt-1">
            <span>View Emergency Status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
