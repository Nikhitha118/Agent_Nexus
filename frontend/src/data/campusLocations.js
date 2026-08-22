// Campus Sentinel - Vignan University Verified Campus Locations & Digital Twin Geodata
// Campus: Vignan's Foundation for Science, Technology & Research (Deemed to be University), Vadlamudi, Guntur, AP

export const CAMPUS_CENTER = {
  lat: 16.233389,
  lng: 80.550917,
  zoom: 18,
  tilt: 60,
  heading: 90
};

export const CAMPUS_LOCATIONS = [
  {
    id: "B-01",
    name: "Main Academic Block (A-Block)",
    category: "Academic / Administration",
    lat: 16.233389,
    lng: 80.550917,
    floors: 4,
    occupancy: 620,
    suppressionSystem: "Sprinkler & Clean Agent"
  },
  {
    id: "B-02",
    name: "CSE & IT Block (B-Block)",
    category: "Academic / Computing Labs",
    lat: 16.234120,
    lng: 80.551650,
    floors: 5,
    occupancy: 540,
    suppressionSystem: "FM200 Clean Gas (Server Rooms)"
  },
  {
    id: "B-03",
    name: "Science & Humanities (C-Block)",
    category: "Academic / Research Labs",
    lat: 16.232650,
    lng: 80.550150,
    floors: 4,
    occupancy: 410,
    suppressionSystem: "Dry Powder Automatics"
  },
  {
    id: "B-04",
    name: "Dr. APJ Abdul Kalam Central Library",
    category: "Central Library",
    lat: 16.233780,
    lng: 80.550420,
    floors: 3,
    occupancy: 290,
    suppressionSystem: "Aerosol & Water Mist"
  },
  {
    id: "B-05",
    name: "Advanced Engineering Workshops",
    category: "Mechanical & Civil Labs",
    lat: 16.232850,
    lng: 80.551850,
    floors: 3,
    occupancy: 330,
    suppressionSystem: "CO2 Total Flooding & Foam"
  },
  {
    id: "B-06",
    name: "Pharmacy & Bio-Technology Block",
    category: "Health Science / Bio Labs",
    lat: 16.232200,
    lng: 80.551300,
    floors: 4,
    occupancy: 280,
    suppressionSystem: "Chemical Foam & Mist"
  },
  {
    id: "B-07",
    name: "Student Activity Center (SAC) & Food Court",
    category: "Student Amenities",
    lat: 16.234500,
    lng: 80.549800,
    floors: 2,
    occupancy: 480,
    suppressionSystem: "Wet Chemical (Kitchen) & Sprinkler"
  },
  {
    id: "B-08",
    name: "University Health Center & Paramedic Post",
    category: "Emergency Medical Center",
    lat: 16.232150,
    lng: 80.550750,
    floors: 2,
    occupancy: 45,
    suppressionSystem: "Medical Clean Agent"
  },
  {
    id: "B-09",
    name: "North Gate & Main Security Command",
    category: "Campus Access Control",
    lat: 16.235100,
    lng: 80.551100,
    floors: 2,
    occupancy: 20,
    suppressionSystem: "Tactical Dry Chem"
  },
  {
    id: "B-10",
    name: "Priyadarshini Residence (Girls Hostel)",
    category: "Student Housing",
    lat: 16.231800,
    lng: 80.549500,
    floors: 5,
    occupancy: 680,
    suppressionSystem: "Hydrant & Fire Alarm Matrix"
  },
  {
    id: "B-11",
    name: "Boys Hostel Complex",
    category: "Student Housing",
    lat: 16.235600,
    lng: 80.552200,
    floors: 6,
    occupancy: 820,
    suppressionSystem: "Hydrant & Fire Alarm Matrix"
  },
  {
    id: "B-12",
    name: "Transit Depot & Bus Terminus",
    category: "Campus Transport",
    lat: 16.234900,
    lng: 80.552800,
    floors: 1,
    occupancy: 60,
    suppressionSystem: "Foam Deluge System"
  }
];

export const SAFE_ZONES = [
  {
    id: "AP-01",
    name: "Safe Zone Alpha — Central Quadrangle Lawn",
    code: "SZ-ALPHA",
    lat: 16.233550,
    lng: 80.550600,
    capacity: 1200,
    currentOccupancy: 85,
    type: "Open Lawn / Primary Assembly",
    amenities: ["Emergency Siren", "First Aid Staging", "PA Announcer", "Water Point"]
  },
  {
    id: "AP-02",
    name: "Safe Zone Bravo — University Stadium & Athletic Grounds",
    code: "SZ-BRAVO",
    lat: 16.234200,
    lng: 80.548900,
    capacity: 2500,
    currentOccupancy: 120,
    type: "Open Stadium / Mass Evacuation",
    amenities: ["Helipad / Ambulance Bay", "Field Trauma Post", "High-Capacity Triage"]
  },
  {
    id: "AP-03",
    name: "Safe Zone Charlie — Open Amphitheatre Ground",
    code: "SZ-CHARLIE",
    lat: 16.232400,
    lng: 80.550600,
    capacity: 1500,
    currentOccupancy: 45,
    type: "Amphitheatre Courtyard",
    amenities: ["Direct Medical Access", "Emergency Lighting", "Shaded Waiting"]
  },
  {
    id: "AP-04",
    name: "Safe Zone Delta — East Gate Evacuation Lawn",
    code: "SZ-DELTA",
    lat: 16.233800,
    lng: 80.552400,
    capacity: 900,
    currentOccupancy: 30,
    type: "Perimeter Safe Buffer",
    amenities: ["Transit Exit Route", "Bus Evacuation Staging"]
  },
  {
    id: "AP-05",
    name: "Safe Zone Echo — South Campus Assembly Point",
    code: "SZ-ECHO",
    lat: 16.231600,
    lng: 80.550800,
    capacity: 800,
    currentOccupancy: 20,
    type: "South Open Grounds",
    amenities: ["Emergency Shelter Access", "Paramedic Point"]
  }
];

export const CAMPUS_CAMERAS = [
  {
    id: "CAM-01",
    name: "North Gate & Checkpoint Feed",
    location: "Main Entrance",
    lat: 16.235080,
    lng: 80.551080,
    status: "MONITORING",
    aiConfidence: 98,
    currentRisk: "NORMAL"
  },
  {
    id: "CAM-02",
    name: "Main Academic Block - F2 Corridor",
    location: "A-Block Floor 2",
    lat: 16.233400,
    lng: 80.550950,
    status: "MONITORING",
    aiConfidence: 96,
    currentRisk: "NORMAL"
  },
  {
    id: "CAM-03",
    name: "CSE & IT Complex Lobby",
    location: "B-Block Foyer",
    lat: 16.234100,
    lng: 80.551600,
    status: "MONITORING",
    aiConfidence: 95,
    currentRisk: "NORMAL"
  },
  {
    id: "CAM-04",
    name: "Central Library Circle",
    location: "Library Plaza",
    lat: 16.233750,
    lng: 80.550400,
    status: "MONITORING",
    aiConfidence: 97,
    currentRisk: "NORMAL"
  },
  {
    id: "CAM-05",
    name: "Pharmacy & Biotech Concourse",
    location: "Pharmacy Quad",
    lat: 16.232250,
    lng: 80.551250,
    status: "MONITORING",
    aiConfidence: 94,
    currentRisk: "NORMAL"
  },
  {
    id: "CAM-06",
    name: "Student Activity Center Plaza",
    location: "SAC Quad",
    lat: 16.234480,
    lng: 80.549850,
    status: "MONITORING",
    aiConfidence: 99,
    currentRisk: "NORMAL"
  },
  {
    id: "CAM-07",
    name: "University Health Center Bay",
    location: "Medical Entrance",
    lat: 16.232180,
    lng: 80.550780,
    status: "MONITORING",
    aiConfidence: 97,
    currentRisk: "NORMAL"
  },
  {
    id: "CAM-08",
    name: "Bus Depot & South Transit Gate",
    location: "Transit Terminal",
    lat: 16.234850,
    lng: 80.552750,
    status: "MONITORING",
    aiConfidence: 96,
    currentRisk: "NORMAL"
  }
];
