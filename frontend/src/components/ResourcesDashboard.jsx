// Campus Sentinel AI - Resource Coordination Dashboard
import React, { useState } from "react";
import { useSentinel } from "../context/SentinelContext";
import {
  Shield,
  HeartPulse,
  Ambulance,
  Flame,
  Truck,
  CheckCircle2,
  Clock,
  Radio,
  MapPin,
  RefreshCw,
  AlertCircle
} from "lucide-react";

export const ResourcesDashboard = () => {
  const { resources, activeIncident } = useSentinel();
  const [activeCategory, setActiveCategory] = useState("ALL"); // ALL, SECURITY, MEDICAL, AMBULANCES, FIRE, TRANSIT

  const getStatusBadge = (status) => {
    switch (status) {
      case "AVAILABLE":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-700/60">AVAILABLE</span>;
      case "DISPATCHING":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-cyan-300 border border-blue-600 animate-pulse">DISPATCHING</span>;
      case "ON_SCENE":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-600">ON SCENE</span>;
      case "PATROLLING":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">PATROLLING</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-slate-500 border border-slate-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span>CAMPUS EMERGENCY RESOURCE COORDINATION FLEET</span>
          </h2>
          <p className="text-xs text-slate-400">
            Live telemetry, status tracking, and spatial dispatch allocation across all emergency units.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 bg-[#141D32] p-1 rounded-lg border border-[#1E2C48] text-xs">
          {["ALL", "SECURITY", "MEDICAL", "AMBULANCES", "FIRE", "TRANSIT"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Security Patrols Grid */}
      {(activeCategory === "ALL" || activeCategory === "SECURITY") && (
        <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E2C48]">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Campus Security Force ({resources.security.length} Units)</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Available: {resources.security.filter(s => s.status === 'AVAILABLE' || s.status === 'PATROLLING').length} / {resources.security.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {resources.security.map((sec) => (
              <div
                key={sec.id}
                className="p-3 rounded-lg bg-[#141D32] border border-[#1E2C48] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{sec.name}</span>
                  {getStatusBadge(sec.status)}
                </div>
                <p className="text-slate-300 font-medium">{sec.officer}</p>
                <div className="text-[10px] text-slate-400 font-mono space-y-0.5">
                  <p>Node: {sec.currentNode || "Sector Post"}</p>
                  <p>Gear: {sec.equipment ? sec.equipment.join(", ") : "Standard Radio"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ambulances & Medical Teams Grid */}
      {(activeCategory === "ALL" || activeCategory === "AMBULANCES" || activeCategory === "MEDICAL") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Ambulances */}
          <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E2C48]">
              <h3 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center space-x-2">
                <Ambulance className="w-4 h-4" />
                <span>Mobile ICU Ambulances ({resources.ambulances.length} Units)</span>
              </h3>
            </div>

            <div className="space-y-2.5">
              {resources.ambulances.map((amb) => (
                <div
                  key={amb.id}
                  className="p-3 rounded-lg bg-[#141D32] border border-[#1E2C48] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">{amb.name}</span>
                      {getStatusBadge(amb.status)}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Crew: {amb.crew ? amb.crew.join(", ") : "EMT Squad"} • Capacity: {amb.patientCapacity} Patients
                    </p>
                  </div>
                  <div className="text-right font-mono text-[10px] text-slate-400">
                    <span>{amb.icuEquipped ? "ICU Equipped (✓)" : "Basic Transit"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Medical Teams */}
          <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E2C48]">
              <h3 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center space-x-2">
                <HeartPulse className="w-4 h-4" />
                <span>Trauma & EMT Field Squads</span>
              </h3>
            </div>

            <div className="space-y-2.5">
              {resources.medical.map((med) => (
                <div
                  key={med.id}
                  className="p-3 rounded-lg bg-[#141D32] border border-[#1E2C48] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">{med.name}</span>
                      {getStatusBadge(med.status)}
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5 font-medium">{med.lead}</p>
                    <p className="text-[10px] text-slate-400">Triage Capacity: {med.triageCapacity} Slots</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fire Safety Units */}
      {(activeCategory === "ALL" || activeCategory === "FIRE") && (
        <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E2C48]">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center space-x-2">
              <Flame className="w-4 h-4" />
              <span>Fire Safety & Hazmat Containment Units ({resources.fireSafety.length} Tenders)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {resources.fireSafety.map((fsu) => (
              <div
                key={fsu.id}
                className="p-3 rounded-lg bg-[#141D32] border border-[#1E2C48] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{fsu.name}</span>
                  {getStatusBadge(fsu.status)}
                </div>
                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <p>Capacity: <strong className="text-white">{fsu.waterCapacityLitres}L</strong></p>
                  <p>Foam Ready: <strong className="text-emerald-400">{fsu.foamAvailable ? "Yes" : "No"}</strong></p>
                  <p>Crew: {fsu.crewSize} Firefighters</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
