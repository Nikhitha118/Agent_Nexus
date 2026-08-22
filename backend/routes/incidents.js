// Campus Sentinel - Incidents Router & Emergency Quick Alert System
import express from "express";
import { campusDataService } from "../services/CampusDataService.js";
import { agentOrchestrator } from "../agents/AgentOrchestrator.js";
import { simulationService } from "../services/SimulationService.js";
import { evacuationRouteAgent } from "../agents/EvacuationRouteAgent.js";
import { communicationAgent } from "../agents/CommunicationAgent.js";
import { securityAgent } from "../agents/SecurityAgent.js";
import { medicalAgent } from "../agents/MedicalAgent.js";
import { facilitiesAgent } from "../agents/FacilitiesAgent.js";

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

// POST Emergency Quick Alert (From Landing Page or authenticated app)
router.post("/quick-alert", async (req, res) => {
  try {
    const {
      incidentType = "OTHER",
      location = "Campus Central Quad",
      buildingId = "B-01",
      description = "",
      attachments = {},
      aiAssessment = {},
      reportedBy = { name: "Anonymous Reporter", role: "STUDENT" },
      gpsCoords = null
    } = req.body;

    const severity = aiAssessment.severity || "HIGH";
    const confidence = aiAssessment.confidence || 88;
    const isGeneralBroadcast = ["FIRE", "MEDICAL", "WEATHER"].includes(incidentType.toUpperCase());

    // 1. Create the new emergency incident
    const incident = campusDataService.createIncident({
      type: incidentType.toUpperCase(),
      title: `${incidentType.toUpperCase()} EMERGENCY - ${location}`,
      location,
      buildingId,
      locationCoords: gpsCoords || { lat: 37.7772, lng: -122.4182 },
      hazardRadius: incidentType.toUpperCase() === "FIRE" ? 85 : 45,
      severity,
      confidence,
      detectedBy: `Emergency AI Quick Report (${reportedBy.name || "Campus Member"})`,
      peopleAtRisk: aiAssessment.peopleAtRisk || 120,
      description,
      attachments,
      aiAssessment,
      isGeneralBroadcast,
      status: "ACTIVE"
    });

    // 2. Calculate Evacuation & Responder Routes
    const routeResult = evacuationRouteAgent.calculateRoutes(incident);
    const safeZoneName = routeResult.recommendedAssemblyPoint ? routeResult.recommendedAssemblyPoint.name : "Assembly Point B (Central Quad)";

    // 3. Dispatch appropriate units based on recommendations
    const securityResult = securityAgent.evaluateAndDispatch(incident);
    const medicalResult = medicalAgent.evaluateAndDispatch(incident);
    const facilitiesResult = facilitiesAgent.evaluateAndDeploy(incident);

    // 4. Update incident with computed route and assignments
    const updatedIncident = campusDataService.updateIncident(incident.id, {
      summary: `${incidentType.toUpperCase()} reported at ${location}. Safe evacuation zone: ${safeZoneName}. Responders mobilized.`,
      evacuationRoute: routeResult.primaryEvacuationRoute,
      recommendedAssemblyPoint: routeResult.recommendedAssemblyPoint,
      responderRoutes: routeResult.responderRoutes,
      assignedResources: {
        security: securityResult.assignedUnits,
        ambulance: medicalResult.assignedAmbulance,
        medical: medicalResult.assignedMedTeam,
        fireSafety: facilitiesResult.assignedFSU
      }
    });

    // 5. Role-Based Notification Generation & Dispatch
    const generatedAlerts = [];

    if (isGeneralBroadcast) {
      // Broadcast to ALL users (Student, Staff, Security, Medical, Transport, Admin)
      const comms = communicationAgent.broadcastEmergencyAlerts(updatedIncident, routeResult);
      generatedAlerts.push(...(comms.alerts || []));
    } else {
      // Restricted broadcast ONLY to Admin, Security, Medical
      const secAlert = campusDataService.addNotification({
        targetRole: "SECURITY",
        title: `🛡️ SECURITY TACTICAL DISPATCH: ${incidentType.toUpperCase()}`,
        message: `${incidentType.toUpperCase()} incident reported at ${location}. Severity: ${severity}. Units dispatched to contain perimeter.`,
        urgency: "CRITICAL",
        incidentId: incident.id,
        channels: { inApp: true, tacticalRadio: true }
      });
      const medAlert = campusDataService.addNotification({
        targetRole: "MEDICAL",
        title: `🚑 MEDICAL ALERT: ${incidentType.toUpperCase()} at ${location}`,
        message: `Standby for potential trauma triage at ${location}. Ambulance unit alerted.`,
        urgency: "HIGH",
        incidentId: incident.id,
        channels: { inApp: true, pager: true }
      });
      const adminAlert = campusDataService.addNotification({
        targetRole: "ADMIN",
        title: `🏛️ COMMAND ALERT: ${incidentType.toUpperCase()} Incident`,
        message: `Confidential operational alert at ${location}. Responders assigned.`,
        urgency: "HIGH",
        incidentId: incident.id,
        channels: { inApp: true }
      });
      generatedAlerts.push(secAlert, medAlert, adminAlert);
    }

    // 6. Broadcast live events via Socket.IO
    agentOrchestrator.broadcast("incident_created", updatedIncident);
    agentOrchestrator.broadcast("incident_updated", updatedIncident);
    agentOrchestrator.broadcast("resources_updated", campusDataService.resources);
    agentOrchestrator.broadcast("new_notification", generatedAlerts);
    agentOrchestrator.broadcast("system_stats_update", campusDataService.getSystemStats());

    res.json({
      success: true,
      message: "Emergency alert submitted successfully",
      incident: updatedIncident,
      alerts: generatedAlerts
    });
  } catch (err) {
    console.error("[Quick Alert Error]", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create incident manually or via orchestrator
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
