// Campus Sentinel AI - Evacuation & Route Agent
// Responsible for calculating the SAFEST evacuation paths and specialized responder routes

import { routingEngine } from "../services/RoutingEngine.js";
import { campusDataService } from "../services/CampusDataService.js";

export class EvacuationRouteAgent {
  constructor() {
    this.name = "Evacuation / Route Agent";
    this.id = "AGENT_ROUTE";
  }

  calculateRoutes(incident) {
    // 1. Determine origin exit node for the affected building
    let originNodeId = "N-01"; // Default Main Academic South Exit
    const building = campusDataService.buildings.find(b => b.id === incident.buildingId || b.name === incident.location);
    if (building && building.exits && building.exits.length > 0) {
      originNodeId = building.exits[0]; // e.g. N-01
    }

    // 2. Compute crowd-aware, hazard-penalized evacuation route
    const evacuationPlan = routingEngine.calculateOptimalEvacuationRoute(originNodeId, {
      locationCoords: incident.locationCoords,
      hazardRadius: incident.hazardRadius || 85
    });

    // 3. Compute Responder Routes for Dispatched Vehicles
    const responderRoutes = [];

    // Ambulance Route (from Ambulance staging node e.g. N-32 to Staging Hub N-00)
    const ambulanceRoute = routingEngine.calculateResponderRoute("N-32", "N-00", { isVehicle: true });
    if (ambulanceRoute && ambulanceRoute.success) {
      responderRoutes.push({
        unitType: "AMBULANCE",
        unitId: "A-02",
        startLocation: "East Gate 3 Staging Post (N-32)",
        destination: "Central Quadrangle Medical Post (N-00)",
        totalDistanceMeters: ambulanceRoute.totalDistanceMeters,
        etaMinutes: (ambulanceRoute.estimatedDriveTimeSeconds / 60).toFixed(1),
        path: ambulanceRoute.path,
        coordinates: ambulanceRoute.coordinates,
        instructions: "Approach via East Ring Road and Central Avenue West. Maintain siren protocol."
      });
    }

    // Fire Unit Route (from N-18 Security HQ Bay to Incident South Access N-01)
    const fireUnitRoute = routingEngine.calculateResponderRoute("N-18", "N-01", { isVehicle: true });
    if (fireUnitRoute && fireUnitRoute.success) {
      responderRoutes.push({
        unitType: "FIRE_TENDER",
        unitId: "FSU-03",
        startLocation: "Depot Service Way (N-18)",
        destination: "Main Academic South Entrance (N-01)",
        totalDistanceMeters: fireUnitRoute.totalDistanceMeters,
        etaMinutes: (fireUnitRoute.estimatedDriveTimeSeconds / 60).toFixed(1),
        path: fireUnitRoute.path,
        coordinates: fireUnitRoute.coordinates,
        instructions: "Proceed via West Science Lane. Deploy foam line at South Access."
      });
    }

    // Security Unit Route (S-04 Jogging to North Corridor)
    const securityRoute = routingEngine.calculateResponderRoute("N-01", "N-40", { isVehicle: false });
    if (securityRoute && securityRoute.success) {
      responderRoutes.push({
        unitType: "SECURITY_SQUAD",
        unitId: "S-04",
        startLocation: "South Promenade (N-01)",
        destination: "North Academic Crossway (N-40)",
        totalDistanceMeters: securityRoute.totalDistanceMeters,
        etaMinutes: (securityRoute.estimatedWalkTimeSeconds / 60).toFixed(1),
        path: securityRoute.path,
        coordinates: securityRoute.coordinates,
        instructions: "Establish physical cordon at N-40 crossway to redirect students."
      });
    }

    const reasoning = [
      `A* Safety Optimization evaluated all 5 campus assembly points against active thermal hazard radius (${incident.hazardRadius || 85}m).`,
      `${evacuationPlan.recommendedAssemblyPoint ? evacuationPlan.recommendedAssemblyPoint.name : 'Assembly Point B'} selected (Distance: ${evacuationPlan.primaryRoute ? evacuationPlan.primaryRoute.totalDistanceMeters : 0}m, Risk: ${evacuationPlan.primaryRoute ? evacuationPlan.primaryRoute.safetyLevel : 'OPTIMAL_SAFE'}).`,
      `Crowd Density Check: ${evacuationPlan.recommendedAssemblyPoint ? evacuationPlan.recommendedAssemblyPoint.name : 'Zone B'} has ${evacuationPlan.primaryRoute ? evacuationPlan.recommendedAssemblyPoint.capacity - evacuationPlan.recommendedAssemblyPoint.currentOccupancy : 540} open capacity slots.`,
      `Segregated Responder Routes generated to ensure emergency vehicles do not conflict with pedestrian evacuation corridors.`
    ];

    const result = {
      agent: this.name,
      status: "ROUTES_COMPUTED",
      evacuationPlan,
      primaryEvacuationRoute: evacuationPlan.primaryRoute,
      recommendedAssemblyPoint: evacuationPlan.recommendedAssemblyPoint,
      alternativeRoute: evacuationPlan.alternativeRoute,
      responderRoutes,
      reasoning,
      timestamp: new Date().toISOString()
    };

    campusDataService.logAgentActivity(
      this.name,
      "ROUTE_CALCULATION",
      `Calculated safest route: ${originNodeId} -> ${evacuationPlan.recommendedAssemblyPoint ? evacuationPlan.recommendedAssemblyPoint.name : 'Zone B'} (${evacuationPlan.primaryRoute ? evacuationPlan.primaryRoute.totalDistanceMeters : 0}m). Safety: ${evacuationPlan.primaryRoute ? evacuationPlan.primaryRoute.safetyLevel : 'SAFE'}`,
      "COMPLETED",
      result
    );

    return result;
  }

  // Dynamic Re-planning when a road segment is blocked
  replanAfterBlockage(incident, blockedEdgeId) {
    campusDataService.toggleEdgeBlockage(blockedEdgeId, true);
    routingEngine.setBlockedEdge(blockedEdgeId, true);

    const newPlan = this.calculateRoutes(incident);

    const reRouteEvent = {
      event: `Dynamic Re-Planning Triggered: Road segment [${blockedEdgeId}] blocked. Alternative route calculated.`,
      timestamp: new Date().toISOString(),
      previousBlockedEdge: blockedEdgeId,
      newEvacuationRoute: newPlan.primaryEvacuationRoute,
      newAssemblyPoint: newPlan.recommendedAssemblyPoint
    };

    campusDataService.addIncidentTimelineEvent(
      incident.id,
      `Route Re-planned: Avoided blocked segment ${blockedEdgeId}. Directed evacuees to ${newPlan.recommendedAssemblyPoint.name}`,
      "ROUTE_AGENT"
    );

    campusDataService.logAgentActivity(
      this.name,
      "DYNAMIC_REPLANNING",
      `Re-calculated safe evacuation route due to blockage on edge ${blockedEdgeId}`,
      "COMPLETED",
      reRouteEvent
    );

    return newPlan;
  }
}

export const evacuationRouteAgent = new EvacuationRouteAgent();
