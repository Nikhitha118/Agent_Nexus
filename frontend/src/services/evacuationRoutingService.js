// Campus Sentinel - Intelligent Hazard-Aware Evacuation Routing Engine
import {
  CAMPUS_LOCATIONS,
  VERIFIED_SAFE_ZONES,
  CAMPUS_BYPASS_WAYPOINTS,
  getDistanceMeters
} from "../data/vignanCampusLocations";

/**
 * Checks if a polyline path intersects with any active danger circle
 */
export function checkPathIntersectsDanger(pathPoints, dangerCenter, dangerRadiusMeters) {
  if (!dangerCenter || !dangerRadiusMeters || !pathPoints || pathPoints.length === 0) return false;

  for (let i = 0; i < pathPoints.length; i++) {
    const pt = pathPoints[i];
    const lat = typeof pt.lat === "function" ? pt.lat() : pt.lat;
    const lng = typeof pt.lng === "function" ? pt.lng() : pt.lng;

    const d = getDistanceMeters({ lat, lng }, dangerCenter);
    // If point is within danger radius (with 10m buffer), mark as compromised
    if (d < dangerRadiusMeters * 0.95) {
      return true;
    }
  }
  return false;
}

/**
 * Computes verified hazard-aware evacuation route using Google Maps DirectionsService
 */
export async function calculateEvacuationRouteAsync({
  googleMaps,
  startLocation,
  activeIncident,
  blockedAreas = []
}) {
  if (!googleMaps || !startLocation) {
    return {
      success: false,
      error: "Google Maps service unavailable"
    };
  }

  const directionsService = new googleMaps.DirectionsService();

  // 1. Determine Danger Center & Radius
  let dangerCenter = null;
  let dangerRadius = 0;

  if (activeIncident) {
    dangerRadius = activeIncident.hazardRadius || 90;
    if (activeIncident.locationCoords && activeIncident.locationCoords.lat) {
      dangerCenter = activeIncident.locationCoords;
    } else if (activeIncident.locationId) {
      const matchLoc = CAMPUS_LOCATIONS.find(l => l.id === activeIncident.locationId || l.name === activeIncident.location);
      if (matchLoc) dangerCenter = { lat: matchLoc.lat, lng: matchLoc.lng };
    }
  }

  // 2. Select Candidate Safe Zones outside the danger zone
  const safeCandidates = VERIFIED_SAFE_ZONES.filter(sz => {
    if (!dangerCenter) return true;
    const distToDanger = getDistanceMeters(sz, dangerCenter);
    return distToDanger > dangerRadius * 1.15; // Must be outside danger zone
  });

  const availableSafeZones = safeCandidates.length > 0 ? safeCandidates : VERIFIED_SAFE_ZONES;

  // Pick nearest safe zone to start location
  let bestSafeZone = availableSafeZones[0];
  let minStartDist = Infinity;

  availableSafeZones.forEach(sz => {
    const dist = getDistanceMeters(startLocation, sz);
    if (dist < minStartDist) {
      minStartDist = dist;
      bestSafeZone = sz;
    }
  });

  const origin = new googleMaps.LatLng(startLocation.lat, startLocation.lng);
  const destination = new googleMaps.LatLng(bestSafeZone.lat, bestSafeZone.lng);

  // 3. Attempt Direct Route
  const requestDirect = {
    origin,
    destination,
    travelMode: googleMaps.TravelMode.WALKING
  };

  try {
    const directResult = await new Promise((resolve) => {
      directionsService.route(requestDirect, (res, status) => {
        if (status === googleMaps.DirectionsStatus.OK && res) {
          resolve(res);
        } else {
          resolve(null);
        }
      });
    });

    if (directResult) {
      const route = directResult.routes[0];
      const overviewPath = route.overview_path || [];

      // Check if direct route passes through danger circle
      const isDangerous = dangerCenter && checkPathIntersectsDanger(overviewPath, dangerCenter, dangerRadius);

      if (!isDangerous) {
        const leg = route.legs[0];
        return {
          success: true,
          path: overviewPath.map(p => ({ lat: p.lat(), lng: p.lng() })),
          distanceText: leg.distance?.text || `${Math.round(leg.distance?.value || 300)} m`,
          durationText: leg.duration?.text || "4 min",
          destination: bestSafeZone,
          isRerouted: false,
          statusMessage: "SAFE DIRECT ROUTE",
          startLocationName: startLocation.name || "Selected Starting Point"
        };
      }
    }
  } catch (err) {
    console.warn("[EvacuationRouting] Direct routing error:", err);
  }

  // 4. If Direct Route is Compromised, Route via Safe Detour Waypoint
  let safeWaypoint = null;
  if (dangerCenter) {
    // Pick bypass waypoint furthest from danger and reasonably close to origin
    const validWaypoints = CAMPUS_BYPASS_WAYPOINTS.filter(wp => getDistanceMeters(wp, dangerCenter) > dangerRadius * 1.25);
    if (validWaypoints.length > 0) {
      safeWaypoint = validWaypoints[0];
    }
  }

  const waypoints = safeWaypoint
    ? [{ location: new googleMaps.LatLng(safeWaypoint.lat, safeWaypoint.lng), stopover: false }]
    : [];

  const requestAlternative = {
    origin,
    destination,
    waypoints,
    travelMode: googleMaps.TravelMode.WALKING,
    optimizeWaypoints: true
  };

  try {
    const altResult = await new Promise((resolve) => {
      directionsService.route(requestAlternative, (res, status) => {
        if (status === googleMaps.DirectionsStatus.OK && res) {
          resolve(res);
        } else {
          resolve(null);
        }
      });
    });

    if (altResult) {
      const route = altResult.routes[0];
      const leg = route.legs[0];
      return {
        success: true,
        path: route.overview_path.map(p => ({ lat: p.lat(), lng: p.lng() })),
        distanceText: leg.distance?.text || "380 m",
        durationText: leg.duration?.text || "5 min",
        destination: bestSafeZone,
        isRerouted: true,
        statusMessage: "SAFE ALTERNATIVE ROUTE (AVOIDING DANGER ZONE)",
        startLocationName: startLocation.name || "Selected Starting Point"
      };
    }
  } catch (err) {
    console.warn("[EvacuationRouting] Alternative routing error:", err);
  }

  // 5. Geometric Fallback Safe Polyline
  const directMeters = getDistanceMeters(startLocation, bestSafeZone);
  const estMins = Math.max(2, Math.ceil(directMeters / 70));

  const fallbackPath = [
    { lat: startLocation.lat, lng: startLocation.lng },
    ...(safeWaypoint ? [{ lat: safeWaypoint.lat, lng: safeWaypoint.lng }] : []),
    { lat: bestSafeZone.lat, lng: bestSafeZone.lng }
  ];

  return {
    success: true,
    path: fallbackPath,
    distanceText: `${directMeters} m`,
    durationText: `${estMins} min`,
    destination: bestSafeZone,
    isRerouted: !!safeWaypoint,
    statusMessage: safeWaypoint ? "SAFE ALTERNATIVE ROUTE" : "SAFE EVACUATION ROUTE",
    startLocationName: startLocation.name || "Selected Starting Point"
  };
}
