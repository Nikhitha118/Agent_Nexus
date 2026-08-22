// Campus Sentinel - Resolve Emergency Incident Confirmation Modal
import React, { useState } from "react";
import { useSentinel } from "../context/SentinelContext";
import {
  CheckCircle2,
  AlertTriangle,
  Flame,
  Shield,
  MapPin,
  Clock,
  X
} from "lucide-react";

export const ResolveIncidentModal = ({ isOpen, onClose, incident }) => {
  const { resolveEmergencyIncident, activeIncident, currentUser } = useSentinel();
  const [notes, setNotes] = useState("Incident controlled, area stabilized, and campus confirmed safe.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const target = incident || activeIncident;
  if (!isOpen || !target) return null;

  const handleConfirmResolve = async () => {
    setIsSubmitting(true);
    await resolveEmergencyIncident(target.id, notes);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0F1626] border-2 border-emerald-500/70 rounded-3xl shadow-2xl shadow-emerald-950/80 p-6 space-y-5 animate-scale-in">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-950/90 border border-emerald-500 flex items-center justify-center text-emerald-400 shadow-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                Resolve this emergency incident?
              </h3>
              <p className="text-xs text-slate-400">
                Confirm all hazard perimeters are safe and cleared.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Incident Summary Card */}
        <div className="p-4 rounded-2xl bg-[#141D32] border border-[#1E2C48] space-y-2.5 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-mono text-[10px]">INCIDENT ID:</span>
            <span className="font-mono font-bold text-cyan-400">{target.id || "INC-2026-ACTIVE"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-mono text-[10px]">INCIDENT TYPE:</span>
            <span className="font-bold text-white uppercase">{target.type || "EMERGENCY"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-mono text-[10px]">CURRENT LOCATION:</span>
            <span className="font-bold text-white">{target.location || "Campus"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-mono text-[10px]">SEVERITY:</span>
            <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-700 font-bold font-mono text-[10px]">
              {target.severity || "CRITICAL"}
            </span>
          </div>
        </div>

        {/* Resolution Notes Input */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-slate-400 uppercase">
            Resolution Notes / Verification:
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-[#0B101D] border border-[#1E2C48] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-xl bg-[#141D32] hover:bg-slate-800 text-slate-300 font-bold text-xs border border-[#1E2C48] transition-all"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={handleConfirmResolve}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all active:scale-95 border border-emerald-400/40"
          >
            {isSubmitting ? "RESOLVING..." : "RESOLVE INCIDENT"}
          </button>
        </div>
      </div>
    </div>
  );
};
