// Campus Sentinel AI - Natural Language Emergency Incident Reporter
import React, { useState } from "react";
import { useSentinel } from "../context/SentinelContext";
import { parseEmergencyNLPReport } from "../services/api";
import {
  Sparkles,
  Send,
  X,
  Bot,
  Flame,
  AlertTriangle,
  Users,
  MapPin,
  CheckCircle,
  RefreshCw
} from "lucide-react";

export const NaturalLanguageReporter = () => {
  const { nlpModalOpen, setNlpModalOpen, setActiveTab } = useSentinel();
  const [inputText, setInputText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);

  if (!nlpModalOpen) return null;

  const examplePrompts = [
    "Smoke is coming from the second floor of the CSE block and many students are nearby.",
    "Student collapsed in the gymnasium arena with severe chest pain and needs urgent EMT.",
    "Intruder breached the Gate 1 perimeter checkpoint without authorization carrying suspicious gear.",
    "Water main pipe burst in the Bio Labs basement causing rapid electrical and flooding hazard."
  ];

  const handleParse = async (autoDispatch = false) => {
    if (!inputText.trim()) return;
    setIsParsing(true);
    const res = await parseEmergencyNLPReport(inputText, autoDispatch);
    setIsParsing(false);
    if (res.success && res.analysis) {
      setParsedResult(res.analysis.extracted);
      if (autoDispatch) {
        setNlpModalOpen(false);
        setActiveTab("COMMAND_CENTER");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F1626] border border-[#1E2C48] rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#1E2C48] flex items-center justify-between bg-[#141D32]">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-red-600 to-rose-600 text-white shadow">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Natural Language Emergency Reporter
              </h3>
              <p className="text-[11px] text-slate-400">
                AI entity extraction for instantaneous multi-agent emergency dispatch
              </p>
            </div>
          </div>
          <button
            onClick={() => setNlpModalOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Describe the situation in plain words:
            </label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. Smoke is coming from the second floor of the Main Academic Block and many students are nearby..."
              className="w-full p-3 rounded-xl bg-[#080B13] border border-[#1E2C48] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-sans"
            />
          </div>

          {/* Quick Example Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400">Try demo prompt:</span>
            <div className="flex flex-wrap gap-1.5">
              {examplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setInputText(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-[#141D32] hover:bg-[#1E2C48] border border-[#1E2C48] text-[11px] text-slate-300 text-left truncate max-w-full"
                >
                  "{prompt.slice(0, 45)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Parsed Result Preview */}
          {parsedResult && (
            <div className="p-4 rounded-xl bg-[#080B13] border border-blue-500/40 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                <span className="font-bold text-cyan-400 flex items-center space-x-1.5">
                  <Bot className="w-4 h-4" />
                  <span>Extracted Emergency Vector:</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300">
                  Confidence: {parsedResult.confidence}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-[#141D32] border border-[#1E2C48]">
                  <span className="text-slate-400 block text-[10px]">Type:</span>
                  <span className="font-bold text-red-400">{parsedResult.type}</span>
                </div>
                <div className="p-2 rounded bg-[#141D32] border border-[#1E2C48]">
                  <span className="text-slate-400 block text-[10px]">Location:</span>
                  <span className="font-bold text-white truncate">{parsedResult.location}</span>
                </div>
                <div className="p-2 rounded bg-[#141D32] border border-[#1E2C48]">
                  <span className="text-slate-400 block text-[10px]">Severity:</span>
                  <span className="font-bold text-amber-400">{parsedResult.severity}</span>
                </div>
                <div className="p-2 rounded bg-[#141D32] border border-[#1E2C48]">
                  <span className="text-slate-400 block text-[10px]">Estimated Occupants:</span>
                  <span className="font-bold text-cyan-400 font-mono">{parsedResult.peopleAtRisk}</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#141D32] text-[11px] text-slate-300">
                <span className="font-bold text-slate-200 block mb-1">Recommended Response:</span>
                {parsedResult.recommendedActions && parsedResult.recommendedActions.map((act, i) => (
                  <p key={i}>{act}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#1E2C48] bg-[#141D32] flex items-center justify-between gap-3">
          <button
            onClick={() => handleParse(false)}
            disabled={isParsing || !inputText.trim()}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-600 flex items-center space-x-1.5"
          >
            {isParsing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5" />}
            <span>Analyze Vector</span>
          </button>

          <button
            onClick={() => handleParse(true)}
            disabled={isParsing || !inputText.trim()}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black flex items-center space-x-2 shadow-lg shadow-red-600/30"
          >
            <Send className="w-3.5 h-3.5" />
            <span>DISPATCH MULTI-AGENT RESPONSE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
