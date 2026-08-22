// Campus Sentinel AI - Security Tactical Officer HUD
import React from "react";
import { useSentinel } from "../../context/SentinelContext";
import { CampusMap } from "../CampusMap";
import {
  Shield,
  Radio,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Users,
  MapPin
} from "lucide-react";

export const SecurityView = () => {
  const { activeIncident, resources } = useSentinel();
  const isEmergency = !!activeIncident;

  const assignedSec = resources.security.find(s => s.status === "DISPATCHING" || s.assignedIncidentId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950 via-[#0F1626] to-[#0F1626] border border-blue-500/50 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-600 text-white font-bold uppercase">
            TACTICAL SECURITY HUD
          </span>
          <h2 className="text-lg font-black text-white mt-1">Campus Security Force Operations</h2>
          <p className="text-xs text-slate-300">Tactical perimeter cordons, access control, and responder navigation.</p>
        </div>
      </div>

      {isEmergency ? (
        <div className="space-y-6">
          {/* Tactical Directive */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950 via-[#141D32] to-[#0F1626] border border-amber-500/60 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-amber-400">
                <Radio className="w-4 h-4 text-amber-400 animate-spin" />
                <span>SECURITY DIRECTIVE: LEVEL 1 CONTAINMENT</span>
              </span>
              <span className="text-xs font-mono font-bold text-red-400">PRIORITY: CRITICAL</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded bg-black/60 border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Assigned Unit:</span>
                <span className="font-bold text-white font-mono">
                  {assignedSec ? `${assignedSec.name} (${assignedSec.id})` : "S-04 Delta Team"}
                </span>
              </div>
              <div className="p-2.5 rounded bg-black/60 border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Target Cordon:</span>
                <span className="font-bold text-cyan-400">{activeIncident.location} South Entrance</span>
              </div>
              <div className="p-2.5 rounded bg-black/60 border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Tactical Objective:</span>
                <span className="font-bold text-amber-300">Prevent student entry to hazard corridor</span>
              </div>
            </div>
          </div>

          {/* Tactical Map */}
          <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Tactical Spatial Layout & Responder Paths
            </h3>
            <CampusMap height="h-[420px]" interactive={true} />
          </div>
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-[#0F1626] border border-[#1E2C48] text-center space-y-3 shadow-xl">
          <Shield className="w-12 h-12 text-blue-400 mx-auto" />
          <h3 className="text-base font-bold text-white">All Security Sectors Nominal</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            8 Security patrol squads active and patrolling designated campus quadrants.
          </p>
        </div>
      )}
    </div>
  );
};
