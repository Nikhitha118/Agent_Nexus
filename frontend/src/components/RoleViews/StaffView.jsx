// Campus Sentinel AI - Faculty & Floor Warden HUD
import React, { useState } from "react";
import { useSentinel } from "../../context/SentinelContext";
import { CampusMap } from "../CampusMap";
import {
  Briefcase,
  Users,
  CheckSquare,
  Square,
  Navigation,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export const StaffView = () => {
  const { activeIncident } = useSentinel();
  const isEmergency = !!activeIncident;

  const [checklist, setChecklist] = useState([
    { id: 1, text: "Announce immediate evacuation to classroom occupants", done: false },
    { id: 2, text: "Check restrooms and side seminar rooms on floor", done: false },
    { id: 3, text: "Close lab doors behind exit to contain air drafts", done: false },
    { id: 4, text: "Guide students toward South/East stairwells (Do not use elevators)", done: false },
    { id: 5, text: "Proceed to Assembly Point B and conduct student roll call", done: false }
  ]);

  const toggleCheck = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950 via-[#0F1626] to-[#0F1626] border border-purple-500/50 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-600 text-white font-bold uppercase">
            FACULTY & FLOOR WARDEN HUD
          </span>
          <h2 className="text-lg font-black text-white mt-1">Staff Emergency Coordination Portal</h2>
          <p className="text-xs text-slate-300">Building sweep protocols, headcount tracking, and designated warden evacuation guidance.</p>
        </div>
      </div>

      {isEmergency ? (
        <div className="space-y-6">
          {/* Emergency Directive */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/90 to-[#0F1626] border border-red-500/60 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-red-400 uppercase">Emergency Wardens Notice:</span>
              <span className="font-mono text-white font-bold">{activeIncident.id}</span>
            </div>
            <p className="text-sm font-bold text-white">
              Assist evacuation of {activeIncident.location}. Direct evacuees toward {activeIncident.recommendedAssemblyPoint ? activeIncident.recommendedAssemblyPoint.name : "Assembly Point B"}.
            </p>
          </div>

          {/* Floor Clearing Checklist */}
          <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center space-x-2">
              <CheckSquare className="w-4 h-4" />
              <span>Floor Warden Action Checklist:</span>
            </h3>

            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3 rounded-lg border cursor-pointer flex items-center space-x-3 transition-all ${
                    item.done
                      ? "bg-emerald-950/40 border-emerald-500/50 text-slate-300"
                      : "bg-[#141D32] border-[#1E2C48] text-white hover:border-slate-600"
                  }`}
                >
                  {item.done ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                  <span className={`text-xs ${item.done ? "line-through text-slate-400" : "font-medium"}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Evacuation Map */}
          <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Campus Safe Corridor Map
            </h3>
            <CampusMap height="h-[380px]" interactive={true} />
          </div>
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-[#0F1626] border border-[#1E2C48] text-center space-y-3 shadow-xl">
          <Briefcase className="w-12 h-12 text-purple-400 mx-auto" />
          <h3 className="text-base font-bold text-white">All Faculty Zones Clear</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No evacuation directives active. Staff warden checklists standing by.
          </p>
        </div>
      )}
    </div>
  );
};
