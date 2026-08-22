// Campus Sentinel AI - Analytics Router
import express from "express";
import { campusDataService } from "../services/CampusDataService.js";

const router = express.Router();

router.get("/", (req, res) => {
  const incidents = campusDataService.incidents;
  const activeInc = campusDataService.activeIncident;

  const incidentsByType = {
    FIRE: incidents.filter(i => i.type === "FIRE").length + 4, // Including simulated baseline history
    MEDICAL: incidents.filter(i => i.type === "MEDICAL").length + 3,
    SECURITY: incidents.filter(i => i.type === "SECURITY").length + 2,
    FLOOD: incidents.filter(i => i.type === "FLOOD").length + 1,
    CROWD: incidents.filter(i => i.type === "CROWD_EMERGENCY").length + 1
  };

  const agentLatencyMs = {
    cameraVision: 140,
    incidentCommander: 180,
    securityAgent: 110,
    medicalAgent: 95,
    facilitiesAgent: 105,
    evacuationRouteAgent: 220,
    communicationAgent: 75
  };

  const responseMetrics = {
    avgResponseTimeSeconds: 42,
    avgEvacuationTimeMinutes: 4.8,
    routeOptimizationGainPercent: 38,
    notificationDeliveryRatePercent: 99.8,
    humanApprovalLatencySeconds: 14,
    tamperAuditedActionsCount: campusDataService.auditLogs.length
  };

  const resourceUtilization = {
    securityPatrolsActive: campusDataService.resources.security.filter(s => s.status !== "AVAILABLE").length,
    securityPatrolsTotal: campusDataService.resources.security.length,
    ambulancesActive: campusDataService.resources.ambulances.filter(a => a.status !== "AVAILABLE").length,
    ambulancesTotal: campusDataService.resources.ambulances.length,
    fireUnitsActive: campusDataService.resources.fireSafety.filter(f => f.status !== "AVAILABLE").length,
    fireUnitsTotal: campusDataService.resources.fireSafety.length
  };

  res.json({
    success: true,
    incidentsByType,
    agentLatencyMs,
    responseMetrics,
    resourceUtilization,
    currentPeopleAtRisk: activeInc ? (activeInc.peopleAtRisk || 620) : 0,
    estimatedEvacuationCompletionTime: activeInc ? "3 min 20 sec" : "N/A"
  });
});

export default router;
