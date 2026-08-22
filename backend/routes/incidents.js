// Campus Sentinel AI - Incidents Router
import express from "express";
import { campusDataService } from "../services/CampusDataService.js";
import { agentOrchestrator } from "../agents/AgentOrchestrator.js";
import { simulationService } from "../services/SimulationService.js";

const router = express.Router();

// GET all incidents
router.get("/", (req, res) => {
  res.json({
    success: true,
    activeIncident: campusDataService.getActiveIncident(),
    incidents: campusDataService.incidents
  });
});

// GET active incident
router.get("/active", (req, res) => {
  const active = campusDataService.getActiveIncident();
  res.json({
    success: true,
    activeIncident: active
  });
});

// GET specific incident
router.get("/:id", (req, res) => {
  const incident = campusDataService.incidents.find(i => i.id === req.params.id);
  if (!incident) {
    return res.status(404).json({ success: false, error: "Incident not found" });
  }
  res.json({ success: true, incident });
});

// POST create incident manually or via NLP
router.post("/", async (req, res) => {
  try {
    const result = await agentOrchestrator.executeEmergencyWorkflow(req.body, { fastDemo: req.body.fastDemo });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST simulate scenario
router.post("/simulate", async (req, res) => {
  const { scenario, fastDemo } = req.body;
  const result = await simulationService.runScenario(scenario || "FIRE", { fastDemo });
  res.json(result);
});

// POST block route (Dynamic Replanning)
router.post("/block-route", (req, res) => {
  const { edgeId, incidentId } = req.body;
  const targetEdge = edgeId || "E-07";
  const result = agentOrchestrator.handleRoadBlockage(targetEdge, incidentId);
  res.json(result);
});

// POST resolve active incident
router.post("/resolve", (req, res) => {
  const { incidentId, notes } = req.body;
  const targetId = incidentId || (campusDataService.activeIncident ? campusDataService.activeIncident.id : null);
  if (!targetId) {
    return res.status(400).json({ success: false, error: "No active incident to resolve" });
  }

  const resolved = campusDataService.resolveIncident(targetId, notes);
  agentOrchestrator.broadcast("incident_resolved", resolved);
  agentOrchestrator.broadcast("system_stats_update", campusDataService.getSystemStats());
  agentOrchestrator.broadcast("resources_updated", campusDataService.resources);

  res.json({ success: true, incident: resolved });
});

// POST reset everything to normal
router.post("/reset", (req, res) => {
  const result = agentOrchestrator.resetAll();
  res.json(result);
});

export default router;
