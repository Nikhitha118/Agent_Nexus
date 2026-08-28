// Campus Sentinel AI - Vignan University Campus Digital Twin Seed Data
// Vignan's Foundation for Science, Technology & Research (VFSTR), Vadlamudi, Guntur (16.233200, 80.549000)

export const CAMPUS_CENTER = { lat: 16.233200, lng: 80.549000 };

export const BUILDINGS = [
  {
    id: "a-block",
    name: "A-Block",
    code: "A-BLOCK",
    category: "Academic / Administration",
    floors: 4,
    occupancy: 620,
    maxCapacity: 850,
    riskLevel: "NORMAL",
    lat: 16.232529,
    lng: 80.547941,
    exits: ["Exit-A1", "Exit-A2", "Exit-A3"],
    suppressionSystem: "Sprinkler & Clean Agent Matrix"
  },
  {
    id: "h-block",
    name: "H-Block",
    code: "H-BLOCK",
    category: "Academic",
    floors: 4,
    occupancy: 410,
    maxCapacity: 600,
    riskLevel: "NORMAL",
    lat: 16.232775,
    lng: 80.547798,
    exits: ["Exit-H1", "Exit-H2"],
    suppressionSystem: "Sprinkler & Dry Powder"
  },
  {
    id: "ntr-library",
    name: "NTR Library",
    code: "NTR-LIB",
    category: "Library",
    floors: 3,
    occupancy: 290,
    maxCapacity: 500,
    riskLevel: "NORMAL",
    lat: 16.233572,
    lng: 80.548722,
    exits: ["Exit-LIB1", "Exit-LIB2"],
    suppressionSystem: "Aerosol & Water Mist"
  },
  {
    id: "mhp",
    name: "MHP",
    code: "MHP-HALL",
    category: "Facility / Auditorium",
    floors: 2,
    occupancy: 450,
    maxCapacity: 1200,
    riskLevel: "NORMAL",
    lat: 16.231920,
    lng: 80.548350,
    exits: ["Exit-MHP1", "Exit-MHP2", "Exit-MHP3"],
    suppressionSystem: "Deluge & Fire Curtains"
  },
  {
    id: "n-block",
    name: "N-Block",
    code: "N-BLOCK",
    category: "Computing & IT",
    floors: 5,
    occupancy: 540,
    maxCapacity: 750,
    riskLevel: "NORMAL",
    lat: 16.234180,
    lng: 80.549650,
    exits: ["Exit-N1", "Exit-N2"],
    suppressionSystem: "FM200 Clean Gas (Server Rooms)"
  },
  {
    id: "u-block",
    name: "U-Block",
    code: "U-BLOCK",
    category: "Engineering",
    floors: 4,
    occupancy: 380,
    maxCapacity: 550,
    riskLevel: "NORMAL",
    lat: 16.233400,
    lng: 80.550900,
    exits: ["Exit-U1", "Exit-U2"],
    suppressionSystem: "CO2 Flooding & Foam"
  },
  {
    id: "boys-hostel",
    name: "Boys Hostel",
    code: "BH-HOSTEL",
    category: "Hostel / Residential",
    floors: 6,
    occupancy: 820,
    maxCapacity: 950,
    riskLevel: "NORMAL",
    lat: 16.235120,
    lng: 80.552150,
    exits: ["Exit-BH1", "Exit-BH2", "Exit-BH3"],
    suppressionSystem: "Hydrant & Central Alarm"
  },
  {
    id: "pharmacy-block",
    name: "Pharmacy Block",
    code: "PHARM-BLK",
    category: "Health Sciences",
    floors: 4,
    occupancy: 280,
    maxCapacity: 400,
    riskLevel: "NORMAL",
    lat: 16.231420,
    lng: 80.549250,
    exits: ["Exit-P1", "Exit-P2"],
    suppressionSystem: "Chemical Foam & Mist"
  },
  {
    id: "convocation",
    name: "Convocation",
    code: "CONVO-LAWN",
    category: "Facility / Assembly",
    floors: 1,
    occupancy: 150,
    maxCapacity: 1500,
    riskLevel: "NORMAL",
    lat: 16.232880,
    lng: 80.549120,
    exits: ["Gate-East-1", "Gate-East-2"],
    suppressionSystem: "Perimeter Hydrant"
  },
  {
    id: "dining-hall",
    name: "Dining Hall",
    code: "DINING",
    category: "Facility / Amenities",
    floors: 2,
    occupancy: 480,
    maxCapacity: 700,
    riskLevel: "NORMAL",
    lat: 16.234250,
    lng: 80.551180,
    exits: ["Exit-D1", "Exit-D2", "Exit-D3"],
    suppressionSystem: "Kitchen Wet Chemical + Sprinklers"
  },
  {
    id: "playground",
    name: "Playground",
    code: "PLAYGROUND",
    category: "Safe Assembly Zone",
    floors: 0,
    occupancy: 120,
    maxCapacity: 3500,
    riskLevel: "NORMAL",
    lat: 16.231150,
    lng: 80.551480,
    exits: ["Gate-Stadium-West", "Gate-Stadium-North"],
    suppressionSystem: "Emergency Helipad & Open Buffer"
  },
  {
    id: "guest-house",
    name: "Guest House",
    code: "GUEST-HSE",
    category: "Facility",
    floors: 2,
    occupancy: 35,
    maxCapacity: 60,
    riskLevel: "NORMAL",
    lat: 16.233950,
    lng: 80.546950,
    exits: ["Exit-GH1"],
    suppressionSystem: "Standard Wet Sprinkler"
  },
  {
    id: "lara-campus",
    name: "LARA Campus",
    code: "LARA-CAMP",
    category: "Campus Wing",
    floors: 4,
    occupancy: 680,
    maxCapacity: 900,
    riskLevel: "NORMAL",
    lat: 16.236250,
    lng: 80.550480,
    exits: ["Exit-LC1", "Exit-LC2"],
    suppressionSystem: "Hydrant & Fire Alarm"
  },
  {
    id: "priyadarshini-girls-hostel",
    name: "Priyadarshini Girls Hostel",
    code: "PGH-HOSTEL",
    category: "Hostel / Residential",
    floors: 5,
    occupancy: 680,
    maxCapacity: 800,
    riskLevel: "NORMAL",
    lat: 16.234650,
    lng: 80.547180,
    exits: ["Exit-PGH1", "Exit-PGH2"],
    suppressionSystem: "Hydrant & Central Alarm"
  },
  {
    id: "lara-gate",
    name: "LARA Gate",
    code: "LARA-GATE",
    category: "Gate / Perimeter",
    floors: 1,
    occupancy: 15,
    maxCapacity: 30,
    riskLevel: "NORMAL",
    lat: 16.235850,
    lng: 80.549180,
    exits: ["Perimeter-SW"],
    suppressionSystem: "Tactical Extinguishers"
  }
];

export const ASSEMBLY_POINTS = [
  {
    id: "convocation",
    name: "Convocation Open Lawn",
    lat: 16.232880,
    lng: 80.549120,
    capacity: 1500,
    currentOccupancy: 45,
    status: "RECOMMENDED",
    nearestNode: "convocation",
    medicalTriageAvailable: true,
    shelterType: "Open Pavilion Ground"
  },
  {
    id: "playground",
    name: "Playground Safe Assembly Area",
    lat: 16.231150,
    lng: 80.551480,
    capacity: 3500,
    currentOccupancy: 120,
    status: "OPEN",
    nearestNode: "playground",
    medicalTriageAvailable: true,
    shelterType: "Open Stadium Grounds"
  },
  {
    id: "lara-gate",
    name: "North Lara Safe Exit Zone",
    lat: 16.235850,
    lng: 80.549180,
    capacity: 1000,
    currentOccupancy: 20,
    status: "OPEN",
    nearestNode: "lara-gate",
    medicalTriageAvailable: true,
    shelterType: "North Dispersal Point"
  }
];

export const CAMERAS = [
  {
    id: "CAM-01",
    name: "North Lara Gate Checkpoint",
    buildingId: "lara-gate",
    location: "Lara Gate",
    lat: 16.235850,
    lng: 80.549180,
    status: "MONITORING",
    aiConfidence: 98,
    currentRisk: "NORMAL",
    coverageSector: "North-Gate"
  },
  {
    id: "CAM-02",
    name: "A-Block Administrative Foyer",
    buildingId: "a-block",
    location: "A-Block Floor 2",
    lat: 16.232529,
    lng: 80.547941,
    status: "MONITORING",
    aiConfidence: 96,
    currentRisk: "NORMAL",
    coverageSector: "A-Block"
  },
  {
    id: "CAM-03",
    name: "N-Block (CSE & IT) Lobby",
    buildingId: "n-block",
    location: "N-Block Foyer",
    lat: 16.234180,
    lng: 80.549650,
    status: "MONITORING",
    aiConfidence: 95,
    currentRisk: "NORMAL",
    coverageSector: "N-Block"
  },
  {
    id: "CAM-04",
    name: "NTR Library Circle",
    buildingId: "ntr-library",
    location: "Library Plaza",
    lat: 16.233572,
    lng: 80.548722,
    status: "MONITORING",
    aiConfidence: 97,
    currentRisk: "NORMAL",
    coverageSector: "Library"
  },
  {
    id: "CAM-05",
    name: "Pharmacy & Biotech Concourse",
    buildingId: "pharmacy-block",
    location: "Pharmacy Quad",
    lat: 16.231420,
    lng: 80.549250,
    status: "MONITORING",
    aiConfidence: 94,
    currentRisk: "NORMAL",
    coverageSector: "Pharmacy"
  },
  {
    id: "CAM-06",
    name: "Dining Hall & SAC Quad",
    buildingId: "dining-hall",
    location: "Dining Plaza",
    lat: 16.234250,
    lng: 80.551180,
    status: "MONITORING",
    aiConfidence: 99,
    currentRisk: "NORMAL",
    coverageSector: "Dining"
  },
  {
    id: "CAM-07",
    name: "MHP Cultural Complex",
    buildingId: "mhp",
    location: "MHP Entrance",
    lat: 16.231920,
    lng: 80.548350,
    status: "MONITORING",
    aiConfidence: 97,
    currentRisk: "NORMAL",
    coverageSector: "MHP"
  },
  {
    id: "CAM-08",
    name: "Boys Hostel Concourse",
    buildingId: "boys-hostel",
    location: "Hostel Gate",
    lat: 16.235120,
    lng: 80.552150,
    status: "MONITORING",
    aiConfidence: 96,
    currentRisk: "NORMAL",
    coverageSector: "Boys-Hostel"
  }
];

export const RESOURCES = {
  security: [
    {
      id: "SEC-01",
      name: "Security QRT Unit Alpha",
      lat: 16.235850,
      lng: 80.549180,
      status: "AVAILABLE",
      guardsCount: 4,
      patrolSector: "North Quad",
      contact: "+91 98480 12345",
      assignedIncidentId: null
    },
    {
      id: "SEC-02",
      name: "Perimeter Patrol Bravo",
      lat: 16.231920,
      lng: 80.548350,
      status: "PATROLLING",
      guardsCount: 3,
      patrolSector: "South East Perimeter",
      contact: "+91 98480 12346",
      assignedIncidentId: null
    },
    {
      id: "SEC-03",
      name: "Main Gate Guard Post",
      lat: 16.232529,
      lng: 80.547941,
      status: "AVAILABLE",
      guardsCount: 2,
      patrolSector: "A-Block Post",
      contact: "+91 98480 12347",
      assignedIncidentId: null
    }
  ],
  medical: [
    {
      id: "MED-01",
      name: "Primary Health Center EMT Team",
      lat: 16.231420,
      lng: 80.549250,
      status: "AVAILABLE",
      respondersCount: 4,
      leader: "Dr. Suresh V.",
      assignedIncidentId: null
    },
    {
      id: "MED-02",
      name: "Campus Triage Squad Beta",
      lat: 16.232880,
      lng: 80.549120,
      status: "AVAILABLE",
      respondersCount: 3,
      leader: "Nurse K. Lakshmi",
      assignedIncidentId: null
    }
  ],
  fireSafety: [
    {
      id: "FIRE-01",
      name: "Campus Rapid Fire Tender 1",
      lat: 16.234250,
      lng: 80.551180,
      status: "AVAILABLE",
      waterCapacityLitres: 3500,
      foamAvailable: true,
      crew: 4,
      assignedIncidentId: null
    },
    {
      id: "FIRE-02",
      name: "Mini Mist Suppression Unit",
      lat: 16.232880,
      lng: 80.549120,
      status: "AVAILABLE",
      waterCapacityLitres: 1200,
      foamAvailable: true,
      crew: 2,
      assignedIncidentId: null
    }
  ],
  ambulances: [
    {
      id: "AMB-01",
      name: "Campus Advanced Life Support Ambulance",
      lat: 16.231420,
      lng: 80.549250,
      status: "AVAILABLE",
      crew: 3,
      icuEquipped: true,
      assignedIncidentId: null
    },
    {
      id: "AMB-02",
      name: "Emergency Patient Transport Van",
      lat: 16.235850,
      lng: 80.549180,
      status: "AVAILABLE",
      crew: 2,
      icuEquipped: false,
      assignedIncidentId: null
    }
  ]
};

export const GRAPH_NODES = {
  "a-block": { id: "a-block", name: "A-Block", lat: 16.232529, lng: 80.547941 },
  "h-block": { id: "h-block", name: "H-Block", lat: 16.232775, lng: 80.547798 },
  "ntr-library": { id: "ntr-library", name: "NTR Library", lat: 16.233572, lng: 80.548722 },
  "mhp": { id: "mhp", name: "MHP", lat: 16.231920, lng: 80.548350 },
  "n-block": { id: "n-block", name: "N-Block", lat: 16.234180, lng: 80.549650 },
  "u-block": { id: "u-block", name: "U-Block", lat: 16.233400, lng: 80.550900 },
  "boys-hostel": { id: "boys-hostel", name: "Boys Hostel", lat: 16.235120, lng: 80.552150 },
  "pharmacy-block": { id: "pharmacy-block", name: "Pharmacy Block", lat: 16.231420, lng: 80.549250 },
  "convocation": { id: "convocation", name: "Convocation", lat: 16.232880, lng: 80.549120 },
  "dining-hall": { id: "dining-hall", name: "Dining Hall", lat: 16.234250, lng: 80.551180 },
  "playground": { id: "playground", name: "Playground", lat: 16.231150, lng: 80.551480 },
  "guest-house": { id: "guest-house", name: "Guest House", lat: 16.233950, lng: 80.546950 },
  "lara-campus": { id: "lara-campus", name: "LARA Campus", lat: 16.236250, lng: 80.550480 },
  "priyadarshini-girls-hostel": { id: "priyadarshini-girls-hostel", name: "Priyadarshini Girls Hostel", lat: 16.234650, lng: 80.547180 },
  "lara-gate": { id: "lara-gate", name: "LARA Gate", lat: 16.235850, lng: 80.549180 },
  "j-central": { id: "j-central", name: "Central Circle Junction", lat: 16.233200, lng: 80.548800 },
  "j-library": { id: "j-library", name: "Library Avenue Junction", lat: 16.233600, lng: 80.548900 },
  "j-stadium-gate": { id: "j-stadium-gate", name: "Stadium West Gate", lat: 16.231500, lng: 80.550800 },
  "j-north-circle": { id: "j-north-circle", name: "North Quad Junction", lat: 16.234800, lng: 80.550200 },
  "j-east-boulevard": { id: "j-east-boulevard", name: "East Science Boulevard", lat: 16.233600, lng: 80.550800 },
  "j-south-hub": { id: "j-south-hub", name: "South Campus Junction", lat: 16.231800, lng: 80.548800 },
  "j-lara-connector": { id: "j-lara-connector", name: "Lara-Priyadarshini Link Road", lat: 16.235400, lng: 80.548200 },
  "j-hostel-lane": { id: "j-hostel-lane", name: "Hostel Transit Avenue", lat: 16.234800, lng: 80.551800 }
};

export const GRAPH_EDGES = [
  { id: "edge-a-central", from: "a-block", to: "j-central", name: "A-Block Main Plaza", distance: 45 },
  { id: "edge-a-mhp", from: "a-block", to: "mhp", name: "A-Block to MHP Walkway", distance: 75 },
  { id: "edge-a-east", from: "a-block", to: "j-east-boulevard", name: "A-Block East Corridor", distance: 88 },
  { id: "edge-central-h", from: "j-central", to: "h-block", name: "Central Circle to H-Block", distance: 62 },
  { id: "edge-central-library", from: "j-central", to: "ntr-library", name: "Central Plaza to NTR Library", distance: 58 },
  { id: "edge-library-junc", from: "ntr-library", to: "j-library", name: "NTR Library Perimeter Road", distance: 40 },
  { id: "edge-libjunc-stadium", from: "j-library", to: "j-stadium-gate", name: "Library to Stadium Gate Road", distance: 68 },
  { id: "edge-stadium-playground", from: "j-stadium-gate", to: "playground", name: "Stadium Promenade to Playground", distance: 65 },
  { id: "edge-h-stadium", from: "h-block", to: "j-stadium-gate", name: "H-Block West Evacuation Path", distance: 130 },
  { id: "edge-central-north", from: "j-central", to: "j-north-circle", name: "Main North Boulevard", distance: 135 },
  { id: "edge-north-nblock", from: "j-north-circle", to: "n-block", name: "N-Block Access Road", distance: 64 },
  { id: "edge-nblock-ublock", from: "n-block", to: "u-block", name: "N-Block to U-Block Corridor", distance: 70 },
  { id: "edge-north-dining", from: "j-north-circle", to: "dining-hall", name: "North Quad to Dining Hall", distance: 58 },
  { id: "edge-dining-libjunc", from: "dining-hall", to: "j-library", name: "Dining Hall to Library Avenue", distance: 120 },
  { id: "edge-north-hostel", from: "j-north-circle", to: "j-hostel-lane", name: "Hostel Access Way", distance: 80 },
  { id: "edge-hostel-boys", from: "j-hostel-lane", to: "boys-hostel", name: "Boys Hostel Road", distance: 70 },
  { id: "edge-ublock-hostel", from: "u-block", to: "j-hostel-lane", name: "U-Block to Hostel Link", distance: 68 },
  { id: "edge-east-nblock", from: "j-east-boulevard", to: "n-block", name: "East Boulevard to N-Block", distance: 75 },
  { id: "edge-east-convo", from: "j-east-boulevard", to: "convocation", name: "East Boulevard to Convocation", distance: 45 },
  { id: "edge-mhp-south", from: "mhp", to: "j-south-hub", name: "MHP to South Hub", distance: 42 },
  { id: "edge-south-pharmacy", from: "j-south-hub", to: "pharmacy-block", name: "South Hub to Pharmacy Block", distance: 60 },
  { id: "edge-pharmacy-guesthouse", from: "pharmacy-block", to: "guest-house", name: "Pharmacy to Guest House Road", distance: 120 },
  { id: "edge-convo-guesthouse", from: "convocation", to: "guest-house", name: "Convocation to Guest House", distance: 155 },
  { id: "edge-h-priyadarshini", from: "h-block", to: "priyadarshini-girls-hostel", name: "H-Block to Girls Hostel Path", distance: 160 },
  { id: "edge-south-priyadarshini", from: "j-south-hub", to: "priyadarshini-girls-hostel", name: "South Hub to Girls Hostel", distance: 155 },
  { id: "edge-priya-connector", from: "priyadarshini-girls-hostel", to: "j-lara-connector", name: "Girls Hostel to Lara Link", distance: 68 },
  { id: "edge-connector-lara", from: "j-lara-connector", to: "lara-campus", name: "Lara Campus Approach", distance: 50 },
  { id: "edge-connector-stadium", from: "j-lara-connector", to: "j-stadium-gate", name: "Lara Link to Stadium West Gate", distance: 280 },
  { id: "edge-lara-gate", from: "lara-campus", to: "lara-gate", name: "Lara Campus to Lara Gate", distance: 85 }
];
