// Campus Sentinel AI - Communication Agent
// Responsible for role-based campus emergency alerts, multichannel broadcast, and delivery logging

import { campusDataService } from "../services/CampusDataService.js";

export class CommunicationAgent {
  constructor() {
    this.name = "Communication Agent";
    this.id = "AGENT_COMMUNICATION";
  }

  broadcastEmergencyAlerts(incident, routePlan = {}) {
    const assemblyName = routePlan.recommendedAssemblyPoint ? routePlan.recommendedAssemblyPoint.name : "Assembly Point B (Central Quad)";
    const routeSummary = routePlan.primaryEvacuationRoute ? `Follow green path toward ${assemblyName} (${routePlan.primaryEvacuationRoute.totalDistanceMeters}m)` : "Proceed to nearest clear exit.";

    const alerts = [];

    // 1. STUDENT ALERT
    const studentAlert = campusDataService.addNotification({
      targetRole: "STUDENT",
      title: "🚨 CAMPUS EMERGENCY: Fire Alert",
      message: `Fire detected near ${incident.location}. Please remain calm and evacuate immediately. AVOID: ${incident.location} & North Corridor. RECOMMENDED EVACUATION: ${routeSummary}. Follow campus warden instructions.`,
      urgency: "CRITICAL",
      incidentId: incident.id,
      channels: { inApp: true, browser: true, sms: "DEMO_MODE", broadcastPA: true }
    });
    alerts.push(studentAlert);

    // 2. STAFF ALERT
    const staffAlert = campusDataService.addNotification({
      targetRole: "STAFF",
      title: "⚠️ FACULTY & STAFF NOTICE: Emergency Evacuation",
      message: `Emergency confirmed at ${incident.location}. Please initiate assigned floor evacuation protocols. Assist students toward ${assemblyName}. Conduct visual sweep of rooms before exiting.`,
      urgency: "HIGH",
      incidentId: incident.id,
      channels: { inApp: true, browser: true, email: "DEMO_MODE", sms: "DEMO_MODE" }
    });
    alerts.push(staffAlert);

    // 3. SECURITY ALERT
    const securityAlert = campusDataService.addNotification({
      targetRole: "SECURITY",
      title: "🛡️ SECURITY RESPONSE REQUIRED: Level 1 Fire Hazard",
      message: `Incident ${incident.id} at ${incident.location}. Severity: ${incident.severity}. Priority units dispatched. Secure perimeter, restrict entry to West Science Lane, and guide evacuees to ${assemblyName}.`,
      urgency: "CRITICAL",
      incidentId: incident.id,
      channels: { inApp: true, tacticalRadio: true, browser: true }
    });
    alerts.push(securityAlert);

    // 4. MEDICAL ALERT
    const medicalAlert = campusDataService.addNotification({
      targetRole: "MEDICAL",
      title: "🚑 MEDICAL RESPONSE ACTIVATED: Burn/Inhalation Protocol",
      message: `Prepare Medical Staging Point at ${assemblyName}. Ambulance A-02 and Team M-03 dispatched. Estimated triage demand: ~${incident.peopleAtRisk ? Math.round(incident.peopleAtRisk * 0.03) : 15} occupants.`,
      urgency: "HIGH",
      incidentId: incident.id,
      channels: { inApp: true, pager: true, browser: true }
    });
    alerts.push(medicalAlert);

    const reasoning = [
      `Generated 4 customized role-based emergency payloads tailored to Student, Staff, Security, and Medical personnel.`,
      `Multi-channel dispatch: In-App WebSockets (Live), Browser Web Notifications (Active), SMS (Demo Simulation Mode), Campus PA Audio (Triggered).`
    ];

    const result = {
      agent: this.name,
      status: "ALERTS_BROADCASTED",
      deliveredCount: alerts.length,
      alerts,
      reasoning,
      channelsReport: {
        inApp: "DELIVERED_REALTIME (✓)",
        browserPush: "DISPATCHED (✓)",
        smsGateway: "SIMULATED_DEMO_MODE (✓)",
        campusPA: "AUDIO_CHIME_TRIGGERED (✓)"
      },
      timestamp: new Date().toISOString()
    };

    campusDataService.logAgentActivity(
      this.name,
      "ALERT_BROADCAST",
      `Dispatched 4 role-based emergency alerts across Campus Sentinel network.`,
      "COMPLETED",
      result
    );

    return result;
  }

  // Route change notification for dynamic replanning
  broadcastRouteChangeAlert(incident, newAssemblyPoint, reason = "Active Road Blockage") {
    const alert = campusDataService.addNotification({
      targetRole: "ALL",
      title: "⚠️ EVACUATION ROUTE MODIFICATION",
      message: `Attention: Evacuation path updated due to ${reason}. Do not use blocked pathways. Proceed immediately to ${newAssemblyPoint.name}. Follow live map guidance.`,
      urgency: "HIGH",
      incidentId: incident.id,
      channels: { inApp: true, browser: true, sms: "DEMO_MODE" }
    });

    return alert;
  }
}

export const communicationAgent = new CommunicationAgent();
