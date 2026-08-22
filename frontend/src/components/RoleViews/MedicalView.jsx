// Campus Sentinel AI - Paramedic & Medical Staging HUD
import React from "react";
import { useSentinel } from "../../context/SentinelContext";
import { CampusMap } from "../CampusMap";
import {
  HeartPulse,
  Ambulance,
  Navigation,
  CheckCircle2,
  AlertOctagon,
  Users,
  Activity
} from "lucide-react";

export const MedicalView = () => {
  const { activeIncident, resources } = useSentinel();
  const isEmergency = !!activeIncident;

  const assignedAmb = resources.ambulances.find(a => a.status === "DISPATCHING" || a.assignedIncidentId);
  const assignedMed = resources.medical.find(m => m.status === "DISPATCHING" || m.assignedIncidentId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950 via-[#0F1626] to-[#0F1626] border border-rose-500/50 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-600 text-white font-bold uppercase">
            MEDICAL & TRIAGE HUD
          </span>
          <h2 className="text-lg font-black text-white mt-1">Campus Emergency Medical Response</h2>
          <p className="text-xs text-slate-300">Ambulance routing, triage staging coordination, and burn/trauma readiness.</p>
        </div>
      </div>

      {isEmergency ? (
        <div className="space-y-6">
          {/* Medical Response Directive */}
          <div className="p-4 rounded-xl bg-[#0F1626] border border-rose-500/60 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-rose-400">
                <HeartPulse className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>TRIAGE STAGING PROTOCOL ACTIVATED</span>
              </span>
              <span className="text-xs font-mono font-bold text-rose-300">
                Estimated Demand: ~18 Inhalation/Trauma Cases
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded bg-[#141D32] border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Dispatched Ambulance:</span>
                <span className="font-bold text-white font-mono">
                  {assignedAmb ? `${assignedAmb.name} (${assignedAmb.id})` : "A-02 Rapid Ambulance"}
                </span>
                <p className="text-[10px] text-cyan-400 mt-0.5">ETA: ~2 min (Direct Vehicle Path)</p>
              </div>

              <div className="p-2.5 rounded bg-[#141D32] border border-slate-700">
                <span className="text-slate-400 block text-[10px]">EMT Field Squad:</span>
                <span className="font-bold text-white">
                  {assignedMed ? assignedMed.name : "Team M-03 (Trauma Squad)"}
                </span>
                <p className="text-[10px] text-emerald-400 mt-0.5">Triage Capacity: 8 Slots</p>
              </div>

              <div className="p-2.5 rounded bg-[#141D32] border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Designated Medical Staging:</span>
                <span className="font-bold text-amber-300">Central Quadrangle Green (Zone B)</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Outside thermal smoke radius</p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Ambulance Direct Transit Route & Medical Staging Point
            </h3>
            <CampusMap height="h-[420px]" interactive={true} />
          </div>
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-[#0F1626] border border-[#1E2C48] text-center space-y-3 shadow-xl">
          <HeartPulse className="w-12 h-12 text-rose-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Medical Readiness: 100%</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Campus Health Center, 4 Ambulances, and 4 EMT squads standing by.
          </p>
        </div>
      )}
    </div>
  );
};
