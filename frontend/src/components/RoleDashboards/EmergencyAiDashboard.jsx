// Campus Sentinel AI - Emergency AI Hub & Immediate Action System
import React, { useState } from "react";
import { useSentinel } from "../../context/SentinelContext";
import { CAMPUS_LOCATIONS } from "../../data/vignanCampusLocations";
import {
  Bot,
  Flame,
  HeartPulse,
  ShieldAlert,
  CloudRain,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Eye,
  Navigation,
  Sparkles,
  Shield,
  Bus,
  Clock,
  MapPin,
  X,
  FileText
} from "lucide-react";

import { ResolveIncidentModal } from "../ResolveIncidentModal";

export const EmergencyAiDashboard = () => {
  const {
    activeIncident,
    activeEmergencyEvent,
    emergencyEvents,
    activateEmergencyAI,
    resolveIncident,
    resolveModalIncident,
    openResolveModal,
    closeResolveModal,
    isSimulating,
    currentRole,
    currentUser,
    agentActivities
  } = useSentinel();

  // Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedType, setSelectedType] = useState("FIRE");
  const [selectedLocation, setSelectedLocation] = useState("A-BLOCK");
  const [severityLevel, setSeverityLevel] = useState("CRITICAL");
  const [notes, setNotes] = useState("");

  const handleConfirmActivation = async () => {
    setShowConfirmModal(false);
    await activateEmergencyAI({
      type: selectedType,
      location: selectedLocation,
      severity: severityLevel,
      notes
    });
  };

  const isEmergencyActive = !!activeIncident || !!activeEmergencyEvent;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2C48]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-300 font-bold uppercase">
              AUTONOMOUS INTELLIGENCE CORE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-700 text-blue-300 font-bold">
              5-STAGE MULTI-AGENT GRAPH
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            EMERGENCY AI IMMEDIATE ACTION SYSTEM
          </h1>
          <p className="text-xs text-slate-400">
            Autonomous emergency detection, real-time threat perception, and campus-wide response coordination
          </p>
        </div>

        {/* Immediate Action Trigger Button */}
        <div>
          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={isSimulating}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-wider flex items-center space-x-2 shadow-xl shadow-red-600/30 transition-all active:scale-95 border border-red-400/40"
          >
            <Zap className="w-4 h-4 text-amber-200 animate-pulse" />
            <span>🚨 ACTIVATE EMERGENCY RESPONSE</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-3xl bg-[#0F1626] border-2 border-red-500 shadow-2xl p-6 sm:p-7 space-y-5 animate-scale-up">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-red-950 border border-red-500 flex items-center justify-center text-red-400">
                  <AlertTriangle className="w-7 h-7 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    ACTIVATE CAMPUS-WIDE EMERGENCY RESPONSE?
                  </h3>
                  <p className="text-xs text-red-300">
                    Immediate multi-agent mobilization & broadcast alert
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-1.5 rounded-xl bg-[#141D32] hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-[#141D32] p-3.5 rounded-2xl border border-[#1E2C48]">
              This action will immediately broadcast a <strong>CRITICAL EMERGENCY ALERT</strong> to all registered students, faculty, security guards, paramedics, transport fleet, and administrators, and initiate autonomous multi-agent response protocols.
            </p>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Emergency Type:</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141D32] border border-[#1E2C48] text-white text-xs font-bold focus:outline-none focus:border-red-500"
                >
                  <option value="FIRE">🔥 FIRE (Thermal Anomaly & Structural Threat)</option>
                  <option value="MEDICAL">🚑 MEDICAL (Trauma & Mass Casualty Incident)</option>
                  <option value="SECURITY">🛡️ SECURITY (Perimeter Breach & Active Threat)</option>
                  <option value="WEATHER">🌧️ WEATHER (Severe Storm & Inundation)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Affected Campus Sector / Building:</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141D32] border border-[#1E2C48] text-white text-xs font-mono focus:outline-none focus:border-red-500"
                >
                  {CAMPUS_LOCATIONS.map(loc => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name} {loc.isSafeZone ? "(Safe Zone)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-xl bg-[#141D32] hover:bg-slate-800 text-slate-300 font-bold text-xs border border-[#1E2C48] transition-all"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleConfirmActivation}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all active:scale-95 border border-red-400/40"
              >
                CONFIRM & ACTIVATE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Incident Overview / Peacetime Standby */}
      {isEmergencyActive ? (
        <div className="p-6 rounded-3xl bg-[#0F1626] border-2 border-red-500/80 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block animate-ping"></span>
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                🚨 ACTIVE EMERGENCY IN PROGRESS: {activeIncident ? activeIncident.type : "CRITICAL THREAT"}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => openResolveModal(activeIncident)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg transition-all active:scale-95 border border-emerald-400/40 flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>RESOLVE INCIDENT</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#141D32] p-4 rounded-2xl border border-[#1E2C48]">
            <div>
              <span className="text-slate-400 block text-[10px]">AFFECTED LOCATION:</span>
              <strong className="text-white text-sm">{activeIncident ? activeIncident.location : "Main Academic Block"}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">SEVERITY LEVEL:</span>
              <strong className="text-red-400 text-sm font-mono">{activeIncident ? activeIncident.severity : "CRITICAL"}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">ESTIMATED AT RISK:</span>
              <strong className="text-amber-300 text-sm">{activeIncident ? activeIncident.estimatedCasualtiesAtRisk : 620} Civilians</strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-[#0F1626] border border-[#1E2C48] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">PEACETIME CAMPUS SURVEILLANCE</h3>
              <p className="text-xs text-slate-400">8 CCTV cameras and environmental telemetry monitored with 0 anomalies</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-pulse"></span>
            <span>AI PERCEPTION AGENTS READY</span>
          </div>
        </div>
      )}

      {/* 5-Stage Autonomous Multi-Agent Pipeline Visualization */}
      <div className="p-6 rounded-3xl bg-[#0F1626] border border-[#1E2C48] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#1E2C48]">
          <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center space-x-2">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>5-Stage Multi-Agent Perception & Orchestration Graph</span>
          </h2>
          <span className="text-xs font-mono text-cyan-400">Latency: 120ms</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { stage: "STAGE 1", name: "DETECT AI", desc: "CCTV Vision & Optical Anomaly Confirmation", icon: Eye, color: "text-amber-400", border: "border-amber-500/30" },
            { stage: "STAGE 2", name: "DECIDE AI", desc: "Threat Classification & Resource Matrix", icon: Zap, color: "text-red-400", border: "border-red-500/30" },
            { stage: "STAGE 3", name: "RESPOND AI", desc: "Security, Medical & Transit Fleet Mobilization", icon: ShieldAlert, color: "text-blue-400", border: "border-blue-500/30" },
            { stage: "STAGE 4", name: "GUIDE AI", desc: "A* Safe Evacuation & Dynamic Re-Routing", icon: Navigation, color: "text-emerald-400", border: "border-emerald-500/30" },
            { stage: "STAGE 5", name: "ALERT AI", desc: "Multi-Channel Broadcast & Role Directives", icon: Radio, color: "text-cyan-400", border: "border-cyan-500/30" }
          ].map(st => (
            <div key={st.stage} className={`p-4 rounded-2xl bg-[#141D32] border ${st.border} space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">{st.stage}</span>
                <st.icon className={`w-4 h-4 ${st.color}`} />
              </div>
              <h4 className="text-xs font-black text-white">{st.name}</h4>
              <p className="text-[11px] text-slate-400 leading-snug">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Role-Specific Directives Reference Grid */}
      <div className="p-6 rounded-3xl bg-[#0F1626] border border-[#1E2C48] space-y-4">
        <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Automated Role-Specific Emergency Response Directives</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-2xl bg-[#141D32] border border-sky-500/30 space-y-1.5">
            <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold">
              <Shield className="w-4 h-4" />
              <span>CAMPUS SECURITY</span>
            </div>
            <p className="text-xs text-slate-300">
              Secure affected perimeter, establish cordon lines, guide responders, and control campus access gates.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#141D32] border border-rose-500/30 space-y-1.5">
            <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold">
              <HeartPulse className="w-4 h-4" />
              <span>MEDICAL & PARAMEDICS</span>
            </div>
            <p className="text-xs text-slate-300">
              Stage Ambulance A-02 at Assembly Point B, deploy EMT squads, and prepare triage station for potential casualties.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#141D32] border border-emerald-500/30 space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
              <Bus className="w-4 h-4" />
              <span>CAMPUS TRANSPORT</span>
            </div>
            <p className="text-xs text-slate-300">
              Mobilize transit shuttles and buses to designated evacuation corridors and ensure clear roadway access.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#141D32] border border-purple-500/30 space-y-1.5">
            <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold">
              <Navigation className="w-4 h-4" />
              <span>FACULTY & STAFF</span>
            </div>
            <p className="text-xs text-slate-300">
              Direct classroom occupants toward primary emergency exits, verify room evacuation, and conduct headcount.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#141D32] border border-blue-500/30 space-y-1.5">
            <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold">
              <Navigation className="w-4 h-4" />
              <span>STUDENTS</span>
            </div>
            <p className="text-xs text-slate-300">
              Follow real-time green walking path on the map, do not use elevators, and assemble at designated green zone.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#141D32] border border-amber-500/30 space-y-1.5">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
              <Bot className="w-4 h-4" />
              <span>ADMIN & HOD</span>
            </div>
            <p className="text-xs text-slate-300">
              Monitor multi-agent execution pipeline, approve high-tier emergency protocols, and coordinate university PR.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Event Log History */}
      <div className="p-6 rounded-3xl bg-[#0F1626] border border-[#1E2C48] space-y-3">
        <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center space-x-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Emergency Event Log History</span>
        </h2>

        {emergencyEvents && emergencyEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141D32] text-slate-400 font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-3">Event ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Source</th>
                  <th className="p-3">Initiated By</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2C48]">
                {emergencyEvents.map((ev, idx) => (
                  <tr key={ev.eventId || idx} className="hover:bg-[#141D32]/50">
                    <td className="p-3 font-mono text-cyan-400">{ev.eventId}</td>
                    <td className="p-3 font-bold text-white">{ev.eventType}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 font-mono text-[10px] border border-red-800">
                        {ev.severity}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{ev.source}</td>
                    <td className="p-3 text-slate-300">{ev.initiatedBy}</td>
                    <td className="p-3 text-slate-300">{ev.affectedArea}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        ev.status === "ACTIVE" ? "bg-red-600 text-white animate-pulse" : "bg-emerald-950 text-emerald-300"
                      }`}>
                        {ev.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 font-mono italic">No previous emergency incidents recorded in this session.</p>
        )}
      </div>

      {/* Resolve Incident Confirmation Modal */}
      {resolveModalIncident && (
        <ResolveIncidentModal
          isOpen={!!resolveModalIncident}
          onClose={closeResolveModal}
          incident={resolveModalIncident}
        />
      )}
    </div>
  );
};
