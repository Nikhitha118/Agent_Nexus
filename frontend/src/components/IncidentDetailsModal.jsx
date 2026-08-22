// Campus Sentinel AI - Comprehensive Incident Details & Timeline Page
import React from "react";
import { useSentinel } from "../context/SentinelContext";
import { CampusMap } from "./CampusMap";
import {
  FileCheck,
  Flame,
  Clock,
  Shield,
  Navigation,
  HeartPulse,
  Radio,
  CheckCircle2,
  AlertTriangle,
  FileText,
  CheckCircle,
  XCircle
} from "lucide-react";

export const IncidentDetailsModal = () => {
  const {
    activeIncident,
    incidentsHistory,
    resolveIncident,
    setReportModalOpen,
    setSelectedIncidentForReport
  } = useSentinel();

  const incident = activeIncident || (incidentsHistory.length > 0 ? incidentsHistory[0] : null);

  if (!incident) {
    return (
      <div className="p-12 rounded-2xl bg-[#0F1626] border border-[#1E2C48] text-center space-y-3 shadow-xl">
        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
        <h3 className="text-base font-bold text-white">No Active or Past Incidents in Session</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Trigger a simulation from the Command Center or Live Camera Studio to generate an emergency incident.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
              incident.status === 'ACTIVE' ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse' : 'bg-emerald-950 text-emerald-400'
            }`}>
              STATUS: {incident.status}
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold">{incident.id}</span>
          </div>
          <h2 className="text-lg font-black text-white mt-1">
            {incident.severity} {incident.type} — {incident.location}
          </h2>
          <p className="text-xs text-slate-400">Detected by {incident.detectedBy} at {new Date(incident.createdAt).toLocaleTimeString()}</p>
        </div>

        <div className="flex items-center space-x-2">
          {incident.status === "ACTIVE" && (
            <button
              onClick={() => resolveIncident()}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Mark as Resolved</span>
            </button>
          )}

          <button
            onClick={() => {
              setSelectedIncidentForReport(incident);
              setReportModalOpen(true);
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Official Report</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Key Parameters & Timeline (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* AI Strategic Directive */}
          <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-purple-400">
              Autonomous Commander Synthesis & Reasoning:
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed font-sans bg-[#141D32] p-3 rounded-lg border border-[#1E2C48]">
              "{incident.summary}"
            </p>

            <div className="space-y-1.5 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Evidence Factors:</span>
              {incident.reasoning && incident.reasoning.map((r, i) => (
                <div key={i} className="flex items-start space-x-2 text-[11px] text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activated Agents */}
          <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-2 text-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400">
              Activated Autonomous Specialist Agents:
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {incident.activatedAgents && incident.activatedAgents.map((ag, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-[#141D32] border border-[#1E2C48] text-slate-300 font-mono text-[11px]">
                  ✓ {ag}
                </span>
              ))}
            </div>
          </div>

          {/* Chronological Incident Timeline */}
          <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Full Incident Response Timeline</span>
            </h3>

            <div className="space-y-2 text-xs font-mono max-h-72 overflow-y-auto">
              {incident.timeline && incident.timeline.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-[#141D32] border border-[#1E2C48] flex items-center justify-between text-slate-300">
                  <div>
                    <span className="text-cyan-400 font-bold">[{item.source}]:</span>{" "}
                    <span>{item.event}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0 ml-2">{item.time || item.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Spatial Map & Assigned Units (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-3 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Spatial Incident Containment & Evacuation Map
            </h3>
            <CampusMap height="h-[360px]" interactive={true} />
          </div>

          {/* Deployed Resources Card */}
          <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-3 text-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-400">
              Allocated Tactical Resources:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[#141D32] border border-[#1E2C48] space-y-1">
                <span className="text-blue-400 font-bold block text-[10px]">SECURITY RESPONSE:</span>
                <p className="font-semibold text-white">S-04 Delta Rapid Squad</p>
                <p className="text-[11px] text-slate-400">Perimeter Containment Cordon</p>
              </div>

              <div className="p-3 rounded-lg bg-[#141D32] border border-[#1E2C48] space-y-1">
                <span className="text-rose-400 font-bold block text-[10px]">MEDICAL & AMBULANCE:</span>
                <p className="font-semibold text-white">Ambulance A-02 & M-03</p>
                <p className="text-[11px] text-slate-400">Triage Base at Zone B</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
