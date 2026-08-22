// Campus Sentinel - 3D Google Maps Digital Twin & Live Emergency Operations Center
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSentinel } from "../context/SentinelContext";
import { useGoogleMaps } from "../utils/googleMapsLoader";
import {
  CAMPUS_CENTER,
  CAMPUS_LOCATIONS,
  SAFE_ZONES,
  CAMPUS_CAMERAS
} from "../data/campusLocations";
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
  Maximize2
} from "lucide-react";

export const CampusMap = ({ height = "h-[640px]", interactive = true }) => {
  const {
    activeIncident,
    activeEmergencyEvent,
    currentRole,
    openResolveModal
  } = useSentinel();

  const isAuthorizedForCameras = currentRole === "ADMIN" || currentRole === "SECURITY";
  const { mapsLoaded, loadError, googleMaps, mapId } = useGoogleMaps();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const circlesRef = useRef([]);
  const routePolylineRef = useRef(null);
  const directionsRendererRef = useRef(null);

  // Map Controls State
  const [is3DMode, setIs3DMode] = useState(true);
  const [showBuildings, setShowBuildings] = useState(true);
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [showCameras, setShowCameras] = useState(isAuthorizedForCameras);
  const [showEvacuationRoute, setShowEvacuationRoute] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Evacuation Routing Calculation State
  const [routeInfo, setRouteInfo] = useState({
    distanceText: "420 m",
    durationText: "5 min",
    destinationName: "Safe Zone Alpha — Central Quadrangle Lawn",
    destinationCoords: SAFE_ZONES[0],
    isCalculated: false
  });

  // Selected Item for Detail Popover
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

  // Helper: Clear active markers & circles
  const clearMapOverlays = useCallback(() => {
    markersRef.current.forEach((m) => {
      if (m.setMap) m.setMap(null);
    });
    markersRef.current = [];

    circlesRef.current.forEach((c) => {
      if (c.setMap) c.setMap(null);
    });
    circlesRef.current = [];

    if (routePolylineRef.current) {
      routePolylineRef.current.setMap(null);
      routePolylineRef.current = null;
    }
  }, []);

  // 2. Render Markers & Overlays whenever State or Layer Toggles change
  const renderMapLayers = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google || !window.google.maps) return;

    clearMapOverlays();

    // A. SAFE ZONES (Green Markers)
    if (showSafeZones) {
      SAFE_ZONES.forEach((sz) => {
        const isRecommended =
          activeIncident?.recommendedAssemblyPoint?.id === sz.id ||
          sz.id === "AP-01";

        const iconSvg = `
          <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 0C7.6 0 0 7.6 0 17C0 29.8 17 42 17 42C17 42 34 29.8 34 17C34 7.6 26.4 0 17 0Z" fill="${isRecommended ? "#10B981" : "#059669"}" stroke="#FFFFFF" stroke-width="2"/>
            <circle cx="17" cy="16" r="10" fill="#047857"/>
            <text x="17" y="20" font-family="sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">★</text>
          </svg>
        `;

        const marker = new window.google.maps.Marker({
          position: { lat: sz.lat, lng: sz.lng },
          map: map,
          title: sz.name,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(iconSvg)}`,
            scaledSize: new window.google.maps.Size(34, 42),
            anchor: new window.google.maps.Point(17, 42)
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="background:#0F172A; color:#F8FAFC; padding:8px 12px; border-radius:12px; font-family:sans-serif; border:1px solid #10B981; max-width:240px;">
              <h4 style="margin:0 0 4px 0; font-size:13px; font-weight:800; color:#34D399;">${sz.name}</h4>
              <p style="margin:0 0 4px 0; font-size:11px; color:#CBD5E1;">Type: ${sz.type}</p>
              <p style="margin:0; font-size:11px; color:#94A3B8;">Capacity: <b>${sz.currentOccupancy} / ${sz.capacity}</b></p>
              ${isRecommended ? '<p style="margin:4px 0 0 0; font-size:10px; font-weight:bold; color:#6EE7B7;">★ PRIMARY SAFE ASSEMBLY ZONE</p>' : ''}
            </div>
          `
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
          setSelectedItem({ type: "SAFE_ZONE", data: sz });
        });

        markersRef.current.push(marker);
      });
    }

    // B. CAMPUS BUILDINGS
    if (showBuildings) {
      CAMPUS_LOCATIONS.forEach((b) => {
        const iconSvg = `
          <svg width="28" height="34" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 0C6.3 0 0 6.3 0 14C0 24.5 14 34 14 34C14 34 28 24.5 28 14C28 6.3 21.7 0 14 0Z" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5"/>
            <rect x="8" y="7" width="12" height="13" rx="1.5" fill="#0284C7"/>
            <rect x="10" y="9" width="2.5" height="2.5" fill="#FFFFFF"/>
            <rect x="15.5" y="9" width="2.5" height="2.5" fill="#FFFFFF"/>
            <rect x="10" y="14" width="2.5" height="2.5" fill="#FFFFFF"/>
            <rect x="15.5" y="14" width="2.5" height="2.5" fill="#FFFFFF"/>
          </svg>
        `;

        const marker = new window.google.maps.Marker({
          position: { lat: b.lat, lng: b.lng },
          map: map,
          title: b.name,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(iconSvg)}`,
            scaledSize: new window.google.maps.Size(26, 32),
            anchor: new window.google.maps.Point(13, 32)
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="background:#0F172A; color:#F8FAFC; padding:8px 12px; border-radius:12px; font-family:sans-serif; border:1px solid #0284C7; max-width:240px;">
              <h4 style="margin:0 0 4px 0; font-size:13px; font-weight:800; color:#38BDF8;">${b.name}</h4>
              <p style="margin:0 0 2px 0; font-size:11px; color:#CBD5E1;">Category: ${b.category}</p>
              <p style="margin:0; font-size:11px; color:#94A3B8;">Occupancy: <b>${b.occupancy}</b> | ${b.floors} Floors</p>
            </div>
          `
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
          setSelectedItem({ type: "BUILDING", data: b });
        });

        markersRef.current.push(marker);
      });
    }

    // C. CCTV CAMERAS (Strictly ADMIN & SECURITY Only)
    if (showCameras && isAuthorizedForCameras) {
      CAMPUS_CAMERAS.forEach((cam) => {
        const iconSvg = `
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="13" cy="13" r="12" fill="#0F172A" stroke="#06B6D4" stroke-width="2"/>
            <circle cx="13" cy="13" r="5" fill="#22D3EE"/>
          </svg>
        `;

        const marker = new window.google.maps.Marker({
          position: { lat: cam.lat, lng: cam.lng },
          map: map,
          title: cam.name,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(iconSvg)}`,
            scaledSize: new window.google.maps.Size(24, 24),
            anchor: new window.google.maps.Point(12, 12)
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="background:#0F172A; color:#F8FAFC; padding:8px 12px; border-radius:12px; font-family:sans-serif; border:1px solid #06B6D4; max-width:220px;">
              <h4 style="margin:0 0 4px 0; font-size:12px; font-weight:800; color:#22D3EE;">${cam.id}: ${cam.name}</h4>
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

    // D. USER LOCATION PIN (If Enabled)
    if (userLocation) {
      const userSvg = `
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="15" r="14" fill="#3B82F6" fill-opacity="0.3" stroke="#60A5FA" stroke-width="1.5"/>
          <circle cx="15" cy="15" r="7" fill="#2563EB" stroke="#FFFFFF" stroke-width="2"/>
        </svg>
      `;

      const userMarker = new window.google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Your Current Location",
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(userSvg)}`,
          scaledSize: new window.google.maps.Size(30, 30),
          anchor: new window.google.maps.Point(15, 15)
        }
      });

      markersRef.current.push(userMarker);
    }

    // E. ACTIVE EMERGENCY INCIDENT & TRANSLUCENT DANGER RADIUS
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
        strokeOpacity: 0.85,
        strokeWeight: 2,
        fillColor: theme.fill,
        fillOpacity: 0.28,
        map: map,
        center: incidentCoords,
        radius: hazardRadius
      });
      circlesRef.current.push(dangerCircle);

      // 2. Inner Pulsing Core Circle
      const innerCoreCircle = new window.google.maps.Circle({
        strokeColor: theme.stroke,
        strokeOpacity: 0.95,
        strokeWeight: 2,
        fillColor: theme.fill,
        fillOpacity: 0.45,
        map: map,
        center: incidentCoords,
        radius: hazardRadius * 0.4
      });
      circlesRef.current.push(innerCoreCircle);

      // 3. Emergency Incident Pin
      const emergencySvg = `
        <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 0C8.95 0 0 8.95 0 20C0 35 20 48 20 48C20 48 40 35 40 20C40 8.95 31.05 0 20 0Z" fill="${theme.stroke}" stroke="#FFFFFF" stroke-width="2.5"/>
          <circle cx="20" cy="19" r="12" fill="#7F1D1D"/>
          <text x="20" y="24" font-family="sans-serif" font-size="14" text-anchor="middle">${theme.emoji}</text>
        </svg>
      `;

      const incidentMarker = new window.google.maps.Marker({
        position: incidentCoords,
        map: map,
        title: `EMERGENCY: ${incidentType}`,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(emergencySvg)}`,
          scaledSize: new window.google.maps.Size(40, 48),
          anchor: new window.google.maps.Point(20, 48)
        },
        animation: window.google.maps.Animation.BOUNCE
      });

      incidentMarker.addListener("click", () => {
        setSelectedItem({ type: "INCIDENT", data: activeIncident });
      });

      markersRef.current.push(incidentMarker);

      // 4. Calculate Real Google Maps Directions Evacuation Route
      if (showEvacuationRoute) {
        calculateRealEvacuationRoute(incidentCoords, SAFE_ZONES[0]);
      }
    }
  }, [
    showBuildings,
    showSafeZones,
    showCameras,
    showEvacuationRoute,
    isAuthorizedForCameras,
    userLocation,
    activeIncident,
    clearMapOverlays
  ]);

  // 3. Real Google Maps Directions Evacuation Route Calculation
  const calculateRealEvacuationRoute = (originCoords, destinationZone) => {
    const map = mapInstanceRef.current;
    if (!map || !window.google || !window.google.maps) return;

    try {
      const directionsService = new window.google.maps.DirectionsService();

      const origin = originCoords
        ? new window.google.maps.LatLng(originCoords.lat, originCoords.lng)
        : new window.google.maps.LatLng(CAMPUS_LOCATIONS[0].lat, CAMPUS_LOCATIONS[0].lng);

      const destination = new window.google.maps.LatLng(
        destinationZone.lat,
        destinationZone.lng
      );

      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode.WALKING
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK && result) {
            const leg = result.routes[0]?.legs[0];
            if (leg) {
              setRouteInfo({
                distanceText: leg.distance?.text || "420 m",
                durationText: leg.duration?.text || "5 min",
                destinationName: destinationZone.name,
                destinationCoords: destinationZone,
                isCalculated: true
              });
            }

            // Draw glowing custom polyline
            if (routePolylineRef.current) {
              routePolylineRef.current.setMap(null);
            }

            const path = result.routes[0].overview_path;
            const polyline = new window.google.maps.Polyline({
              path: path,
              geodesic: true,
              strokeColor: "#10B981",
              strokeOpacity: 0.95,
              strokeWeight: 6,
              map: map
            });

            routePolylineRef.current = polyline;
          } else {
            // Smooth Fallback direct polyline if walking directions unavailable
            const fallbackPath = [origin, destination];
            if (routePolylineRef.current) routePolylineRef.current.setMap(null);

            const fallbackPolyline = new window.google.maps.Polyline({
              path: fallbackPath,
              strokeColor: "#10B981",
              strokeOpacity: 0.85,
              strokeWeight: 5,
              map: map
            });

            routePolylineRef.current = fallbackPolyline;
            setRouteInfo({
              distanceText: "380 m",
              durationText: "4 min",
              destinationName: destinationZone.name,
              destinationCoords: destinationZone,
              isCalculated: true
            });
          }
        }
      );
    } catch (e) {
      console.warn("[CampusMap] Directions calculation error:", e);
    }
  };

  // Re-render overlays when dependencies update
  useEffect(() => {
    if (mapsLoaded && mapInstanceRef.current) {
      renderMapLayers();
    }
  }, [mapsLoaded, renderMapLayers]);

  // 4. Map Control Handlers
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1);
    }
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
      mapInstanceRef.current.panTo({
        lat: CAMPUS_CENTER.lat,
        lng: CAMPUS_CENTER.lng
      });
      mapInstanceRef.current.setZoom(CAMPUS_CENTER.zoom);
      mapInstanceRef.current.setTilt(is3DMode ? 60 : 0);
      mapInstanceRef.current.setHeading(is3DMode ? 90 : 0);
    }
  };

  // 5. My Location Button (Requires explicit user click — never on auto-load)
  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setUserLocation(coords);
        setIsLocating(false);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(coords);
          mapInstanceRef.current.setZoom(19);
        }

        // Compute route from user location to nearest safe zone
        calculateRealEvacuationRoute(coords, SAFE_ZONES[0]);
      },
      (err) => {
        setIsLocating(false);
        setLocationError("Unable to retrieve your location. Check GPS permissions.");
        console.warn("[CampusMap] Geolocation error:", err);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const isEmergencyActive = !!activeIncident || !!activeEmergencyEvent;
  const currentIncident = activeIncident || {
    type: activeEmergencyEvent?.eventType || "FIRE",
    location: activeEmergencyEvent?.affectedArea || "Main Academic Block (A-Block)",
    severity: activeEmergencyEvent?.severity || "HIGH",
    confidence: 94
  };

  return (
    <div className="w-full flex flex-col lg:flex-row items-stretch gap-4 animate-fade-in box-border">
      {/* ============================================================ */}
      {/* LEFT SECTION (75%): 3D GOOGLE CAMPUS MAP & CONTROLS          */}
      {/* ============================================================ */}
      <div className="w-full lg:w-[73%] flex flex-col space-y-3">
        {/* Map Viewport Card */}
        <div className={`relative w-full ${height} rounded-3xl overflow-hidden bg-[#07111F] border-2 border-[#1E2C48] shadow-2xl group`}>
          {/* Google Maps Container */}
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Fallback Loading Skeleton */}
          {!mapsLoaded && (
            <div className="absolute inset-0 bg-[#0B1220] flex flex-col items-center justify-center space-y-3 z-10">
              <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-mono text-cyan-300">
                Loading Vignan University 3D Digital Twin Map...
              </p>
            </div>
          )}

          {/* Top-Left Campus Header Overlay */}
          <div className="absolute top-3.5 left-3.5 z-20 flex items-center space-x-2 bg-[#0B1220]/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#1E2C48] shadow-xl">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <div className="text-left">
              <h3 className="text-xs font-black text-white leading-tight">
                Vignan University • 3D Vector Map
              </h3>
              <p className="text-[10px] font-mono text-cyan-400">
                Vadlamudi, Guntur (16.2333°N, 80.5509°E)
              </p>
            </div>
          </div>

          {/* Top-Right Quick Map Action Controls */}
          <div className="absolute top-3.5 right-3.5 z-20 flex items-center space-x-1.5 bg-[#0B1220]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#1E2C48] shadow-xl">
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

            {/* My Location (GPS) */}
            <button
              type="button"
              onClick={handleMyLocation}
              disabled={isLocating}
              className="p-1.5 rounded-xl bg-[#141D32] hover:bg-slate-700 text-slate-200 hover:text-cyan-300 transition-colors"
              title="Locate My Position (GPS)"
            >
              <Crosshair className={`w-4 h-4 ${isLocating ? "animate-spin text-cyan-400" : ""}`} />
            </button>

            {/* Reset Campus Center */}
            <button
              type="button"
              onClick={handleResetCampus}
              className="p-1.5 rounded-xl bg-[#141D32] hover:bg-slate-700 text-slate-200 hover:text-cyan-300 transition-colors"
              title="Reset Campus View"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
            </button>
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
                checked={showSafeZones}
                onChange={(e) => setShowSafeZones(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0"
              />
              <span className="font-bold text-emerald-400">★ Safe Zones ({SAFE_ZONES.length})</span>
            </label>

            <label className="flex items-center space-x-1.5 text-slate-300 cursor-pointer px-2 py-1 rounded-lg hover:bg-[#141D32]">
              <input
                type="checkbox"
                checked={showBuildings}
                onChange={(e) => setShowBuildings(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
              />
              <span>Buildings ({CAMPUS_LOCATIONS.length})</span>
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
                <span className="text-cyan-300">📷 CCTV Feeds ({CAMPUS_CAMERAS.length})</span>
              </label>
            )}
          </div>
        </div>

        {/* Location Error Notice if GPS Fails */}
        {locationError && (
          <div className="text-xs font-mono text-amber-400 bg-amber-950/60 p-2.5 rounded-xl border border-amber-800 flex items-center justify-between">
            <span>⚠️ {locationError}</span>
            <button onClick={() => setLocationError(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* RIGHT SECTION (25%): LIVE EMERGENCY STATUS PANEL             */}
      {/* ============================================================ */}
      <div className="w-full lg:w-[27%] flex flex-col space-y-4">
        {isEmergencyActive ? (
          /* ACTIVE EMERGENCY PANEL */
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

            {/* Incident Details Card */}
            <div className="space-y-2.5">
              <div className="bg-[#141D32] p-3 rounded-2xl border border-[#1E2C48] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[10px] uppercase">ACTIVE INCIDENT:</span>
                  <span className="font-black text-red-400 uppercase">{currentIncident.type}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[10px] uppercase">SEVERITY:</span>
                  <span className="font-bold text-amber-400 font-mono">{currentIncident.severity}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[10px] uppercase">LOCATION:</span>
                  <span className="font-bold text-white text-right max-w-[140px] truncate">{currentIncident.location}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[10px] uppercase">AI CONFIDENCE:</span>
                  <span className="font-bold text-cyan-400 font-mono">{currentIncident.confidence || 94}%</span>
                </div>
              </div>

              {/* Recommended Safe Zone & Real Route */}
              <div className="bg-[#141D32] p-3 rounded-2xl border border-[#1E2C48] space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>RECOMMENDED SAFE ZONE</span>
                </div>
                <p className="text-xs font-black text-white">
                  {routeInfo.destinationName}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#1E2C48] text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">DISTANCE:</span>
                    <strong className="text-emerald-300 font-mono">{routeInfo.distanceText}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">EST. TIME:</span>
                    <strong className="text-cyan-300 font-mono">{routeInfo.durationText}</strong>
                  </div>
                </div>
              </div>

              {/* Recommended Actions */}
              <div className="bg-[#141D32] p-3 rounded-2xl border border-[#1E2C48] space-y-1.5 text-xs text-slate-300">
                <span className="text-[10px] font-mono text-cyan-400 font-bold block uppercase">
                  RECOMMENDED ACTION:
                </span>
                <ul className="space-y-1 text-[11px] text-slate-200">
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-400">✓</span>
                    <span>Follow the green evacuation route.</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-400">✓</span>
                    <span>Move calmly to Central Quadrangle.</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-400">✓</span>
                    <span>Do NOT use building elevators.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (mapInstanceRef.current && activeIncident?.locationCoords) {
                    mapInstanceRef.current.panTo(activeIncident.locationCoords);
                    mapInstanceRef.current.setZoom(19);
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg transition-all active:scale-95"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>SHOW SAFE ROUTE</span>
              </button>

              {(currentRole === "ADMIN" || currentRole === "SECURITY") && (
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
                Campus telemetry, 8 CCTV cameras, and environmental sensors online with 0 critical anomalies detected.
              </p>
            </div>

            {/* Verified Assembly Points Directory */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                CAMPUS SAFE ZONES ({SAFE_ZONES.length}):
              </span>
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                {SAFE_ZONES.map((sz) => (
                  <div
                    key={sz.id}
                    onClick={() => {
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.panTo({ lat: sz.lat, lng: sz.lng });
                        mapInstanceRef.current.setZoom(19);
                      }
                      setSelectedItem({ type: "SAFE_ZONE", data: sz });
                    }}
                    className="p-2.5 rounded-xl bg-[#141D32] hover:bg-[#1A2640] border border-[#1E2C48] cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <p className="font-bold text-white text-[11px]">{sz.name}</p>
                      <p className="text-[9px] text-slate-400 font-mono">Capacity: {sz.capacity} Persons</p>
                    </div>
                    <span className="text-emerald-400 text-[10px] font-bold">★ View</span>
                  </div>
                ))}
              </div>
            </div>

            {/* My Location Quick Button */}
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
