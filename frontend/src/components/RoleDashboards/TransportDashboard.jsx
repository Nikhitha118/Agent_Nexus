// Campus Sentinel - Campus Transport Command Dashboard
import React, { useState } from "react";
import { useSentinel } from "../../context/SentinelContext";
import { ReportDetailsModal } from "../ReportDetailsModal";
import {
  Bus,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Plus,
  Navigation,
  Activity,
  Users
} from "lucide-react";

export const TransportDashboard = () => {
  const {
    reports,
    changeReportStatus,
    selectedReportForDetails,
    setSelectedReportForDetails,
    setActiveReportingCategory,
    resources
  } = useSentinel();

  const [statusFilter, setStatusFilter] = useState("ALL");

  // Only Transport-routed reports appear here
  const transportReports = reports.filter(r => r.routedDepartment === "TRANSPORT" || r.category === "TRANSPORTATION");

  const filteredReports = transportReports.filter(r => {
    if (statusFilter === "ALL") return true;
    return r.status === statusFilter;
  });

  const totalRequests = transportReports.length;
  const activeIssues = transportReports.filter(r => r.status !== "RESOLVED").length;
  const inProgressIssues = transportReports.filter(r => r.status === "IN_PROGRESS" || r.status === "ACKNOWLEDGED").length;
  const resolvedIssues = transportReports.filter(r => r.status === "RESOLVED").length;

  const getStatusBadge = (st) => {
    switch (st) {
      case "NEW": return "bg-blue-950/90 text-blue-300 border-blue-600";
      case "ACKNOWLEDGED": return "bg-purple-950/90 text-purple-300 border-purple-600";
      case "IN_PROGRESS": return "bg-amber-950/90 text-amber-300 border-amber-600";
      case "RESOLVED": return "bg-emerald-950/90 text-emerald-300 border-emerald-600";
      case "ESCALATED": return "bg-red-950/90 text-red-300 border-red-600";
      default: return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2C48]">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Bus className="w-3.5 h-3.5" />
            <span>CAMPUS TRANSIT & MOBILITY DISPATCH</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            CAMPUS TRANSPORT COMMAND
          </h1>
          <p className="text-xs text-slate-400">
            Shuttle fleet dispatch, student & faculty transit tickets, route optimization, and vehicle maintenance.
          </p>
        </div>

        <button
          onClick={() => setActiveReportingCategory("TRANSPORTATION")}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-600/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>LOG TRANSPORT ISSUE</span>
        </button>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#0F1626] border border-[#1E2C48] shadow-lg space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">TRANSPORTATION REQUESTS</span>
          <p className="text-2xl font-black text-white">{totalRequests}</p>
          <span className="text-[10px] text-cyan-400 font-mono">Total Logged</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1626] border border-amber-600/40 shadow-lg space-y-1">
          <span className="text-[10px] font-mono text-amber-400 uppercase">ACTIVE TRANSPORT ISSUES</span>
          <p className="text-2xl font-black text-amber-300">{activeIssues}</p>
          <span className="text-[10px] text-amber-400 font-mono">Pending Dispatch</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1626] border border-blue-600/40 shadow-lg space-y-1">
          <span className="text-[10px] font-mono text-blue-400 uppercase">IN PROGRESS</span>
          <p className="text-2xl font-black text-blue-300">{inProgressIssues}</p>
          <span className="text-[10px] text-blue-400 font-mono">Team Assigned</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1626] border border-emerald-600/40 shadow-lg space-y-1">
          <span className="text-[10px] font-mono text-emerald-400 uppercase">RESOLVED</span>
          <p className="text-2xl font-black text-emerald-300">{resolvedIssues}</p>
          <span className="text-[10px] text-emerald-400 font-mono">Route Restored</span>
        </div>
      </div>

      {/* Transit Fleet Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#0F1626] border border-[#1E2C48] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center justify-center">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Main Loop Shuttle #01</p>
              <p className="text-[10px] font-mono text-slate-400">Status: ON SCHEDULE (Gate 1 ➔ Block C)</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
            ACTIVE
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1626] border border-[#1E2C48] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-700 text-blue-400 flex items-center justify-center">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Express Shuttle #02</p>
              <p className="text-[10px] font-mono text-slate-400">Status: EN ROUTE (Hostels ➔ Admin Block)</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-700 font-bold">
            TRANSIT
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1626] border border-[#1E2C48] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-700 text-amber-400 flex items-center justify-center">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Transit Bus TB-03</p>
              <p className="text-[10px] font-mono text-slate-400">Status: DEPOT MAINTENANCE (AC Check)</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-700 font-bold">
            DEPOT
          </span>
        </div>
      </div>

      {/* Transport Issue Queue */}
      <div className="p-5 rounded-3xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-200">
            Active Transportation Tickets & Requests
          </h2>
          <div className="flex items-center space-x-1">
            {["ALL", "NEW", "IN_PROGRESS", "RESOLVED"].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  statusFilter === st
                    ? "bg-blue-600 text-white"
                    : "bg-[#141D32] text-slate-400 border border-[#1E2C48]"
                }`}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No active transportation requests. All campus routes running normally.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReportForDetails(report)}
                className="p-4 sm:p-5 rounded-2xl bg-[#141D32] border border-[#1E2C48] hover:border-emerald-500/50 shadow-lg transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(report.status)}`}>
                      {report.status}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
                      {report.priority} PRIORITY
                    </span>
                    <span className="text-[11px] font-mono text-cyan-400">{report.id}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {report.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2">
                    {report.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono pt-1">
                    <span className="flex items-center space-x-1 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{report.location}</span>
                    </span>
                    <span>•</span>
                    <span>Reporter: <strong>{report.submittedBy?.name || "Commuter"}</strong> ({report.submittedBy?.role})</span>
                    <span>•</span>
                    <span>{new Date(report.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {report.status === "NEW" && (
                    <button
                      type="button"
                      onClick={() => changeReportStatus(report.id, "ACKNOWLEDGED", "Transit request acknowledged.")}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                    >
                      ACKNOWLEDGE
                    </button>
                  )}
                  {report.status !== "IN_PROGRESS" && report.status !== "RESOLVED" && (
                    <button
                      type="button"
                      onClick={() => changeReportStatus(report.id, "IN_PROGRESS", "Fleet mechanic / backup vehicle assigned.")}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
                    >
                      ASSIGN TEAM
                    </button>
                  )}
                  {report.status !== "RESOLVED" && (
                    <button
                      type="button"
                      onClick={() => changeReportStatus(report.id, "RESOLVED", "Vehicle inspected and transit restored.")}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      RESOLVED
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Report Details Modal */}
      {selectedReportForDetails && (
        <ReportDetailsModal
          report={selectedReportForDetails}
          onClose={() => setSelectedReportForDetails(null)}
        />
      )}
    </div>
  );
};
