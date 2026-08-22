// Campus Sentinel AI - 5-Stage Agent Orchestrator
// See. Understand. Decide. Alert. Guide.

import { cameraVisionAgent } from "./CameraVisionAgent.js";
import { incidentCommanderAgent } from "./IncidentCommanderAgent.js";
import { securityAgent } from "./SecurityAgent.js";
import { medicalAgent } from "./MedicalAgent.js";
import { facilitiesAgent } from "./FacilitiesAgent.js";
import { evacuationRouteAgent } from "./EvacuationRouteAgent.js";
import { communicationAgent } from "./CommunicationAgent.js";
import { campusDataService } from "../services/CampusDataService.js";

export class AgentOrchestrator {
  constructor() {
    this.io = null;
    this.isProcessing = false;
  }

  setSocketServer(io) {
    this.io = io;
  }

  broadcast(event, payload) {
    if (this.io) {
      this.io.emit(event, payload);
    }
  }

  async executeEmergencyWorkflow(triggerData = {}, options = {}) {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const delay = options.fastDemo ? 80 : 350;

    try {
      this.isProcessing = true;

      const incidentType = triggerData.type || "FIRE";
      const incidentTitle = triggerData.title || `${incidentType} Emergency - Main Academic Block`;
      const location = triggerData.location || "Main Academic Block";
      const buildingId = triggerData.buildingId || "B-01";
      const locationCoords = triggerData.locationCoords || { lat: 37.7772, lng: -122.4182 };
      const hazardRadius = triggerData.hazardRadius || 85;
      const severity = triggerData.severity || "CRITICAL";
      const confidence = triggerData.confidence || 94;
      const cameraId = triggerData.cameraId || "CAM-02";
      const peopleAtRisk = triggerData.peopleAtRisk || 620;
      const detectedBy = triggerData.detectedBy || `Camera ${cameraId}`;

      // 1. 👁 DETECT (Camera Vision)
      const visionResult = cameraVisionAgent.triggerDemoFire(cameraId);

      this.broadcast("agent_step", {
        step: "DETECT",
        name: "👁 DETECT AI",
        status: `${incidentType} CONFIRMED`,
        message: `${detectedBy} verified ${incidentType} anomaly with ${confidence}% confidence across 3 consecutive frames.`,
        data: { ...visionResult, confidence, type: incidentType, location }
      });
      await sleep(delay);

      // 2. 🧠 DECIDE (Incident Commander)
      const incident = campusDataService.createIncident({
        type: incidentType,
        title: incidentTitle,
        location,
        buildingId,
        locationCoords,
        hazardRadius,
        severity,
        confidence,
        detectedBy,
        peopleAtRisk
      });

      this.broadcast("incident_created", incident);
      this.broadcast("agent_step", {
        step: "DECIDE",
        name: "🧠 DECIDE AI",
        status: severity === "CRITICAL" ? "EVACUATION ORDERED" : "TACTICAL RESPONSE ORDERED",
        message: `Classified as ${severity}. Commander AI evaluated ${peopleAtRisk} occupants at risk. Recommended evacuation and first-responder mobilization.`,
        incidentId: incident.id
      });
      await sleep(delay);

      // 3. 🛡 RESPOND (Security, Medical, Facilities)
      const securityResult = securityAgent.evaluateAndDispatch(incident);
      const medicalResult = medicalAgent.evaluateAndDispatch(incident);
      const facilitiesResult = facilitiesAgent.evaluateAndDeploy(incident);

      const secName = securityResult.assignedUnits && securityResult.assignedUnits[0] ? securityResult.assignedUnits[0].name : "S-04 Delta Squad";
      const medName = medicalResult.assignedAmbulance ? medicalResult.assignedAmbulance.name : "Ambulance A-02";
      const facName = facilitiesResult.assignedFSU ? facilitiesResult.assignedFSU.name : "FSU-03 Tender";

      this.broadcast("agent_step", {
        step: "RESPOND",
        name: "🛡 RESPOND AI",
        status: "UNITS COMMITTED",
        message: `Dispatched ${secName}, ${medName}, and ${facName} with automated perimeter coordinates.`,
        data: { security: securityResult, medical: medicalResult, facilities: facilitiesResult }
      });
      this.broadcast("resources_updated", campusDataService.resources);
      await sleep(delay);

      // 4. 🗺 GUIDE (Evacuation & Responder Routes)
      const routeResult = evacuationRouteAgent.calculateRoutes(incident);
      const safeZoneName = routeResult.recommendedAssemblyPoint ? routeResult.recommendedAssemblyPoint.name : "Assembly Point B";
      const routeDist = routeResult.primaryEvacuationRoute ? routeResult.primaryEvacuationRoute.totalDistanceMeters : 70;

      this.broadcast("agent_step", {
        step: "GUIDE",
        name: "🗺 GUIDE AI",
        status: "SAFEST ROUTE COMPUTED",
        message: `Calculated safest path to ${safeZoneName} (${routeDist}m). Avoids active ${incidentType} hazard zone and high crowd bottlenecks.`,
        data: routeResult
      });
      await sleep(delay);

      // 5. 📢 ALERT (Targeted Notifications)
      const commsResult = communicationAgent.broadcastEmergencyAlerts(incident, routeResult);
      this.broadcast("agent_step", {
        step: "ALERT",
        name: "📢 ALERT AI",
        status: "USERS NOTIFIED",
        message: `Role-tailored emergency directives sent to Students, Faculty, Security, and Medical staff.`,
        data: commsResult
      });
      this.broadcast("new_notification", commsResult.alerts);

      // Final Consolidated Update
      const updatedIncident = campusDataService.updateIncident(incident.id, {
        summary: `${incidentTitle}. Evacuate toward ${safeZoneName}. Emergency responders actively converging on scene.`,
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

      this.broadcast("incident_updated", updatedIncident);
      this.broadcast("approvals_updated", campusDataService.pendingApprovals);
      this.broadcast("system_stats_update", campusDataService.getSystemStats());

      this.isProcessing = false;
      return { success: true, incident: updatedIncident };
    } catch (err) {
      this.isProcessing = false;
      console.error("[AgentOrchestrator Error]", err);
      return { success: false, error: err.message };
    }
  }

  // Handle Dynamic Re-planning when a road is blocked
  handleRoadBlockage(edgeId = "E-07") {
    const incident = campusDataService.activeIncident;
    if (!incident) {
      return { success: false, reason: "No active incident to re-plan around" };
    }

    const reRoute = evacuationRouteAgent.replanAfterBlockage(incident, edgeId);
    const safeZone = reRoute.recommendedAssemblyPoint ? reRoute.recommendedAssemblyPoint : { name: "Assembly Point B" };

    // Broadcast route change alert
    const routeAlert = communicationAgent.broadcastRouteChangeAlert(
      incident,
      safeZone,
      `road obstruction detected on segment [${edgeId}]`
    );

    const updated = campusDataService.updateIncident(incident.id, {
      evacuationRoute: reRoute.primaryEvacuationRoute,
      recommendedAssemblyPoint: reRoute.recommendedAssemblyPoint
    });

    this.broadcast("route_replanned", {
      incidentId: incident.id,
      blockedEdgeId: edgeId,
      newEvacuationRoute: reRoute.primaryEvacuationRoute,
      newAssemblyPoint: reRoute.recommendedAssemblyPoint,
      reason: "Current route is no longer safe due to pathway obstruction. New recommended route selected."
    });

    this.broadcast("incident_updated", updated);
    this.broadcast("new_notification", [routeAlert]);
    return { success: true, incident: updated, reRoute };
  }

  resetAll() {
    campusDataService.resetState();
    cameraVisionAgent.reset("CAM-02");

    this.broadcast("system_reset", {
      status: "NORMAL",
      stats: campusDataService.getSystemStats()
    });

    return { success: true, message: "Campus reset to SAFE peacetime baseline." };
  }
}

export const agentOrchestrator = new AgentOrchestrator();
