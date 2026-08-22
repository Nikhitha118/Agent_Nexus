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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0F1626] border border-[#1E2C48] rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#1E2C48]">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(report.status)}`}>
                STATUS: {report.status}
              </span>
              <span className="text-xs font-mono text-cyan-400">
                {report.id}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{report.title}</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono pt-1">
              <span className="flex items-center space-x-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{report.location}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                <span>Routed to: <strong className="text-white">{report.routedDepartment}</strong></span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{new Date(report.createdAt).toLocaleString()}</span>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reporter Info */}
        <div className="p-3.5 rounded-2xl bg-[#141D32] border border-[#1E2C48] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-700 flex items-center justify-center text-base">
              {report.submittedBy?.avatar || "👤"}
            </div>
            <div>
              <p className="font-bold text-white">{report.submittedBy?.name || "Campus Member"}</p>
              <p className="text-[11px] text-slate-400 font-mono">
                {report.submittedBy?.department || report.submittedBy?.role || "Student"} • @{report.submittedBy?.username || "reporter"}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[10px] uppercase font-bold border border-slate-700">
            {report.category}
          </span>
        </div>

        {/* Original Description */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>User Reported Description</span>
          </h4>
          <div className="p-4 rounded-2xl bg-[#141D32]/80 border border-[#1E2C48] text-xs text-slate-200 leading-relaxed font-sans">
            {report.description}
          </div>
        </div>

        {/* AI Structured Analysis */}
        {report.aiReport && (
          <div className="p-4 rounded-2xl bg-[#090D17] border border-cyan-500/40 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E2C48] pb-2">
              <div className="flex items-center space-x-1.5 text-xs font-black text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI STRUCTURED DEBRIEF & ACTION PLAN</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">
                PRIORITY: {report.aiReport.priority}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Summary</span>
                <p className="text-slate-200 leading-relaxed">{report.aiReport.summary}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Recommended Action</span>
                <p className="text-amber-200 leading-relaxed">{report.aiReport.requestedAction}</p>
              </div>
            </div>
          </div>
        )}

        {/* Media Attachments */}
        {(report.attachments?.imageUrl || report.attachments?.videoUrl) && (
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider">
              Attached Media Evidence
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.attachments?.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-[#1E2C48] bg-black/60 p-2 space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>Photo: {report.attachments.imageName || "Attached Image"}</span>
                  </span>
                  <img
                    src={report.attachments.imageUrl}
                    alt="Attached evidence"
                    className="max-h-48 w-full object-contain rounded-xl"
                  />
                </div>
              )}
              {report.attachments?.videoUrl && (
                <div className="rounded-2xl overflow-hidden border border-[#1E2C48] bg-black/60 p-2 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 flex items-center space-x-1">
                    <VideoIcon className="w-3 h-3" />
                    <span>Video: {report.attachments.videoName || "Attached Video"}</span>
                  </span>
                  <video
                    src={report.attachments.videoUrl}
                    controls
                    className="max-h-48 w-full rounded-xl"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status Lifecycle & Timeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Resolution Timeline & Audit Trail</span>
          </h4>
          <div className="space-y-2">
            {report.timeline?.map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#141D32] border border-[#1E2C48] flex items-start space-x-3 text-xs"
              >
                <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white uppercase">{step.status}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(step.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-0.5">{step.notes}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">By: {step.updatedBy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Actions for Authorized Department Officers */}
        {isDepartmentOfficer && (
          <div className="p-4 rounded-2xl bg-[#141D32] border-2 border-[#1E2C48] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">
                Department Operational Controls ({report.routedDepartment})
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Update issue status</span>
            </div>

            <input
              type="text"
              placeholder="Optional progress note (e.g. Technician dispatched / Parts replaced)"
              value={newStatusNote}
              onChange={(e) => setNewStatusNote(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0F1626] border border-[#1E2C48] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleStatusChange("ACKNOWLEDGED")}
                disabled={isUpdating || report.status === "ACKNOWLEDGED"}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow disabled:opacity-40"
              >
                ACKNOWLEDGE
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("IN_PROGRESS")}
                disabled={isUpdating || report.status === "IN_PROGRESS"}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow disabled:opacity-40"
              >
                MARK IN PROGRESS
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("RESOLVED")}
                disabled={isUpdating || report.status === "RESOLVED"}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow disabled:opacity-40"
              >
                RESOLVE ISSUE
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("ESCALATED")}
                disabled={isUpdating || report.status === "ESCALATED"}
                className="px-3.5 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-xs shadow disabled:opacity-40"
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
