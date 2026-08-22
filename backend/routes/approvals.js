// Campus Sentinel AI - Human Approvals Router
import express from "express";
import { campusDataService } from "../services/CampusDataService.js";
import { agentOrchestrator } from "../agents/AgentOrchestrator.js";

const router = express.Router();

// GET all approvals
router.get("/", (req, res) => {
  res.json({
    success: true,
    approvals: campusDataService.pendingApprovals
  });
});

// POST decision (APPROVE, REJECT, MODIFY)
router.post("/:id/decision", (req, res) => {
  const { id } = req.params;
  const { decision, operatorName, notes } = req.body;

  if (!["APPROVED", "REJECTED", "MODIFIED"].includes(decision)) {
    return res.status(400).json({ success: false, error: "Invalid decision value" });
  }

  const updated = campusDataService.handleApprovalDecision(id, decision, operatorName || "Commander Mitchell (Chief Operator)", notes);
  if (!updated) {
    return res.status(404).json({ success: false, error: "Approval request not found" });
  }

  agentOrchestrator.broadcast("approvals_updated", campusDataService.pendingApprovals);
  agentOrchestrator.broadcast("audit_log_updated", campusDataService.auditLogs.slice(0, 10));

  res.json({ success: true, approval: updated });
});

export default router;
