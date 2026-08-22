// Campus Sentinel AI - Security Agent
// Responsible for perimeter containment, crowd control, and security unit deployment

import { campusDataService } from "../services/CampusDataService.js";
import { calculateDistance } from "../services/RoutingEngine.js";

export class SecurityAgent {
  constructor() {
    this.name = "Security Agent";
    this.id = "AGENT_SECURITY";
  }

  evaluateAndDispatch(incident) {
    const incCoords = incident.locationCoords || { lat: 37.7772, lng: -122.4182 };
    const availableUnits = campusDataService.resources.security.filter(s => s.status === "AVAILABLE" || s.status === "PATROLLING");

    if (availableUnits.length === 0) {
      return {
        agent: this.name,
        status: "NO_AVAILABLE_UNITS",
        recommendedAction: "Request external municipal police assistance",
        assignedUnits: []
      };
    }

    // Rank by distance to incident
    const rankedUnits = availableUnits.map(unit => {
      const dist = Math.round(calculateDistance(unit.lat, unit.lng, incCoords.lat, incCoords.lng));
      return {
        ...unit,
        distanceMeters: dist,
        estimatedEtaSeconds: Math.round(dist / 2.5) // ~9 km/h jog
      };
    }).sort((a, b) => a.distanceMeters - b.distanceMeters);

    const primaryUnit = rankedUnits[0];
    const backupUnit = rankedUnits.length > 1 ? rankedUnits[1] : null;

    // Dispatch primary unit
    campusDataService.updateResourceStatus("security", primaryUnit.id, "DISPATCHING", {
      assignedIncidentId: incident.id,
      etaSeconds: primaryUnit.estimatedEtaSeconds
    });

    const assigned = [
      {
        id: primaryUnit.id,
        name: primaryUnit.name,
        officer: primaryUnit.officer,
        role: "PRIMARY_CONTAINMENT",
        distanceMeters: primaryUnit.distanceMeters,
        eta: `${Math.ceil(primaryUnit.estimatedEtaSeconds / 60)} min (${primaryUnit.estimatedEtaSeconds}s)`,
        targetLocation: `${incident.location} - Main Entry Cordon`,
        action: `Secure ${incident.location} perimeter and guide evacuees away from active hazard zone.`
      }
    ];

    if (backupUnit && incident.severity === "CRITICAL") {
      campusDataService.updateResourceStatus("security", backupUnit.id, "DISPATCHING", {
        assignedIncidentId: incident.id,
        etaSeconds: backupUnit.estimatedEtaSeconds
      });
      assigned.push({
        id: backupUnit.id,
        name: backupUnit.name,
        officer: backupUnit.officer,
        role: "CROWD_EVACUATION_SUPPORT",
        distanceMeters: backupUnit.distanceMeters,
        eta: `${Math.ceil(backupUnit.estimatedEtaSeconds / 60)} min`,
        targetLocation: `Evacuation Pathway to Assembly Zone`,
        action: `Establish corridor safety and prevent bottlenecks at building exit gates.`
      });
    }

    const reasoning = [
      `Selected ${primaryUnit.name} (${primaryUnit.id}) as primary responder: closest available unit at ${primaryUnit.distanceMeters}m.`,
      `Assigned containment cordon around ${incident.location} to prevent student entry into smoke zone.`
    ];

    // Propose human-in-the-loop approval if building doors need electronic lockdown
    const approval = campusDataService.createApprovalRequest({
      incidentId: incident.id,
      actionType: "SECURITY_PERIMETER_LOCKDOWN",
      title: `Authorize North Corridor Access Lockout at ${incident.location}`,
      description: `Security Agent proposes disabling electronic keycard entry to ${incident.location} to prevent students entering hazard zone while keeping emergency push-bar exit doors unlocked.`,
      proposedByAgent: this.name,
      severity: "HIGH",
      payload: { buildingId: incident.buildingId, perimeterGate: "Gate 1" }
    });

    const result = {
      agent: this.name,
      status: "UNITS_DISPATCHED",
      primaryUnit: primaryUnit.id,
      assignedUnits: assigned,
      reasoning,
      pendingApprovalId: approval.id,
      timestamp: new Date().toISOString()
    };

    campusDataService.logAgentActivity(
      this.name,
      "SECURITY_DISPATCH",
      `Dispatched ${primaryUnit.name} (ETA: ${primaryUnit.estimatedEtaSeconds}s) to ${incident.location}`,
      "COMPLETED",
      result
    );

    return result;
  }
}

export const securityAgent = new SecurityAgent();
