// Campus Sentinel AI - Human-In-The-Loop Governance Component
import React, { useState } from "react";
import { useSentinel } from "../context/SentinelContext";
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Edit3,
  UserCheck,
  AlertTriangle,
  Lock,
  Zap
} from "lucide-react";

export const HumanApprovalCard = () => {
  const { pendingApprovals, handleApprovalDecision } = useSentinel();
  const [operatorNotes, setOperatorNotes] = useState({});
  const [editingId, setEditingId] = useState(null);

  if (!pendingApprovals || pendingApprovals.length === 0) {
    return null;
  }

  const handleDecision = async (id, decision) => {
    const notes = operatorNotes[id] || "";
    await handleApprovalDecision(id, decision, notes);
  };

  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/80 via-[#141D32] to-[#0F1626] border border-amber-500/60 shadow-2xl space-y-3 animate-pulse-slow">
      <div className="flex items-center justify-between pb-2 border-b border-amber-500/30">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-300">
              Human-in-the-Loop Governance Gate
            </h3>
            <p className="text-[10px] text-slate-300">
              {pendingApprovals.length} High-Impact AI Recommendation(s) Awaiting Operator Authorization
            </p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500 text-black font-bold font-mono uppercase">
          Authorization Required
        </span>
      </div>

      <div className="space-y-3">
        {pendingApprovals.map((app) => {
          const isPending = app.status === "PENDING";
          return (
            <div
              key={app.id}
              className="p-3 rounded-lg bg-[#0B101D] border border-amber-500/40 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{app.title}</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  By: {app.proposedByAgent}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                {app.description}
              </p>

              {/* Action Buttons */}
              {isPending ? (
                <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDecision(app.id, "APPROVED")}
                      className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1 shadow-md transition-all active:scale-95"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>APPROVE</span>
                    </button>

                    <button
                      onClick={() => handleDecision(app.id, "REJECTED")}
                      className="px-3 py-1.5 rounded-md bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs flex items-center space-x-1 transition-all active:scale-95"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>REJECT</span>
                    </button>

                    <button
                      onClick={() => setEditingId(editingId === app.id ? null : app.id)}
                      className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center space-x-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Add Notes</span>
                    </button>
                  </div>

                  <span className="text-[10px] text-amber-400 font-mono">
                    Audit Log Entry Ready
                  </span>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-800 flex items-center space-x-2 text-[11px] font-semibold text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>✓ Action {app.status} by {app.reviewedBy || 'Authorized Operator'}.</span>
                </div>
              )}

              {editingId === app.id && (
                <div className="pt-2">
                  <input
                    type="text"
                    placeholder="Enter operator authorization notes / constraints..."
                    value={operatorNotes[app.id] || ""}
                    onChange={(e) => setOperatorNotes({ ...operatorNotes, [app.id]: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
