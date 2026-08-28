// Campus Sentinel - My Submitted Reports View (Student & Faculty)
import React, { useState } from "react";
import { useSentinel } from "../context/SentinelContext";
import { ReportDetailsModal } from "./ReportDetailsModal";
import {
  FileText,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  Building,
  CheckCircle2,
  AlertCircle,
  Eye,
  Layers,
  ArrowRight
} from "lucide-react";

export const MyReportsView = () => {
  const {
    currentUser,
    reports,
    setActiveReportingCategory,
    selectedReportForDetails,
    setSelectedReportForDetails
  } = useSentinel();

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter reports submitted by current user (or all if dev/unauthenticated fallback)
  const myReports = reports.filter(r => {
    if (!currentUser) return true;
    return r.submittedBy && (r.submittedBy.id === currentUser.id || r.submittedBy.username === currentUser.username);
  });

  const filteredReports = myReports.filter(r => {
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    const matchesSearch = !searchTerm.trim() ||
      r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
    <div className="max-w-4xl mx-auto py-4 px-3 sm:px-4 space-y-3.5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#1E2C48]">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center space-x-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>MY SUBMITTED REPORTS & REQUESTS</span>
          </h1>
          <p className="text-[11px] text-slate-400">
            Track real-time status, departmental updates, and AI resolution history for your campus issues.
          </p>
        </div>

        <button
          onClick={() => setActiveReportingCategory("CLASSROOM")}
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-blue-600/20 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>REPORT NEW ISSUE</span>
        </button>
      </div>

      {/* Controls Bar: Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search your reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#141D32] border border-[#1E2C48] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 w-full sm:w-auto">
          {["ALL", "NEW", "IN_PROGRESS", "RESOLVED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase transition-all ${
                statusFilter === st
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-[#141D32] text-slate-400 hover:text-white border border-[#1E2C48]"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#0F1626] border border-[#1E2C48] text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#141D32] text-slate-500 flex items-center justify-center mx-auto">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">No Reports Found</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            You haven't submitted any reports matching this filter yet. Click below to submit an issue.
          </p>
          <button
            onClick={() => setActiveReportingCategory("CLASSROOM")}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
          >
            REPORT AN ISSUE
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => setSelectedReportForDetails(report)}
              className="p-3 rounded-xl bg-[#0F1626] border border-[#1E2C48] hover:border-cyan-500/40 shadow-md hover:shadow-cyan-500/10 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 group"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${getStatusBadge(report.status)}`}>
                    {report.status}
                  </span>
                  <span className="text-[10.5px] font-mono text-cyan-400 font-bold">
                    {report.id}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {report.category}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {report.title}
                </h3>

                <p className="text-[10px] text-slate-400 line-clamp-1">
                  {report.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[9.5px] text-slate-400 font-mono pt-0.5">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{report.location}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Building className="w-3 h-3 text-slate-500" />
                    <span>Routed: {report.routedDepartment}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{new Date(report.createdAt).toLocaleString()}</span>
                  </span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-1 self-stretch sm:self-center shrink-0">
                <span className="text-[11px] font-bold text-cyan-400 group-hover:underline flex items-center space-x-1">
                  <span>Track Status</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

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
