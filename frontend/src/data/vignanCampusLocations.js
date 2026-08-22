// Campus Sentinel - Official Vignan University Verified Campus Locations Dataset
// Location: Vignan's Foundation for Science, Technology & Research, Vadlamudi, Guntur, Andhra Pradesh
// Coordinates: 16.2333746°N, 80.5509079°E

export const CAMPUS_CENTER = {
  lat: 16.2333746,
  lng: 80.5509079,
  zoom: 18,
  tilt: 60,
  heading: 90
};

// EXACT 15 OFFICIAL VIGNAN UNIVERSITY CAMPUS LOCATIONS
export const CAMPUS_LOCATIONS = [
  {
    id: "A_BLOCK",
    name: "A-BLOCK",
    type: "BUILDING",
    lat: 16.233375,
    lng: 80.550908,
    isSafeZone: false,
    description: "Main Academic & Administrative Wing"
  },
  {
    id: "H_BLOCK",
    name: "H-BLOCK",
    type: "BUILDING",
    lat: 16.233050,
    lng: 80.550300,
    isSafeZone: false,
    description: "Science & Humanities Block"
  },
  {
    id: "NTR_LIBRARY",
    name: "NTR LIBRARY",
    type: "LIBRARY",
    lat: 16.233780,
    lng: 80.550420,
    isSafeZone: false,
    description: "NTR Central Memorial Library"
  },
  {
    id: "MHP",
    name: "MHP",
    type: "FACILITY",
    lat: 16.232750,
    lng: 80.551150,
    isSafeZone: false,
    description: "Mahati Pranganam Multipurpose Hall"
  },
  {
    id: "N_BLOCK",
    name: "N-BLOCK",
    type: "BUILDING",
    lat: 16.234120,
    lng: 80.551650,
    isSafeZone: false,
    description: "NTR Vignan Bhavan (CSE & IT)"
  },
  {
    id: "U_BLOCK",
    name: "U-BLOCK",
    type: "BUILDING",
    lat: 16.234550,
    lng: 80.552100,
    isSafeZone: false,
    description: "Advanced Engineering Laboratories"
  },
  {
    id: "BOYS_HOSTEL",
    name: "BOYS HOSTEL",
    type: "HOSTEL",
    lat: 16.235600,
    lng: 80.552200,
    isSafeZone: false,
    description: "Men's Student Residential Complex"
  },
  {
    id: "PHARMACY_BLOCK",
    name: "PHARMACY BLOCK",
    type: "BUILDING",
    lat: 16.232200,
    lng: 80.551300,
    isSafeZone: false,
    description: "School of Pharmaceutical Sciences"
  },
  {
    id: "CONVOCATION",
    name: "CONVOCATION",
    type: "FACILITY",
    lat: 16.233200,
    lng: 80.551800,
    isSafeZone: true,
    safeZoneName: "CONVOCATION OPEN LAWN",
    description: "Sangamithra Open Lawn & Evacuation Assembly Area"
  },
  {
    id: "DINING_HALL",
    name: "DINING HALL",
    type: "FACILITY",
    lat: 16.234800,
    lng: 80.550800,
    isSafeZone: false,
    description: "Central Dining Hall & Student Food Court"
  },
  {
    id: "PLAYGROUND",
    name: "PLAYGROUND",
    type: "SAFE_ZONE",
    lat: 16.234200,
    lng: 80.548900,
    isSafeZone: true,
    safeZoneName: "PLAYGROUND STADIUM GROUNDS",
    description: "Main University Sports Stadium • Primary Safe Assembly Zone"
  },
  {
    id: "GUEST_HOUSE",
    name: "GUEST HOUSE",
    type: "FACILITY",
    lat: 16.231900,
    lng: 80.552400,
    isSafeZone: false,
    description: "University VIP Guest House"
  },
  {
    id: "LARA_CAMPUS",
    name: "LARA CAMPUS",
    type: "CAMPUS",
    lat: 16.231500,
    lng: 80.548500,
    isSafeZone: false,
    description: "Vignan's Lara Institute Wing"
  },
  {
    id: "PRIYADARSHINI_GIRLS_HOSTEL",
    name: "PRIYADARSHINI GIRLS HOSTEL",
    type: "HOSTEL",
    lat: 16.231800,
    lng: 80.549500,
    isSafeZone: false,
    description: "Priyadarshini Women's Residence Hall"
  },
  {
    id: "LARA_GATE",
    name: "LARA GATE",
    type: "GATE",
    lat: 16.230900,
    lng: 80.548000,
    isSafeZone: false,
    description: "South-West Perimeter Gate"
  }
];

// Verified Safe Evacuation Assembly Areas
export const VERIFIED_SAFE_ZONES = CAMPUS_LOCATIONS.filter(loc => loc.isSafeZone);

// Campus Bypass Waypoints to route around danger zones safely
export const CAMPUS_BYPASS_WAYPOINTS = [
  { id: "WP_NORTH", name: "North Quad Ring Road", lat: 16.234600, lng: 80.551300 },
  { id: "WP_EAST", name: "East Science Boulevard", lat: 16.233600, lng: 80.551700 },
  { id: "WP_WEST", name: "Stadium West Approach", lat: 16.234100, lng: 80.549500 },
  { id: "WP_SOUTH", name: "South Campus Link", lat: 16.232500, lng: 80.550800 },
  { id: "WP_CENTRAL", name: "Central Circle", lat: 16.233500, lng: 80.550700 }
];

// Helper: Haversine distance in meters
export function getDistanceMeters(p1, p2) {
  if (!p1 || !p2) return 0;
  const R = 6371e3;
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
