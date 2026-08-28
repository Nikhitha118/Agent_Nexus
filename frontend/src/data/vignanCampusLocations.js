// Campus Sentinel - Official Vignan University Verified Campus Locations Dataset
// Location: Vignan's Foundation for Science, Technology & Research (VFSTR)
// Vadlamudi, Guntur, Andhra Pradesh, India - 522213
// Coordinates: 16.233200°N, 80.549000°E (True Campus Geometric Center)

export const CAMPUS_CENTER = {
  lat: 16.233200,
  lng: 80.549000,
  zoom: 17,
  tilt: 60,
  heading: 90
};

// EXACT 15 OFFICIAL VIGNAN UNIVERSITY (VFSTR) CAMPUS LOCATIONS
// Coordinates verified from official geotagged campus reference surveys & architectural plans.
export const CAMPUS_LOCATIONS = [
  {
    id: "A_BLOCK",
    name: "A-BLOCK",
    displayName: "A-Block (Administrative Wing)",
    type: "ADMINISTRATIVE",
    lat: 16.232529,
    lng: 80.547941,
    isSafeZone: false,
    description: "Main University Administration, Dean's Office & Central Registry"
  },
  {
    id: "H_BLOCK",
    name: "H-BLOCK",
    displayName: "H-Block (Visweswaraya Block)",
    type: "ACADEMIC",
    lat: 16.232775,
    lng: 80.547798,
    isSafeZone: false,
    description: "Science & Humanities Block (Visweswaraya Block)"
  },
  {
    id: "NTR_LIBRARY",
    name: "NTR LIBRARY",
    displayName: "NTR Vignan Central Library",
    type: "LIBRARY",
    lat: 16.233572,
    lng: 80.548722,
    isSafeZone: false,
    description: "NTR Central Memorial Library & Digital Archive Center"
  },
  {
    id: "MHP",
    name: "MHP",
    displayName: "MHP (Mahati Pranganam)",
    type: "FACILITY",
    lat: 16.231920,
    lng: 80.548350,
    isSafeZone: false,
    description: "Mahati Pranganam Open Air Auditorium & Multipurpose Complex"
  },
  {
    id: "N_BLOCK",
    name: "N-BLOCK",
    displayName: "N-Block (CSE & IT Complex)",
    type: "ACADEMIC",
    lat: 16.234180,
    lng: 80.549650,
    isSafeZone: false,
    description: "NTR Vignan Bhavan (Computer Science & Information Technology)"
  },
  {
    id: "U_BLOCK",
    name: "U-BLOCK",
    displayName: "U-Block (Aryabhatta Block)",
    type: "ACADEMIC",
    lat: 16.233400,
    lng: 80.550900,
    isSafeZone: false,
    description: "Aryabhatta Block (Engineering Labs & Advanced Workshops)"
  },
  {
    id: "BOYS_HOSTEL",
    name: "BOYS HOSTEL",
    displayName: "Vignan Vihar Boys Hostel",
    type: "HOSTEL",
    lat: 16.235120,
    lng: 80.552150,
    isSafeZone: false,
    description: "Vignan Vihar Men's Student Residential Complex"
  },
  {
    id: "PHARMACY_BLOCK",
    name: "PHARMACY BLOCK",
    displayName: "Pharmacy & Biotech Block",
    type: "ACADEMIC",
    lat: 16.231420,
    lng: 80.549250,
    isSafeZone: false,
    description: "School of Pharmaceutical Sciences & Research Labs"
  },
  {
    id: "CONVOCATION",
    name: "CONVOCATION",
    displayName: "Convocation Open Lawn",
    type: "SAFE_ZONE",
    lat: 16.232880,
    lng: 80.549120,
    isSafeZone: true,
    safeZoneName: "CONVOCATION OPEN LAWN",
    description: "Sangamithra Open Lawn • Primary Verified Safe Evacuation Assembly Ground"
  },
  {
    id: "DINING_HALL",
    name: "DINING HALL",
    displayName: "Central Student Dining Hall",
    type: "FACILITY",
    lat: 16.234250,
    lng: 80.551180,
    isSafeZone: false,
    description: "Central Campus Student & Faculty Food Court"
  },
  {
    id: "PLAYGROUND",
    name: "PLAYGROUND",
    displayName: "Main University Sports Stadium",
    type: "SAFE_ZONE",
    lat: 16.231150,
    lng: 80.551480,
    isSafeZone: true,
    safeZoneName: "PLAYGROUND STADIUM GROUNDS",
    description: "Main Athletic Track & Sports Stadium • South Safe Assembly Zone"
  },
  {
    id: "GUEST_HOUSE",
    name: "GUEST HOUSE",
    displayName: "University VIP Guest House",
    type: "FACILITY",
    lat: 16.233950,
    lng: 80.546950,
    isSafeZone: false,
    description: "University Executive Accommodation & Chancellor Suite"
  },
  {
    id: "LARA_CAMPUS",
    name: "LARA CAMPUS",
    displayName: "Vignan's Lara Campus",
    type: "CAMPUS",
    lat: 16.236250,
    lng: 80.550480,
    isSafeZone: false,
    description: "Vignan's Lara Institute of Technology & Science Wing"
  },
  {
    id: "LARA_GATE",
    name: "LARA GATE",
    displayName: "North Lara Exit Gate",
    type: "SAFE_ZONE",
    lat: 16.235850,
    lng: 80.549180,
    isSafeZone: true,
    safeZoneName: "NORTH LARA GATE SAFE EXIT",
    description: "North Perimeter Gate & Safe Evacuation Dispersal Corridor"
  },
  {
    id: "PRIYADARSHINI_GIRLS_HOSTEL",
    name: "PRIYADARSHINI GIRLS HOSTEL",
    displayName: "Priyadarshini Girls Hostel",
    type: "HOSTEL",
    lat: 16.234650,
    lng: 80.547180,
    isSafeZone: false,
    description: "Priyadarshini Women's Student Residential Hostel"
  }
];

// Verified Safe Evacuation Assembly Areas
export const VERIFIED_SAFE_ZONES = CAMPUS_LOCATIONS.filter(loc => loc.isSafeZone);

// Campus Bypass Waypoints connecting road network
export const CAMPUS_BYPASS_WAYPOINTS = [
  { id: "WP_NORTH", name: "North Quad Ring Road", lat: 16.235200, lng: 80.549800 },
  { id: "WP_EAST", name: "East Science Boulevard", lat: 16.233800, lng: 80.551000 },
  { id: "WP_WEST", name: "West Library Corridor", lat: 16.233200, lng: 80.547800 },
  { id: "WP_SOUTH", name: "South Pharmacy Link", lat: 16.231800, lng: 80.549000 },
  { id: "WP_CENTRAL", name: "Convocation Circle", lat: 16.233000, lng: 80.549000 }
];

// Helper: Haversine distance in meters
export function getDistanceMeters(p1, p2) {
  if (!p1 || !p2) return 0;
  const lat1 = p1.lat ?? p1[0];
  const lng1 = p1.lng ?? p1[1];
  const lat2 = p2.lat ?? p2[0];
  const lng2 = p2.lng ?? p2[1];

  if (lat1 == null || lng1 == null || lat2 == null || lng2 == null) return 0;

  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Campus Sentinel Surveillance Nodes
export const CAMPUS_CAMERAS = [
  {
    id: "CAM-01",
    name: "North Lara Gate Checkpoint",
    location: "Lara Gate",
    lat: 16.235850,
    lng: 80.549180,
    status: "MONITORING",
    aiConfidence: 98,
    currentRisk: "NORMAL"
  },
  {
    id: "CAM-02",
    name: "A-Block Administrative Foyer",
    location: "A-Block",
    lat: 16.232529,
    lng: 80.547941,
    status: "MONITORING",
    aiConfidence: 96,
    currentRisk: "NORMAL"
  },
  {
    id: "CAM-03",
    name: "N-Block CSE & IT Quad",
    location: "N-Block",
    lat: 16.234180,
    lng: 80.549650,
    status: "MONITORING",
    aiConfidence: 95,
    currentRisk: "NORMAL"
  },
  {
    id: "CAM-04",
    name: "NTR Central Library Plaza",
    location: "NTR Library",
    lat: 16.233572,
    lng: 80.548722,
    status: "MONITORING",
    aiConfidence: 97,
    currentRisk: "NORMAL"
  },
  {
    id: "CAM-05",
    name: "U-Block Engineering Labs",
    location: "U-Block",
    lat: 16.233400,
    lng: 80.550900,
    status: "MONITORING",
    aiConfidence: 94,
    currentRisk: "NORMAL"
  },
  {
    id: "CAM-06",
    name: "MHP Auditorium & Plaza",
    location: "MHP",
    lat: 16.231920,
    lng: 80.548350,
    status: "MONITORING",
    aiConfidence: 99,
    currentRisk: "NORMAL"
  },
  {
    id: "CAM-07",
    name: "Pharmacy & Biotech Concourse",
    location: "Pharmacy Block",
    lat: 16.231420,
    lng: 80.549250,
    status: "MONITORING",
    aiConfidence: 97,
    currentRisk: "NORMAL"
  },
  {
    id: "CAM-08",
    name: "Boys Hostel Residential Gate",
    location: "Boys Hostel",
    lat: 16.235120,
    lng: 80.552150,
    status: "MONITORING",
    aiConfidence: 96,
    currentRisk: "NORMAL"
  }
];
