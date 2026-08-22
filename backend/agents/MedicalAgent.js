// Campus Sentinel AI - Medical Agent
// Responsible for triage capacity estimation, ambulance routing, and EMT dispatch

import { campusDataService } from "../services/CampusDataService.js";
import { calculateDistance } from "../services/RoutingEngine.js";

export class MedicalAgent {
  constructor() {
    this.name = "Medical Agent";
    this.id = "AGENT_MEDICAL";
  }

  evaluateAndDispatch(incident) {
    const incCoords = incident.locationCoords || { lat: 37.7772, lng: -122.4182 };
    
    // 1. Find nearest available ambulance
    const availableAmbulances = campusDataService.resources.ambulances.filter(a => a.status === "AVAILABLE");
    let assignedAmbulance = null;

    if (availableAmbulances.length > 0) {
      const rankedAmbulances = availableAmbulances.map(amb => {
        const dist = Math.round(calculateDistance(amb.lat, amb.lng, incCoords.lat, incCoords.lng));
        const etaSeconds = Math.round(dist / 8.5) + 30; // ~30 km/h + 30s prep
        return {
          ...amb,
          distanceMeters: dist,
          etaSeconds
        };
      }).sort((a, b) => a.distanceMeters - b.distanceMeters);

      const bestAmb = rankedAmbulances[0];
      campusDataService.updateResourceStatus("ambulances", bestAmb.id, "DISPATCHING", {
        assignedIncidentId: incident.id,
        etaSeconds: bestAmb.etaSeconds
      });

      assignedAmbulance = {
        id: bestAmb.id,
        name: bestAmb.name,
        distanceMeters: bestAmb.distanceMeters,
        eta: `${Math.ceil(bestAmb.etaSeconds / 60)} min (${bestAmb.etaSeconds}s)`,
        crew: bestAmb.crew,
        icuEquipped: bestAmb.icuEquipped,
        stagingDestination: "Central Quad Medical Staging Point (N-00)"
      };
    }

    // 2. Find nearest EMT Medical Squad
    const availableMedTeams = campusDataService.resources.medical.filter(m => m.status === "AVAILABLE");
    let assignedMedTeam = null;

    if (availableMedTeams.length > 0) {
      const rankedTeams = availableMedTeams.map(team => {
        const dist = Math.round(calculateDistance(team.lat, team.lng, incCoords.lat, incCoords.lng));
        return {
          ...team,
          distanceMeters: dist,
          etaSeconds: Math.round(dist / 2.8)
        };
      }).sort((a, b) => a.distanceMeters - b.distanceMeters);

      const bestTeam = rankedTeams[0];
      campusDataService.updateResourceStatus("medical", bestTeam.id, "DISPATCHING", {
        assignedIncidentId: incident.id
      });

      assignedMedTeam = {
        id: bestTeam.id,
        name: bestTeam.name,
        lead: bestTeam.lead,
        distanceMeters: bestTeam.distanceMeters,
        triageCapacity: bestTeam.triageCapacity,
        equipment: bestTeam.equipment,
        action: `Set up triage tarps and oxygen therapy at Safe Staging Point B.`
      };
    }

    // 3. Triage Estimation
    const buildingOccupancy = incident.peopleAtRisk || 620;
    const estimatedPotentialCasualties = Math.max(2, Math.round(buildingOccupancy * 0.03)); // ~3% triage estimate

    const reasoning = [
      `Selected ${assignedAmbulance ? assignedAmbulance.name : 'Emergency Ambulance'} (Distance: ${assignedAmbulance ? assignedAmbulance.distanceMeters : 0}m, ETA: ${assignedAmbulance ? assignedAmbulance.eta : '2 min'}).`,
      `Deployed ${assignedMedTeam ? assignedMedTeam.name : 'EMT Team'} to establish emergency oxygen/burn station at Central Quad.`,
      `Estimated triage demand: ~${estimatedPotentialCasualties} potential smoke inhalation / minor trauma cases.`
    ];

    const result = {
      agent: this.name,
      status: "MEDICAL_RESOURCES_COMMITTED",
      assignedAmbulance,
      assignedMedTeam,
      triageStagingLocation: "Central Quadrangle Green (Zone B)",
      estimatedPotentialCasualties,
      reasoning,
      timestamp: new Date().toISOString()
    };

    campusDataService.logAgentActivity(
      this.name,
      "MEDICAL_DISPATCH",
      `Dispatched ${assignedAmbulance ? assignedAmbulance.id : 'A-02'} and ${assignedMedTeam ? assignedMedTeam.id : 'M-03'} to ${incident.location} staging area`,
      "COMPLETED",
      result
    );

    return result;
  }
}

export const medicalAgent = new MedicalAgent();
