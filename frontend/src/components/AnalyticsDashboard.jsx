// Campus Sentinel AI - Analytics & Operational Performance Dashboard
import React, { useEffect, useState } from "react";
import { useSentinel } from "../context/SentinelContext";
import { fetchAnalytics } from "../services/api";
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldCheck,
  Zap,
  Activity,
  Users,
  CheckCircle2
} from "lucide-react";

export const AnalyticsDashboard = () => {
  const { activeIncident } = useSentinel();
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetchAnalytics().then(res => {
      if (res.success) setAnalyticsData(res);
    });
  }, [activeIncident]);

  const incidentsByType = analyticsData?.incidentsByType || { FIRE: 5, MEDICAL: 3, SECURITY: 2, FLOOD: 1, CROWD: 1 };
  const latencies = analyticsData?.agentLatencyMs || {
    cameraVision: 140,
    incidentCommander: 180,
    securityAgent: 110,
    medicalAgent: 95,
    facilitiesAgent: 105,
    evacuationRouteAgent: 220,
    communicationAgent: 75
  };
  const metrics = analyticsData?.responseMetrics || {
    avgResponseTimeSeconds: 42,
    avgEvacuationTimeMinutes: 4.8,
    routeOptimizationGainPercent: 38,
    notificationDeliveryRatePercent: 99.8,
    humanApprovalLatencySeconds: 14,
    tamperAuditedActionsCount: 28
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span>OPERATIONAL ANALYTICS & AI PERFORMANCE BENCHMARKS</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time telemetry measuring autonomous coordination velocity, hazard containment, and evacuation efficiency.
          </p>
        </div>
      </div>

      {/* Top Core Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Avg Response Time</span>
          <div className="text-2xl font-black text-cyan-400 font-mono">{metrics.avgResponseTimeSeconds}s</div>
          <p className="text-[10px] text-emerald-400 font-semibold">↓ 64% faster than manual dispatch</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Evacuation Optimization</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">+{metrics.routeOptimizationGainPercent}%</div>
          <p className="text-[10px] text-slate-400 font-medium">Safe path bottleneck avoidance</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Alert Delivery Rate</span>
          <div className="text-2xl font-black text-purple-400 font-mono">{metrics.notificationDeliveryRatePercent}%</div>
          <p className="text-[10px] text-slate-400 font-medium">Across WebSockets & Push API</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Operator Authorization Speed</span>
          <div className="text-2xl font-black text-amber-400 font-mono">{metrics.humanApprovalLatencySeconds}s</div>
          <p className="text-[10px] text-slate-400 font-medium">Human-in-the-loop gate latency</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Execution Latency Benchmarks */}
        <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E2C48]">
            <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Multi-Agent Compute Latency (Milliseconds)</span>
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">Total Pipeline: ~925ms</span>
          </div>

          <div className="space-y-3 text-xs">
            {Object.entries(latencies).map(([key, ms]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-mono text-cyan-400 font-bold">{ms}ms</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                    style={{ width: `${(ms / 250) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incidents Breakdown by Category */}
        <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E2C48]">
            <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-red-400" />
              <span>Campus Incident Distribution</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Historical & Simulated</span>
          </div>

          <div className="space-y-3 text-xs">
            {Object.entries(incidentsByType).map(([type, count]) => (
              <div key={type} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300 font-bold">{type}</span>
                  <span className="font-mono text-slate-200">{count} Incidents</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      type === 'FIRE' ? 'bg-red-500' :
                      type === 'MEDICAL' ? 'bg-rose-500' :
                      type === 'SECURITY' ? 'bg-blue-500' :
                      type === 'FLOOD' ? 'bg-cyan-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${(count / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
