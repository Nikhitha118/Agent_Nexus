// Campus Sentinel AI - Persistent Campus-Wide Emergency Alert Banner
import React from "react";
import { useSentinel } from "../context/SentinelContext";
import {
  AlertTriangle,
  Flame,
  Shield,
  HeartPulse,
  Bus,
  Navigation,
  Sparkles,
  Bot,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2
} from "lucide-react";

export const EmergencyAlertBanner = () => {
  const {
    activeIncident,
    activeEmergencyEvent,
    currentRole,
    setActiveTab,
    resolveIncident
  } = useSentinel();

  if (!activeIncident && !activeEmergencyEvent) {
    return null;
  }

  const incidentType = activeIncident ? activeIncident.type : (activeEmergencyEvent ? activeEmergencyEvent.eventType : "EMERGENCY");
  const location = activeIncident ? activeIncident.location : (activeEmergencyEvent ? activeEmergencyEvent.affectedArea : "Campus Sector");
  const timestamp = activeIncident ? (activeIncident.timeFormatted || new Date().toLocaleTimeString()) : new Date().toLocaleTimeString();

  // Role-Specific Directives
  const getRoleDirective = (role) => {
    switch (role) {
      case "SECURITY":
        return {
          title: "CAMPUS SECURITY DIRECTIVE",
          action: "Secure the affected area, establish perimeter cordon, and coordinate access control.",
          icon: Shield,
          color: "text-sky-300"
        };
      case "MEDICAL":
        return {
          title: "MEDICAL TEAM DIRECTIVE",
          action: "Prepare emergency triage squad, stage ambulance at Assembly Point B, and stand by for trauma dispatch.",
          icon: HeartPulse,
          color: "text-rose-300"
        };
      case "TRANSPORT":
        return {
          title: "TRANSIT FLEET DIRECTIVE",
          action: "Mobilize evacuation buses (TB-01 / TB-02) to South Ring Road and maintain clear emergency transit corridors.",
          icon: Bus,
          color: "text-emerald-300"
        };
      case "FACULTY":
        return {
          title: "FACULTY / WARDEN DIRECTIVE",
          action: "Guide students toward designated emergency exits calmly and conduct roll call at the assembly point.",
          icon: Navigation,
          color: "text-purple-300"
        };
      case "STUDENT":
        return {
          title: "STUDENT CIVILIAN DIRECTIVE",
          action: "Follow official emergency route on map, do not use elevators, and move directly to Assembly Point B (Central Quad).",
          icon: Navigation,
          color: "text-blue-300"
        };
      case "ADMIN":
      default:
        return {
          title: "COMMAND & OPERATIONS DIRECTIVE",
          action: "Supervising 5-stage multi-agent emergency response network and reviewing authorization queues.",
          icon: Bot,
          color: "text-amber-300"
        };
    }
  };

  const directive = getRoleDirective(currentRole);
  const DirectiveIcon = directive.icon;

  return (
    <div className="bg-gradient-to-r from-red-950 via-[#1A0B12] to-red-950 border-b-2 border-red-500 shadow-2xl text-white px-4 py-3 sticky top-16 z-30 animate-pulse-glow">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Critical Alert Badge & Event Info */}
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 border border-red-400/50 flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-600/40 animate-bounce">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-600 text-white shadow font-mono">
                🚨 CRITICAL CAMPUS ALERT
              </span>
              <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                Source: Emergency AI
              </span>
              <span className="text-[11px] font-mono text-red-400 bg-red-900/60 px-2 py-0.5 rounded border border-red-700 font-bold">
                STATUS: ACTIVE
              </span>
              <span className="text-[11px] font-mono text-slate-300 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{timestamp}</span>
              </span>
            </div>

            <div className="mt-1 flex items-center space-x-2 text-sm font-black text-white">
              <span className="text-red-400">{incidentType} DETECTED:</span>
              <span>{location}</span>
            </div>
          </div>
        </div>

        {/* Center: Role-Specific Action Instructions */}
        <div className="bg-[#141D32]/90 border border-[#1E2C48] rounded-xl px-3 py-2 flex-1 max-w-xl">
          <div className="flex items-center space-x-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
            <DirectiveIcon className="w-3.5 h-3.5" />
            <span>{directive.title}</span>
          </div>
          <p className="text-xs font-semibold text-slate-100 mt-0.5 leading-snug">
            {directive.action}
          </p>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
          <button
            onClick={() => setActiveTab("MAP")}
            className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>VIEW MAP ROUTE</span>
          </button>

          <button
            onClick={() => setActiveTab("EMERGENCY_AI")}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg transition-all active:scale-95 border border-cyan-400/40"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">EMERGENCY AI HUB</span>
          </button>
        </div>
      </div>
    </div>
  );
};
