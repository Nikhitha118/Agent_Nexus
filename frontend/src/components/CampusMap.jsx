// Campus Sentinel - Vignan University Professional 3D Emergency Operations Map
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSentinel } from "../context/SentinelContext";
import { useGoogleMaps } from "../utils/googleMapsLoader";
import {
  CAMPUS_CENTER,
  CAMPUS_LOCATIONS,
  VERIFIED_SAFE_ZONES,
  getDistanceMeters
} from "../data/vignanCampusLocations";
import { CAMPUS_CAMERAS } from "../data/campusLocations";
import { calculateEvacuationRouteAsync } from "../services/evacuationRoutingService";
import {
  Flame,
  Shield,
  HeartPulse,
  Navigation,
  Crosshair,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Eye,
  Camera,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Compass,
  RotateCw,
  Plus,
  Minus,
  Maximize2,
  Ban,
  ShieldAlert,
  Building,
  RefreshCw
} from "lucide-react";

export const CampusMap = ({ height = "h-[650px]", interactive = true }) => {
  const {
    activeIncident,
    activeEmergencyEvent,
    currentRole,
    openResolveModal
  } = useSentinel();

  const isAuthorizedForSecurity = currentRole === "ADMIN" || currentRole === "SECURITY";
  const isAuthorizedForCameras = isAuthorizedForSecurity;

  const { mapsLoaded, mapId } = useGoogleMaps();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const circlesRef = useRef([]);
  const routePolylineRef = useRef(null);
  const arrowPolylineRef = useRef(null);

  // Map Controls State
  const [is3DMode, setIs3DMode] = useState(true);
  const [showCameras, setShowCameras] = useState(isAuthorizedForCameras);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  // Selected Start Location (Defaults to A-BLOCK)
  const [selectedStartId, setSelectedStartId] = useState("A_BLOCK");

  // Evacuation Route State
  const [evacuationRoute, setEvacuationRoute] = useState({
    path: [],
    distanceText: "240 m",
    durationText: "4 min",
    destination: VERIFIED_SAFE_ZONES[0],
    isRerouted: false,
    statusMessage: "SAFE DIRECT ROUTE",
    startLocationName: "A-BLOCK"
  });

  // Selected Marker Info for Detail Modal/Popover
  const [selectedMarkerInfo, setSelectedMarkerInfo] = useState(null);

  // 1. Initialize Google 3D Vector Map with Strict POI Suppression
  useEffect(() => {
    if (!mapsLoaded || !mapContainerRef.current || mapInstanceRef.current) return;

    try {
      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: { lat: CAMPUS_CENTER.lat, lng: CAMPUS_CENTER.lng },
        zoom: CAMPUS_CENTER.zoom,
        tilt: CAMPUS_CENTER.tilt,
        heading: CAMPUS_CENTER.heading,
        mapId: mapId,
        disableDefaultUI: true,
        clickableIcons: false, // Disables all third-party POI click popups
        gestureHandling: interactive ? "greedy" : "none",
        isFractionalZoomEnabled: true,
        // Strict Dark Command Styling & Complete POI Suppression
        styles: [
          {
            featureType: "poi",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "poi.business",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "transit",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "road",
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      mapInstanceRef.current = map;
    } catch (err) {
      console.error("[CampusMap] Error initializing Google Map:", err);
    }
  }, [mapsLoaded, mapId, interactive]);

  // 2. Clear Overlays Helper
  const clearMapOverlays = useCallback(() => {
    markersRef.current.forEach(m => { if (m.setMap) m.setMap(null); });
    markersRef.current = [];

    circlesRef.current.forEach(c => { if (c.setMap) c.setMap(null); });
    circlesRef.current = [];

    if (routePolylineRef.current) {
      routePolylineRef.current.setMap(null);
      routePolylineRef.current = null;
    }

    if (arrowPolylineRef.current) {
      arrowPolylineRef.current.setMap(null);
      arrowPolylineRef.current = null;
    }
  }, []);

  // 3. Compute Real Evacuation Route
  const computeEvacuationRoute = useCallback(async () => {
    if (!window.google || !window.google.maps) return;

    setIsCalculatingRoute(true);

    const startLoc = userLocation
      ? { lat: userLocation.lat, lng: userLocation.lng, name: "Your GPS Location" }
      : (CAMPUS_LOCATIONS.find(l => l.id === selectedStartId) || CAMPUS_LOCATIONS[0]);

    const result = await calculateEvacuationRouteAsync({
      googleMaps: window.google.maps,
      startLocation: startLoc,
      activeIncident: activeIncident
    });

    if (result && result.success) {
      setEvacuationRoute(result);
    }
    setIsCalculatingRoute(false);
  }, [activeIncident, selectedStartId, userLocation]);

  // Re-compute route when incident, start location, or user location changes
  useEffect(() => {
    if (mapsLoaded) {
      computeEvacuationRoute();
    }
  }, [mapsLoaded, computeEvacuationRoute]);

  // 4. Render All Custom Markers, Danger Circles, and Glowing Route
  const renderMapElements = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google || !window.google.maps) return;

    clearMapOverlays();

    const dangerCenter = activeIncident?.locationCoords ||
      (activeIncident?.locationId ? CAMPUS_LOCATIONS.find(l => l.id === activeIncident.locationId) : null);
    const dangerRadius = activeIncident?.hazardRadius || 90;

    // A. RENDER THE 15 OFFICIAL VIGNAN CAMPUS LOCATIONS
    CAMPUS_LOCATIONS.forEach((loc) => {
      const isStart = !userLocation && selectedStartId === loc.id;
      const isDestination = evacuationRoute?.destination?.id === loc.id;
      const isSafeZone = loc.isSafeZone;

      // Check if location is in hazard area
      const isCompromised = dangerCenter && getDistanceMeters(loc, dangerCenter) < dangerRadius;

      // Color coding & Custom SVG Pin
      let pinColor = "#0284C7"; // Default building
      let pinBorder = "#38BDF8";
      let glyph = "🏢";

      if (isDestination || isSafeZone) {
        pinColor = "#059669";
        pinBorder = "#34D399";
        glyph = "★";
      } else if (loc.type === "HOSTEL") {
        pinColor = "#D97706";
        pinBorder = "#FBBF24";
        glyph = "🏠";
      } else if (loc.type === "FACILITY") {
        pinColor = "#7C3AED";
        pinBorder = "#C084FC";
        glyph = "🏛️";
      } else if (loc.type === "LIBRARY") {
        pinColor = "#2563EB";
        pinBorder = "#93C5FD";
        glyph = "📚";
      } else if (loc.type === "GATE") {
        pinColor = "#475569";
        pinBorder = "#94A3B8";
        glyph = "🚪";
      }

      if (isCompromised) {
        pinColor = "#DC2626";
        pinBorder = "#EF4444";
        glyph = "⚠️";
      }

      if (isStart) {
        pinColor = "#0284C7";
        pinBorder = "#00F0FF";
        glyph = "📍";
      }

      const iconSvg = `
        <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 0C7.6 0 0 7.6 0 17C0 29.8 17 42 17 42C17 42 34 29.8 34 17C34 7.6 26.4 0 17 0Z" fill="${pinColor}" stroke="${pinBorder}" stroke-width="2.5"/>
          <circle cx="17" cy="16" r="10" fill="#0B1220"/>
          <text x="17" y="20" font-family="sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${glyph}</text>
        </svg>
      `;

      const marker = new window.google.maps.Marker({
        position: { lat: loc.lat, lng: loc.lng },
        map: map,
        title: loc.name,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(iconSvg)}`,
          scaledSize: new window.google.maps.Size(32, 40),
          anchor: new window.google.maps.Point(16, 40)
        }
      });

      const distFromStart = getDistanceMeters(
        userLocation || (CAMPUS_LOCATIONS.find(l => l.id === selectedStartId) || CAMPUS_LOCATIONS[0]),
        loc
      );

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="background:#0B1220; color:#F8FAFC; padding:10px 14px; border-radius:14px; font-family:sans-serif; border:2px solid ${pinBorder}; max-width:240px; box-shadow:0 10px 25px rgba(0,0,0,0.8);">
            <h4 style="margin:0 0 4px 0; font-size:14px; font-weight:900; color:${pinBorder}; letter-spacing:0.5px;">${loc.name}</h4>
            <p style="margin:0 0 4px 0; font-size:11px; color:#94A3B8; font-weight:bold;">TYPE: <span style="color:#FFFFFF;">${loc.type}</span></p>
            <p style="margin:0 0 4px 0; font-size:10px; color:#64748B; font-family:monospace;">${loc.lat.toFixed(6)}°N, ${loc.lng.toFixed(6)}°E</p>
            <p style="margin:0 0 4px 0; font-size:11px; color:#94A3B8;">STATUS: <b style="color:${isCompromised ? '#EF4444' : '#34D399'};">${isCompromised ? '⚠️ DANGER PERIMETER' : 'SAFE'}</b></p>
            <p style="margin:0; font-size:11px; color:#38BDF8;">Distance: <b>${distFromStart} m</b></p>
          </div>
        `
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
        setSelectedStartId(loc.id);
        setUserLocation(null);
        setSelectedMarkerInfo({ ...loc, distance: distFromStart, isCompromised });
      });

      markersRef.current.push(marker);
    });

    // B. CCTV CAMERAS (STRICTLY ADMIN & SECURITY ONLY)
    if (showCameras && isAuthorizedForCameras) {
      CAMPUS_CAMERAS.forEach((cam) => {
        const iconSvg = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" fill="#0B1220" stroke="#06B6D4" stroke-width="2"/>
            <circle cx="12" cy="12" r="4" fill="#22D3EE"/>
          </svg>
        `;

        const marker = new window.google.maps.Marker({
          position: { lat: cam.lat, lng: cam.lng },
          map: map,
          title: `CCTV: ${cam.name}`,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(iconSvg)}`,
            scaledSize: new window.google.maps.Size(22, 22),
            anchor: new window.google.maps.Point(11, 11)
          }
        });

        markersRef.current.push(marker);
      });
    }

    // C. USER GPS PIN
    if (userLocation) {
      const userSvg = `
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="17" cy="17" r="15" fill="#00F0FF" fill-opacity="0.3" stroke="#38BDF8" stroke-width="2"/>
          <circle cx="17" cy="17" r="7" fill="#0284C7" stroke="#FFFFFF" stroke-width="2.5"/>
        </svg>
      `;

      const userMarker = new window.google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Your GPS Location",
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(userSvg)}`,
          scaledSize: new window.google.maps.Size(34, 34),
          anchor: new window.google.maps.Point(17, 17)
        }
      });
      markersRef.current.push(userMarker);
    }

    // D. EMERGENCY INCIDENT & TRANSLUCENT DANGER RADIUS
    if (activeIncident && dangerCenter) {
      const incidentType = (activeIncident.type || "FIRE").toUpperCase();

      // Translucent Danger Circle
      const dangerCircle = new window.google.maps.Circle({
        strokeColor: "#EF4444",
        strokeOpacity: 0.95,
        strokeWeight: 2.5,
        fillColor: "#DC2626",
        fillOpacity: 0.28,
        map: map,
        center: dangerCenter,
        radius: dangerRadius
      });
      circlesRef.current.push(dangerCircle);

      // Inner Core Pulse Circle
      const coreCircle = new window.google.maps.Circle({
        strokeColor: "#F87171",
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: "#991B1B",
        fillOpacity: 0.45,
        map: map,
        center: dangerCenter,
        radius: dangerRadius * 0.4
      });
      circlesRef.current.push(coreCircle);

      // Incident Pin
      const emergencySvg = `
        <svg width="44" height="52" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 0C9.85 0 0 9.85 0 22C0 38 22 52 22 52C22 52 44 38 44 22C44 9.85 34.15 0 22 0Z" fill="#DC2626" stroke="#FFFFFF" stroke-width="3"/>
          <circle cx="22" cy="21" r="14" fill="#7F1D1D"/>
          <text x="22" y="26" font-family="sans-serif" font-size="15" text-anchor="middle">🔥</text>
        </svg>
      `;

      const incidentMarker = new window.google.maps.Marker({
        position: dangerCenter,
        map: map,
        title: `EMERGENCY: ${incidentType}`,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(emergencySvg)}`,
          scaledSize: new window.google.maps.Size(44, 52),
          anchor: new window.google.maps.Point(22, 52)
        },
        animation: window.google.maps.Animation.BOUNCE
      });
      markersRef.current.push(incidentMarker);
    }

    // E. BRIGHT CYAN EVACUATION ROUTE WITH DIRECTIONAL ARROWS
    if (evacuationRoute && evacuationRoute.path && evacuationRoute.path.length > 1) {
      // Ambient Glow Line
      const glowPolyline = new window.google.maps.Polyline({
        path: evacuationRoute.path,
        geodesic: true,
        strokeColor: "#00F0FF",
        strokeOpacity: 0.4,
        strokeWeight: 10,
        map: map
      });
      routePolylineRef.current = glowPolyline;

      // Animated Arrow Line
      const arrowSymbol = {
        path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 3.5,
        strokeColor: "#FFFFFF",
        fillColor: "#00F0FF",
        fillOpacity: 1
      };

      const arrowPolyline = new window.google.maps.Polyline({
        path: evacuationRoute.path,
        geodesic: true,
        strokeColor: "#0284C7",
        strokeOpacity: 0.95,
        strokeWeight: 5,
        icons: [
          {
            icon: arrowSymbol,
            offset: "20%",
            repeat: "60px"
          }
        ],
        map: map
      });
      arrowPolylineRef.current = arrowPolyline;
    }
  }, [
    showCameras,
    isAuthorizedForCameras,
    userLocation,
    selectedStartId,
    activeIncident,
    evacuationRoute,
    clearMapOverlays
  ]);

  // Re-render map elements when dependencies change
  useEffect(() => {
    if (mapsLoaded && mapInstanceRef.current) {
      renderMapElements();
    }
  }, [mapsLoaded, renderMapElements]);

  // 5. Controls Handlers
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1);
  };
  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1);
  };
  const handleToggle3D = () => {
    if (mapInstanceRef.current) {
      const next3D = !is3DMode;
      setIs3DMode(next3D);
      mapInstanceRef.current.setTilt(next3D ? 60 : 0);
      mapInstanceRef.current.setHeading(next3D ? 90 : 0);
    }
  };
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo({ lat: CAMPUS_CENTER.lat, lng: CAMPUS_CENTER.lng });
      mapInstanceRef.current.setZoom(CAMPUS_CENTER.zoom);
      mapInstanceRef.current.setTilt(is3DMode ? 60 : 0);
      mapInstanceRef.current.setHeading(is3DMode ? 90 : 0);
    }
  };

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setIsLocating(false);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(coords);
          mapInstanceRef.current.setZoom(19);
        }
      },
      (err) => {
        setIsLocating(false);
        setLocationError("Unable to obtain GPS location. Please select a starting campus building.");
        console.warn("[CampusMap] GPS error:", err);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const isEmergencyActive = !!activeIncident || !!activeEmergencyEvent;
  const currentIncident = activeIncident || {
    type: activeEmergencyEvent?.eventType || "FIRE",
    location: activeEmergencyEvent?.affectedArea || "H-BLOCK",
    severity: activeEmergencyEvent?.severity || "HIGH",
    confidence: 94
  };

  return (
    <div className="w-full flex flex-col lg:flex-row items-stretch gap-4 animate-fade-in box-border">
      {/* ============================================================ */}
      {/* LEFT SECTION (73%): DARK 3D GOOGLE CAMPUS MAP & CONTROLS     */}
      {/* ============================================================ */}
      <div className="w-full lg:w-[73%] flex flex-col space-y-3">
        {/* Map Container Viewport */}
        <div className={`relative w-full ${height} rounded-3xl overflow-hidden bg-[#07111F] border-2 border-[#1E2C48] shadow-2xl group`}>
          {/* Google Maps Viewport */}
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Loading Fallback */}
          {!mapsLoaded && (
            <div className="absolute inset-0 bg-[#0B1220] flex flex-col items-center justify-center space-y-3 z-10">
              <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-mono text-cyan-300">
                Loading Vignan University 3D Digital Twin Map...
              </p>
            </div>
          )}

          {/* Top-Left Clean Campus Badge */}
          <div className="absolute top-3.5 left-3.5 z-20 flex flex-col space-y-1 bg-[#0B1220]/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-[#1E2C48] shadow-xl max-w-sm">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
              </span>
              <h3 className="text-xs font-black text-white leading-tight uppercase tracking-wider">
                VIGNAN UNIVERSITY • DIGITAL TWIN
              </h3>
            </div>
            <p className="text-[10px] font-mono text-cyan-400">
              15 Verified Locations • Real Hazard-Aware Evacuation Routing
            </p>
          </div>

          {/* Top-Right Map Controls */}
          <div className="absolute top-3.5 right-3.5 z-20 flex items-center space-x-1.5 bg-[#0B1220]/95 backdrop-blur-md p-1.5 rounded-2xl border border-[#1E2C48] shadow-xl">
            {/* 3D / 2D Tilt Toggle */}
            <button
              type="button"
              onClick={handleToggle3D}
              className={`px-2.5 py-1.5 rounded-xl font-mono text-[11px] font-bold transition-all ${
                is3DMode
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                  : "bg-[#141D32] text-slate-300 hover:bg-[#1A2640]"
              }`}
              title="Toggle 3D Perspective Tilt"
            >
              {is3DMode ? "3D ON" : "2D FLAT"}
            </button>

            {/* GPS My Location */}
            <button
              type="button"
              onClick={handleMyLocation}
              disabled={isLocating}
              className="p-1.5 rounded-xl bg-[#141D32] hover:bg-slate-700 text-slate-200 hover:text-cyan-300 transition-colors"
              title="Locate My Position (GPS)"
            >
              <Crosshair className={`w-4 h-4 ${isLocating ? "animate-spin text-cyan-400" : ""}`} />
            </button>

            {/* Reset Campus View */}
            <button
              type="button"
              onClick={handleResetView}
              className="p-1.5 rounded-xl bg-[#141D32] hover:bg-slate-700 text-slate-200 hover:text-cyan-300 transition-colors"
              title="Reset View"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
            </button>
          </div>

          {/* Bottom-Right Zoom Controls */}
          <div className="absolute bottom-4 right-4 z-20 flex flex-col space-y-1.5 bg-[#0B1220]/95 backdrop-blur-md p-1.5 rounded-2xl border border-[#1E2C48] shadow-xl">
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-2 rounded-xl bg-[#141D32] hover:bg-slate-700 text-white font-bold transition-colors"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-2 rounded-xl bg-[#141D32] hover:bg-slate-700 text-white font-bold transition-colors"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom-Left Route Status Legend & Camera Toggle */}
          <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-[#0B1220]/95 backdrop-blur-md p-2 rounded-2xl border border-[#1E2C48] shadow-xl text-[11px]">
            <span className="flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-[#141D32] text-cyan-300 font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-pulse" />
              <span>{evacuationRoute.statusMessage}</span>
            </span>

            {isAuthorizedForCameras && (
              <label className="flex items-center space-x-1.5 text-slate-300 cursor-pointer px-2 py-1 rounded-lg hover:bg-[#141D32]">
                <input
                  type="checkbox"
                  checked={showCameras}
                  onChange={(e) => setShowCameras(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-0"
                />
                <span className="text-cyan-300">📷 CCTV (8)</span>
              </label>
            )}
          </div>
        </div>

        {/* Location Error Notice */}
        {locationError && (
          <div className="text-xs font-mono text-amber-400 bg-amber-950/60 p-2.5 rounded-xl border border-amber-800 flex items-center justify-between">
            <span>⚠️ {locationError}</span>
            <button onClick={() => setLocationError(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* RIGHT SECTION (27%): LIVE EMERGENCY & EVACUATION PANEL       */}
      {/* ============================================================ */}
      <div className="w-full lg:w-[27%] flex flex-col space-y-4">
        {/* Controlled Starting Location Selector (EXACT 15 LOCATIONS ONLY) */}
        <div className="p-4 rounded-2xl bg-[#0F1626] border border-[#1E2C48] space-y-2 text-left shadow-lg">
          <label className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
            Select Your Starting Location:
          </label>
          <select
            value={selectedStartId}
            onChange={(e) => {
              setSelectedStartId(e.target.value);
              setUserLocation(null);
            }}
            className="w-full p-2.5 rounded-xl bg-[#141D32] border border-[#1E2C48] text-white text-xs font-bold focus:outline-none focus:border-cyan-500 uppercase"
          >
            {CAMPUS_LOCATIONS.map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.name} {loc.isSafeZone ? "(SAFE ZONE)" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* ACTIVE EMERGENCY / PEACETIME ROUTING PANEL */}
        {isEmergencyActive ? (
          <div className="p-5 rounded-3xl bg-[#0F1626] border-2 border-red-500/80 shadow-2xl space-y-4 text-left animate-pulse-glow">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2C48]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  LIVE EMERGENCY STATUS
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-red-950 border border-red-700 text-red-300 text-[10px] font-mono font-bold uppercase">
                {currentIncident.severity}
              </span>
            </div>

            {/* Incident Summary Card */}
            <div className="bg-[#141D32] p-3 rounded-2xl border border-[#1E2C48] space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono text-[10px] uppercase">ACTIVE INCIDENT:</span>
                <span className="font-black text-red-400 uppercase">{currentIncident.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono text-[10px] uppercase">SEVERITY:</span>
                <span className="font-bold text-amber-400 font-mono">{currentIncident.severity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono text-[10px] uppercase">INCIDENT LOCATION:</span>
                <span className="font-bold text-white text-right uppercase">{currentIncident.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono text-[10px] uppercase">AI CONFIDENCE:</span>
                <span className="font-bold text-cyan-400 font-mono">{currentIncident.confidence || 92}%</span>
              </div>
            </div>

            {/* Safe Assembly Area Card */}
            <div className="bg-[#141D32] p-3.5 rounded-2xl border border-[#1E2C48] space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>SAFE ASSEMBLY AREA</span>
              </div>
              <p className="text-xs font-black text-white uppercase">
                {evacuationRoute.destination?.name || "PLAYGROUND"}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1E2C48] text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">DISTANCE:</span>
                  <strong className="text-emerald-300 font-mono">{evacuationRoute.distanceText}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">EST. TIME:</span>
                  <strong className="text-cyan-300 font-mono">{evacuationRoute.durationText}</strong>
                </div>
              </div>
            </div>

            {/* Route Status Notice */}
            <div className={`p-2.5 rounded-xl border text-xs font-bold font-mono ${
              evacuationRoute.isRerouted
                ? "bg-amber-950/70 border-amber-500 text-amber-300"
                : "bg-emerald-950/70 border-emerald-500 text-emerald-300"
            }`}>
              {evacuationRoute.isRerouted ? "⚠️ ALTERNATIVE SAFE ROUTE GENERATED" : "✓ SAFE DIRECT EVACUATION ROUTE"}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (mapInstanceRef.current && evacuationRoute.path?.[0]) {
                    mapInstanceRef.current.panTo(evacuationRoute.path[0]);
                    mapInstanceRef.current.setZoom(19);
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg transition-all active:scale-95 uppercase"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>SHOW SAFE ROUTE</span>
              </button>

              <button
                type="button"
                onClick={computeEvacuationRoute}
                disabled={isCalculatingRoute}
                className="w-full py-2 rounded-xl bg-[#141D32] hover:bg-[#1A2640] text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 border border-[#1E2C48] transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCalculatingRoute ? "animate-spin text-cyan-400" : ""}`} />
                <span>RECALCULATE ROUTE</span>
              </button>

              {isAuthorizedForSecurity && (
                <button
                  type="button"
                  onClick={() => openResolveModal(activeIncident)}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition-all active:scale-95 border border-emerald-400/30 uppercase"
                >
                  RESOLVE INCIDENT
                </button>
              )}
            </div>
          </div>
        ) : (
          /* PEACETIME STANDBY PANEL */
          <div className="p-5 rounded-3xl bg-[#0F1626] border border-[#1E2C48] shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2C48]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  LIVE EMERGENCY STATUS
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 text-[10px] font-mono font-bold">
                PEACETIME
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>NO ACTIVE EMERGENCY</span>
              </div>
              <p className="text-[11px] text-slate-300">
                15 verified campus locations and 8 CCTV cameras operational with 0 active anomalies.
              </p>
            </div>

            {/* Standby Route Preview to Safe Zone */}
            <div className="p-3.5 rounded-2xl bg-[#141D32] border border-[#1E2C48] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[10px]">ROUTE TO SAFE ZONE:</span>
                <span className="text-emerald-400 font-bold font-mono">{evacuationRoute.distanceText} ({evacuationRoute.durationText})</span>
              </div>
              <div className="text-[10px] font-mono text-slate-300 space-y-1">
                <p>START: <b className="text-white">{evacuationRoute.startLocationName}</b></p>
                <p>DESTINATION: <b className="text-emerald-400">{evacuationRoute.destination?.name || "PLAYGROUND"}</b></p>
              </div>
            </div>

            {/* 15 Verified Locations Directory */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                CAMPUS LOCATIONS ({CAMPUS_LOCATIONS.length}):
              </span>
              <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1">
                {CAMPUS_LOCATIONS.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => {
                      setSelectedStartId(loc.id);
                      setUserLocation(null);
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.panTo({ lat: loc.lat, lng: loc.lng });
                        mapInstanceRef.current.setZoom(19);
                      }
                    }}
                    className={`p-2 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-colors ${
                      selectedStartId === loc.id && !userLocation
                        ? "bg-blue-950/80 border-blue-500 text-cyan-300"
                        : "bg-[#141D32] hover:bg-[#1A2640] border-[#1E2C48] text-slate-200"
                    }`}
                  >
                    <span className="font-bold text-[11px] truncate uppercase">{loc.name}</span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      loc.isSafeZone ? "bg-emerald-950 text-emerald-300 border border-emerald-700" : "text-slate-400"
                    }`}>
                      {loc.isSafeZone ? "SAFE ZONE" : loc.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* GPS My Location Button */}
            <button
              type="button"
              onClick={handleMyLocation}
              disabled={isLocating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg transition-all active:scale-95 uppercase"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>{isLocating ? "LOCATING..." : "📍 MY LOCATION"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
