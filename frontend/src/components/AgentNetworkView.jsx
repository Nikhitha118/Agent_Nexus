// Campus Sentinel AI - Multi-Agent Architecture Network Visualizer
import React from "react";
import { useSentinel } from "../context/SentinelContext";
import {
  Camera,
  Bot,
  Shield,
  HeartPulse,
  Flame,
  Navigation,
  Radio,
  CheckCircle2,
  Clock,
  ArrowDown,
  ArrowRight,
  Activity,
  Cpu
} from "lucide-react";

export const AgentNetworkView = () => {
  const { activeIncident, agentActivities } = useSentinel();

  const isEmergency = !!activeIncident;

  const agents = [
    {
      id: "camera",
      name: "Camera Vision Agent",
      role: "Perception & Anomaly Verification",
      icon: Camera,
      color: "from-cyan-500 to-blue-600",
      borderColor: "border-cyan-500/50",
      status: isEmergency ? "DETECTED & CONFIRMED" : "MONITORING (30 FPS)",
      isActive: true,
      latency: "140ms",
      reasoning: isEmergency
        ? `Temporal buffer verified consecutive frames >80% confidence at ${activeIncident.location}.`
        : "Continuously monitoring 8 campus CCTV optical streams for flame, dense smoke, and thermal anomalies."
    },
    {
      id: "commander",
      name: "Incident Commander Agent",
      role: "Strategic Synthesis & Resource Authority",
      icon: Bot,
      color: "from-purple-600 to-indigo-700",
      borderColor: "border-purple-500/50",
      status: isEmergency ? "SYNTHESIZING & ORCHESTRATING" : "STANDBY (ACTIVE LISTENER)",
      isActive: isEmergency,
      latency: "180ms",
      reasoning: isEmergency
        ? `Classified as ${activeIncident.severity}: Evaluating ${activeIncident.peopleAtRisk} occupants, wind corridors, and multi-agency response matrix.`
        : "Maintaining live Digital Twin state and evaluating ambient campus occupancy data."
    },
    {
      id: "security",
      name: "Security Agent",
      role: "Perimeter Containment & Crowd Safety",
      icon: Shield,
      color: "from-blue-600 to-sky-700",
      borderColor: "border-blue-500/50",
      status: isEmergency ? "TEAMS DISPATCHED" : "PATROL COORDINATION",
      isActive: isEmergency,
      latency: "110ms",
      reasoning: isEmergency
        ? "Assigned S-04 Delta Rapid Response to cordon Main Academic Block and prevent student access into hazard corridor."
        : "Tracking 8 security patrols across North, South, and Central sectors."
    },
    {
      id: "medical",
      name: "Medical Agent",
      role: "Triage Capacity & Ambulance Dispatch",
      icon: HeartPulse,
      color: "from-rose-600 to-red-700",
      borderColor: "border-rose-500/50",
      status: isEmergency ? "AMBULANCE EN ROUTE" : "TRIAGE READY",
      isActive: isEmergency,
      latency: "95ms",
      reasoning: isEmergency
        ? "Committed Ambulance A-02 and Trauma Team M-03 to Central Quad. Estimated triage demand: ~18 patients."
        : "Monitoring clinic beds, AED availability, and 4 ambulance units."
    },
    {
      id: "facilities",
      name: "Facilities / Fire Safety Agent",
      role: "Suppression Units & Utility Isolation",
      icon: Flame,
      color: "from-amber-600 to-orange-700",
      borderColor: "border-amber-500/50",
      status: isEmergency ? "SUPPRESSION ENGAGED" : "SYSTEMS NORMAL",
      isActive: isEmergency,
      latency: "105ms",
      reasoning: isEmergency
        ? "Mobilized FSU-03 Quick Fire Unit. Recommended remote gas main isolation (GV-01) and smoke damper activation."
        : "Checking pressure in 5 fire tenders and campus water hydrants."
    },
    {
      id: "route",
      name: "Evacuation / Route Agent",
      role: "Dynamic A* Safe Path & Responder Routing",
      icon: Navigation,
      color: "from-emerald-600 to-teal-700",
      borderColor: "border-emerald-500/50",
      status: isEmergency ? "SAFE ROUTE COMPUTED" : "GRAPH OPTIMAL",
      isActive: isEmergency,
      latency: "220ms",
      reasoning: isEmergency
        ? `A* algorithm selected Assembly Point B (${activeIncident.evacuationRoute ? activeIncident.evacuationRoute.totalDistanceMeters : 280}m) avoiding active thermal hazard perimeter.`
        : "Maintaining 32-node campus navigation graph with dynamic hazard and crowd weighting."
    },
    {
      id: "comms",
      name: "Communication Agent",
      role: "Multichannel Targeted Alerts & PA Broadcast",
      icon: Radio,
      color: "from-fuchsia-600 to-pink-700",
      borderColor: "border-fuchsia-500/50",
      status: isEmergency ? "ALERTS DISPATCHED" : "BROADCAST READY",
      isActive: isEmergency,
      latency: "75ms",
      reasoning: isEmergency
        ? "Dispatched tailored emergency alerts to Student, Staff, Security, and Medical personnel with distinct operational instructions."
        : "WebSockets, Browser Notifications, and PA Audio channels standing by."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            <span>AUTONOMOUS MULTI-AGENT ORCHESTRATION GRAPH</span>
          </h2>
          <p className="text-xs text-slate-400">
            6 Specialized AI agents interacting through typed message queues, heuristic filters, and spatial graph solvers.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#141D32] border border-[#1E2C48] text-slate-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Avg Pipeline Latency: <strong>~132ms</strong></span>
          </div>
        </div>
      </div>

      {/* Network Visual Architecture Layout */}
      <div className="p-6 rounded-xl bg-[#0B101D] border border-[#1E2C48] shadow-2xl relative overflow-hidden space-y-6">
        {/* Step 1: Perception */}
        <div className="flex justify-center">
          <AgentCard agent={agents[0]} />
        </div>

        <div className="flex justify-center">
          <ArrowDown className={`w-6 h-6 ${isEmergency ? 'text-purple-400 animate-bounce' : 'text-slate-600'}`} />
        </div>

        {/* Step 2: Strategic Commander */}
        <div className="flex justify-center">
          <AgentCard agent={agents[1]} isCommander={true} />
        </div>

        <div className="flex justify-center">
          <ArrowDown className={`w-6 h-6 ${isEmergency ? 'text-purple-400 animate-bounce' : 'text-slate-600'}`} />
        </div>

        {/* Step 3: Domain Specialist Triad (Security, Medical, Facilities) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AgentCard agent={agents[2]} />
          <AgentCard agent={agents[3]} />
          <AgentCard agent={agents[4]} />
        </div>

        <div className="flex justify-center">
          <ArrowDown className={`w-6 h-6 ${isEmergency ? 'text-emerald-400 animate-bounce' : 'text-slate-600'}`} />
        </div>

        {/* Step 4: Evacuation & Route Agent */}
        <div className="flex justify-center">
          <AgentCard agent={agents[5]} />
        </div>

        <div className="flex justify-center">
          <ArrowDown className={`w-6 h-6 ${isEmergency ? 'text-fuchsia-400 animate-bounce' : 'text-slate-600'}`} />
        </div>

        {/* Step 5: Communication Agent */}
        <div className="flex justify-center">
          <AgentCard agent={agents[6]} />
        </div>
      </div>

      {/* Real-time Agent Stream Log */}
      <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Live Multi-Agent Inter-Communication Stream</span>
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto font-mono text-xs">
          {agentActivities.length > 0 ? (
            agentActivities.map((act) => (
              <div
                key={act.id}
                className="p-2.5 rounded-lg bg-[#141D32] border border-[#1E2C48] flex items-start justify-between gap-3 text-slate-300"
              >
                <div>
                  <span className="text-cyan-400 font-bold">{act.agentName || "Agent"}:</span>{" "}
                  <span className="text-slate-200">{act.message}</span>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{act.timeFormatted}</span>
              </div>
            ))
          ) : (
            <p className="text-slate-500 italic">No recent agent transactions.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const AgentCard = ({ agent, isCommander = false }) => {
  const Icon = agent.icon;
  return (
    <div
      className={`w-full max-w-md p-4 rounded-xl bg-[#0F1626] border transition-all shadow-xl ${
        agent.isActive
          ? `${agent.borderColor} shadow-lg shadow-purple-500/10`
          : "border-slate-800 opacity-80"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2.5">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center text-white shadow`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white tracking-wide">{agent.name}</h4>
            <p className="text-[10px] text-slate-400">{agent.role}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-700">
            {agent.latency}
          </span>
        </div>
      </div>

      <div className="p-2 rounded-lg bg-[#141D32] border border-[#1E2C48] text-[11px] text-slate-300 space-y-1">
        <div className="flex items-center justify-between text-[10px] font-mono font-bold">
          <span className="text-slate-400">STATE:</span>
          <span className={agent.isActive ? "text-emerald-400" : "text-slate-500"}>
            {agent.status}
          </span>
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed italic">"{agent.reasoning}"</p>
      </div>
    </div>
  );
};
