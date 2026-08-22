// Campus Sentinel - Vignan University 3D Digital Twin & Dynamic Campus Evacuation Network
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSentinel } from "../context/SentinelContext";
import { useGoogleMaps } from "../utils/googleMapsLoader";
import {
  CAMPUS_CENTER,
  CAMPUS_LOCATIONS,
  CAMPUS_ROAD_EDGES,
  ALL_NETWORK_NODES,
  calculateCustomCampusRoute
} from "../data/vignanCampusNetwork";
import { CAMPUS_CAMERAS } from "../data/campusLocations";
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
  Settings2,
  HelpCircle,
  Footprints,
  ShieldAlert,
  Building
} from "lucide-react";

export const CampusMap = ({ height = "h-[640px]", interactive = true }) => {
  const {
    activeIncident,
    activeEmergencyEvent,
    currentRole,
    openResolveModal
  } = useSentinel();

  const isAuthorizedForAdmin = currentRole === "ADMIN";
  const isAuthorizedForSecurity = currentRole === "ADMIN" || currentRole === "SECURITY";
  const isAuthorizedForCameras = isAuthorizedForSecurity;

  const { mapsLoaded, loadError, mapId } = useGoogleMaps();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const circlesRef = useRef([]);
  const routePolylineRef = useRef(null);
  const arrowPolylineRef = useRef(null);
  const blockedPolylinesRef = useRef([]);

  // Map Controls State
  const [is3DMode, setIs3DMode] = useState(true);
  const [showLocations, setShowLocations] = useState(true);
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [showCameras, setShowCameras] = useState(isAuthorizedForCameras);
  const [showCampusNetwork, setShowCampusNetwork] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Selected Start Location (Defaults to incident location or A-Block)
  const [selectedStartLocationId, setSelectedStartLocationId] = useState("a-block");

  // Admin Route Blockage & Network Editor State
  const [showRouteEditor, setShowRouteEditor] = useState(false);
  const [blockedEdgeIds, setBlockedEdgeIds] = useState([]);

  // Calculated Dynamic Evacuation Route
  const [routeResult, setRouteResult] = useState(() =>
    calculateCustomCampusRoute({
      originLocationId: "a-block",
      incidentLocationId: activeIncident?.locationId || "a-block",
      hazardRadius: activeIncident?.hazardRadius || 85,
      blockedEdgeIds: []
    })
  );

  // Selected item popover
  const [selectedItem, setSelectedItem] = useState(null);

  // 1. Initialize Google 3D Vector Map
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
        gestureHandling: interactive ? "greedy" : "none",
        isFractionalZoomEnabled: true
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

    blockedPolylinesRef.current.forEach(p => { if (p.setMap) p.setMap(null); });
    blockedPolylinesRef.current = [];
  }, []);

  // 3. Compute Dynamic Route whenever Incident, Blocked Roads, or Origin changes
  useEffect(() => {
    const originId = userLocation ? null : (selectedStartLocationId || "a-block");

    const result = calculateCustomCampusRoute({
      originLocationId: originId,
      userGpsCoords: userLocation,
      incidentLocationId: activeIncident?.locationId || (activeIncident ? "a-block" : null),
      incidentCoords: activeIncident?.locationCoords || null,
      hazardRadius: activeIncident?.hazardRadius || 85,
      blockedEdgeIds: blockedEdgeIds,
      preferredSafeZoneId: "playground"
    });

    setRouteResult(result);
  }, [activeIncident, blockedEdgeIds, selectedStartLocationId, userLocation]);

  // 4. Render All Custom Markers, Danger Zones, Blocked Paths & Animated Safe Route
  const renderMapLayers = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google || !window.google.maps) return;

    clearMapOverlays();

    // A. 15 OFFICIAL VIGNAN UNIVERSITY LOCATIONS
    if (showLocations) {
      CAMPUS_LOCATIONS.forEach((loc) => {
        const isSafeZone = loc.isSafeZone;
        const isPrimarySafeZone = loc.id === "playground";

        // SVG Pin Color & Glyph based on location type
        let pinColor = "#0284C7"; // Default building (Cyan/Blue)
        let pinBorder = "#38BDF8";
        let symbolText = "🏢";

        if (isSafeZone) {
          pinColor = isPrimarySafeZone ? "#10B981" : "#059669";
          pinBorder = "#6EE7B7";
          symbolText = "★";
        } else if (loc.type === "hostel") {
          pinColor = "#D97706";
          pinBorder = "#FBBF24";
          symbolText = "🏠";
        } else if (loc.type === "facility") {
          pinColor = "#7C3AED";
          pinBorder = "#C084FC";
          symbolText = "🏛️";
        } else if (loc.type === "library") {
          pinColor = "#2563EB";
          pinBorder = "#93C5FD";
          symbolText = "📚";
        } else if (loc.type === "gate") {
          pinColor = "#475569";
          pinBorder = "#94A3B8";
          symbolText = "🚪";
        }

        const iconSvg = `
          <svg width="32" height="38" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.16 0 0 7.16 0 16C0 27.5 16 38 16 38C16 38 32 27.5 32 16C32 7.16 24.84 0 16 0Z" fill="${pinColor}" stroke="${pinBorder}" stroke-width="2"/>
            <circle cx="16" cy="15" r="9" fill="#0F172A"/>
            <text x="16" y="19" font-family="sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${symbolText}</text>
          </svg>
        `;

        const marker = new window.google.maps.Marker({
          position: { lat: loc.lat, lng: loc.lng },
          map: map,
          title: loc.name,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(iconSvg)}`,
            scaledSize: new window.google.maps.Size(30, 36),
            anchor: new window.google.maps.Point(15, 36)
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="background:#0F172A; color:#F8FAFC; padding:8px 12px; border-radius:12px; font-family:sans-serif; border:1px solid ${pinBorder}; max-width:240px;">
              <h4 style="margin:0 0 3px 0; font-size:13px; font-weight:800; color:${pinBorder};">${loc.name}</h4>
              <p style="margin:0 0 4px 0; font-size:11px; color:#CBD5E1;">${loc.fullName}</p>
              <p style="margin:0; font-size:10px; color:#94A3B8;">Category: <b>${loc.category}</b></p>
              ${isSafeZone ? `<p style="margin:4px 0 0 0; font-size:10px; font-weight:bold; color:#34D399;">★ VERIFIED SAFE ASSEMBLY ZONE (Capacity: ${loc.safeZoneCapacity || 1500})</p>` : ''}
            </div>
          `
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
          setSelectedItem({ type: "LOCATION", data: loc });
          setSelectedStartLocationId(loc.id);
        });

        markersRef.current.push(marker);
      });
    }

    // B. CCTV CAMERAS (STRICTLY ADMIN & SECURITY ONLY)
    if (showCameras && isAuthorizedForCameras) {
      CAMPUS_CAMERAS.forEach((cam) => {
        const iconSvg = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" fill="#0F172A" stroke="#06B6D4" stroke-width="2"/>
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

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="background:#0F172A; color:#F8FAFC; padding:8px 12px; border-radius:12px; font-family:sans-serif; border:1px solid #06B6D4; max-width:220px;">
              <h4 style="margin:0 0 3px 0; font-size:12px; font-weight:800; color:#22D3EE;">${cam.id}: ${cam.name}</h4>
              <p style="margin:0; font-size:10px; color:#94A3B8;">Status: <b style="color:#34D399;">${cam.status}</b> (${cam.aiConfidence}% AI Confidence)</p>
            </div>
          `
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
          setSelectedItem({ type: "CAMERA", data: cam });
        });

        markersRef.current.push(marker);
      });
    }

    // C. USER CURRENT LOCATION (GPS)
    if (userLocation) {
      const userSvg = `
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="#3B82F6" fill-opacity="0.35" stroke="#60A5FA" stroke-width="2"/>
          <circle cx="16" cy="16" r="7" fill="#2563EB" stroke="#FFFFFF" stroke-width="2"/>
        </svg>
      `;

      const userMarker = new window.google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Your GPS Location",
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(userSvg)}`,
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16)
        }
      });
      markersRef.current.push(userMarker);
    }

    // D. DANGER ZONES & ACTIVE EMERGENCY INCIDENT
    if (activeIncident) {
      const incidentType = (activeIncident.type || "FIRE").toUpperCase();
      const hazardRadius = activeIncident.hazardRadius || 85;

      const incidentColorMap = {
        FIRE: { stroke: "#EF4444", fill: "#DC2626", emoji: "🔥" },
        MEDICAL: { stroke: "#F43F5E", fill: "#E11D48", emoji: "🚑" },
        SECURITY: { stroke: "#3B82F6", fill: "#1D4ED8", emoji: "🛡️" },
        ACCIDENT: { stroke: "#F97316", fill: "#EA580C", emoji: "⚠️" },
        WEATHER: { stroke: "#A855F7", fill: "#7E22CE", emoji: "🌧️" },
        CROWD: { stroke: "#F59E0B", fill: "#D97706", emoji: "👥" }
      };

      const theme = incidentColorMap[incidentType] || incidentColorMap.FIRE;
      const incidentCoords = activeIncident.locationCoords || {
        lat: CAMPUS_LOCATIONS[0].lat,
        lng: CAMPUS_LOCATIONS[0].lng
      };

      // 1. Outer Translucent Danger Circle
      const dangerCircle = new window.google.maps.Circle({
        strokeColor: theme.stroke,
        strokeOpacity: 0.9,
        strokeWeight: 2.5,
        fillColor: theme.fill,
        fillOpacity: 0.3,
        map: map,
        center: incidentCoords,
        radius: hazardRadius
      });
      circlesRef.current.push(dangerCircle);

      // 2. Inner Pulsing Core Circle
      const innerCoreCircle = new window.google.maps.Circle({
        strokeColor: theme.stroke,
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: theme.fill,
        fillOpacity: 0.5,
        map: map,
        center: incidentCoords,
        radius: hazardRadius * 0.45
      });
      circlesRef.current.push(innerCoreCircle);

      // 3. Emergency Incident Pin
      const emergencySvg = `
        <svg width="42" height="50" viewBox="0 0 42 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 0C9.4 0 0 9.4 0 21C0 36.5 21 50 21 50C21 50 42 36.5 42 21C42 9.4 32.6 0 21 0Z" fill="${theme.stroke}" stroke="#FFFFFF" stroke-width="2.5"/>
          <circle cx="21" cy="20" r="13" fill="#7F1D1D"/>
          <text x="21" y="25" font-family="sans-serif" font-size="14" text-anchor="middle">${theme.emoji}</text>
        </svg>
      `;

      const incidentMarker = new window.google.maps.Marker({
        position: incidentCoords,
        map: map,
        title: `EMERGENCY: ${incidentType}`,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(emergencySvg)}`,
          scaledSize: new window.google.maps.Size(42, 50),
          anchor: new window.google.maps.Point(21, 50)
        },
        animation: window.google.maps.Animation.BOUNCE
      });

      incidentMarker.addListener("click", () => {
        setSelectedItem({ type: "INCIDENT", data: activeIncident });
      });

      markersRef.current.push(incidentMarker);
    }

    // E. BLOCKED ROAD SEGMENTS (RED DASHED LINES)
    if (blockedEdgeIds.length > 0) {
      blockedEdgeIds.forEach(edgeId => {
        const edge = CAMPUS_ROAD_EDGES.find(e => e.id === edgeId);
        if (!edge) return;
        const nodeA = ALL_NETWORK_NODES[edge.from];
        const nodeB = ALL_NETWORK_NODES[edge.to];
        if (!nodeA || !nodeB) return;

        const blockedLine = new window.google.maps.Polyline({
          path: [{ lat: nodeA.lat, lng: nodeA.lng }, { lat: nodeB.lat, lng: nodeB.lng }],
          strokeColor: "#EF4444",
          strokeOpacity: 0.9,
          strokeWeight: 5,
          map: map
        });
        blockedPolylinesRef.current.push(blockedLine);
      });
    }

    // F. DYNAMIC VIGNAN CAMPUS EVACUATION ROUTE WITH DIRECTIONAL ARROWS
    if (routeResult && routeResult.coordinates && routeResult.coordinates.length > 1) {
      // 1. Ambient Glow Underlay
      const glowPolyline = new window.google.maps.Polyline({
        path: routeResult.coordinates,
        geodesic: true,
        strokeColor: "#06B6D4",
        strokeOpacity: 0.45,
        strokeWeight: 10,
        map: map
      });
      routePolylineRef.current = glowPolyline;

      // 2. Main High-Contrast Evacuation Line with Directional Arrows
      const lineSymbol = {
        path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 3,
        strokeColor: "#FFFFFF",
        fillColor: "#38BDF8",
        fillOpacity: 1
      };

      const arrowPolyline = new window.google.maps.Polyline({
        path: routeResult.coordinates,
        geodesic: true,
        strokeColor: "#0EA5E9",
        strokeOpacity: 0.95,
        strokeWeight: 5,
        icons: [
          {
            icon: lineSymbol,
            offset: "20%",
            repeat: "70px"
          }
        ],
        map: map
      });
      arrowPolylineRef.current = arrowPolyline;
    }
  }, [
    showLocations,
    showCameras,
    isAuthorizedForCameras,
    userLocation,
    activeIncident,
    blockedEdgeIds,
    routeResult,
    clearMapOverlays
  ]);

  // Re-render when maps or dependencies update
  useEffect(() => {
    if (mapsLoaded && mapInstanceRef.current) {
      renderMapLayers();
    }
  }, [mapsLoaded, renderMapLayers]);

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
  const handleResetCampus = () => {
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
        setLocationError("Unable to acquire GPS location. Using campus starting point.");
        console.warn("[CampusMap] GPS error:", err);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Toggle Road Blockage (Admin & Security Feature)
  const handleToggleBlockEdge = (edgeId) => {
    setBlockedEdgeIds(prev =>
      prev.includes(edgeId) ? prev.filter(id => id !== edgeId) : [...prev, edgeId]
    );
  };

  const isEmergencyActive = !!activeIncident || !!activeEmergencyEvent;
  const currentIncident = activeIncident || {
    type: activeEmergencyEvent?.eventType || "FIRE",
    location: activeEmergencyEvent?.affectedArea || "A-Block (Administration)",
    severity: activeEmergencyEvent?.severity || "HIGH",
    confidence: 94
  };

  return (
    <div className="w-full flex flex-col lg:flex-row items-stretch gap-4 animate-fade-in box-border">
      {/* ============================================================ */}
      {/* LEFT SECTION (73%): 3D GOOGLE CAMPUS MAP & CONTROLS          */}
      {/* ============================================================ */}
      <div className="w-full lg:w-[73%] flex flex-col space-y-3">
        {/* Map Viewport Card */}
        <div className={`relative w-full ${height} rounded-3xl overflow-hidden bg-[#07111F] border-2 border-[#1E2C48] shadow-2xl group`}>
          {/* Google Maps Container */}
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

          {/* Top-Left Campus Branding & Active Route Notice */}
          <div className="absolute top-3.5 left-3.5 z-20 flex flex-col space-y-1.5 bg-[#0B1220]/92 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-[#1E2C48] shadow-xl max-w-sm">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <h3 className="text-xs font-black text-white leading-tight">
                Vignan University • 3D Campus Network
              </h3>
            </div>
            <p className="text-[10px] font-mono text-cyan-300">
              15 Verified Buildings • Dynamic AI Evacuation Routing
            </p>
          </div>

          {/* Top-Right Quick Map Controls */}
          <div className="absolute top-3.5 right-3.5 z-20 flex items-center space-x-1.5 bg-[#0B1220]/92 backdrop-blur-md p-1.5 rounded-2xl border border-[#1E2C48] shadow-xl">
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
              onClick={handleResetCampus}
              className="p-1.5 rounded-xl bg-[#141D32] hover:bg-slate-700 text-slate-200 hover:text-cyan-300 transition-colors"
              title="Reset Campus View"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
            </button>

            {/* Admin / Security Route Editor Toggle */}
            {isAuthorizedForSecurity && (
              <button
                type="button"
                onClick={() => setShowRouteEditor(prev => !prev)}
                className={`p-1.5 rounded-xl border transition-colors ${
                  showRouteEditor
                    ? "bg-amber-600 border-amber-400 text-white"
                    : "bg-[#141D32] border-[#1E2C48] text-amber-300 hover:bg-[#1A2640]"
                }`}
                title="Admin Route Blockage & Network Manager"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Bottom-Right Zoom Controls */}
          <div className="absolute bottom-4 right-4 z-20 flex flex-col space-y-1.5 bg-[#0B1220]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#1E2C48] shadow-xl">
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

          {/* Bottom-Left Layer Toggles Bar */}
          <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-[#0B1220]/90 backdrop-blur-md p-2 rounded-2xl border border-[#1E2C48] shadow-xl text-[11px]">
            <label className="flex items-center space-x-1.5 text-slate-300 cursor-pointer px-2 py-1 rounded-lg hover:bg-[#141D32]">
              <input
                type="checkbox"
                checked={showLocations}
                onChange={(e) => setShowLocations(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
              />
              <span className="font-semibold text-sky-300">🏢 Locations (15)</span>
            </label>

            {/* STRICT ADMIN & SECURITY CAMERA TOGGLE */}
            {isAuthorizedForCameras && (
              <label className="flex items-center space-x-1.5 text-slate-300 cursor-pointer px-2 py-1 rounded-lg hover:bg-[#141D32]">
                <input
                  type="checkbox"
                  checked={showCameras}
                  onChange={(e) => setShowCameras(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-0"
                />
                <span className="text-cyan-300">📷 CCTV Feeds (8)</span>
              </label>
            )}

            {blockedEdgeIds.length > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-red-950 text-red-300 font-mono text-[10px] font-bold border border-red-700 flex items-center space-x-1">
                <Ban className="w-3 h-3" />
                <span>{blockedEdgeIds.length} PATHS BLOCKED</span>
              </span>
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

        {/* ADMIN / SECURITY ROAD BLOCKAGE MANAGER MODAL / ACCORDION */}
        {showRouteEditor && isAuthorizedForSecurity && (
          <div className="p-4 rounded-2xl bg-[#0F1626] border-2 border-amber-500/70 shadow-xl space-y-3 animate-fade-in text-left">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E2C48]">
              <div className="flex items-center space-x-2">
                <Settings2 className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Admin Campus Road Blockage & Dynamic Rerouting Manager
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setBlockedEdgeIds([])}
                className="text-[10px] font-mono text-cyan-400 hover:underline"
              >
                Clear All Blockages
              </button>
            </div>

            <p className="text-[11px] text-slate-300">
              Click any campus road segment to simulate a hazard/blockage. The AI graph algorithm will instantly recompute the safest alternative route avoiding blocked segments!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[160px] overflow-y-auto pr-1">
              {CAMPUS_ROAD_EDGES.map((edge) => {
                const isBlocked = blockedEdgeIds.includes(edge.id);
                return (
                  <button
                    key={edge.id}
                    type="button"
                    onClick={() => handleToggleBlockEdge(edge.id)}
                    className={`p-2 rounded-xl text-left text-[11px] font-semibold border transition-all flex items-center justify-between ${
                      isBlocked
                        ? "bg-red-950/80 border-red-500 text-red-200"
                        : "bg-[#141D32] border-[#1E2C48] text-slate-300 hover:bg-[#1A2640]"
                    }`}
                  >
                    <span className="truncate pr-1">{edge.name}</span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isBlocked ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}>
                      {isBlocked ? "BLOCKED" : "OPEN"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* RIGHT SECTION (27%): LIVE EMERGENCY & EVACUATION ROUTE PANEL  */}
      {/* ============================================================ */}
      <div className="w-full lg:w-[27%] flex flex-col space-y-4">
        {/* Dynamic Start Location Selector */}
        <div className="p-4 rounded-2xl bg-[#0F1626] border border-[#1E2C48] space-y-2 text-left shadow-lg">
          <label className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
            Select Your Starting Location:
          </label>
          <select
            value={selectedStartLocationId}
            onChange={(e) => {
              setSelectedStartLocationId(e.target.value);
              setUserLocation(null);
            }}
            className="w-full p-2.5 rounded-xl bg-[#141D32] border border-[#1E2C48] text-white text-xs font-bold focus:outline-none focus:border-cyan-500"
          >
            {CAMPUS_LOCATIONS.map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.name} {loc.isSafeZone ? "(Safe Zone)" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* ACTIVE EMERGENCY / PEACETIME ROUTING PANEL */}
        {isEmergencyActive ? (
          <div className="p-5 rounded-3xl bg-[#0F1626] border-2 border-red-500/80 shadow-2xl space-y-4 text-left animate-pulse-glow">
            {/* Header Status */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2C48]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  LIVE EMERGENCY STATUS
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-red-950 border border-red-700 text-red-300 text-[10px] font-mono font-bold">
                CRITICAL
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
                <span className="text-slate-400 font-mono text-[10px] uppercase">EPICENTER:</span>
                <span className="font-bold text-white text-right max-w-[140px] truncate">{currentIncident.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono text-[10px] uppercase">AI CONFIDENCE:</span>
                <span className="font-bold text-cyan-400 font-mono">{currentIncident.confidence || 94}%</span>
              </div>
            </div>

            {/* Primary Recommended Safe Zone & Real Distance */}
            <div className="bg-[#141D32] p-3.5 rounded-2xl border border-[#1E2C48] space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>PRIMARY SAFE ASSEMBLY AREA</span>
              </div>
              <p className="text-xs font-black text-white">
                {routeResult.destinationSafeZone?.fullName || "Playground (Primary Safe Zone)"}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1E2C48] text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">DISTANCE:</span>
                  <strong className="text-emerald-300 font-mono">{routeResult.distanceText}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">EST. WALK TIME:</span>
                  <strong className="text-cyan-300 font-mono">{routeResult.durationText}</strong>
                </div>
              </div>
            </div>

            {/* Step-by-Step Waypoint Route Navigation */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                CAMPUS EVACUATION WAYPOINTS:
              </span>
              <div className="p-3 rounded-2xl bg-[#0B101D] border border-[#1E2C48] space-y-2 text-xs">
                {routeResult.pathNames?.map((nodeName, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                      idx === 0
                        ? "bg-blue-600 text-white"
                        : idx === routeResult.pathNames.length - 1
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-800 text-cyan-300"
                    }`}>
                      {idx + 1}
                    </span>
                    <span className={`text-[11px] truncate ${
                      idx === routeResult.pathNames.length - 1
                        ? "font-bold text-emerald-300"
                        : "text-slate-200"
                    }`}>
                      {nodeName}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (mapInstanceRef.current && routeResult.coordinates?.[0]) {
                    mapInstanceRef.current.panTo(routeResult.coordinates[0]);
                    mapInstanceRef.current.setZoom(19);
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg transition-all active:scale-95"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>FOLLOW SAFE CAMPUS ROUTE</span>
              </button>

              {isAuthorizedForSecurity && (
                <button
                  type="button"
                  onClick={() => openResolveModal(activeIncident)}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition-all active:scale-95 border border-emerald-400/30"
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
                15 campus buildings and 8 CCTV feeds monitored in real-time. Standby evacuation paths verified.
              </p>
            </div>

            {/* Quick Safe Route Preview from Current Selection */}
            <div className="p-3.5 rounded-2xl bg-[#141D32] border border-[#1E2C48] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[10px]">ROUTE TO PLAYGROUND:</span>
                <span className="text-emerald-400 font-bold font-mono">{routeResult.distanceText} ({routeResult.durationText})</span>
              </div>
              <div className="text-[10px] font-mono text-slate-300 space-y-1">
                <p>Origin: <b className="text-white">{routeResult.startLocationName}</b></p>
                <p>Dest: <b className="text-emerald-400">Playground (Safe Zone)</b></p>
              </div>
            </div>

            {/* 15 Locations Quick Pan Directory */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                CAMPUS LOCATIONS (15):
              </span>
              <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1">
                {CAMPUS_LOCATIONS.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => {
                      setSelectedStartLocationId(loc.id);
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.panTo({ lat: loc.lat, lng: loc.lng });
                        mapInstanceRef.current.setZoom(19);
                      }
                    }}
                    className={`p-2 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-colors ${
                      selectedStartLocationId === loc.id
                        ? "bg-blue-950/80 border-blue-500 text-cyan-300"
                        : "bg-[#141D32] hover:bg-[#1A2640] border-[#1E2C48] text-slate-200"
                    }`}
                  >
                    <span className="font-bold text-[11px] truncate">{loc.name}</span>
                    <span className="text-[9px] font-mono text-slate-400">{loc.category}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* GPS My Location Button */}
            <button
              type="button"
              onClick={handleMyLocation}
              disabled={isLocating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg transition-all active:scale-95"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>{isLocating ? "LOCATING..." : "FIND MY LOCATION"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
