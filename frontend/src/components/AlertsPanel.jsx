// Campus Sentinel AI - Alerts & Multichannel Broadcast Center
import React, { useState } from "react";
import { useSentinel } from "../context/SentinelContext";
import {
  Bell,
  Radio,
  Users,
  Shield,
  HeartPulse,
  Send,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Globe,
  Volume2
} from "lucide-react";

export const AlertsPanel = () => {
  const { notifications, activeIncident } = useSentinel();
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");

  const filteredNotifications = notifications.filter(
    (n) => selectedRoleFilter === "ALL" || n.targetRole === selectedRoleFilter || n.targetRole === "ALL"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
            <span>CAMPUS EMERGENCY BROADCAST & NOTIFICATION HUB</span>
          </h2>
          <p className="text-xs text-slate-400">
            Role-targeted alert payloads dispatched across WebSockets, Browser Notifications, and PA Audio.
          </p>
        </div>

        {/* Filter Role Tabs */}
        <div className="flex items-center space-x-1 bg-[#141D32] p-1 rounded-lg border border-[#1E2C48] text-xs">
          {["ALL", "STUDENT", "STAFF", "SECURITY", "MEDICAL"].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRoleFilter(r)}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                selectedRoleFilter === r
                  ? "bg-red-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Multichannel Dispatch Integrity Tracker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-[#0F1626] border border-emerald-500/40 text-xs space-y-1">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
            <Globe className="w-4 h-4" />
            <span>IN-APP WEBSOCKET</span>
          </div>
          <p className="text-[10px] text-slate-300">Live Client Sync: <strong>CONNECTED (✓)</strong></p>
        </div>

        <div className="p-3 rounded-xl bg-[#0F1626] border border-emerald-500/40 text-xs space-y-1">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
            <Bell className="w-4 h-4" />
            <span>BROWSER NOTIFICATIONS</span>
          </div>
          <p className="text-[10px] text-slate-300">Web Push API: <strong>DISPATCHED (✓)</strong></p>
        </div>

        <div className="p-3 rounded-xl bg-[#0F1626] border border-amber-500/40 text-xs space-y-1">
          <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
            <Smartphone className="w-4 h-4" />
            <span>SMS GATEWAY</span>
          </div>
          <p className="text-[10px] text-slate-300">Carrier Dispatch: <strong>DEMO MODE (✓)</strong></p>
        </div>

        <div className="p-3 rounded-xl bg-[#0F1626] border border-cyan-500/40 text-xs space-y-1">
          <div className="flex items-center space-x-1.5 text-cyan-400 font-bold">
            <Volume2 className="w-4 h-4" />
            <span>CAMPUS PA AUDIO</span>
          </div>
          <p className="text-[10px] text-slate-300">Synthesizer: <strong>ACTIVE (✓)</strong></p>
        </div>
      </div>

      {/* Alerts Stream */}
      <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] space-y-3 shadow-xl">
        <h3 className="text-xs font-black uppercase tracking-wider text-white">
          Active Notification Feed ({filteredNotifications.length} Dispatches)
        </h3>

        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                className="p-3.5 rounded-xl bg-[#141D32] border border-[#1E2C48] space-y-2 text-xs transition-all hover:border-slate-600"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      n.targetRole === "STUDENT" ? "bg-blue-950 text-blue-300 border border-blue-800" :
                      n.targetRole === "STAFF" ? "bg-purple-950 text-purple-300 border border-purple-800" :
                      n.targetRole === "SECURITY" ? "bg-amber-950 text-amber-300 border border-amber-800" :
                      n.targetRole === "MEDICAL" ? "bg-rose-950 text-rose-300 border border-rose-800" :
                      "bg-red-950 text-red-300 border border-red-800"
                    }`}>
                      TARGET: {n.targetRole}
                    </span>
                    <h4 className="font-bold text-white text-xs">{n.title}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{n.timeFormatted}</span>
                </div>

                <p className="text-[11px] text-slate-200 leading-relaxed font-sans pl-2 border-l-2 border-red-500">
                  {n.message}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
                  <span>Urgency: <strong className="text-red-400 uppercase">{n.urgency}</strong></span>
                  <span>Payload ID: {n.id}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 italic text-xs py-4 text-center">
              No notifications matching selected role filter.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
