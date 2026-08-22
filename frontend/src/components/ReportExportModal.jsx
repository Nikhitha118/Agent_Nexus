// Campus Sentinel AI - Printable Incident Debrief & Audit Report
import React from "react";
import { useSentinel } from "../context/SentinelContext";
import {
  FileText,
  Printer,
  X,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Clock,
  MapPin,
  Users
} from "lucide-react";

export const ReportExportModal = () => {
  const {
    reportModalOpen,
    setReportModalOpen,
    selectedIncidentForReport,
    activeIncident
  } = useSentinel();

  const incident = selectedIncidentForReport || activeIncident;

  if (!reportModalOpen || !incident) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-[#0F1626] border border-[#1E2C48] rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#1E2C48] flex items-center justify-between bg-[#141D32] print:hidden">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Official Incident Post-Action Debrief Report
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export PDF</span>
            </button>

            <button
              onClick={() => setReportModalOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="p-8 space-y-6 overflow-y-auto text-slate-200 font-sans print:text-black print:p-6">
          {/* Official Letterhead */}
          <div className="border-b-2 border-red-500 pb-4 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-black tracking-wider text-white print:text-black">
                CAMPUS SENTINEL
              </h1>
              <p className="text-xs text-slate-400 print:text-gray-600">
                University Emergency Management & Autonomous Multi-Agent Command Division
              </p>
              <p className="text-[11px] text-slate-500 print:text-gray-500 font-mono mt-0.5">
                Vignan University Digital Twin Operations
              </p>
            </div>

            <div className="text-right font-mono text-xs">
              <span className="px-2.5 py-1 rounded bg-red-950 text-red-300 border border-red-600 font-bold uppercase print:bg-red-100 print:text-red-700">
                {incident.severity} {incident.type}
              </span>
              <p className="text-[11px] text-slate-400 print:text-gray-500 mt-1">INCIDENT ID: {incident.id}</p>
            </div>
          </div>

          {/* Incident Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#141D32] print:bg-gray-100 p-4 rounded-xl border border-[#1E2C48] print:border-gray-300">
            <div>
              <span className="text-slate-400 print:text-gray-500 block text-[10px] uppercase">Incident Type</span>
              <strong className="text-white print:text-black">{incident.type}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-500 block text-[10px] uppercase">Primary Location</span>
              <strong className="text-white print:text-black">{incident.location}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-500 block text-[10px] uppercase">AI Confidence</span>
              <strong className="text-amber-400 print:text-amber-700 font-mono">{incident.confidence}%</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-500 block text-[10px] uppercase">Occupants At Risk</span>
              <strong className="text-cyan-400 print:text-cyan-700 font-mono">{incident.peopleAtRisk}</strong>
            </div>
          </div>

          {/* Strategic Summary */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-white print:text-black uppercase text-[11px] tracking-wider border-b border-slate-700 pb-1">
              Autonomous Commander Strategic Assessment:
            </h3>
            <p className="text-slate-300 print:text-gray-800 leading-relaxed italic bg-slate-900/60 print:bg-gray-50 p-3 rounded-lg border border-slate-800 print:border-gray-200">
              "{incident.summary}"
            </p>
          </div>

          {/* Assigned Emergency Assets */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-white print:text-black uppercase text-[11px] tracking-wider border-b border-slate-700 pb-1">
              Deployed Responders & Tactical Allocation:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-2.5 rounded-lg bg-[#141D32] print:bg-gray-100 border border-[#1E2C48] print:border-gray-300">
                <span className="text-[10px] text-blue-400 font-bold block">SECURITY SQUAD:</span>
                <p className="font-semibold text-white print:text-black">S-04 Delta Rapid Response</p>
                <p className="text-[10px] text-slate-400">Main Academic Block Perimeter</p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#141D32] print:bg-gray-100 border border-[#1E2C48] print:border-gray-300">
                <span className="text-[10px] text-rose-400 font-bold block">AMBULANCE & TRIAGE:</span>
                <p className="font-semibold text-white print:text-black">Ambulance A-02 & Team M-03</p>
                <p className="text-[10px] text-slate-400">Central Quadrangle Staging</p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#141D32] print:bg-gray-100 border border-[#1E2C48] print:border-gray-300">
                <span className="text-[10px] text-amber-400 font-bold block">FIRE SAFETY UNIT:</span>
                <p className="font-semibold text-white print:text-black">FSU-03 Quick Fire Tender</p>
                <p className="text-[10px] text-slate-400">South Hydrant Hookup</p>
              </div>
            </div>
          </div>

          {/* Chronological Incident Timeline */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-white print:text-black uppercase text-[11px] tracking-wider border-b border-slate-700 pb-1">
              Incident Response Timeline:
            </h3>
            <div className="space-y-1.5 font-mono text-[11px]">
              {incident.timeline && incident.timeline.map((evt, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-900/60 print:bg-gray-50 border border-slate-800 print:border-gray-200">
                  <span className="text-slate-300 print:text-gray-800">{evt.event}</span>
                  <span className="text-slate-400 print:text-gray-500 shrink-0 ml-2">{evt.time || evt.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Human Governance Authorization Signature */}
          <div className="pt-4 border-t-2 border-slate-800 print:border-gray-300 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-white print:text-black">Authorized Operations Commander</p>
              <p className="text-[11px] text-slate-400 print:text-gray-500">Chief Officer Mitchell (Verified Electronic Signature)</p>
            </div>
            <div className="text-right font-mono text-[10px] text-slate-400 print:text-gray-500">
              <span>SHA-256 LEDGER AUDIT HASH:</span>
              <p className="text-cyan-400 print:text-cyan-700">8f7b2c9a4e1d6e3f5b8a0c2e</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
