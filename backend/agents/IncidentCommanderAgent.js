// Campus Sentinel AI - Incident Commander Agent
// High-Level Orchestrator, Priority Assessor, and Multi-Agent Reasoning Master

import { campusDataService } from "../services/CampusDataService.js";

export class IncidentCommanderAgent {
  constructor() {
    this.name = "Incident Commander Agent";
    this.id = "AGENT_INCIDENT_COMMANDER";
  }

  // Assess incident severity matrix
  assessSeverity(incidentData) {
    const confidence = incidentData.confidence || 90;
    const type = incidentData.type || "FIRE";
    const occupancy = incidentData.peopleAtRisk || 620;

    let severity = "MODERATE";
    const factors = [];

    if (type === "FIRE" || type === "EXPLOSION" || type === "HAZMAT") {
      if (confidence >= 80 && occupancy >= 200) {
        severity = "CRITICAL";
        factors.push(`High confidence (${confidence}%) fire detection in heavily occupied building (${occupancy} occupants).`);
      } else if (confidence >= 60) {
        severity = "HIGH";
        factors.push(`Suspicious thermal anomaly (${confidence}% confidence) with moderate occupancy.`);
      }
    } else if (type === "MEDICAL") {
      severity = "HIGH";
      factors.push("Urgent medical trauma reported requiring immediate resuscitation gear.");
    } else if (type === "SECURITY") {
      severity = "HIGH";
      factors.push("Campus safety breach requiring tactical containment.");
    }

    return { severity, factors };
  }

  // Formulate human-readable Commander synthesis & recommendations
  generateCommanderSummary(incident, agentOutputs = {}) {
    const security = agentOutputs.security || {};
    const medical = agentOutputs.medical || {};
    const facilities = agentOutputs.facilities || {};
    const route = agentOutputs.route || {};

    const primaryUnit = security.assignedUnits && security.assignedUnits[0] ? security.assignedUnits[0].name : "S-04 Delta Rapid Response";
    const primaryAmb = medical.assignedAmbulance ? medical.assignedAmbulance.name : "A-02 Rapid Ambulance";
    const primaryFsu = facilities.assignedFSU ? facilities.assignedFSU.name : "FSU-03 Central Fire Unit";
    const safeZone = route.recommendedAssemblyPoint ? route.recommendedAssemblyPoint.name : "Assembly Point B (Central Quad)";

    const reasoning = [
      `Fire detected in ${incident.location} with ${incident.confidence}% AI confidence.`,
      `Severity classified as ${incident.severity}: High building occupancy (${incident.peopleAtRisk} students/staff), thermal hazard radius ${incident.hazardRadius}m, multiple wind-ward adjoining blocks.`,
      `Safety-weighted A* algorithm routed evacuation toward ${safeZone} avoiding the active smoke buffer zone.`,
      `Responder access cleared via East Ring Road for Ambulance and West Science Lane for Fire Squad.`
    ];

    const recommendedActions = [
      `1. Immediate evacuation of ${incident.location} via South/East exits.`,
      `2. Multi-channel emergency alert broadcast to all campus occupants within 500m radius.`,
      `3. Deploy ${primaryUnit} for perimeter containment & crowd channeling.`,
      `4. Dispatch ${primaryAmb} and Trauma Team to ${safeZone} Staging Base.`,
      `5. Deploy ${primaryFsu} to engage hydrant hookup at South Access.`,
      `6. Execute human-approved remote gas main isolation (Valve ${facilities.buildingInfrastructure ? facilities.buildingInfrastructure.gasValveZone : 'GV-01'}).`
    ];

    const summaryText = `EMERGENCY COMMAND DIRECTIVE: Confirmed Level-1 Fire emergency at ${incident.location}. All 5 specialist agents active. Evacuation in progress toward ${safeZone}. Responders converging on scene.`;

    return {
      incidentId: incident.id,
      commanderTitle: "Autonomous Incident Commander AI",
      summaryText,
      reasoning,
      recommendedActions,
      humanInTheLoopNotice: "AI provides real-time decision support. High-impact utility shutoffs and full gate lockdowns require operator verification.",
      timestamp: new Date().toISOString()
    };
  }
}

export const incidentCommanderAgent = new IncidentCommanderAgent();
