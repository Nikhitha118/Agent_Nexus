// Campus Sentinel AI - Resources Router
import express from "express";
import { campusDataService } from "../services/CampusDataService.js";
import { agentOrchestrator } from "../agents/AgentOrchestrator.js";

const router = express.Router();

// GET all resources
router.get("/", (req, res) => {
  res.json({
    success: true,
    resources: campusDataService.resources
  });
});

// PATCH resource status (e.g. manually set S-01 to ON_SCENE)
router.patch("/:category/:id/status", (req, res) => {
  const { category, id } = req.params;
  const { status, updates } = req.body;

  const updated = campusDataService.updateResourceStatus(category, id, status, updates || {});
  if (!updated) {
    return res.status(404).json({ success: false, error: "Resource not found or invalid category" });
  }

  agentOrchestrator.broadcast("resources_updated", campusDataService.resources);
  agentOrchestrator.broadcast("system_stats_update", campusDataService.getSystemStats());

  res.json({ success: true, resource: updated });
});

export default router;
