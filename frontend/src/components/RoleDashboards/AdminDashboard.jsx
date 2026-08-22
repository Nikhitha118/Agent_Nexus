// Campus Sentinel - Admin Command Center Dashboard
import React, { useState } from "react";
import { useSentinel } from "../../context/SentinelContext";
import { ReportDetailsModal } from "../ReportDetailsModal";
import {
  ShieldAlert,
  Building,
  FileText,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Search,
  Filter,
  Eye,
  ArrowRight,
  Sparkles,
  Users,
  Activity,
  Layers
} from "lucide-react";

export const AdminDashboard = () => {
  const {
    reports,
    changeReportStatus,
    selectedReportForDetails,
    setSelectedReportForDetails,
    activeIncident,
    setActiveTab
  } = useSentinel();

  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter only Admin-routed reports (or all campus reports if Admin wishes to inspect)
  const adminReports = reports.filter(r => r.routedDepartment === "ADMIN" || categoryFilter === "ALL_DEPARTMENTS");

  const filteredReports = adminReports.filter(r => {
    const matchesCategory = categoryFilter === "ALL" || categoryFilter === "ALL_DEPARTMENTS" || r.category === categoryFilter;
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    const matchesSearch = !searchTerm.trim() ||
      r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.submittedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  // Summary Metrics
  const totalReports = adminReports.length;
  const newReports = adminReports.filter(r => r.status === "NEW").length;
  const inProgressReports = adminReports.filter(r => r.status === "IN_PROGRESS" || r.status === "ACKNOWLEDGED").length;
  const resolvedReports = adminReports.filter(r => r.status === "RESOLVED").length;
  const criticalReports = adminReports.filter(r => r.priority === "CRITICAL" || r.priority === "HIGH").length;

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

  const getPriorityBadge = (p) => {
    switch (p) {
      case "CRITICAL": return "bg-red-950 text-red-300 border-red-600 font-bold";
      case "HIGH": return "bg-orange-950 text-orange-300 border-orange-600 font-bold";
      case "MEDIUM": return "bg-amber-950/80 text-amber-300 border-amber-600";
      default: return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="w-full max-w-[1700px] mx-auto py-6 px-3 sm:px-4 lg:px-6 space-y-6 box-border">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2C48]">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-800 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>EXECUTIVE COMMAND PORTAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            ADMIN COMMAND CENTER
          </h1>
          <p className="text-xs text-slate-400">
            Real-time management for classroom facilities, faculty cabin tickets, salary administration, and general campus operations.
          </p>
        </div>

        {activeIncident && (
          <button
            onClick={() => setActiveTab("EMERGENCY_AI")}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-red-600/30 animate-pulse shrink-0"
          >
            <Flame className="w-4 h-4" />
            <span>ACTIVE EMERGENCY: {activeIncident.location}</span>
          </button>
        )}
      </div>

      {/* 5 Key Metric Cards (Responsive Grid, min-w-0 for flex shrinking) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
        <div className="min-w-0 p-4 rounded-2xl bg-[#0F1626] border border-[#1E2C48] shadow-lg space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase truncate block">TOTAL REPORTS</span>
          <p className="text-2xl font-black text-white">{totalReports}</p>
          <span className="text-[10px] text-cyan-400 font-mono block truncate">Admin Managed</span>
        </div>

        <div className="min-w-0 p-4 rounded-2xl bg-[#0F1626] border border-blue-600/40 shadow-lg space-y-1">
          <span className="text-[10px] font-mono text-blue-400 uppercase truncate block">NEW REPORTS</span>
          <p className="text-2xl font-black text-blue-300">{newReports}</p>
          <span className="text-[10px] text-blue-400 font-mono block truncate">Pending Review</span>
        </div>

        <div className="min-w-0 p-4 rounded-2xl bg-[#0F1626] border border-amber-600/40 shadow-lg space-y-1">
          <span className="text-[10px] font-mono text-amber-400 uppercase truncate block">IN PROGRESS</span>
          <p className="text-2xl font-black text-amber-300">{inProgressReports}</p>
          <span className="text-[10px] text-amber-400 font-mono block truncate">Dispatched</span>
        </div>

        <div className="min-w-0 p-4 rounded-2xl bg-[#0F1626] border border-emerald-600/40 shadow-lg space-y-1">
          <span className="text-[10px] font-mono text-emerald-400 uppercase truncate block">RESOLVED</span>
          <p className="text-2xl font-black text-emerald-300">{resolvedReports}</p>
          <span className="text-[10px] text-emerald-400 font-mono block truncate">Completed</span>
        </div>

        <div className="min-w-0 p-4 rounded-2xl bg-[#0F1626] border border-red-600/40 shadow-lg space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono text-red-400 uppercase truncate block">CRITICAL ISSUES</span>
          <p className="text-2xl font-black text-red-300">{criticalReports}</p>
          <span className="text-[10px] text-red-400 font-mono block truncate">High Priority</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="w-full p-4 rounded-3xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-4 box-border">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 w-full">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            {[
              { id: "ALL", label: "All Admin Queue" },
              { id: "CLASSROOM", label: "Classroom Issues" },
              { id: "CABIN_OFFICE", label: "Faculty Cabins" },
              { id: "SALARY_ADMIN", label: "Salary / Admin" },
              { id: "OTHER", label: "Other Campus" }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  categoryFilter === cat.id
                    ? "bg-blue-600 text-white shadow"
                    : "bg-[#141D32] text-slate-400 hover:text-white border border-[#1E2C48]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#141D32] border border-[#1E2C48] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        {/* Operational Reports Table in responsive container */}
        <div className="w-full max-w-full overflow-x-auto rounded-2xl border border-[#1E2C48]">
          <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
            <thead className="bg-[#141D32] text-slate-400 font-mono text-[10px] uppercase border-b border-[#1E2C48]">
              <tr>
                <th className="py-3 px-4">REPORT ID</th>
                <th className="py-3 px-4">ISSUE / TITLE</th>
                <th className="py-3 px-4">CATEGORY</th>
                <th className="py-3 px-4">LOCATION</th>
                <th className="py-3 px-4">REPORTER</th>
                <th className="py-3 px-4">PRIORITY</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2C48]">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No reports match the current filter.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-[#141D32]/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedReportForDetails(report)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                      {report.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white max-w-xs truncate">
                      {report.title}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px] whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {report.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                      {report.location}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-200 block">
                        {report.submittedBy?.name || "Campus Member"}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {report.submittedBy?.role || "User"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${getPriorityBadge(report.priority)}`}>
                        {report.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] border ${getStatusBadge(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        {report.status === "NEW" && (
                          <button
                            type="button"
                            onClick={() => changeReportStatus(report.id, "ACKNOWLEDGED", "Acknowledged by Admin.")}
                            className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px]"
                          >
                            Acknowledge
                          </button>
                        )}
                        {report.status !== "RESOLVED" && (
                          <button
                            type="button"
                            onClick={() => changeReportStatus(report.id, "RESOLVED", "Resolved by Admin.")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                          >
                            Resolve
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedReportForDetails(report)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
