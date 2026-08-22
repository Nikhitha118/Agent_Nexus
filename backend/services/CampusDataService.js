// Campus Sentinel AI - In-Memory & Real-time State Store
// Manages the Campus Digital Twin, Incidents, Resources, Approvals, and Audit Logs

import { BUILDINGS, ASSEMBLY_POINTS, CAMERAS, RESOURCES, GRAPH_NODES, GRAPH_EDGES } from "../data/campusSeed.js";

class CampusDataService {
  constructor() {
    this.resetState();
  }

  resetState() {
    // Deep clone initial state
    this.buildings = JSON.parse(JSON.stringify(BUILDINGS));
    this.assemblyPoints = JSON.parse(JSON.stringify(ASSEMBLY_POINTS));
    this.cameras = JSON.parse(JSON.stringify(CAMERAS));
    this.resources = JSON.parse(JSON.stringify(RESOURCES));
    this.nodes = JSON.parse(JSON.stringify(GRAPH_NODES));
    this.edges = JSON.parse(JSON.stringify(GRAPH_EDGES));

    this.incidents = [];
    this.activeIncident = null;
    this.pendingApprovals = [];
    this.notifications = [];
    this.auditLogs = [];
    this.agentActivities = [];

    this.blockedEdgeIds = new Set();
    this.systemStatus = "NORMAL";

    // Initial audit log
    this.logAudit("SYSTEM_INIT", "Campus Sentinel AI Core Engine initialized with digital twin assets.");
  }

  // AUDIT LOGGING
  logAudit(action, details, actor = "SYSTEM_AGENT", incidentId = null) {
    const entry = {
      id: `AUD-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`.toUpperCase(),
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString(),
      action,
      details,
      actor,
      incidentId,
      hash: Math.random().toString(36).substring(2) + Date.now().toString(36)
    };
    this.auditLogs.unshift(entry);
    return entry;
  }

  // AGENT ACTIVITY LOGGING
  logAgentActivity(agentName, action, message, status = "COMPLETED", data = null) {
    const activity = {
      id: `ACT-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`.toUpperCase(),
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString(),
      agentName,
      action,
      message,
      status,
      data
    };
    this.agentActivities.unshift(activity);
    if (this.agentActivities.length > 200) this.agentActivities.pop();
    return activity;
  }

  // INCIDENTS
  createIncident(incidentData) {
    const incidentId = incidentData.id || `INC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newIncident = {
      id: incidentId,
      type: incidentData.type || "FIRE",
      title: incidentData.title || `${incidentData.type || 'FIRE'} Emergency Detected`,
      location: incidentData.location || "Main Academic Block",
      buildingId: incidentData.buildingId || "B-01",
      locationCoords: incidentData.locationCoords || { lat: 37.7772, lng: -122.4182 },
      hazardRadius: incidentData.hazardRadius || 85,
      severity: incidentData.severity || "CRITICAL",
      confidence: incidentData.confidence || 94,
      status: "ACTIVE",
      detectedBy: incidentData.detectedBy || "CAM-02 (2nd Floor Corridor)",
      peopleAtRisk: incidentData.peopleAtRisk || 620,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      summary: incidentData.summary || "Fire/smoke detected with high confidence.",
      reasoning: incidentData.reasoning || [],
      activatedAgents: incidentData.activatedAgents || [],
      assignedResources: incidentData.assignedResources || {},
      evacuationRoute: incidentData.evacuationRoute || null,
      responderRoutes: incidentData.responderRoutes || [],
      timeline: [
        {
          timestamp: new Date().toISOString(),
          time: new Date().toLocaleTimeString(),
          event: "Incident Detected & Verified",
          source: incidentData.detectedBy || "Camera Vision Agent"
        }
      ]
    };

    this.incidents.unshift(newIncident);
    this.activeIncident = newIncident;
    this.systemStatus = "EMERGENCY";

    // Mark corresponding building risk
    const building = this.buildings.find(b => b.id === newIncident.buildingId || b.name === newIncident.location);
    if (building) {
      building.riskLevel = newIncident.severity;
    }

    this.logAudit("INCIDENT_CREATED", `Incident ${newIncident.id} (${newIncident.type}) created with severity ${newIncident.severity}`, "INCIDENT_COMMANDER", newIncident.id);

    return newIncident;
  }

  getActiveIncident() {
    return this.activeIncident;
  }

  updateIncident(id, updates) {
    const incident = this.incidents.find(i => i.id === id);
    if (!incident) return null;

    Object.assign(incident, updates, { updatedAt: new Date().toISOString() });
    if (this.activeIncident && this.activeIncident.id === id) {
      this.activeIncident = incident;
    }

    this.logAudit("INCIDENT_UPDATED", `Incident ${id} updated: ${Object.keys(updates).join(", ")}`, "INCIDENT_COMMANDER", id);
    return incident;
  }

  addIncidentTimelineEvent(incidentId, event, source = "SYSTEM") {
    const incident = this.incidents.find(i => i.id === incidentId);
    if (incident) {
      const eventObj = {
        timestamp: new Date().toISOString(),
        time: new Date().toLocaleTimeString(),
        event,
        source
      };
      incident.timeline.push(eventObj);
      return eventObj;
    }
    return null;
  }

  resolveIncident(incidentId, resolutionNotes = "Incident resolved and campus secured.") {
    const incident = this.incidents.find(i => i.id === incidentId);
    if (!incident) return null;

    incident.status = "RESOLVED";
    incident.resolvedAt = new Date().toISOString();
    incident.resolutionNotes = resolutionNotes;
    this.addIncidentTimelineEvent(incidentId, `Incident resolved: ${resolutionNotes}`, "HUMAN_COMMANDER");

    // Reset building risk
    const building = this.buildings.find(b => b.id === incident.buildingId);
    if (building) {
      building.riskLevel = "NORMAL";
    }

    // Release assigned resources
    this.releaseResourcesForIncident(incidentId);

    if (this.activeIncident && this.activeIncident.id === incidentId) {
      this.activeIncident = null;
      this.systemStatus = "NORMAL";
    }

    this.logAudit("INCIDENT_RESOLVED", `Incident ${incidentId} marked as RESOLVED`, "HUMAN_COMMANDER", incidentId);
    return incident;
  }

  // HUMAN-IN-THE-LOOP APPROVALS
  createApprovalRequest(data) {
    const approval = {
      id: `APP-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`.toUpperCase(),
      incidentId: data.incidentId || (this.activeIncident ? this.activeIncident.id : null),
      actionType: data.actionType, // e.g. "DEPLOY_FOAM_SUPPRESSION", "ROAD_BLOCKAGE", "MASS_EVACUATION", "EXTERNAL_DISPATCH"
      title: data.title,
      description: data.description,
      proposedByAgent: data.proposedByAgent || "IncidentCommanderAgent",
      severity: data.severity || "HIGH",
      status: "PENDING", // PENDING, APPROVED, REJECTED, MODIFIED
      createdAt: new Date().toISOString(),
      payload: data.payload || {},
      operatorNotes: null,
      reviewedBy: null,
      reviewedAt: null
    };

    this.pendingApprovals.unshift(approval);
    this.logAudit("APPROVAL_REQUESTED", `Action approval requested: ${approval.title}`, approval.proposedByAgent, approval.incidentId);
    return approval;
  }

  handleApprovalDecision(approvalId, decision, operatorName = "Chief Operator", notes = "") {
    const approval = this.pendingApprovals.find(a => a.id === approvalId);
    if (!approval) return null;

    approval.status = decision; // APPROVED or REJECTED or MODIFIED
    approval.reviewedBy = operatorName;
    approval.reviewedAt = new Date().toISOString();
    approval.operatorNotes = notes;

    this.logAudit(
      `APPROVAL_${decision}`,
      `Action ${approval.title} was ${decision} by ${operatorName}${notes ? ` (Notes: ${notes})` : ""}`,
      operatorName,
      approval.incidentId
    );

    if (approval.incidentId) {
      this.addIncidentTimelineEvent(
        approval.incidentId,
        `Operator ${decision} action: "${approval.title}"`,
        operatorName
      );
    }

    return approval;
  }

  // RESOURCES
  updateResourceStatus(category, id, status, updates = {}) {
    if (!this.resources[category]) return null;
    const item = this.resources[category].find(r => r.id === id);
    if (!item) return null;

    const previousStatus = item.status;
    item.status = status;
    Object.assign(item, updates);

    this.logAudit("RESOURCE_STATUS_CHANGE", `${item.name} (${id}) status changed: ${previousStatus} -> ${status}`);
    return item;
  }

  releaseResourcesForIncident(incidentId) {
    Object.keys(this.resources).forEach(category => {
      this.resources[category].forEach(item => {
        if (item.assignedIncidentId === incidentId) {
          item.assignedIncidentId = null;
          item.status = "AVAILABLE";
        }
      });
    });
  }

  // NOTIFICATIONS
  addNotification(notificationData) {
    const notif = {
      id: `NOTIF-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`.toUpperCase(),
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString(),
      targetRole: notificationData.targetRole || "ALL", // STUDENT, STAFF, SECURITY, MEDICAL, ALL
      title: notificationData.title,
      message: notificationData.message,
      urgency: notificationData.urgency || "HIGH",
      channels: notificationData.channels || { inApp: true, browser: true, sms: "DEMO_MODE", email: "DEMO_MODE" },
      incidentId: notificationData.incidentId || (this.activeIncident ? this.activeIncident.id : null),
      read: false
    };

    this.notifications.unshift(notif);
    if (this.notifications.length > 100) this.notifications.pop();
    return notif;
  }

  // ROAD BLOCKAGES (for Dynamic Re-planning Demo)
  toggleEdgeBlockage(edgeId, isBlocked = true) {
    const edge = this.edges.find(e => e.id === edgeId);
    if (!edge) return null;

    edge.isBlocked = isBlocked;
    if (isBlocked) {
      this.blockedEdgeIds.add(edgeId);
    } else {
      this.blockedEdgeIds.delete(edgeId);
    }

    this.logAudit("ROAD_BLOCKAGE_TOGGLED", `Road segment "${edge.name}" (${edge.id}) is now ${isBlocked ? 'BLOCKED' : 'CLEARED'}`);
    return edge;
  }

  // System Stats for Command Center
  getSystemStats() {
    let activeRespondersCount = 0;
    let availableAmbulancesCount = 0;
    let totalCameras = this.cameras.length;
    let camerasActive = this.cameras.filter(c => c.status === "MONITORING").length;

    this.resources.security.forEach(s => {
      if (s.status === "DISPATCHING" || s.status === "ON_SCENE") activeRespondersCount++;
    });
    this.resources.medical.forEach(m => {
      if (m.status === "DISPATCHING" || m.status === "ON_SCENE") activeRespondersCount++;
    });
    this.resources.fireSafety.forEach(f => {
      if (f.status === "DISPATCHING" || f.status === "ON_SCENE") activeRespondersCount++;
    });
    this.resources.ambulances.forEach(a => {
      if (a.status === "AVAILABLE") availableAmbulancesCount++;
      if (a.status === "DISPATCHING" || a.status === "ON_SCENE") activeRespondersCount++;
    });

    const activeInc = this.activeIncident;

    return {
      activeIncidentsCount: activeInc ? 1 : 0,
      activeRespondersCount,
      availableAmbulancesCount,
      peopleAtRisk: activeInc ? (activeInc.peopleAtRisk || 620) : 0,
      camerasMonitored: `${camerasActive}/${totalCameras}`,
      systemStatus: this.systemStatus,
      systemTime: new Date().toLocaleTimeString(),
      uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0)
    };
  }
}

export const campusDataService = new CampusDataService();
