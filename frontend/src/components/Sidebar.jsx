// Campus Sentinel AI - Operations Command Sidebar
import React from "react";
import { useSentinel } from "../context/SentinelContext";
import {
  LayoutDashboard,
  Camera,
  MapPin,
  Bot,
  FileCheck,
  Shield,
  Bell,
  BarChart3,
  ScrollText,
  Settings,
  Flame,
  Zap,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export const Sidebar = () => {
  const {
    activeTab,
    setActiveTab,
    activeIncident,
    unreadNotificationsCount,
    pendingApprovals,
    isFastDemo,
    setIsFastDemo,
    currentRole
  } = useSentinel();

  const navItems = [
    { id: "COMMAND_CENTER", label: "Live Command Center", icon: LayoutDashboard, badge: activeIncident ? "LIVE" : null, badgeColor: "bg-red-500 text-white animate-pulse" },
    { id: "LIVE_CAMERAS", label: "Live Camera Studio", icon: Camera, badge: "Webcam", badgeColor: "bg-cyan-950 text-cyan-400 border border-cyan-700/50" },
    { id: "MAP", label: "Campus Digital Twin", icon: MapPin, badge: "Vector", badgeColor: "bg-slate-800 text-slate-400" },
    { id: "AGENTS", label: "AI Agent Network", icon: Bot, badge: "6 Agents", badgeColor: "bg-purple-950 text-purple-400 border border-purple-800/50" },
    { id: "INCIDENT_DETAILS", label: "Incident Details", icon: FileCheck, badge: activeIncident ? "Active" : null, badgeColor: "bg-amber-950 text-amber-400" },
    { id: "RESOURCES", label: "Resource Coordination", icon: Shield },
    { id: "ALERTS", label: "Alerts & Broadcasts", icon: Bell, badge: unreadNotificationsCount > 0 ? `${unreadNotificationsCount}` : null, badgeColor: "bg-red-500 text-white" },
    { id: "ANALYTICS", label: "Analytics & Metrics", icon: BarChart3 },
    { id: "AUDIT_LOGS", label: "Audit Ledger", icon: ScrollText },
    { id: "SETTINGS", label: "Settings & System", icon: Settings }
  ];

  return (
    <aside className="w-64 bg-[#0B101D] border-r border-[#1E2C48] flex flex-col justify-between shrink-0 select-none h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-3 space-y-4">
        {/* Active Emergency Status Card */}
        {activeIncident ? (
          <div
            onClick={() => setActiveTab("COMMAND_CENTER")}
            className="cursor-pointer p-3 rounded-xl bg-gradient-to-br from-red-950/90 via-red-900/40 to-slate-900 border border-red-500/60 shadow-lg shadow-red-900/20 hover:border-red-400 transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-red-400">
                <Flame className="w-4 h-4 text-red-500 animate-bounce" />
                <span>ACTIVE EMERGENCY</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-600 font-bold text-white uppercase tracking-wider">
                {activeIncident.severity}
              </span>
            </div>
            <p className="text-sm font-bold text-white truncate">{activeIncident.type}: {activeIncident.location}</p>
            <p className="text-[11px] text-slate-300 mt-1 line-clamp-1">{activeIncident.summary}</p>
            {pendingApprovals.length > 0 && (
              <div className="mt-2 pt-2 border-t border-red-800/40 flex items-center justify-between text-[11px] text-amber-300 font-semibold">
                <span className="flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>{pendingApprovals.length} Action Pending Approval</span>
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-[#0F1626] border border-[#1E2C48] flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
            <div>
              <p className="text-xs font-bold text-emerald-400">Campus Status: SECURE</p>
              <p className="text-[10px] text-slate-400">All 8 camera feeds monitoring</p>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Navigation</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold"
                    : "text-slate-400 hover:text-slate-100 hover:bg-[#141D32]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${item.badgeColor || 'bg-slate-800 text-slate-400'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Controls: Fast Demo Toggle & Safety Disclaimer */}
      <div className="p-3 border-t border-[#1E2C48] bg-[#090D16] space-y-3">
        {/* Fast Demo Mode Switch */}
        <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-[#141D32] border border-[#1E2C48]">
          <div className="flex items-center space-x-1.5">
            <Zap className={`w-3.5 h-3.5 ${isFastDemo ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-[11px] font-bold text-slate-300">Fast Demo Mode</span>
          </div>
          <button
            onClick={() => setIsFastDemo(!isFastDemo)}
            className={`w-8 h-4 rounded-full p-0.5 transition-all ${isFastDemo ? 'bg-amber-500' : 'bg-slate-700'}`}
          >
            <div className={`w-3 h-3 rounded-full bg-white transition-all transform ${isFastDemo ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Safety Protocol Disclaimer */}
        <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400 leading-tight">
          <span className="font-semibold text-slate-300 block mb-0.5">⚠️ Prototype Safety Protocol</span>
          AI provides automated decision support. Emergency interventions remain subject to authorized human operator verification.
        </div>
      </div>
    </aside>
  );
};
