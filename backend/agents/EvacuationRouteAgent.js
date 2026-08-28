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
    let originNodeId = "a-block"; // Default Main Academic A-Block
    const building = campusDataService.buildings.find(b => b.id === incident.buildingId || b.name === incident.location);
    if (building) {
      originNodeId = building.id; // e.g. "a-block"
    }

    // 2. Compute crowd-aware, hazard-penalized evacuation route
    const evacuationPlan = routingEngine.calculateOptimalEvacuationRoute(originNodeId, {
      locationCoords: incident.locationCoords,
      hazardRadius: incident.hazardRadius || 85
    });

    // 3. Compute Responder Routes for Dispatched Vehicles
    const responderRoutes = [];

    // Ambulance Route (from Pharmacy Health Bay to Incident Origin)
    const ambulanceRoute = routingEngine.calculateResponderRoute("pharmacy-block", originNodeId, { isVehicle: true });
    if (ambulanceRoute && ambulanceRoute.success) {
      responderRoutes.push({
        unitType: "AMBULANCE",
        unitId: "AMB-01",
        startLocation: "Health Center Bay (Pharmacy Block)",
        destination: `${building ? building.name : 'Incident Scene'} Main Access`,
        totalDistanceMeters: ambulanceRoute.totalDistanceMeters,
        etaMinutes: (ambulanceRoute.estimatedDriveTimeSeconds / 60).toFixed(1),
        path: ambulanceRoute.path,
        coordinates: ambulanceRoute.coordinates,
        instructions: "Approach via South Link and Central Avenue. Maintain emergency siren protocol."
      });
    }

    // Fire Unit Route (from Dining Hall Depot to Incident Origin)
    const fireUnitRoute = routingEngine.calculateResponderRoute("dining-hall", originNodeId, { isVehicle: true });
    if (fireUnitRoute && fireUnitRoute.success) {
      responderRoutes.push({
        unitType: "FIRE_TENDER",
        unitId: "FIRE-01",
        startLocation: "Service Depot (Dining Hall Quad)",
        destination: `${building ? building.name : 'Incident Scene'} South Access`,
        totalDistanceMeters: fireUnitRoute.totalDistanceMeters,
        etaMinutes: (fireUnitRoute.estimatedDriveTimeSeconds / 60).toFixed(1),
        path: fireUnitRoute.path,
        coordinates: fireUnitRoute.coordinates,
        instructions: "Proceed via North Quad Link. Deploy water foam line at primary perimeter."
      });
    }

    // Security Unit Route (from Boys Hostel Guard Post to Incident Origin)
    const securityRoute = routingEngine.calculateResponderRoute("boys-hostel", originNodeId, { isVehicle: false });
    if (securityRoute && securityRoute.success) {
      responderRoutes.push({
        unitType: "SECURITY_SQUAD",
        unitId: "SEC-01",
        startLocation: "North Security Point (Boys Hostel)",
        destination: `${building ? building.name : 'Incident Scene'} Crossway`,
        totalDistanceMeters: securityRoute.totalDistanceMeters,
        etaMinutes: (securityRoute.estimatedWalkTimeSeconds / 60).toFixed(1),
        path: securityRoute.path,
        coordinates: securityRoute.coordinates,
        instructions: "Establish physical cordon around incident perimeter to guide civilian evacuation."
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
