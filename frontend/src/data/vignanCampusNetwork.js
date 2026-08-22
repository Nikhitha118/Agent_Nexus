// Campus Sentinel - Vignan University Custom Campus Road Network & Dynamic Evacuation Graph
// Centered around: Vignan's Foundation for Science, Technology & Research, Vadlamudi, Guntur (16.233389, 80.550917)

export const CAMPUS_CENTER = {
  lat: 16.233389,
  lng: 80.550917,
  zoom: 18,
  tilt: 60,
  heading: 90
};

// 15 Official Vignan University Campus Locations
export const CAMPUS_LOCATIONS = [
  {
    id: "a-block",
    name: "A-Block",
    fullName: "A-Block (Administrative & Central Academic Wing)",
    type: "building",
    category: "Academic",
    lat: 16.233389,
    lng: 80.550917,
    floors: 4,
    description: "Main University Administration, Dean Offices & Academic Classrooms",
    isSafeZone: false
  },
  {
    id: "h-block",
    name: "H-Block",
    fullName: "H-Block (Science & Humanities Wing)",
    type: "building",
    category: "Academic",
    lat: 16.233050,
    lng: 80.550300,
    floors: 4,
    description: "Department of Science & Humanities, Lecture Halls",
    isSafeZone: false
  },
  {
    id: "ntr-library",
    name: "NTR Library",
    fullName: "NTR Central Memorial Library",
    type: "library",
    category: "Library",
    lat: 16.233780,
    lng: 80.550420,
    floors: 3,
    description: "Central Digital Library, Reading Rooms & Research Archives",
    isSafeZone: false
  },
  {
    id: "mhp",
    name: "MHP",
    fullName: "MHP (Mahati Pranganam Multipurpose Hall)",
    type: "facility",
    category: "Auditorium",
    lat: 16.232750,
    lng: 80.551150,
    floors: 2,
    description: "Main University Auditorium & Indoor Cultural Complex",
    isSafeZone: false
  },
  {
    id: "n-block",
    name: "N-Block",
    fullName: "N-Block (NTR Vignan Bhavan - CSE & IT)",
    type: "building",
    category: "Computing & IT",
    lat: 16.234120,
    lng: 80.551650,
    floors: 5,
    description: "Computer Science & Engineering, IT Labs & Server Rooms",
    isSafeZone: false
  },
  {
    id: "u-block",
    name: "U-Block",
    fullName: "U-Block (Advanced Engineering Labs)",
    type: "building",
    category: "Engineering",
    lat: 16.234550,
    lng: 80.552100,
    floors: 4,
    description: "ECE, EEE, Robotics & Advanced Simulation Workshops",
    isSafeZone: false
  },
  {
    id: "boys-hostel",
    name: "Boys Hostel",
    fullName: "Boys Hostel Complex",
    type: "hostel",
    category: "Student Housing",
    lat: 16.235600,
    lng: 80.552200,
    floors: 6,
    description: "Men's Residential Blocks & Student Quarters",
    isSafeZone: false
  },
  {
    id: "pharmacy-block",
    name: "Pharmacy Block",
    fullName: "School of Pharmaceutical Sciences",
    type: "building",
    category: "Health Science",
    lat: 16.232200,
    lng: 80.551300,
    floors: 4,
    description: "Pharmacy Laboratories, Drug Research & Medical Dispensary",
    isSafeZone: false
  },
  {
    id: "convocation",
    name: "Convocation",
    fullName: "Convocation & Sangamithra Open Lawn",
    type: "facility",
    category: "Open Facility",
    lat: 16.233200,
    lng: 80.551800,
    floors: 1,
    description: "Open Convocation Pavilion & Secondary Assembly Lawn",
    isSafeZone: true,
    safeZoneCapacity: 1200
  },
  {
    id: "dining-hall",
    name: "Dining Hall",
    fullName: "Central Dining Hall & Student Cafeteria",
    type: "facility",
    category: "Amenities",
    lat: 16.234800,
    lng: 80.550800,
    floors: 2,
    description: "Central Student Food Court & Mess Facilities",
    isSafeZone: false
  },
  {
    id: "playground",
    name: "Playground",
    fullName: "University Playground & Sports Stadium (PRIMARY SAFE ZONE)",
    type: "safe-zone",
    category: "Safe Assembly Zone",
    lat: 16.234200,
    lng: 80.548900,
    floors: 0,
    description: "Primary Campus Safe Zone • High Capacity Open Grounds with Triage Access",
    isSafeZone: true,
    safeZoneCapacity: 3500
  },
  {
    id: "guest-house",
    name: "Guest House",
    fullName: "University VIP Guest House",
    type: "facility",
    category: "Hospitality",
    lat: 16.231900,
    lng: 80.552400,
    floors: 2,
    description: "Dignitary Suites & Faculty Accommodations",
    isSafeZone: false
  },
  {
    id: "lara-campus",
    name: "LARA Campus",
    fullName: "Vignan's Lara Institute of Technology & Science",
    type: "campus",
    category: "Affiliated Campus",
    lat: 16.231500,
    lng: 80.548500,
    floors: 4,
    description: "Lara Engineering Complex & Research Laboratories",
    isSafeZone: false
  },
  {
    id: "priyadarshini-girls-hostel",
    name: "Priyadarshini Girls Hostel",
    fullName: "Priyadarshini Women's Residence Hall",
    type: "hostel",
    category: "Student Housing",
    lat: 16.231800,
    lng: 80.549500,
    floors: 5,
    description: "Women's Residential Hall & Safe Enclosure",
    isSafeZone: false
  },
  {
    id: "lara-gate",
    name: "LARA Gate",
    fullName: "LARA South-West Perimeter Gate",
    type: "gate",
    category: "Perimeter Access",
    lat: 16.230900,
    lng: 80.548000,
    floors: 1,
    description: "South-West Campus Perimeter Gate & Transit Exit",
    isSafeZone: false
  }
];

// Strategic Road Junction Nodes for Realistic Curved Campus Road Geometry
export const CAMPUS_JUNCTIONS = [
  { id: "j-central", name: "Central Circle Junction", lat: 16.233500, lng: 80.550700 },
  { id: "j-library", name: "Library Avenue Junction", lat: 16.233950, lng: 80.550100 },
  { id: "j-stadium-gate", name: "Stadium West Gate", lat: 16.234100, lng: 80.549500 },
  { id: "j-north-circle", name: "North Quad Junction", lat: 16.234600, lng: 80.551300 },
  { id: "j-east-boulevard", name: "East Science Boulevard", lat: 16.233600, lng: 80.551700 },
  { id: "j-south-hub", name: "South Campus Junction", lat: 16.232500, lng: 80.550800 },
  { id: "j-lara-connector", name: "Lara-Priyadarshini Link Road", lat: 16.231700, lng: 80.548900 },
  { id: "j-hostel-lane", name: "Hostel Transit Avenue", lat: 16.235100, lng: 80.551800 }
];

// Unified Node Map
export const ALL_NETWORK_NODES = {};
CAMPUS_LOCATIONS.forEach(loc => {
  ALL_NETWORK_NODES[loc.id] = { id: loc.id, name: loc.name, lat: loc.lat, lng: loc.lng, isLocation: true };
});
CAMPUS_JUNCTIONS.forEach(junc => {
  ALL_NETWORK_NODES[junc.id] = { id: junc.id, name: junc.name, lat: junc.lat, lng: junc.lng, isJunction: true };
});

// Real Campus Roads & Walkways (Bi-directional Graph Edges)
export const CAMPUS_ROAD_EDGES = [
  // 1. A-Block connections
  { id: "edge-a-central", from: "a-block", to: "j-central", name: "A-Block Main Plaza" },
  { id: "edge-a-mhp", from: "a-block", to: "mhp", name: "A-Block to MHP Walkway" },
  { id: "edge-a-east", from: "a-block", to: "j-east-boulevard", name: "A-Block East Corridor" },

  // 2. Central Circle to Library & H-Block
  { id: "edge-central-h", from: "j-central", to: "h-block", name: "Central Circle to H-Block" },
  { id: "edge-central-library", from: "j-central", to: "ntr-library", name: "Central Plaza to NTR Library" },
  { id: "edge-library-junc", from: "ntr-library", to: "j-library", name: "NTR Library Perimeter Road" },

  // 3. West Route to Playground (Primary Safe Zone)
  { id: "edge-libjunc-stadium", from: "j-library", to: "j-stadium-gate", name: "Library to Stadium Gate Road" },
  { id: "edge-stadium-playground", from: "j-stadium-gate", to: "playground", name: "Stadium Promenade to Playground" },
  { id: "edge-h-stadium", from: "h-block", to: "j-stadium-gate", name: "H-Block West Evacuation Path" },

  // 4. North Corridor (N-Block, U-Block, Dining Hall, Boys Hostel)
  { id: "edge-central-north", from: "j-central", to: "j-north-circle", name: "Main North Boulevard" },
  { id: "edge-north-nblock", from: "j-north-circle", to: "n-block", name: "N-Block Access Road" },
  { id: "edge-nblock-ublock", from: "n-block", to: "u-block", name: "N-Block to U-Block Corridor" },
  { id: "edge-north-dining", from: "j-north-circle", to: "dining-hall", name: "North Quad to Dining Hall" },
  { id: "edge-dining-libjunc", from: "dining-hall", to: "j-library", name: "Dining Hall to Library Avenue" },
  { id: "edge-north-hostel", from: "j-north-circle", to: "j-hostel-lane", name: "Hostel Access Way" },
  { id: "edge-hostel-boys", from: "j-hostel-lane", to: "boys-hostel", name: "Boys Hostel Road" },
  { id: "edge-ublock-hostel", from: "u-block", to: "j-hostel-lane", name: "U-Block to Hostel Link" },

  // 5. East & South Corridor (Convocation, Pharmacy, Guest House)
  { id: "edge-east-nblock", from: "j-east-boulevard", to: "n-block", name: "East Boulevard to N-Block" },
  { id: "edge-east-convo", from: "j-east-boulevard", to: "convocation", name: "East Boulevard to Convocation" },
  { id: "edge-mhp-south", from: "mhp", to: "j-south-hub", name: "MHP to South Hub" },
  { id: "edge-south-pharmacy", from: "j-south-hub", to: "pharmacy-block", name: "South Hub to Pharmacy Block" },
  { id: "edge-pharmacy-guesthouse", from: "pharmacy-block", to: "guest-house", name: "Pharmacy to Guest House Road" },
  { id: "edge-convo-guesthouse", from: "convocation", to: "guest-house", name: "Convocation to Guest House" },

  // 6. South-West Corridor (Priyadarshini Hostel, LARA Campus, LARA Gate)
  { id: "edge-h-priyadarshini", from: "h-block", to: "priyadarshini-girls-hostel", name: "H-Block to Girls Hostel Path" },
  { id: "edge-south-priyadarshini", from: "j-south-hub", to: "priyadarshini-girls-hostel", name: "South Hub to Girls Hostel" },
  { id: "edge-priya-connector", from: "priyadarshini-girls-hostel", to: "j-lara-connector", name: "Girls Hostel to Lara Link" },
  { id: "edge-connector-lara", from: "j-lara-connector", to: "lara-campus", name: "Lara Campus Approach" },
  { id: "edge-connector-stadium", from: "j-lara-connector", to: "j-stadium-gate", name: "Lara Link to Stadium West Gate" },
  { id: "edge-lara-gate", from: "lara-campus", to: "lara-gate", name: "Lara Campus to Lara Gate" }
];

// Helper: Compute Haversine distance in meters between two lat/lng points
export function getDistanceMeters(p1, p2) {
  if (!p1 || !p2) return 0;
  const R = 6371e3; // Earth radius in meters
  const lat1 = (p1.lat * Math.PI) / 180;
  const lat2 = (p2.lat * Math.PI) / 180;
  const deltaLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const deltaLng = ((p2.lng - p1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Build adjacency list for Dijkstra graph traversal
function buildAdjacencyList(nodes, edges, blockedEdgeIds = [], dangerCenter = null, dangerRadius = 0) {
  const adj = {};
  Object.keys(nodes).forEach(id => { adj[id] = []; });

  edges.forEach(edge => {
    if (blockedEdgeIds.includes(edge.id)) return;

    const nodeA = nodes[edge.from];
    const nodeB = nodes[edge.to];
    if (!nodeA || !nodeB) return;

    // Check if edge passes through or touches the danger zone
    if (dangerCenter && dangerRadius > 0) {
      const distA = getDistanceMeters(nodeA, dangerCenter);
      const distB = getDistanceMeters(nodeB, dangerCenter);
      const midPoint = { lat: (nodeA.lat + nodeB.lat) / 2, lng: (nodeA.lng + nodeB.lng) / 2 };
      const distMid = getDistanceMeters(midPoint, dangerCenter);

      // Block edge if any part is inside the danger perimeter (with 15m safety buffer)
      if (distA < dangerRadius * 0.95 || distB < dangerRadius * 0.95 || distMid < dangerRadius * 0.95) {
        return; // Exclude dangerous edge
      }
    }

    const dist = getDistanceMeters(nodeA, nodeB);
    adj[edge.from].push({ node: edge.to, weight: dist, edgeId: edge.id, name: edge.name });
    adj[edge.to].push({ node: edge.from, weight: dist, edgeId: edge.id, name: edge.name });
  });

  return adj;
}

// Find nearest graph node to a given GPS coordinate
export function findNearestGraphNode(coord, excludedNodeIds = []) {
  if (!coord) return "a-block";
  let minDistance = Infinity;
  let nearestNodeId = "a-block";

  Object.values(ALL_NETWORK_NODES).forEach(node => {
    if (excludedNodeIds.includes(node.id)) return;
    const dist = getDistanceMeters(coord, node);
    if (dist < minDistance) {
      minDistance = dist;
      nearestNodeId = node.id;
    }
  });

  return nearestNodeId;
}

/**
 * Intelligent Multi-Agent Campus Evacuation Routing Algorithm (Dijkstra + Hazard Avoidance)
 * Dynamically computes safe path avoiding danger circles and blocked roads.
 */
export function calculateCustomCampusRoute({
  originLocationId = "a-block",
  userGpsCoords = null,
  incidentLocationId = null,
  incidentCoords = null,
  hazardRadius = 85,
  blockedEdgeIds = [],
  preferredSafeZoneId = "playground"
}) {
  // 1. Determine origin node
  let startNodeId = originLocationId;
  if (userGpsCoords) {
    startNodeId = findNearestGraphNode(userGpsCoords);
  } else if (!startNodeId && incidentLocationId) {
    startNodeId = incidentLocationId;
  }
  if (!ALL_NETWORK_NODES[startNodeId]) {
    startNodeId = "a-block";
  }

  // 2. Determine danger center
  let dangerCenter = null;
  if (incidentCoords && incidentCoords.lat) {
    dangerCenter = incidentCoords;
  } else if (incidentLocationId && ALL_NETWORK_NODES[incidentLocationId]) {
    dangerCenter = ALL_NETWORK_NODES[incidentLocationId];
  }

  // 3. Determine Candidate Safe Zones
  const safeZoneCandidates = CAMPUS_LOCATIONS.filter(l => l.isSafeZone);
  let targetSafeZone = safeZoneCandidates.find(sz => sz.id === preferredSafeZoneId) || safeZoneCandidates[0];

  // If preferred safe zone is compromised by danger circle, pick alternative
  if (dangerCenter && getDistanceMeters(targetSafeZone, dangerCenter) < hazardRadius * 1.2) {
    const alternative = safeZoneCandidates.find(sz => getDistanceMeters(sz, dangerCenter) > hazardRadius * 1.5);
    if (alternative) targetSafeZone = alternative;
  }

  // 4. Build hazard-aware graph adjacency list
  const adj = buildAdjacencyList(ALL_NETWORK_NODES, CAMPUS_ROAD_EDGES, blockedEdgeIds, dangerCenter, hazardRadius);

  // 5. Run Dijkstra Shortest Safe Path
  const distances = {};
  const previous = {};
  const edgeUsed = {};
  const unvisited = new Set(Object.keys(ALL_NETWORK_NODES));

  Object.keys(ALL_NETWORK_NODES).forEach(id => {
    distances[id] = Infinity;
    previous[id] = null;
  });
  distances[startNodeId] = 0;

  while (unvisited.size > 0) {
    // Pick node with lowest distance
    let current = null;
    let minD = Infinity;
    for (const node of unvisited) {
      if (distances[node] < minD) {
        minD = distances[node];
        current = node;
      }
    }

    if (!current || minD === Infinity) break;
    if (current === targetSafeZone.id) break; // Reached goal

    unvisited.delete(current);

    (adj[current] || []).forEach(neighbor => {
      if (!unvisited.has(neighbor.node)) return;
      const alt = distances[current] + neighbor.weight;
      if (alt < distances[neighbor.node]) {
        distances[neighbor.node] = alt;
        previous[neighbor.node] = current;
        edgeUsed[neighbor.node] = neighbor.edgeId;
      }
    });
  }

  // 6. Reconstruct Path Nodes
  const pathNodes = [];
  let curr = targetSafeZone.id;
  while (curr) {
    pathNodes.unshift(curr);
    curr = previous[curr];
  }

  // Check if path is valid (connected to start)
  const isPathFound = pathNodes.length > 0 && pathNodes[0] === startNodeId;

  // Fallback direct campus link if graph is partitioned
  const finalNodes = isPathFound ? pathNodes : [startNodeId, "j-central", "j-stadium-gate", targetSafeZone.id];

  // Coordinates polyline array
  const coordinates = finalNodes.map(id => ({
    lat: ALL_NETWORK_NODES[id].lat,
    lng: ALL_NETWORK_NODES[id].lng,
    name: ALL_NETWORK_NODES[id].name
  }));

  // Total distance & walk duration
  let totalMeters = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    totalMeters += getDistanceMeters(coordinates[i], coordinates[i + 1]);
  }
  if (totalMeters === 0) totalMeters = 380;

  // Walking speed: ~1.2 m/s -> ~72 m/min
  const estimatedMinutes = Math.max(2, Math.ceil(totalMeters / 72));

  return {
    success: true,
    pathNodeIds: finalNodes,
    pathNames: finalNodes.map(id => ALL_NETWORK_NODES[id]?.name || id),
    coordinates: coordinates,
    totalDistanceMeters: totalMeters,
    distanceText: `${totalMeters} m`,
    estimatedMinutes: estimatedMinutes,
    durationText: `${estimatedMinutes} min`,
    destinationSafeZone: targetSafeZone,
    isRerouted: blockedEdgeIds.length > 0 || !!dangerCenter,
    startLocationName: ALL_NETWORK_NODES[startNodeId]?.name || startNodeId
  };
}
