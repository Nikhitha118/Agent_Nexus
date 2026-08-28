// Campus Sentinel - Dedicated Student Dashboard (Clean, Brighter & Professional Dark Theme)
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
    <div className="relative min-h-[calc(100vh-60px)] w-full py-3.5 sm:py-4 px-3 sm:px-4 bg-gradient-to-b from-[#0B1220] via-[#0F172A] to-[#111827] text-slate-100 overflow-hidden box-border">
      {/* Subtle Ambient Radial Glow Layers */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-blue-600/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(30,58,138,0.15),rgba(15,23,42,0))] pointer-events-none -z-0" />

      {/* Main Student Portal Content */}
      <div className="relative z-10 max-w-4xl lg:max-w-[880px] mx-auto space-y-3.5 animate-fade-in">
        {/* 1. Page Header / Hero */}
        <div className="text-center space-y-1 pb-0.5">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-700/60 text-cyan-300 text-[10px] font-bold uppercase tracking-wider shadow-sm">
            <GraduationCap className="w-3 h-3" />
            <span>STUDENT PORTAL • VIGNAN UNIVERSITY</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm leading-tight">
            STUDENT CAMPUS ASSISTANCE
          </h1>
          <p className="text-[11px] sm:text-xs font-medium text-slate-300 max-w-lg mx-auto leading-normal">
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-200">
                Select Issue Category to Report
              </h2>
              <span className="text-[9.5px] font-mono font-semibold text-cyan-400">Automatic Department Routing</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {STUDENT_ISSUE_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.category}
                    className={`p-3 sm:p-3.5 rounded-2xl bg-[#131E36] hover:bg-[#16233F] border ${card.border} shadow-lg shadow-slate-950/30 transition-all flex flex-col justify-between space-y-2.5 group`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className={`w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#192744] text-slate-300 border border-[#2B3F68]">
                          ROUTES TO: {card.targetDept}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xs sm:text-[13px] font-black text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-snug mt-0.5 font-normal">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveReportingCategory(card.category)}
                      className={`w-full h-7.5 sm:h-8 rounded-xl bg-gradient-to-r ${card.color} hover:brightness-110 text-white font-bold text-[11px] flex items-center justify-center space-x-1.5 shadow transition-all active:scale-95 border border-white/20`}
                    >
                      <span>REPORT ISSUE</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. My Active Reports Overview Section */}
        {!activeReportingCategory && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#131E36] border border-[#22355A] shadow-xl shadow-slate-950/30 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#22355A]">
              <div className="flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  My Recent Reports & Status
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("MY_REPORTS")}
                className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 transition-colors"
              >
                <span>View All Reports</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {studentReports.length === 0 ? (
              <div className="py-3 text-center text-xs text-slate-400 font-medium">
                No recent reports. Select a category above to submit an issue.
              </div>
            ) : (
              <div className="space-y-2">
                {studentReports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReportForDetails(report)}
                    className="p-2.5 rounded-xl bg-[#192744] border border-[#273B60] hover:border-cyan-500/50 hover:bg-[#1E2E50] cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 group transition-all"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${getStatusBadge(report.status)}`}>
                          {report.status}
                        </span>
                        <span className="text-[10.5px] font-mono font-semibold text-cyan-400">{report.id}</span>
                      </div>
                      <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {report.title}
                      </p>
                      <p className="text-[9.5px] text-slate-300 font-mono">
                        Location: {report.location} • Routed: {report.routedDepartment}
                      </p>
                    </div>

                    <span className="text-[10.5px] font-bold text-cyan-400 group-hover:underline self-end sm:self-center">
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
    </div>
  );
};
