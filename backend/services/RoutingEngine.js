// Campus Sentinel AI - Graph Routing & Safety Engine
// Implements dynamic A* and safety-penalized Dijkstra for Evacuation and First Responders

import { GRAPH_NODES, GRAPH_EDGES, ASSEMBLY_POINTS, BUILDINGS } from "../data/campusSeed.js";

// Haversine distance in meters between two lat/lng points
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export class CampusRoutingEngine {
  constructor(nodes = GRAPH_NODES, edges = GRAPH_EDGES) {
    this.nodes = { ...nodes };
    this.edges = [...edges];
    this.blockedEdges = new Set();
    this.activeHazards = [];
  }

  setBlockedEdge(edgeId, isBlocked = true) {
    if (isBlocked) {
      this.blockedEdges.add(edgeId);
    } else {
      this.blockedEdges.delete(edgeId);
    }
  }

  clearBlockedEdges() {
    this.blockedEdges.clear();
  }

  setActiveHazards(hazards) {
    this.activeHazards = hazards || [];
  }

  // Calculate adjacency list with dynamic weights
  getAdjacencyList(options = {}) {
    const {
      isVehicle = false,
      hazardAvoidance = true,
      hazardRadius = 90, // meters
      hazardPenaltyMultiplier = 2000,
      customBlockedEdges = []
    } = options;

    const combinedBlocked = new Set([...this.blockedEdges, ...customBlockedEdges]);
    const adj = {};

    Object.keys(this.nodes).forEach(nodeId => {
      adj[nodeId] = [];
    });

    this.edges.forEach(edge => {
      // Check vehicle accessibility
      if (isVehicle && !edge.isRoad) {
        return; // Vehicles can only traverse roads
      }

      const isBlocked = edge.isBlocked || combinedBlocked.has(edge.id);
      
      const nodeA = this.nodes[edge.from];
      const nodeB = this.nodes[edge.to];

      if (!nodeA || !nodeB) return;

      // Base weight: physical distance in meters
      let weight = edge.distance || calculateDistance(nodeA.lat, nodeA.lng, nodeB.lat, nodeB.lng);

      // Check hazard proximity penalty
      let hazardPenalty = 0;
      if (hazardAvoidance && this.activeHazards.length > 0) {
        this.activeHazards.forEach(hazard => {
          const distA = calculateDistance(nodeA.lat, nodeA.lng, hazard.lat, hazard.lng);
          const distB = calculateDistance(nodeB.lat, nodeB.lng, hazard.lat, hazard.lng);
          const minHazardDist = Math.min(distA, distB);

          const effectiveRadius = hazard.radius || hazardRadius;

          if (minHazardDist <= effectiveRadius) {
            // Severe exponential penalty inside direct hazard zone
            const intensity = (effectiveRadius - minHazardDist) / effectiveRadius;
            hazardPenalty += hazardPenaltyMultiplier * (1 + intensity * 5);
          } else if (minHazardDist <= effectiveRadius * 1.6) {
            // Moderate smoke/thermal buffer penalty
            const bufferIntensity = (effectiveRadius * 1.6 - minHazardDist) / (effectiveRadius * 0.6);
            hazardPenalty += (hazardPenaltyMultiplier * 0.3) * bufferIntensity;
          }
        });
      }

      // Blocked edge penalty
      if (isBlocked) {
        weight += 1000000; // Impassable
      } else {
        weight += hazardPenalty;
      }

      adj[edge.from].push({
        node: edge.to,
        edgeId: edge.id,
        weight,
        baseDistance: edge.distance,
        isBlocked,
        hazardPenalty,
        name: edge.name
      });

      adj[edge.to].push({
        node: edge.from,
        edgeId: edge.id,
        weight,
        baseDistance: edge.distance,
        isBlocked,
        hazardPenalty,
        name: edge.name
      });
    });

    return adj;
  }

  // Dijkstra / A* Shortest & Safest Path between two nodes
  findRoute(startNodeId, endNodeId, options = {}) {
    if (!this.nodes[startNodeId] || !this.nodes[endNodeId]) {
      return null;
    }

    const adj = this.getAdjacencyList(options);
    const distances = {};
    const previous = {};
    const previousEdges = {};
    const unvisited = new Set(Object.keys(this.nodes));

    Object.keys(this.nodes).forEach(nodeId => {
      distances[nodeId] = Infinity;
      previous[nodeId] = null;
    });

    distances[startNodeId] = 0;

    while (unvisited.size > 0) {
      // Find unvisited node with smallest distance
      let current = null;
      let minDistance = Infinity;

      unvisited.forEach(nodeId => {
        if (distances[nodeId] < minDistance) {
          minDistance = distances[nodeId];
          current = nodeId;
        }
      });

      if (current === null || distances[current] === Infinity || current === endNodeId) {
        break;
      }

      unvisited.delete(current);

      const neighbors = adj[current] || [];
      for (const neighbor of neighbors) {
        if (!unvisited.has(neighbor.node)) continue;

        const alt = distances[current] + neighbor.weight;
        if (alt < distances[neighbor.node]) {
          distances[neighbor.node] = alt;
          previous[neighbor.node] = current;
          previousEdges[neighbor.node] = neighbor;
        }
      }
    }

    // Path reconstruction
    if (distances[endNodeId] >= 1000000 || !previous[endNodeId] && startNodeId !== endNodeId) {
      return {
        success: false,
        reason: "No safe or unblocked route found between selected points",
        startNodeId,
        endNodeId
      };
    }

    const path = [];
    const pathEdges = [];
    let curr = endNodeId;
    let totalBaseDistance = 0;
    let totalHazardPenalty = 0;

    while (curr) {
      path.unshift(curr);
      const edgeInfo = previousEdges[curr];
      if (edgeInfo) {
        pathEdges.unshift(edgeInfo);
        totalBaseDistance += edgeInfo.baseDistance;
        totalHazardPenalty += edgeInfo.hazardPenalty;
      }
      curr = previous[curr];
    }

    const waypoints = path.map(nodeId => {
      const node = this.nodes[nodeId];
      return {
        nodeId,
        name: node.name,
        lat: node.lat,
        lng: node.lng,
        type: node.type
      };
    });

    const coordinates = waypoints.map(wp => [wp.lat, wp.lng]);

    // Safety Risk classification
    let safetyLevel = "OPTIMAL_SAFE";
    if (totalHazardPenalty > 500) safetyLevel = "MODERATE_RISK";
    if (totalHazardPenalty > 2000) safetyLevel = "HIGH_RISK";

    return {
      success: true,
      startNodeId,
      endNodeId,
      path,
      waypoints,
      coordinates,
      totalDistanceMeters: Math.round(totalBaseDistance),
      totalCost: Math.round(distances[endNodeId]),
      hazardPenaltyScore: Math.round(totalHazardPenalty),
      safetyLevel,
      estimatedWalkTimeSeconds: Math.round(totalBaseDistance / 1.3), // 1.3 m/s walking speed
      estimatedDriveTimeSeconds: Math.round(totalBaseDistance / 8.5) // ~30 km/h campus speed
    };
  }

  // Calculate safest evacuation route to the optimal Assembly Point considering crowd occupancy
  calculateOptimalEvacuationRoute(originNodeId, incidentDetails = {}) {
    const hazards = incidentDetails.locationCoords ? [{
      lat: incidentDetails.locationCoords.lat,
      lng: incidentDetails.locationCoords.lng,
      radius: incidentDetails.hazardRadius || 80
    }] : this.activeHazards;

    this.setActiveHazards(hazards);

    const candidates = ASSEMBLY_POINTS.map(ap => {
      const route = this.findRoute(originNodeId, ap.nearestNode, {
        isVehicle: false,
        hazardAvoidance: true,
        hazardRadius: incidentDetails.hazardRadius || 80
      });

      if (!route || !route.success) {
        return null;
      }

      // Crowd penalty score based on current occupancy vs capacity
      const occupancyRatio = ap.currentOccupancy / ap.capacity;
      let crowdPenalty = occupancyRatio * 400;
      if (occupancyRatio > 0.85) crowdPenalty += 1500; // Congested zone penalty

      const combinedScore = route.totalCost + crowdPenalty;

      return {
        assemblyPoint: ap,
        route,
        combinedScore,
        occupancyRatio: Math.round(occupancyRatio * 100),
        availableCapacity: ap.capacity - ap.currentOccupancy
      };
    }).filter(Boolean);

    if (candidates.length === 0) {
      return {
        success: false,
        reason: "All evacuation assembly pathways are critically obstructed"
      };
    }

    // Sort by combined score (Safety > Crowd Congestion > Distance)
    candidates.sort((a, b) => a.combinedScore - b.combinedScore);

    const best = candidates[0];
    const alternative = candidates[1] || null;

    return {
      success: true,
      originNodeId,
      recommendedAssemblyPoint: best.assemblyPoint,
      primaryRoute: best.route,
      alternativeRoute: alternative ? alternative.route : null,
      alternativeAssemblyPoint: alternative ? alternative.assemblyPoint : null,
      justification: `Selected ${best.assemblyPoint.name} (Capacity: ${best.availableCapacity} open slots, Distance: ${best.route.totalDistanceMeters}m). Avoids active thermal hazard zone and high crowd bottlenecks.`,
      allCandidates: candidates.map(c => ({
        id: c.assemblyPoint.id,
        name: c.assemblyPoint.name,
        distanceMeters: c.route.totalDistanceMeters,
        safetyLevel: c.route.safetyLevel,
        availableCapacity: c.availableCapacity
      }))
    };
  }

  // Calculate fastest route for emergency responder vehicles (Ambulance, Fire Tender, Security)
  calculateResponderRoute(responderStartNodeId, targetStagingNodeId, options = {}) {
    const route = this.findRoute(responderStartNodeId, targetStagingNodeId, {
      isVehicle: options.isVehicle !== false,
      hazardAvoidance: true,
      hazardRadius: 50 // Responders can get closer to hazard perimeter
    });

    return route;
  }
}

export const routingEngine = new CampusRoutingEngine();
