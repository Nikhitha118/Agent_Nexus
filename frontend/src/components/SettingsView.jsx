// Campus Sentinel AI - Settings & System Status View
import React, { useState } from "react";
import { useSentinel } from "../context/SentinelContext";
import {
  Settings,
  ShieldCheck,
  Cpu,
  Key,
  Server,
  Globe,
  RefreshCw,
  Zap,
  Info
} from "lucide-react";

export const SettingsView = () => {
  const { resetSystem, isFastDemo, setIsFastDemo } = useSentinel();
  const [aiProvider, setAiProvider] = useState("LOCAL_SENTINEL_INFERENCE");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <Settings className="w-5 h-5 text-slate-400" />
            <span>CAMPUS SENTINEL SYSTEM SETTINGS & TELEMETRY</span>
          </h2>
          <p className="text-xs text-slate-400">
            System configuration, pluggable AI providers, and environment telemetry.
          </p>
        </div>
      </div>

      {/* System Gateway Status */}
      <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center space-x-2">
          <Server className="w-4 h-4" />
          <span>Core Infrastructure Telemetry</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#141D32] border border-[#1E2C48] space-y-1">
            <span className="text-slate-400 block text-[10px]">Backend Server Gateway:</span>
            <p className="font-mono font-bold text-emerald-400">http://localhost:5000 (ONLINE)</p>
          </div>
          <div className="p-3 rounded-lg bg-[#141D32] border border-[#1E2C48] space-y-1">
            <span className="text-slate-400 block text-[10px]">Real-Time WebSockets:</span>
            <p className="font-mono font-bold text-emerald-400">Socket.IO v4.8 (CONNECTED)</p>
          </div>
          <div className="p-3 rounded-lg bg-[#141D32] border border-[#1E2C48] space-y-1">
            <span className="text-slate-400 block text-[10px]">Graph Solver Engine:</span>
            <p className="font-mono font-bold text-cyan-400">Dijkstra / A* Dynamic Weighted</p>
          </div>
          <div className="p-3 rounded-lg bg-[#141D32] border border-[#1E2C48] space-y-1">
            <span className="text-slate-400 block text-[10px]">Map Tile Service:</span>
            <p className="font-mono font-bold text-cyan-400">Carto Dark / OpenStreetMap</p>
          </div>
        </div>
      </div>

      {/* Pluggable Vision & NLP Configuration */}
      <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl space-y-4 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#1E2C48]">
          <h3 className="font-black uppercase tracking-wider text-purple-400 flex items-center space-x-2">
            <Cpu className="w-4 h-4" />
            <span>AI Model & Vision Inference Provider</span>
          </h3>
          <span className="text-[10px] font-mono text-emerald-400">Modular Abstraction</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Active AI Provider:</label>
            <select
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#141D32] border border-[#1E2C48] text-white focus:outline-none focus:border-blue-500"
            >
              <option value="LOCAL_SENTINEL_INFERENCE">Local Sentinel EdgeNet (Built-in Zero-Latency Offline)</option>
              <option value="YOLO_VISION_BRIDGE">Modular YOLO Vision Pipeline (Bridge)</option>
              <option value="OPENAI_VISION">OpenAI GPT-4o Vision API</option>
              <option value="GEMINI_VISION">Google Gemini 2.5 Pro Vision API</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Optional External API Key:</label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Leave blank to use built-in local inference engine (.env protected)..."
              className="w-full p-2.5 rounded-lg bg-[#141D32] border border-[#1E2C48] text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Never expose secret keys on frontend. Keys are securely stored in backend <code className="text-cyan-400">.env</code>.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow"
            >
              Save Configuration
            </button>
            {savedSuccess && (
              <span className="text-emerald-400 font-bold text-xs flex items-center space-x-1">
                <span>✓ Configuration updated</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Demo Reset */}
      <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-white">Reset Digital Twin State</h4>
          <p className="text-[11px] text-slate-400">Clears active hazards, resets resource assignments to peacetime baseline.</p>
        </div>
        <button
          onClick={resetSystem}
          className="px-4 py-2 rounded-lg bg-[#141D32] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#1E2C48] text-xs font-bold flex items-center space-x-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset All State</span>
        </button>
      </div>
    </div>
  );
};
