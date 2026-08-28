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
    resolveIncident,
    openResolveModal
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
          title: "CIVILIAN EVACUATION DIRECTIVE",
          action: "Evacuate via North Stairwell ➔ Proceed directly to Assembly Point B (Central Quad). Do not use elevators.",
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0F1626]/95 backdrop-blur-md border-t border-red-600/50 shadow-2xl shadow-red-950/80 text-white px-4 py-2.5 animate-pulse-glow">
      <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-3 text-xs">
        
        {/* 1. Left: Pulsing Flame Icon & Alert Source Timestamp */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 border border-red-400/50 flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-600/40 relative">
            <span className="absolute w-full h-full rounded-xl bg-red-500 opacity-50 animate-ping" />
            <Flame className="w-5 h-5 relative z-10 animate-bounce" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-red-600 text-white shadow">
                🚨 CRITICAL ALERT
              </span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800 font-bold">
                Emergency AI
              </span>
              <span className="text-[10px] font-mono text-slate-300 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{timestamp}</span>
              </span>
            </div>
            <p className="font-black text-white text-xs tracking-tight truncate max-w-[220px] sm:max-w-xs">
              <span className="text-red-400">{incidentType}:</span> {location}
            </p>
          </div>
        </div>

        {/* 2. Center: Role-Based Sensitive Directive */}
        <div className="hidden md:flex items-center space-x-2 bg-[#141D32]/90 border border-[#1E2C48] rounded-xl px-3 py-1.5 flex-1 max-w-2xl overflow-hidden">
          <DirectiveIcon className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 mr-2">
              [{directive.title}]
            </span>
            <span className="text-xs font-medium text-slate-100 truncate">
              {currentRole === "STUDENT"
                ? "Please move calmly along designated green evacuation route to Lara Gate."
                : directive.action}
            </span>
          </div>
        </div>

        {/* 3. Right: CTA Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setActiveTab("MAP")}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-blue-600/30 transition-all active:scale-95 whitespace-nowrap"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{currentRole === "STUDENT" ? "VIEW SAFE ROUTE" : "VIEW MAP ROUTE"}</span>
          </button>

          {currentRole !== "STUDENT" && (
            <button
              onClick={() => setActiveTab("EMERGENCY_AI")}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg transition-all active:scale-95 border border-cyan-400/40 whitespace-nowrap"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>EMERGENCY AI HUB</span>
            </button>
          )}

          {(currentRole === "ADMIN" || currentRole === "SECURITY") && (
            <button
              onClick={() => openResolveModal(activeIncident)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-600/20 transition-all active:scale-95 border border-emerald-400/40 whitespace-nowrap"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>APPROVE / RESOLVE</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
