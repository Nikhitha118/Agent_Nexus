// Campus Sentinel - Report Details & Live Timeline Modal
import React, { useState } from "react";
import { useSentinel } from "../context/SentinelContext";
import {
  FileText,
  X,
  Sparkles,
  MapPin,
  Clock,
  User,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Building,
  Image as ImageIcon,
  Video as VideoIcon,
  Layers,
  ArrowRight,
  Send,
  Printer
} from "lucide-react";

export const ReportDetailsModal = ({ report, onClose }) => {
  const { currentUser, currentRole, changeReportStatus } = useSentinel();
  const [newStatusNote, setNewStatusNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!report) return null;

  const isDepartmentOfficer = currentRole === "ADMIN" ||
    (currentRole === "TRANSPORT" && report.routedDepartment === "TRANSPORT") ||
    (currentRole === "MEDICAL" && report.routedDepartment === "MEDICAL") ||
    (currentRole === "SECURITY" && report.routedDepartment === "SECURITY");

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    await changeReportStatus(report.id, newStatus, newStatusNote);
    setIsUpdating(false);
    setNewStatusNote("");
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case "NEW":
        return "bg-blue-950/90 text-blue-300 border-blue-600";
      case "ACKNOWLEDGED":
        return "bg-purple-950/90 text-purple-300 border-purple-600";
      case "IN_PROGRESS":
        return "bg-amber-950/90 text-amber-300 border-amber-600";
      case "RESOLVED":
        return "bg-emerald-950/90 text-emerald-300 border-emerald-600";
      case "ESCALATED":
        return "bg-red-950/90 text-red-300 border-red-600";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0F1626] border border-[#1E2C48] rounded-2xl max-w-2xl w-full p-4 sm:p-5 space-y-3.5 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-start justify-between pb-2.5 border-b border-[#1E2C48]">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${getStatusBadge(report.status)}`}>
                STATUS: {report.status}
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                {report.id}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">{report.title}</h2>
            <div className="flex flex-wrap items-center gap-2.5 text-[10.5px] text-slate-400 font-mono pt-0.5">
              <span className="flex items-center space-x-1 text-slate-300">
                <MapPin className="w-3 h-3 text-rose-400" />
                <span>{report.location}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Building className="w-3 h-3 text-cyan-400" />
                <span>Routed to: <strong className="text-white">{report.routedDepartment}</strong></span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{new Date(report.createdAt).toLocaleString()}</span>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reporter Info */}
        <div className="p-2.5 rounded-xl bg-[#141D32] border border-[#1E2C48] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-950 border border-blue-700 flex items-center justify-center text-sm">
              {report.submittedBy?.avatar || "👤"}
            </div>
            <div>
              <p className="font-bold text-white text-xs">{report.submittedBy?.name || "Campus Member"}</p>
              <p className="text-[10px] text-slate-400 font-mono">
                {report.submittedBy?.department || report.submittedBy?.role || "Student"} • @{report.submittedBy?.username || "reporter"}
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[9px] uppercase font-bold border border-slate-700">
            {report.category}
          </span>
        </div>

        {/* Original Description */}
        <div className="space-y-1">
          <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-wider flex items-center space-x-1">
            <FileText className="w-3 h-3 text-amber-400" />
            <span>User Reported Description</span>
          </h4>
          <div className="p-2.5 rounded-xl bg-[#141D32]/80 border border-[#1E2C48] text-xs text-slate-200 leading-snug font-sans">
            {report.description}
          </div>
        </div>

        {/* AI Structured Analysis */}
        {report.aiReport && (
          <div className="p-3 rounded-xl bg-[#090D17] border border-cyan-500/40 space-y-2">
            <div className="flex items-center justify-between border-b border-[#1E2C48] pb-1.5">
              <div className="flex items-center space-x-1 text-xs font-black text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI STRUCTURED DEBRIEF & ACTION PLAN</span>
              </div>
              <span className="text-[9.5px] font-mono text-cyan-400 font-bold">
                PRIORITY: {report.aiReport.priority}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div>
                <span className="text-[9.5px] font-mono text-slate-400 uppercase block">Summary</span>
                <p className="text-slate-200 text-[11px] leading-snug">{report.aiReport.summary}</p>
              </div>
              <div>
                <span className="text-[9.5px] font-mono text-slate-400 uppercase block">Recommended Action</span>
                <p className="text-amber-200 text-[11px] leading-snug">{report.aiReport.requestedAction}</p>
              </div>
            </div>
          </div>
        )}

        {/* Media Attachments */}
        {(report.attachments?.imageUrl || report.attachments?.videoUrl) && (
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-wider">
              Attached Media Evidence
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {report.attachments?.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-[#1E2C48] bg-black/60 p-1.5 space-y-1">
                  <span className="text-[9.5px] font-mono text-emerald-400 flex items-center space-x-1">
                    <ImageIcon className="w-2.5 h-2.5" />
                    <span>Photo: {report.attachments.imageName || "Attached Image"}</span>
                  </span>
                  <img
                    src={report.attachments.imageUrl}
                    alt="Attached evidence"
                    className="max-h-36 w-full object-contain rounded-lg"
                  />
                </div>
              )}
              {report.attachments?.videoUrl && (
                <div className="rounded-xl overflow-hidden border border-[#1E2C48] bg-black/60 p-1.5 space-y-1">
                  <span className="text-[9.5px] font-mono text-cyan-400 flex items-center space-x-1">
                    <VideoIcon className="w-2.5 h-2.5" />
                    <span>Video: {report.attachments.videoName || "Attached Video"}</span>
                  </span>
                  <video
                    src={report.attachments.videoUrl}
                    controls
                    className="max-h-36 w-full rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status Lifecycle & Timeline */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-wider flex items-center space-x-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>Resolution Timeline & Audit Trail</span>
          </h4>
          <div className="space-y-1.5">
            {report.timeline?.map((step, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-[#141D32] border border-[#1E2C48] flex items-start space-x-2.5 text-xs"
              >
                <div className="p-1 rounded bg-slate-800 text-cyan-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white uppercase text-[11px]">{step.status}</span>
                    <span className="text-[9.5px] font-mono text-slate-400">
                      {new Date(step.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[10.5px] mt-0.5">{step.notes}</p>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">By: {step.updatedBy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Actions for Authorized Department Officers */}
        {isDepartmentOfficer && (
          <div className="p-3 rounded-xl bg-[#141D32] border border-[#1E2C48] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-cyan-400 uppercase tracking-wider">
                Department Operational Controls ({report.routedDepartment})
              </span>
              <span className="text-[9.5px] text-slate-400 font-mono">Update status</span>
            </div>

            <input
              type="text"
              placeholder="Optional progress note..."
              value={newStatusNote}
              onChange={(e) => setNewStatusNote(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#0F1626] border border-[#1E2C48] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleStatusChange("ACKNOWLEDGED")}
                disabled={isUpdating || report.status === "ACKNOWLEDGED"}
                className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow disabled:opacity-40"
              >
                ACKNOWLEDGE
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("IN_PROGRESS")}
                disabled={isUpdating || report.status === "IN_PROGRESS"}
                className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow disabled:opacity-40"
              >
                MARK IN PROGRESS
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("RESOLVED")}
                disabled={isUpdating || report.status === "RESOLVED"}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow disabled:opacity-40"
              >
                RESOLVE ISSUE
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("ESCALATED")}
                disabled={isUpdating || report.status === "ESCALATED"}
                className="px-2.5 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-white font-bold text-xs shadow disabled:opacity-40"
              >
                ESCALATE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
