// Campus Sentinel - Official Vignan University (VFSTR) Campus Geofence & Boundary
// Location: Vignan's Foundation for Science, Technology & Research (VFSTR), Vadlamudi, Guntur, AP - 522213

import { CAMPUS_LOCATIONS } from "./vignanCampusLocations";

/**
 * Official VFSTR Vadlamudi Campus Boundary Polygon (Lat, Lng pairs).
 * Coordinates rigorously bounded to the true physical perimeter of the Vadlamudi campus.
 */
export const VIGNAN_CAMPUS_BOUNDARY_COORDS = [
  [16.23720, 80.54620], // North-West perimeter (Guest house / Lara north-west)
  [16.23740, 80.55000], // North perimeter (Lara Gate / North Lara road)
  [16.23680, 80.55320], // North-East perimeter (Boys Hostel north boundary)
  [16.23480, 80.55400], // East perimeter (Boys Hostel & East Sports Grounds)
  [16.23020, 80.55300], // South-East perimeter (Main Sports Stadium / Athletic Ground)
  [16.23000, 80.54850], // South perimeter (Pharmacy Wing & Tenali-Guntur Road approach)
  [16.23080, 80.54620], // South-West perimeter (MHP Auditorium & Main Campus Arch)
  [16.23450, 80.54550], // West perimeter (Priyadarshini Girls Hostel west wall)
  [16.23720, 80.54620]  // Loop closed
];

/**
 * GeoJSON representation of VFSTR Campus Boundary
 */
export const VIGNAN_CAMPUS_BOUNDARY_GEOJSON = {
  type: "Feature",
  properties: {
    name: "Vignan's Foundation for Science, Technology & Research (VFSTR)",
    location: "Vadlamudi, Guntur, Andhra Pradesh, India - 522213",
    type: "University Campus Geofence Boundary"
  },
  geometry: {
    type: "Polygon",
    coordinates: [
      VIGNAN_CAMPUS_BOUNDARY_COORDS.map(([lat, lng]) => [lng, lat]) // GeoJSON format: [Lng, Lat]
    ]
  }
};

/**
 * Point-in-Polygon (Ray-Casting Algorithm)
 * Determines with mathematical certainty whether a coordinate is within the campus polygon.
 */
export function isCoordinateInsideCampus(lat, lng) {
  if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) return false;

  const polygon = VIGNAN_CAMPUS_BOUNDARY_COORDS;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const yi = polygon[i][0], xi = polygon[i][1];
    const yj = polygon[j][0], xj = polygon[j][1];

    const intersect = ((yi > lat) !== (yj > lat)) &&
      (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Haversine formula to compute exact distance in meters between two coordinates.
 */
export function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return 0;
  const R = 6371e3; // Earth's mean radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Human-readable distance formatter (e.g., "45 m", "350 m", "1.4 km").
 */
export function formatDistance(meters) {
  if (meters == null || isNaN(meters)) return "--";
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(2)} km`;
}

/**
 * Identifies the nearest verified Vignan campus location to a given GPS coordinate.
 */
export function getNearestCampusLocation(lat, lng) {
  if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) return null;

  let closest = null;
  let minDistance = Infinity;

  for (const loc of CAMPUS_LOCATIONS) {
    const dist = calculateDistanceMeters(lat, lng, loc.lat, loc.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = loc;
    }
  }

  return closest ? {
    location: closest,
    distanceMeters: minDistance,
    formattedDistance: formatDistance(minDistance)
  } : null;
}
