// Campus Sentinel AI - Main Incident Command Dashboard
import React from "react";
import { useSentinel } from "../context/SentinelContext";
import { CampusMap } from "./CampusMap";
import { SimulationControls } from "./SimulationControls";
import { HumanApprovalCard } from "./HumanApprovalCard";
import {
  ShieldAlert,
  Flame,
  Users,
  Ambulance,
  Camera,
  Activity,
  Navigation,
  Bot,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  FileText,
  Clock
} from "lucide-react";

export const IncidentCommandDashboard = () => {
  const {
    activeIncident,
    systemStats,
    agentActivities,
    setActiveTab,
    setSelectedIncidentForReport,
    setReportModalOpen
  } = useSentinel();

  const isEmergency = !!activeIncident;

  const statCards = [
    {
      label: "Active Incidents",
      value: isEmergency ? "1" : "0",
      sub: isEmergency ? `${activeIncident.severity} ${activeIncident.type}` : "Normal Baseline",
      icon: Flame,
      color: isEmergency ? "text-red-400 bg-red-950/60 border-red-500/50" : "text-slate-400 bg-[#0F1626] border-[#1E2C48]"
    },
    {
      label: "Active Responders",
      value: systemStats.activeRespondersCount.toString(),
      sub: "Patrols, EMTs & Fire Crews",
      icon: Users,
      color: "text-blue-400 bg-[#0F1626] border-[#1E2C48]"
    },
    {
      label: "Available Ambulances",
      value: `${systemStats.availableAmbulancesCount} / 4`,
      sub: "Mobile ICU Ready",
      icon: Ambulance,
      color: "text-rose-400 bg-[#0F1626] border-[#1E2C48]"
    },
    {
      label: "People At Risk",
      value: isEmergency ? (activeIncident.peopleAtRisk || 620).toString() : "0",
      sub: isEmergency ? `In ${activeIncident.location}` : "All Zones Clear",
      icon: AlertOctagon,
      color: isEmergency ? "text-amber-400 bg-amber-950/40 border-amber-500/50" : "text-slate-400 bg-[#0F1626] border-[#1E2C48]"
    },
    {
      label: "Cameras Monitored",
      value: systemStats.camerasMonitored,
      sub: "Edge Vision Online",
      icon: Camera,
      color: "text-cyan-400 bg-[#0F1626] border-[#1E2C48]"
    },
    {
      label: "System Grid Status",
      value: isEmergency ? "EMERGENCY" : "SECURE",
      sub: "Multi-Agent Active",
      icon: Activity,
      color: isEmergency ? "text-red-400 bg-red-950/60 border-red-500/50" : "text-emerald-400 bg-emerald-950/40 border-emerald-800/50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Emergency Flash Banner when Active */}
      {isEmergency && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-950 via-red-900/60 to-slate-900 border-2 border-red-500 shadow-2xl shadow-red-900/40 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/50 animate-bounce">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded bg-red-600 text-white">
                  🚨 ACTIVE CAMPUS EMERGENCY
                </span>
                <span className="text-xs text-red-300 font-mono font-bold">
                  {activeIncident.id}
                </span>
              </div>
              <h2 className="text-lg font-black text-white mt-0.5">
                {activeIncident.severity} {activeIncident.type} DETECTED AT {activeIncident.location.toUpperCase()}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setSelectedIncidentForReport(activeIncident);
                setReportModalOpen(true);
              }}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center space-x-1.5 border border-slate-600 shadow"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Incident Debrief Report</span>
            </button>

            <button
              onClick={() => setActiveTab("INCIDENT_DETAILS")}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-red-600/30"
            >
              <span>View Full Incident Data</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Key Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border shadow-lg transition-all ${s.color}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</span>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-xl font-black text-white font-mono">{s.value}</div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Emergency Simulation Toolbar */}
      <SimulationControls />

      {/* Main Command Center Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center: Interactive Digital Twin Map (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-3 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-cyan-400" />
                <span>LIVE DIGITAL TWIN CAMPUS MAP</span>
              </h3>
              {activeIncident && (
                <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                  <span>A* SAFE ROUTE ACTIVE</span>
                </span>
              )}
            </div>

            <CampusMap height="h-[500px]" interactive={true} />
          </div>
        </div>

        {/* Right: AI Incident Commander Reasoning Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Human-in-the-loop Gate */}
          <HumanApprovalCard />

          {/* Incident Commander Synthesis Card */}
          <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E2C48]">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/40">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">
                    Incident Commander Reasoning
                  </h3>
                  <p className="text-[10px] text-slate-400">Autonomous synthesis across all 5 specialist agents</p>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                Agentic Orchestrator
              </span>
            </div>

            {isEmergency ? (
              <div className="space-y-3 text-xs">
                {/* Summary Box */}
                <div className="p-3 rounded-lg bg-[#141D32] border border-[#1E2C48] text-slate-200 leading-relaxed font-sans">
                  <span className="font-bold text-cyan-400 block mb-1">STRATEGIC DIRECTIVE:</span>
                  {activeIncident.summary}
                </div>

                {/* Evidence & Reasoning Points */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Evidence & Assessment:
                  </span>
                  {activeIncident.reasoning && activeIncident.reasoning.map((r, i) => (
                    <div key={i} className="p-2 rounded bg-slate-900/60 border border-slate-800 flex items-start space-x-2 text-[11px] text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>

                {/* Recommended Actions */}
                {activeIncident.recommendedActions && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Recommended Action Matrix:
                    </span>
                    <div className="p-2.5 rounded-lg bg-[#0B101D] border border-blue-900/50 space-y-1 text-[11px] text-slate-200">
                      {activeIncident.recommendedActions.map((act, i) => (
                        <p key={i} className="leading-snug">{act}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center space-y-2 text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto animate-pulse" />
                <p className="text-xs font-bold text-slate-200">Campus Status: PEACETIME / SECURE</p>
                <p className="text-[11px] text-slate-400">
                  Incident Commander Agent is actively listening to CCTV edge vision streams and telemetry nodes.
                </p>
              </div>
            )}
          </div>

          {/* Safe Evacuation Summary Card */}
          {isEmergency && activeIncident.evacuationRoute && (
            <div className="p-3.5 rounded-xl bg-[#0F1626] border border-emerald-500/40 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center space-x-1.5">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Optimal Safe Evacuation Path</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Safety Rank: {activeIncident.evacuationRoute.safetyLevel}
                </span>
              </div>
              <p className="text-xs font-semibold text-white">
                Destination: {activeIncident.recommendedAssemblyPoint ? activeIncident.recommendedAssemblyPoint.name : "Assembly Point B"}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1 border-t border-[#1E2C48]">
                <span>Distance: <strong className="text-white">{activeIncident.evacuationRoute.totalDistanceMeters}m</strong></span>
                <span>Est. Walk: <strong className="text-cyan-400">{activeIncident.evacuationRoute.estimatedWalkTimeSeconds}s</strong></span>
                <span>Available Slots: <strong className="text-emerald-400">540</strong></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom: Multi-Agent Activity Stream */}
      <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1E2C48]">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400 animate-spin" />
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Live Multi-Agent Activity Stream
            </h3>
          </div>
          <button
            onClick={() => setActiveTab("AGENTS")}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            View Full Agent Network →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto">
          {agentActivities.slice(0, 6).map((act, i) => (
            <div
              key={i}
              className="p-2.5 rounded-lg bg-[#141D32] border border-[#1E2C48] space-y-1 text-xs"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-cyan-400">{act.agentName}</span>
                <span className="text-slate-500 font-mono">{act.timeFormatted}</span>
              </div>
              <p className="text-slate-300 text-[11px] line-clamp-2">{act.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
