// Campus Sentinel AI - Academic Engineering Specs & Architecture Modal (B.Tech Capstone / Hackathon)
import React from "react";
import {
  BookOpen,
  Cpu,
  GitBranch,
  Layers,
  Network,
  ShieldCheck,
  Zap,
  X,
  Code2,
  Database,
  GraduationCap
} from "lucide-react";

export const EngineeringSpecsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0B101D] border border-cyan-500/40 rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl shadow-cyan-950/50 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#1E2C48]">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
              <GraduationCap className="w-4 h-4" />
              <span>B.TECH CSE CAPSTONE & HACKATHON PROJECT • VIGNAN UNIVERSITY</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              System Architecture & Methodology
            </h2>
            <p className="text-xs text-slate-400">
              Autonomous Multi-Agent Decision Support & Dynamic Graph Navigation Digital Twin
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Abstract & Problem Statement */}
        <div className="space-y-2 bg-[#0F1626] p-4 rounded-2xl border border-[#1E2C48]">
          <h3 className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center space-x-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Project Abstract</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Campus Sentinel AI implements a distributed, event-driven Multi-Agent System (MAS) coupled with a campus digital twin. The system processes optical sensor feeds, eliminates false positives via temporal frame buffers, computes safety-weighted shortest evacuation paths avoiding hazard envelopes ($85\text{m}$ radius), dispatches nearest first responders, and performs real-time dynamic re-planning upon encountering topological obstacles.
          </p>
        </div>

        {/* 2. Mathematical Formulation of Safe Routing Algorithm */}
        <div className="space-y-2 bg-[#0F1626] p-4 rounded-2xl border border-[#1E2C48]">
          <h3 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center space-x-1.5">
            <Code2 className="w-3.5 h-3.5" />
            <span>Mathematical Routing Formulation (Dynamic Safety-Weighted A*)</span>
          </h3>
          <p className="text-xs text-slate-300">
            For edge $e = (u, v)$ in the campus navigation graph $G=(V, E)$, the effective traversal cost function $C(e)$ is formulated as:
          </p>
          <div className="p-3 rounded-xl bg-black/60 font-mono text-[11px] text-cyan-300 border border-slate-800 space-y-1">
            <p>Cost(e) = Distance(e) + α · HazardPenalty(e) + β · CongestionFactor(e) + γ · ObstaclePenalty(e)</p>
            <p className="text-slate-400 text-[10px]">Where: α = 12000 (Hazard proximity weight), β = 1.8 (Crowd density), γ = 1,000,000 (Blocked edge penalty)</p>
          </div>
        </div>

        {/* 3. Multi-Agent Finite State Pipeline */}
        <div className="space-y-3 bg-[#0F1626] p-4 rounded-2xl border border-[#1E2C48]">
          <h3 className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>5-Stage Autonomous Agent Hierarchy</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-[#141D32] border border-cyan-500/30">
              <span className="font-bold text-cyan-400 block text-[11px]">1. DETECT</span>
              <span className="text-[10px] text-slate-400">Temporal Buffer &gt;80%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#141D32] border border-purple-500/30">
              <span className="font-bold text-purple-400 block text-[11px]">2. DECIDE</span>
              <span className="text-[10px] text-slate-400">Severity Assessment</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#141D32] border border-blue-500/30">
              <span className="font-bold text-blue-400 block text-[11px]">3. RESPOND</span>
              <span className="text-[10px] text-slate-400">Euclidean Dispatch</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#141D32] border border-emerald-500/30">
              <span className="font-bold text-emerald-400 block text-[11px]">4. GUIDE</span>
              <span className="text-[10px] text-slate-400">A* Path & Dynamic Re-plan</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#141D32] border border-rose-500/30">
              <span className="font-bold text-rose-400 block text-[11px]">5. ALERT</span>
              <span className="text-[10px] text-slate-400">Role Multicast & Web Audio</span>
            </div>
          </div>
        </div>

        {/* 4. Technology Stack & Verification */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-[#0F1626] border border-[#1E2C48] space-y-1">
            <span className="font-bold text-white block">Full-Stack Tech Stack:</span>
            <p className="text-slate-400 font-mono text-[11px]">
              • Frontend: React 18, Vite, Tailwind CSS, Leaflet Map, Web Audio API<br />
              • Backend: Node.js, Express, Socket.IO WebSockets<br />
              • Graph Engine: Dijkstra & A* Pathfinding Solver
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#0F1626] border border-[#1E2C48] space-y-1">
            <span className="font-bold text-white block">Academic Credentials:</span>
            <p className="text-slate-400 text-[11px]">
              Department of Computer Science & Engineering<br />
              Vignan's Foundation for Science, Technology & Research<br />
              <span className="text-emerald-400 font-bold">Project Status: Verified & Hackathon Production Ready</span>
            </p>
          </div>
        </div>

        {/* Footer close */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[10px] font-mono text-slate-500">
            Build Hash: SHA-256 (Campus-Sentinel-MAS-2026)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow"
          >
            Close Engineering View
          </button>
        </div>
      </div>
    </div>
  );
};
