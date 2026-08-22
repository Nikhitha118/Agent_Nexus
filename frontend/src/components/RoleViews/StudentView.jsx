// Campus Sentinel AI - Student Civilian Evacuation HUD
import React from "react";
import { useSentinel } from "../../context/SentinelContext";
import { CampusMap } from "../CampusMap";
import {
  Flame,
  ShieldCheck,
  Navigation,
  AlertTriangle,
  CheckCircle2,
  Info,
  MapPin,
  Clock,
  ArrowRight
} from "lucide-react";

export const StudentView = () => {
  const { activeIncident } = useSentinel();
  const isEmergency = !!activeIncident;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/80 via-[#0F1626] to-[#0F1626] border border-blue-500/40 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-600 text-white font-bold uppercase">
            STUDENT PORTAL
          </span>
          <h2 className="text-lg font-black text-white mt-1">Campus Safety & Evacuation Guidance</h2>
          <p className="text-xs text-slate-300">Live geolocation-aware guidance tailored for campus students.</p>
        </div>
      </div>

      {isEmergency ? (
        <div className="space-y-6">
          {/* Emergency Alert Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-red-950 via-red-900/60 to-slate-900 border-2 border-red-500 shadow-2xl space-y-3 animate-pulse-slow">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-red-600 text-white shadow animate-bounce">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-red-300">
                  🚨 CAMPUS EMERGENCY ALERT
                </span>
                <h3 className="text-base font-black text-white">
                  Fire detected near {activeIncident.location}. Please remain calm.
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-red-800/60">
              <div className="p-2.5 rounded-lg bg-black/60 border border-red-500/40">
                <span className="text-red-400 font-bold block mb-0.5">⚠️ DANGER ZONES TO AVOID:</span>
                <p className="text-slate-200">{activeIncident.location} & North Corridor</p>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50">
                <span className="text-emerald-400 font-bold block mb-0.5">🟢 RECOMMENDED SAFE EXIT:</span>
                <p className="text-white font-semibold">
                  Gate 2 → {activeIncident.recommendedAssemblyPoint ? activeIncident.recommendedAssemblyPoint.name : "Assembly Point B"}
                </p>
              </div>
            </div>
          </div>

          {/* Safe Route Map View */}
          <div className="p-4 rounded-2xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <h3 className="font-bold text-white flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>Your Live Safe Evacuation Pathway</span>
              </h3>
              <span className="text-emerald-400 font-mono font-bold">
                Follow Green Line on Map
              </span>
            </div>

            <CampusMap height="h-[380px]" interactive={true} />
          </div>

          {/* Action Checklist */}
          <div className="p-4 rounded-2xl bg-[#0F1626] border border-[#1E2C48] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Immediate Safety Instructions:
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#141D32] flex items-center space-x-2.5 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Do NOT use elevators. Use the marked South/East emergency stairwells.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#141D32] flex items-center space-x-2.5 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Leave bulky personal belongings behind; proceed briskly without running.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#141D32] flex items-center space-x-2.5 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Report to Floor Warden or Assembly Point Captain upon arrival at Zone B.</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-[#0F1626] border border-[#1E2C48] text-center space-y-3 shadow-xl">
          <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Campus is Secure & Peaceful</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No active emergencies reported. In case of an incident, this screen will instantly switch to live turn-by-turn safe evacuation guidance.
          </p>
        </div>
      )}
    </div>
  );
};
