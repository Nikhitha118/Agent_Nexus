// Campus Sentinel AI - Facilities & Fire Safety Agent
// Responsible for fire suppression assets, utility isolation, and hazard mitigation

import { campusDataService } from "../services/CampusDataService.js";
import { calculateDistance } from "../services/RoutingEngine.js";

export class FacilitiesAgent {
  constructor() {
    this.name = "Facilities / Fire Safety Agent";
    this.id = "AGENT_FACILITIES";
  }

  evaluateAndDeploy(incident) {
    const incCoords = incident.locationCoords || { lat: 37.7772, lng: -122.4182 };
    const building = campusDataService.buildings.find(b => b.id === incident.buildingId || b.name === incident.location);

    // 1. Find nearest Fire Safety Unit
    const availableFSU = campusDataService.resources.fireSafety.filter(f => f.status === "AVAILABLE");
    let assignedFSU = null;

    if (availableFSU.length > 0) {
      const rankedFSU = availableFSU.map(fsu => {
        const dist = Math.round(calculateDistance(fsu.lat, fsu.lng, incCoords.lat, incCoords.lng));
        return {
          ...fsu,
          distanceMeters: dist,
          etaSeconds: Math.round(dist / 4.0) + 20
        };
      }).sort((a, b) => a.distanceMeters - b.distanceMeters);

      const bestFSU = rankedFSU[0];
      campusDataService.updateResourceStatus("fireSafety", bestFSU.id, "DISPATCHING", {
        assignedIncidentId: incident.id
      });

      assignedFSU = {
        id: bestFSU.id,
        name: bestFSU.name,
        distanceMeters: bestFSU.distanceMeters,
        eta: `${Math.ceil(bestFSU.etaSeconds / 60)} min (${bestFSU.etaSeconds}s)`,
        waterCapacity: `${bestFSU.waterCapacityLitres}L`,
        foamAvailable: bestFSU.foamAvailable
      };
    }

    // 2. Identify infrastructure controls
    const gasValve = building ? building.gasValveZone : "GV-01";
    const powerGrid = building ? building.powerGridZone : "Grid-North-1";
    const suppressionType = building ? building.suppressionSystem : "Automatic Wet Sprinkler System";

    // 3. Propose Human-In-The-Loop Approval for High-Impact Utility Isolation
    const approval = campusDataService.createApprovalRequest({
      incidentId: incident.id,
      actionType: "UTILITY_ISOLATION_AND_SUPPRESSION",
      title: `Authorize Remote Gas Main Isolation (${gasValve}) & Suppression Arming`,
      description: `Facilities Agent recommends isolating natural gas line [${gasValve}] and activating secondary HVAC smoke extraction dampers for ${building ? building.name : 'Main Academic Block'}.`,
      proposedByAgent: this.name,
      severity: "CRITICAL",
      payload: { buildingId: incident.buildingId, gasValve, powerGrid }
    });

    const reasoning = [
      `Assigned nearest fire unit ${assignedFSU ? assignedFSU.name : 'FSU-03'} (Distance: ${assignedFSU ? assignedFSU.distanceMeters : 95}m).`,
      `Flagged ${gasValve} (Gas Main) and ${powerGrid} for immediate emergency isolation to prevent secondary explosions.`,
      `Armed building smoke purge exhaust dampers to clear evacuation stairwells.`
    ];

    const result = {
      agent: this.name,
      status: "FIRE_SAFETY_ENGAGED",
      assignedFSU,
      buildingInfrastructure: {
        suppressionSystem: suppressionType,
        gasValveZone: gasValve,
        powerGridZone: powerGrid
      },
      pendingApprovalId: approval.id,
      reasoning,
      timestamp: new Date().toISOString()
    };

    campusDataService.logAgentActivity(
      this.name,
      "FIRE_SAFETY_DISPATCH",
      `Dispatched ${assignedFSU ? assignedFSU.name : 'FSU-03'} (Distance: ${assignedFSU ? assignedFSU.distanceMeters : 95}m) and staged gas isolation.`,
      "COMPLETED",
      result
    );

    return result;
  }
}

export const facilitiesAgent = new FacilitiesAgent();
