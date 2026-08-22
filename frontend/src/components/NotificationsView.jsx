// Campus Sentinel - Targeted Department & User Notifications Center
import React from "react";
import { useSentinel } from "../context/SentinelContext";
import { ReportDetailsModal } from "./ReportDetailsModal";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building,
  FileText,
  Eye,
  Flame,
  Shield,
  Sparkles
} from "lucide-react";

export const NotificationsView = () => {
  const {
    currentUser,
    currentRole,
    notifications,
    reports,
    selectedReportForDetails,
    setSelectedReportForDetails
  } = useSentinel();

  // Filter notifications for this user or their department
  const userNotifications = notifications.filter(n => {
    if (!currentUser) return true;
    if (n.targetUserId && n.targetUserId === currentUser.id) return true;
    if (n.targetRole && n.targetRole === currentRole) return true;
    if (currentRole === "ADMIN") return true;
    return false;
  });

  const handleNotificationClick = (notif) => {
    if (notif.reportId || notif.linkId) {
      const targetId = notif.reportId || notif.linkId;
      const found = reports.find(r => r.id === targetId);
      if (found) {
        setSelectedReportForDetails(found);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-[#1E2C48]">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <Bell className="w-6 h-6 text-cyan-400" />
            <span>NOTIFICATIONS & OPERATIONAL ALERTS</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time departmental dispatches, issue status updates, and emergency broadcasts.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-blue-950 text-cyan-400 border border-blue-700 text-xs font-mono font-bold">
          {userNotifications.length} ALERTS
        </span>
      </div>

      {userNotifications.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#0F1626] border border-[#1E2C48] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#141D32] text-slate-500 flex items-center justify-center mx-auto">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No New Notifications</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You are all caught up. New reports and status updates will be displayed here in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {userNotifications.map((notif, idx) => (
            <div
              key={notif.id || idx}
              onClick={() => handleNotificationClick(notif)}
              className="p-4 sm:p-5 rounded-2xl bg-[#0F1626] border border-[#1E2C48] hover:border-cyan-500/40 shadow-lg hover:shadow-cyan-500/10 transition-all cursor-pointer flex items-start justify-between gap-4 group"
            >
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-700 text-cyan-400 shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors">
                      {notif.title || "Department Alert"}
                    </span>
                    {notif.severity && (
                      <span className="text-[9px] font-mono font-bold px-2 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {notif.severity}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {notif.message || notif.text}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{notif.timeFormatted || new Date(notif.timestamp || Date.now()).toLocaleTimeString()}</span>
                  </p>
                </div>
              </div>

              {(notif.reportId || notif.linkId) && (
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl bg-[#141D32] hover:bg-slate-800 text-cyan-400 text-xs font-bold shrink-0 self-center border border-[#1E2C48] flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>VIEW</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Report Details Modal */}
      {selectedReportForDetails && (
        <ReportDetailsModal
          report={selectedReportForDetails}
          onClose={() => setSelectedReportForDetails(null)}
        />
      )}
    </div>
  );
};
