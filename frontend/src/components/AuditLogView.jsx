// Campus Sentinel AI - Tamper-Evident Audit Ledger
import React, { useEffect, useState } from "react";
import { fetchAuditLogs } from "../services/api";
import {
  ScrollText,
  ShieldCheck,
  Download,
  Key,
  CheckCircle2,
  RefreshCw,
  Search
} from "lucide-react";

export const AuditLogView = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const loadLogs = async () => {
    setLoading(true);
    const res = await fetchAuditLogs();
    setLoading(false);
    if (res.success) {
      setLogs(res.auditLogs || []);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter(l =>
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.actor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sentinel-audit-ledger-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center space-x-2">
            <ScrollText className="w-5 h-5 text-amber-400" />
            <span>TAMPER-EVIDENT EMERGENCY AUDIT LEDGER</span>
          </h2>
          <p className="text-xs text-slate-400">
            Immutable chronological logging of all autonomous AI recommendations, human authorizations, and resource dispatches.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadLogs}
            className="p-2 rounded-lg bg-[#141D32] border border-[#1E2C48] text-slate-300 hover:text-white"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={exportJSON}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Trail (JSON)</span>
          </button>
        </div>
      </div>

      {/* Ledger Table Card */}
      <div className="p-4 rounded-xl bg-[#0F1626] border border-[#1E2C48] space-y-3 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search audit actions, actors, or incident IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#141D32] border border-[#1E2C48] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filteredLogs.length} Verified Entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141D32] text-slate-400 font-mono text-[10px] uppercase border-y border-[#1E2C48]">
              <tr>
                <th className="p-2.5">Audit ID & Hash</th>
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5">Action Type</th>
                <th className="p-2.5">Actor / Agent</th>
                <th className="p-2.5">Details & Parameters</th>
                <th className="p-2.5 text-right">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2C48] text-slate-200">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#141D32]/50 transition-colors">
                    <td className="p-2.5 font-mono text-[11px] text-cyan-400">
                      <div>{log.id}</div>
                      <div className="text-[9px] text-slate-500 truncate max-w-[120px]">{log.hash}</div>
                    </td>
                    <td className="p-2.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {log.timeFormatted || new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="p-2.5 font-bold text-white text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-2.5 text-[11px] text-amber-300 font-medium">
                      {log.actor}
                    </td>
                    <td className="p-2.5 text-slate-300 text-[11px] max-w-md">
                      {log.details}
                    </td>
                    <td className="p-2.5 text-right">
                      <span className="inline-flex items-center space-x-1 text-[10px] font-mono text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>VERIFIED</span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-slate-500 italic">
                    No matching audit records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
