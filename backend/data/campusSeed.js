// Campus Sentinel AI - Campus Digital Twin Seed Data
// Realistic Campus: "Apex Institute of Technology & Research Campus"
// Centered around: Lat 37.7765, Lng -122.4175 (Metric calibrated bounding grid)

export const CAMPUS_CENTER = { lat: 37.7765, lng: -122.4175 };

export const BUILDINGS = [
  {
    id: "B-01",
    name: "Main Academic Block",
    code: "MAB",
    category: "Academic",
    floors: 4,
    occupancy: 620,
    maxCapacity: 850,
    riskLevel: "NORMAL",
    lat: 37.7772,
    lng: -122.4182,
    polygon: [
      [37.7776, -122.4187],
      [37.7776, -122.4177],
      [37.7768, -122.4177],
      [37.7768, -122.4187]
    ],
    exits: ["N-01", "N-02", "N-03", "N-04"],
    suppressionSystem: "Sprinkler & Dry Powder Automatics",
    powerGridZone: "Grid-North-1",
    gasValveZone: "GV-01"
  },
  {
    id: "B-02",
    name: "Computer Science & AI Complex",
    code: "CSE",
    category: "Academic / Lab",
    floors: 5,
    occupancy: 430,
    maxCapacity: 600,
    riskLevel: "NORMAL",
    lat: 37.7781,
    lng: -122.4168,
    polygon: [
      [37.7785, -122.4173],
      [37.7785, -122.4163],
      [37.7777, -122.4163],
      [37.7777, -122.4173]
    ],
    exits: ["N-05", "N-06"],
    suppressionSystem: "FM200 Clean Gas (Server Rooms)",
    powerGridZone: "Grid-North-2",
    gasValveZone: "GV-02"
  },
  {
    id: "B-03",
    name: "Central Science Library",
    code: "LIB",
    category: "Library",
    floors: 3,
    occupancy: 280,
    maxCapacity: 500,
    riskLevel: "NORMAL",
    lat: 37.7765,
    lng: -122.4162,
    polygon: [
      [37.7769, -122.4167],
      [37.7769, -122.4157],
      [37.7761, -122.4157],
      [37.7761, -122.4167]
    ],
    exits: ["N-07", "N-08"],
    suppressionSystem: "Aerosol & Water Mist",
    powerGridZone: "Grid-Central-1",
    gasValveZone: "GV-03"
  },
  {
    id: "B-04",
    name: "Advanced Engineering Wing",
    code: "ENG",
    category: "Engineering / Workshops",
    floors: 3,
    occupancy: 350,
    maxCapacity: 480,
    riskLevel: "NORMAL",
    lat: 37.7758,
    lng: -122.4190,
    polygon: [
      [37.7762, -122.4195],
      [37.7762, -122.4185],
      [37.7754, -122.4185],
      [37.7754, -122.4195]
    ],
    exits: ["N-09", "N-10"],
    suppressionSystem: "CO2 Total Flooding & Foam",
    powerGridZone: "Grid-West-1",
    gasValveZone: "GV-04"
  },
  {
    id: "B-05",
    name: "Student Activity Center & Cafeteria",
    code: "SAC",
    category: "Recreation",
    floors: 2,
    occupancy: 510,
    maxCapacity: 750,
    riskLevel: "NORMAL",
    lat: 37.7754,
    lng: -122.4173,
    polygon: [
      [37.7758, -122.4178],
      [37.7758, -122.4168],
      [37.7750, -122.4168],
      [37.7750, -122.4178]
    ],
    exits: ["N-11", "N-12", "N-13"],
    suppressionSystem: "Kitchen Hood Wet Chemical + Sprinklers",
    powerGridZone: "Grid-South-1",
    gasValveZone: "GV-05"
  },
  {
    id: "B-06",
    name: "Biotechnology & Research Labs",
    code: "BIO",
    category: "Research / Labs",
    floors: 4,
    occupancy: 190,
    maxCapacity: 300,
    riskLevel: "NORMAL",
    lat: 37.7770,
    lng: -122.4198,
    polygon: [
      [37.7774, -122.4203],
      [37.7774, -122.4193],
      [37.7766, -122.4193],
      [37.7766, -122.4203]
    ],
    exits: ["N-14", "N-15"],
    suppressionSystem: "Specialized Halon Alternate + Hazmat Lockers",
    powerGridZone: "Grid-West-2",
    gasValveZone: "GV-06"
  },
  {
    id: "B-07",
    name: "Campus Health & Medical Center",
    code: "MED",
    category: "Medical",
    floors: 2,
    occupancy: 60,
    maxCapacity: 150,
    riskLevel: "NORMAL",
    lat: 37.7748,
    lng: -122.4158,
    polygon: [
      [37.7752, -122.4163],
      [37.7752, -122.4153],
      [37.7744, -122.4153],
      [37.7744, -122.4163]
    ],
    exits: ["N-16", "N-17"],
    suppressionSystem: "Standard Wet Sprinkler",
    powerGridZone: "Grid-East-1",
    gasValveZone: "GV-07"
  },
  {
    id: "B-08",
    name: "Security Command Headquarters",
    code: "SEC",
    category: "Operations",
    floors: 2,
    occupancy: 40,
    maxCapacity: 80,
    riskLevel: "NORMAL",
    lat: 37.7788,
    lng: -122.4185,
    polygon: [
      [37.7791, -122.4189],
      [37.7791, -122.4181],
      [37.7785, -122.4181],
      [37.7785, -122.4189]
    ],
    exits: ["N-18"],
    suppressionSystem: "Clean Agent Suppression",
    powerGridZone: "Grid-North-HQ",
    gasValveZone: "GV-08"
  },
  {
    id: "B-09",
    name: "North Residential Hall (Dorm Alpha)",
    code: "DORM-A",
    category: "Residential",
    floors: 6,
    occupancy: 480,
    maxCapacity: 550,
    riskLevel: "NORMAL",
    lat: 37.7792,
    lng: -122.4162,
    polygon: [
      [37.7796, -122.4167],
      [37.7796, -122.4157],
      [37.7788, -122.4157],
      [37.7788, -122.4167]
    ],
    exits: ["N-19", "N-20"],
    suppressionSystem: "Residential Sprinklers",
    powerGridZone: "Grid-North-3",
    gasValveZone: "GV-09"
  },
  {
    id: "B-10",
    name: "South Residential Hall (Dorm Beta)",
    code: "DORM-B",
    category: "Residential",
    floors: 6,
    occupancy: 420,
    maxCapacity: 500,
    riskLevel: "NORMAL",
    lat: 37.7742,
    lng: -122.4180,
    polygon: [
      [37.7746, -122.4185],
      [37.7746, -122.4175],
      [37.7738, -122.4175],
      [37.7738, -122.4185]
    ],
    exits: ["N-21", "N-22"],
    suppressionSystem: "Residential Sprinklers",
    powerGridZone: "Grid-South-2",
    gasValveZone: "GV-10"
  },
  {
    id: "B-11",
    name: "Indoor Sports Arena & Gymnasium",
    code: "GYM",
    category: "Recreation",
    floors: 2,
    occupancy: 200,
    maxCapacity: 600,
    riskLevel: "NORMAL",
    lat: 37.7745,
    lng: -122.4195,
    polygon: [
      [37.7749, -122.4200],
      [37.7749, -122.4190],
      [37.7741, -122.4190],
      [37.7741, -122.4200]
    ],
    exits: ["N-23", "N-24"],
    suppressionSystem: "High-Bay Deluge Sprinklers",
    powerGridZone: "Grid-West-3",
    gasValveZone: "GV-11"
  },
  {
    id: "B-12",
    name: "Administration & Visitor Hub",
    code: "ADM",
    category: "Administration",
    floors: 3,
    occupancy: 140,
    maxCapacity: 250,
    riskLevel: "NORMAL",
    lat: 37.7778,
    lng: -122.4150,
    polygon: [
      [37.7782, -122.4155],
      [37.7782, -122.4145],
      [37.7774, -122.4145],
      [37.7774, -122.4155]
    ],
    exits: ["N-25", "N-26"],
    suppressionSystem: "Wet Sprinkler System",
    powerGridZone: "Grid-East-2",
    gasValveZone: "GV-12"
  }
];

export const ASSEMBLY_POINTS = [
  {
    id: "AP-A",
    name: "North Athletic Ground (Zone A)",
    lat: 37.7798,
    lng: -122.4178,
    capacity: 1200,
    currentOccupancy: 120,
    status: "OPEN",
    nearestNode: "N-30",
    medicalTriageAvailable: true,
    shelterType: "Open Field"
  },
  {
    id: "AP-B",
    name: "Central Quadrangle Green (Zone B)",
    lat: 37.7766,
    lng: -122.4175,
    capacity: 800,
    currentOccupancy: 260,
    status: "RECOMMENDED",
    nearestNode: "N-00",
    medicalTriageAvailable: true,
    shelterType: "Open Park"
  },
  {
    id: "AP-C",
    name: "South Amphitheatre Plaza (Zone C)",
    lat: 37.7738,
    lng: -122.4165,
    capacity: 950,
    currentOccupancy: 80,
    status: "OPEN",
    nearestNode: "N-31",
    medicalTriageAvailable: true,
    shelterType: "Stone Plaza"
  },
  {
    id: "AP-D",
    name: "East Parking Complex Safe Zone (Zone D)",
    lat: 37.7768,
    lng: -122.4142,
    capacity: 700,
    currentOccupancy: 40,
    status: "OPEN",
    nearestNode: "N-32",
    medicalTriageAvailable: false,
    shelterType: "Clear Perimeter Lot"
  },
  {
    id: "AP-E",
    name: "West Sports Field (Zone E)",
    lat: 37.7760,
    lng: -122.4208,
    capacity: 1000,
    currentOccupancy: 110,
    status: "OPEN",
    nearestNode: "N-33",
    medicalTriageAvailable: true,
    shelterType: "Turf Field"
  }
];

export const CAMERAS = [
  {
    id: "CAM-01",
    name: "Main Academic Block - Ground Atrium",
    buildingId: "B-01",
    location: "Main Academic Block (Ground Floor)",
    lat: 37.7771,
    lng: -122.4184,
    status: "MONITORING",
    fps: 30,
    resolution: "1080p",
    fovAngle: 90,
    orientation: 135,
    aiConfidence: 0,
    currentRisk: "NORMAL",
    lastAnalyzed: new Date().toISOString(),
    isWebcamFeed: false
  },
  {
    id: "CAM-02",
    name: "Main Academic Block - 2nd Floor Corridor (Primary Demo)",
    buildingId: "B-01",
    location: "Main Academic Block (Floor 2 Corridor)",
    lat: 37.7773,
    lng: -122.4181,
    status: "MONITORING",
    fps: 30,
    resolution: "1080p HD",
    fovAngle: 110,
    orientation: 220,
    aiConfidence: 0,
    currentRisk: "NORMAL",
    lastAnalyzed: new Date().toISOString(),
    isWebcamFeed: true
  },
  {
    id: "CAM-03",
    name: "CSE & AI Complex - Server Core",
    buildingId: "B-02",
    location: "Computer Science Complex (Level 1 Server Hall)",
    lat: 37.7780,
    lng: -122.4169,
    status: "MONITORING",
    fps: 30,
    resolution: "4K UHD",
    fovAngle: 85,
    orientation: 45,
    aiConfidence: 0,
    currentRisk: "NORMAL",
    lastAnalyzed: new Date().toISOString(),
    isWebcamFeed: false
  },
  {
    id: "CAM-04",
    name: "Central Science Library - West Wing",
    buildingId: "B-03",
    location: "Central Library (Reading Hall 2)",
    lat: 37.7766,
    lng: -122.4163,
    status: "MONITORING",
    fps: 25,
    resolution: "1080p",
    fovAngle: 95,
    orientation: 270,
    aiConfidence: 0,
    currentRisk: "NORMAL",
    lastAnalyzed: new Date().toISOString(),
    isWebcamFeed: false
  },
  {
    id: "CAM-05",
    name: "Student Activity Center - Dining Promenade",
    buildingId: "B-05",
    location: "Student Activity Center (Food Court)",
    lat: 37.7753,
    lng: -122.4174,
    status: "MONITORING",
    fps: 30,
    resolution: "1080p",
    fovAngle: 120,
    orientation: 0,
    aiConfidence: 0,
    currentRisk: "NORMAL",
    lastAnalyzed: new Date().toISOString(),
    isWebcamFeed: false
  },
  {
    id: "CAM-06",
    name: "Gate 1 Main Entrance & Checkpoint",
    buildingId: "B-08",
    location: "North Campus Gateway (Gate 1)",
    lat: 37.7794,
    lng: -122.4184,
    status: "MONITORING",
    fps: 30,
    resolution: "4K UHD",
    fovAngle: 130,
    orientation: 180,
    aiConfidence: 0,
    currentRisk: "NORMAL",
    lastAnalyzed: new Date().toISOString(),
    isWebcamFeed: false
  },
  {
    id: "CAM-07",
    name: "Central Quad North Walkway",
    buildingId: "B-01",
    location: "Central Quadrangle Walkway",
    lat: 37.7769,
    lng: -122.4175,
    status: "MONITORING",
    fps: 30,
    resolution: "1080p",
    fovAngle: 100,
    orientation: 90,
    aiConfidence: 0,
    currentRisk: "NORMAL",
    lastAnalyzed: new Date().toISOString(),
    isWebcamFeed: false
  },
  {
    id: "CAM-08",
    name: "Engineering Wing - Materials Lab",
    buildingId: "B-04",
    location: "Advanced Engineering (Workshop Bay 3)",
    lat: 37.7759,
    lng: -122.4189,
    status: "MONITORING",
    fps: 30,
    resolution: "1080p",
    fovAngle: 90,
    orientation: 315,
    aiConfidence: 0,
    currentRisk: "NORMAL",
    lastAnalyzed: new Date().toISOString(),
    isWebcamFeed: false
  }
];

export const RESOURCES = {
  security: [
    {
      id: "S-01",
      name: "Alpha Patrol Unit",
      type: "SECURITY",
      officer: "Officer Marcus Vance",
      lat: 37.7790,
      lng: -122.4175,
      status: "AVAILABLE",
      equipment: ["Radio", "Bodycam", "AED Defibrillator", "First-Aid Pack"],
      assignedIncidentId: null,
      currentNode: "N-30",
      etaSeconds: 0
    },
    {
      id: "S-02",
      name: "Bravo Guard Team",
      type: "SECURITY",
      officer: "Officer Elena Rostova",
      lat: 37.7777,
      lng: -122.4149,
      status: "PATROLLING",
      equipment: ["Radio", "Crowd Control Barrier Kit", "Flashlight"],
      assignedIncidentId: null,
      currentNode: "N-25",
      etaSeconds: 0
    },
    {
      id: "S-03",
      name: "Charlie Response Squad",
      type: "SECURITY",
      officer: "Officer Darius King",
      lat: 37.7752,
      lng: -122.4172,
      status: "AVAILABLE",
      equipment: ["Tactical Vest", "Thermal Scanner", "Radio", "Megaphone"],
      assignedIncidentId: null,
      currentNode: "N-11",
      etaSeconds: 0
    },
    {
      id: "S-04",
      name: "Delta Rapid Response Team",
      type: "SECURITY",
      officer: "Lead Sgt. Sarah Chen",
      lat: 37.7770,
      lng: -122.4180,
      status: "AVAILABLE",
      equipment: ["Emergency Breach Gear", "Respirator", "High-Power Megaphone", "Hazmat Radios"],
      assignedIncidentId: null,
      currentNode: "N-01",
      etaSeconds: 0
    },
    {
      id: "S-05",
      name: "Echo Residential Patrol",
      type: "SECURITY",
      officer: "Officer Jamal Washington",
      lat: 37.7791,
      lng: -122.4161,
      status: "AVAILABLE",
      equipment: ["Radio", "First-Aid Bag"],
      assignedIncidentId: null,
      currentNode: "N-19",
      etaSeconds: 0
    },
    {
      id: "S-06",
      name: "Foxtrot Workshop Security",
      type: "SECURITY",
      officer: "Officer Liam O'Connor",
      lat: 37.7756,
      lng: -122.4191,
      status: "BUSY",
      equipment: ["Radio", "Extinguisher", "Safety Goggles"],
      assignedIncidentId: null,
      currentNode: "N-09",
      etaSeconds: 0
    },
    {
      id: "S-07",
      name: "Golf Gate Perimeter Guard",
      type: "SECURITY",
      officer: "Officer Priya Patel",
      lat: 37.7739,
      lng: -122.4179,
      status: "AVAILABLE",
      equipment: ["Radio", "Spike Strip", "Traffic Cones"],
      assignedIncidentId: null,
      currentNode: "N-21",
      etaSeconds: 0
    },
    {
      id: "S-08",
      name: "Hotel K9 Search & Rescue",
      type: "SECURITY",
      officer: "Handler Miller & K9 'Thor'",
      lat: 37.7761,
      lng: -122.4206,
      status: "AVAILABLE",
      equipment: ["Search Harness", "Thermal Tracker", "Trauma Kit"],
      assignedIncidentId: null,
      currentNode: "N-33",
      etaSeconds: 0
    }
  ],
  medical: [
    {
      id: "M-01",
      name: "Trauma Response Team Alpha",
      type: "MEDICAL",
      lead: "Dr. Karen Thorne (Trauma MD)",
      lat: 37.7749,
      lng: -122.4159,
      status: "AVAILABLE",
      triageCapacity: 12,
      equipment: ["Defibrillator", "Oxygen Kits", "Burn Trauma Kit", "IV Fluids"],
      assignedIncidentId: null,
      currentNode: "N-16"
    },
    {
      id: "M-02",
      name: "Sports Clinic First Aid Bravo",
      type: "MEDICAL",
      lead: "Nurse Practitioner Tyler Ross",
      lat: 37.7744,
      lng: -122.4193,
      status: "BUSY",
      triageCapacity: 6,
      equipment: ["Splints", "Standard First Aid", "Stretcher"],
      assignedIncidentId: null,
      currentNode: "N-23"
    },
    {
      id: "M-03",
      name: "Rapid EMT Squad Charlie",
      type: "MEDICAL",
      lead: "Paramedic Jordan Lee",
      lat: 37.7764,
      lng: -122.4173,
      status: "AVAILABLE",
      triageCapacity: 8,
      equipment: ["Advanced Airway Kit", "Burn Gel Dressing", "Mobile EKG", "Extrication Board"],
      assignedIncidentId: null,
      currentNode: "N-00"
    },
    {
      id: "M-04",
      name: "Field Medic Squad Delta",
      type: "MEDICAL",
      lead: "EMT Samantha Wright",
      lat: 37.7790,
      lng: -122.4163,
      status: "AVAILABLE",
      triageCapacity: 5,
      equipment: ["Portable Oxygen", "Triage Tarps", "Bleeding Control Kits"],
      assignedIncidentId: null,
      currentNode: "N-19"
    }
  ],
  ambulances: [
    {
      id: "A-01",
      name: "Campus Mobile ICU Ambulance 01",
      type: "AMBULANCE",
      lat: 37.7747,
      lng: -122.4156,
      status: "AVAILABLE",
      crew: ["Driver Dave", "Paramedic Scott"],
      patientCapacity: 2,
      icuEquipped: true,
      currentNode: "N-16",
      etaSeconds: 0
    },
    {
      id: "A-02",
      name: "Rapid Response Ambulance 02",
      type: "AMBULANCE",
      lat: 37.7770,
      lng: -122.4143,
      status: "AVAILABLE",
      crew: ["Driver Alex", "Paramedic Mia"],
      patientCapacity: 2,
      icuEquipped: true,
      currentNode: "N-32",
      etaSeconds: 0
    },
    {
      id: "A-03",
      name: "Critical Care Transport 03",
      type: "AMBULANCE",
      lat: 37.7795,
      lng: -122.4182,
      status: "AVAILABLE",
      crew: ["Driver Ray", "Paramedic Ben"],
      patientCapacity: 1,
      icuEquipped: true,
      currentNode: "N-30",
      etaSeconds: 0
    },
    {
      id: "A-04",
      name: "Auxiliary Medical Van 04",
      type: "AMBULANCE",
      lat: 37.7737,
      lng: -122.4163,
      status: "AVAILABLE",
      crew: ["Driver Sam", "EMT Chloe"],
      patientCapacity: 3,
      icuEquipped: false,
      currentNode: "N-31",
      etaSeconds: 0
    }
  ],
  fireSafety: [
    {
      id: "FSU-01",
      name: "Depot Mini Fire Tender 01",
      type: "FIRE_SAFETY",
      lat: 37.7786,
      lng: -122.4187,
      status: "AVAILABLE",
      waterCapacityLitres: 1500,
      foamAvailable: true,
      crewSize: 3,
      currentNode: "N-18"
    },
    {
      id: "FSU-02",
      name: "Engineering Rapid Extinguisher Cannon",
      type: "FIRE_SAFETY",
      lat: 37.7757,
      lng: -122.4194,
      status: "BUSY",
      waterCapacityLitres: 800,
      foamAvailable: true,
      crewSize: 2,
      currentNode: "N-09"
    },
    {
      id: "FSU-03",
      name: "Central Quad Quick Fire Unit 03",
      type: "FIRE_SAFETY",
      lat: 37.7767,
      lng: -122.4179,
      status: "AVAILABLE",
      waterCapacityLitres: 2000,
      foamAvailable: true,
      crewSize: 4,
      currentNode: "N-01"
    },
    {
      id: "FSU-04",
      name: "Bio-Hazmat Containment Tender 04",
      type: "FIRE_SAFETY",
      lat: 37.7772,
      lng: -122.4201,
      status: "AVAILABLE",
      waterCapacityLitres: 1000,
      foamAvailable: true,
      chemicalNeutralizer: true,
      crewSize: 3,
      currentNode: "N-14"
    },
    {
      id: "FSU-05",
      name: "East Perimeter Foam Response Unit 05",
      type: "FIRE_SAFETY",
      lat: 37.7766,
      lng: -122.4140,
      status: "AVAILABLE",
      waterCapacityLitres: 1200,
      foamAvailable: true,
      crewSize: 2,
      currentNode: "N-32"
    }
  ],
  transitVehicles: [
    {
      id: "V-01",
      name: "Campus Electric Evac Shuttle 01",
      type: "TRANSIT",
      lat: 37.7797,
      lng: -122.4176,
      status: "AVAILABLE",
      passengerCapacity: 24,
      currentNode: "N-30"
    },
    {
      id: "V-02",
      name: "Campus Electric Evac Shuttle 02",
      type: "TRANSIT",
      lat: 37.7739,
      lng: -122.4168,
      status: "AVAILABLE",
      passengerCapacity: 24,
      currentNode: "N-31"
    }
  ]
};

// Complete Campus Navigation Graph (Nodes and Edges)
// Nodes: Key intersections, gates, building entrances, and assembly areas
export const GRAPH_NODES = {
  "N-00": { id: "N-00", name: "Central Quad Hub", lat: 37.7766, lng: -122.4175, type: "HUB" },
  "N-01": { id: "N-01", name: "Main Academic - South Exit", lat: 37.7768, lng: -122.4182, type: "EXIT" },
  "N-02": { id: "N-02", name: "Main Academic - North Exit", lat: 37.7776, lng: -122.4182, type: "EXIT" },
  "N-03": { id: "N-03", name: "Main Academic - West Exit", lat: 37.7772, lng: -122.4187, type: "EXIT" },
  "N-04": { id: "N-04", name: "Main Academic - East Promenade Exit", lat: 37.7772, lng: -122.4177, type: "EXIT" },
  
  "N-05": { id: "N-05", name: "CSE Complex - South Entrance", lat: 37.7777, lng: -122.4168, type: "EXIT" },
  "N-06": { id: "N-06", name: "CSE Complex - North Plaza Exit", lat: 37.7785, lng: -122.4168, type: "EXIT" },

  "N-07": { id: "N-07", name: "Library - West Entrance", lat: 37.7765, lng: -122.4167, type: "EXIT" },
  "N-08": { id: "N-08", name: "Library - East Exit", lat: 37.7765, lng: -122.4157, type: "EXIT" },

  "N-09": { id: "N-09", name: "Engineering - North Entrance", lat: 37.7762, lng: -122.4190, type: "EXIT" },
  "N-10": { id: "N-10", name: "Engineering - South Bay Exit", lat: 37.7754, lng: -122.4190, type: "EXIT" },

  "N-11": { id: "N-11", name: "Student Activity - North Plaza", lat: 37.7758, lng: -122.4173, type: "EXIT" },
  "N-12": { id: "N-12", name: "Student Activity - South Lawn", lat: 37.7750, lng: -122.4173, type: "EXIT" },
  "N-13": { id: "N-13", name: "Student Activity - East Cafe Walk", lat: 37.7754, lng: -122.4168, type: "EXIT" },

  "N-14": { id: "N-14", name: "Bio Labs - Main Entrance", lat: 37.7770, lng: -122.4193, type: "EXIT" },
  "N-15": { id: "N-15", name: "Bio Labs - West Emergency Exit", lat: 37.7770, lng: -122.4203, type: "EXIT" },

  "N-16": { id: "N-16", name: "Health Center - Ambulance Bay", lat: 37.7748, lng: -122.4158, type: "MEDICAL_BAY" },
  "N-17": { id: "N-17", name: "Health Center - Walk-in Clinic", lat: 37.7752, lng: -122.4158, type: "EXIT" },

  "N-18": { id: "N-18", name: "Security HQ Dispatch Bay", lat: 37.7788, lng: -122.4185, type: "SECURITY_POST" },

  "N-19": { id: "N-19", name: "Dorm Alpha - Main Lobby", lat: 37.7788, lng: -122.4162, type: "EXIT" },
  "N-20": { id: "N-20", name: "Dorm Alpha - North Gate Exit", lat: 37.7796, lng: -122.4162, type: "EXIT" },

  "N-21": { id: "N-21", name: "Dorm Beta - North Entry", lat: 37.7746, lng: -122.4180, type: "EXIT" },
  "N-22": { id: "N-22", name: "Dorm Beta - South Gate Exit", lat: 37.7738, lng: -122.4180, type: "EXIT" },

  "N-23": { id: "N-23", name: "Gymnasium - North Lobby", lat: 37.7749, lng: -122.4195, type: "EXIT" },
  "N-24": { id: "N-24", name: "Gymnasium - South Exit", lat: 37.7741, lng: -122.4195, type: "EXIT" },

  "N-25": { id: "N-25", name: "Admin Building - West Plaza", lat: 37.7778, lng: -122.4155, type: "EXIT" },
  "N-26": { id: "N-26", name: "Admin Building - East Visitor Gate", lat: 37.7778, lng: -122.4145, type: "EXIT" },

  // Key Junctions and Assembly Points
  "N-30": { id: "N-30", name: "North Gate 1 & Athletic Staging", lat: 37.7798, lng: -122.4178, type: "ASSEMBLY_A" },
  "N-31": { id: "N-31", name: "South Gate 2 & Amphitheatre", lat: 37.7738, lng: -122.4165, type: "ASSEMBLY_C" },
  "N-32": { id: "N-32", name: "East Gate 3 & Parking Zone", lat: 37.7768, lng: -122.4142, type: "ASSEMBLY_D" },
  "N-33": { id: "N-33", name: "West Gate 4 & Sports Ground", lat: 37.7760, lng: -122.4208, type: "ASSEMBLY_E" },

  // Intersections / Pathways
  "N-40": { id: "N-40", name: "North Academic Crossway", lat: 37.7780, lng: -122.4182, type: "CROSSWAY" },
  "N-41": { id: "N-41", name: "North-East Quad Intersection", lat: 37.7774, lng: -122.4162, type: "CROSSWAY" },
  "N-42": { id: "N-42", name: "West Science Lane Intersection", lat: 37.7764, lng: -122.4190, type: "CROSSWAY" },
  "N-43": { id: "N-43", name: "South Promenade Intersection", lat: 37.7754, lng: -122.4180, type: "CROSSWAY" },
  "N-44": { id: "N-44", name: "East Library Boulevard", lat: 37.7758, lng: -122.4150, type: "ROAD" },
  "N-45": { id: "N-45", name: "North Perimeter Ring Road", lat: 37.7792, lng: -122.4175, type: "ROAD" },
  "N-46": { id: "N-46", name: "South Perimeter Service Road", lat: 37.7740, lng: -122.4172, type: "ROAD" },
  "N-47": { id: "N-47", name: "West Campus Perimeter Avenue", lat: 37.7768, lng: -122.4205, type: "ROAD" }
};

// Graph Edges (with road attributes, distances in meters, and block status)
export const GRAPH_EDGES = [
  // Hub Connections
  { id: "E-01", from: "N-00", to: "N-01", distance: 70, isRoad: false, isPath: true, isBlocked: false, name: "Quad to Academic South" },
  { id: "E-02", from: "N-00", to: "N-04", distance: 75, isRoad: false, isPath: true, isBlocked: false, name: "Quad to Academic East" },
  { id: "E-03", from: "N-00", to: "N-07", distance: 75, isRoad: false, isPath: true, isBlocked: false, name: "Quad to Library West" },
  { id: "E-04", from: "N-00", to: "N-11", distance: 90, isRoad: false, isPath: true, isBlocked: false, name: "Quad to Student Activity" },
  { id: "E-05", from: "N-00", to: "N-42", distance: 130, isRoad: true, isPath: true, isBlocked: false, name: "Quad Central Avenue West" },
  { id: "E-06", from: "N-00", to: "N-41", distance: 140, isRoad: true, isPath: true, isBlocked: false, name: "Quad Central Avenue East" },

  // Academic Block Connections
  { id: "E-07", from: "N-01", to: "N-43", distance: 155, isRoad: true, isPath: true, isBlocked: false, name: "Academic South Main Road" },
  { id: "E-08", from: "N-02", to: "N-40", distance: 50, isRoad: true, isPath: true, isBlocked: false, name: "Academic North Lane" },
  { id: "E-09", from: "N-03", to: "N-14", distance: 60, isRoad: false, isPath: true, isBlocked: false, name: "Academic-Bio Connector Walkway" },
  { id: "E-10", from: "N-04", to: "N-41", distance: 135, isRoad: true, isPath: true, isBlocked: false, name: "Academic East Road" },

  // North Sector Connections
  { id: "E-11", from: "N-40", to: "N-18", distance: 95, isRoad: true, isPath: true, isBlocked: false, name: "Security HQ Service Way" },
  { id: "E-12", from: "N-40", to: "N-45", distance: 140, isRoad: true, isPath: true, isBlocked: false, name: "North Gateway Connector" },
  { id: "E-13", from: "N-45", to: "N-30", distance: 75, isRoad: true, isPath: true, isBlocked: false, name: "North Gate 1 Ringway" },
  { id: "E-14", from: "N-45", to: "N-20", distance: 120, isRoad: true, isPath: true, isBlocked: false, name: "North Dorm Access Road" },
  { id: "E-15", from: "N-18", to: "N-30", distance: 125, isRoad: true, isPath: true, isBlocked: false, name: "HQ to Assembly A" },

  // CSE Block Connections
  { id: "E-16", from: "N-05", to: "N-41", distance: 65, isRoad: true, isPath: true, isBlocked: false, name: "CSE South Lane" },
  { id: "E-17", from: "N-06", to: "N-19", distance: 60, isRoad: false, isPath: true, isBlocked: false, name: "CSE-Dorm Walkway" },
  { id: "E-18", from: "N-19", to: "N-20", distance: 90, isRoad: false, isPath: true, isBlocked: false, name: "Dorm Alpha Perimeter Path" },
  { id: "E-19", from: "N-06", to: "N-45", distance: 100, isRoad: true, isPath: true, isBlocked: false, name: "CSE North Road" },

  // East Sector / Admin & Library
  { id: "E-20", from: "N-41", to: "N-25", distance: 80, isRoad: true, isPath: true, isBlocked: false, name: "Admin Plaza Lane" },
  { id: "E-21", from: "N-25", to: "N-26", distance: 90, isRoad: true, isPath: true, isBlocked: false, name: "Admin Driveway" },
  { id: "E-22", from: "N-26", to: "N-32", distance: 115, isRoad: true, isPath: true, isBlocked: false, name: "East Gate 3 Main Access" },
  { id: "E-23", from: "N-07", to: "N-08", distance: 90, isRoad: false, isPath: true, isBlocked: false, name: "Library Gallery Walk" },
  { id: "E-24", from: "N-08", to: "N-44", distance: 100, isRoad: true, isPath: true, isBlocked: false, name: "Library East Boulevard" },
  { id: "E-25", from: "N-44", to: "N-32", distance: 130, isRoad: true, isPath: true, isBlocked: false, name: "East Ring Road" },
  { id: "E-26", from: "N-44", to: "N-17", distance: 95, isRoad: true, isPath: true, isBlocked: false, name: "Medical Center East Access" },

  // South Sector & Health Center
  { id: "E-27", from: "N-16", to: "N-17", distance: 45, isRoad: true, isPath: true, isBlocked: false, name: "Ambulance Bay Run" },
  { id: "E-28", from: "N-16", to: "N-46", distance: 135, isRoad: true, isPath: true, isBlocked: false, name: "Medical South Link" },
  { id: "E-29", from: "N-17", to: "N-13", distance: 95, isRoad: false, isPath: true, isBlocked: false, name: "Health Center - Cafeteria Walk" },
  { id: "E-30", from: "N-11", to: "N-12", distance: 90, isRoad: false, isPath: true, isBlocked: false, name: "SAC Promenade" },
  { id: "E-31", from: "N-12", to: "N-46", distance: 110, isRoad: true, isPath: true, isBlocked: false, name: "SAC South Link Road" },
  { id: "E-32", from: "N-46", to: "N-31", distance: 65, isRoad: true, isPath: true, isBlocked: false, name: "Gate 2 Amphitheatre Staging" },
  { id: "E-33", from: "N-21", to: "N-22", distance: 90, isRoad: false, isPath: true, isBlocked: false, name: "Dorm Beta Garden Path" },
  { id: "E-34", from: "N-22", to: "N-46", distance: 75, isRoad: true, isPath: true, isBlocked: false, name: "Dorm Beta South Road" },

  // West Sector & Engineering / Bio / Gym
  { id: "E-35", from: "N-42", to: "N-09", distance: 40, isRoad: true, isPath: true, isBlocked: false, name: "Engineering North Way" },
  { id: "E-36", from: "N-09", to: "N-10", distance: 90, isRoad: false, isPath: true, isBlocked: false, name: "Engineering Internal Arcade" },
  { id: "E-37", from: "N-10", to: "N-43", distance: 110, isRoad: true, isPath: true, isBlocked: false, name: "Engineering South Lane" },
  { id: "E-38", from: "N-43", to: "N-21", distance: 90, isRoad: true, isPath: true, isBlocked: false, name: "South Dorm North Link" },
  { id: "E-39", from: "N-43", to: "N-23", distance: 145, isRoad: true, isPath: true, isBlocked: false, name: "Sports Arena West Path" },
  { id: "E-40", from: "N-23", to: "N-24", distance: 90, isRoad: false, isPath: true, isBlocked: false, name: "Gym Complex Walk" },
  { id: "E-41", from: "N-24", to: "N-46", distance: 120, isRoad: true, isPath: true, isBlocked: false, name: "Gym South Road" },
  { id: "E-42", from: "N-14", to: "N-15", distance: 90, isRoad: false, isPath: true, isBlocked: false, name: "Bio Research Corridor" },
  { id: "E-43", from: "N-15", to: "N-47", distance: 40, isRoad: true, isPath: true, isBlocked: false, name: "Bio West Loading Dock" },
  { id: "E-44", from: "N-47", to: "N-33", distance: 95, isRoad: true, isPath: true, isBlocked: false, name: "West Gate 4 Sports Avenue" },
  { id: "E-45", from: "N-42", to: "N-47", distance: 140, isRoad: true, isPath: true, isBlocked: false, name: "West Science Lane" },
  { id: "E-46", from: "N-47", to: "N-18", distance: 230, isRoad: true, isPath: true, isBlocked: false, name: "North-West Security Perimeter Road" }
];
