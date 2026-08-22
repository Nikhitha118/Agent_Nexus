// Campus Sentinel - Dedicated Student Dashboard
import React from "react";
import { useSentinel } from "../../context/SentinelContext";
import { IssueReportingModal } from "../IssueReportingModal";
import { ReportDetailsModal } from "../ReportDetailsModal";
import {
  GraduationCap,
  Building,
  Bus,
  HeartPulse,
  HelpCircle,
  ArrowRight,
  FileText,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Navigation,
  Plus
} from "lucide-react";

export const StudentDashboard = () => {
  const {
    currentUser,
    reports,
    activeReportingCategory,
    setActiveReportingCategory,
    setActiveTab,
    selectedReportForDetails,
    setSelectedReportForDetails,
    activeIncident
  } = useSentinel();

  // 4 Main Student Issue Categories
  const STUDENT_ISSUE_CARDS = [
    {
      category: "CLASSROOM",
      title: "CLASSROOM ISSUES",
      description: "Report classroom infrastructure, AC, projector, electrical, or facility problems.",
      icon: Building,
      color: "from-amber-600 to-orange-700",
      border: "border-amber-500/40 hover:border-amber-400 hover:shadow-amber-500/10",
      targetDept: "ADMIN"
    },
    {
      category: "TRANSPORTATION",
      title: "TRANSPORTATION ISSUES",
      description: "Report bus delays, shuttle maintenance, or campus transportation problems.",
      icon: Bus,
      color: "from-emerald-600 to-teal-700",
      border: "border-emerald-500/40 hover:border-emerald-400 hover:shadow-emerald-500/10",
      targetDept: "TRANSPORT"
    },
    {
      category: "MEDICAL",
      title: "MEDICAL ASSISTANCE",
      description: "Request urgent medical support, first-aid triage, or report a health emergency.",
      icon: HeartPulse,
      color: "from-rose-600 to-red-700",
      border: "border-rose-500/40 hover:border-rose-400 hover:shadow-rose-500/10",
      targetDept: "MEDICAL"
    },
    {
      category: "OTHER",
      title: "OTHER CAMPUS ISSUES",
      description: "Report any other campus, hostel, cafeteria, or general facility concern.",
      icon: HelpCircle,
      color: "from-blue-600 to-indigo-700",
      border: "border-blue-500/40 hover:border-blue-400 hover:shadow-blue-500/10",
      targetDept: "ADMIN"
    }
  ];

  // Filter student's recent reports
  const studentReports = reports.filter(r => {
    if (!currentUser) return true;
    return r.submittedBy && (r.submittedBy.id === currentUser.id || r.submittedBy.username === currentUser.username);
  }).slice(0, 4);

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
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-8 animate-fade-in">
      {/* 1. Page Header */}
      <div className="text-center space-y-2 pb-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>STUDENT PORTAL • VIGNAN UNIVERSITY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          STUDENT CAMPUS ASSISTANCE
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-300 max-w-xl mx-auto">
          Report campus issues and request assistance from the appropriate department.
        </p>
      </div>

      {/* If Reporting Category Active, Show Reporting Modal */}
      {activeReportingCategory && (
        <IssueReportingModal
          defaultCategory={activeReportingCategory}
          onClose={() => setActiveReportingCategory(null)}
        />
      )}

      {/* 2. Four Main Issue Cards Grid */}
      {!activeReportingCategory && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-300">
              Select Issue Category to Report
            </h2>
            <span className="text-[11px] font-mono text-cyan-400">Automatic Department Routing</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STUDENT_ISSUE_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.category}
                  className={`p-5 rounded-3xl bg-[#0F1626] border ${card.border} shadow-xl transition-all flex flex-col justify-between space-y-4 group`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#141D32] text-slate-300 border border-[#1E2C48]">
                        ROUTES TO: {card.targetDept}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed mt-1">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveReportingCategory(card.category)}
                    className={`w-full py-2.5 px-4 rounded-xl bg-gradient-to-r ${card.color} hover:brightness-110 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-95 border border-white/20`}
                  >
                    <span>REPORT ISSUE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. My Active Reports Overview Section */}
      {!activeReportingCategory && (
        <div className="p-6 rounded-3xl bg-[#0F1626] border border-[#1E2C48] shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2C48]">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                My Recent Reports & Status
              </h3>
            </div>
            <button
              onClick={() => setActiveTab("MY_REPORTS")}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <span>View All Reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {studentReports.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No recent reports. Select a category above to submit an issue.
            </div>
          ) : (
            <div className="space-y-2.5">
              {studentReports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReportForDetails(report)}
                  className="p-3.5 rounded-2xl bg-[#141D32] border border-[#1E2C48] hover:border-cyan-500/40 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(report.status)}`}>
                        {report.status}
                      </span>
                      <span className="text-[11px] font-mono text-cyan-400">{report.id}</span>
                    </div>
                    <p className="text-xs font-bold text-white group-hover:text-cyan-300">
                      {report.title}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Location: {report.location} • Routed: {report.routedDepartment}
                    </p>
                  </div>

                  <span className="text-[11px] font-bold text-cyan-400 group-hover:underline self-end sm:self-center">
                    Track Details →
                  </span>
                </div>
              ))}
            </div>
          )}
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
