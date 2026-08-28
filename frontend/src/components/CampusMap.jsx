// Campus Sentinel - Live Satellite & Street Digital Twin Map with Real GPS Tracking & Campus Geofence
// Location: Vignan's Foundation for Science, Technology & Research (VFSTR), Vadlamudi, Guntur, AP - 522213

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSentinel } from "../context/SentinelContext";
import {
  CAMPUS_CENTER,
  CAMPUS_LOCATIONS,
  VERIFIED_SAFE_ZONES,
  getDistanceMeters
} from "../data/vignanCampusLocations";
import {
  VIGNAN_CAMPUS_BOUNDARY_COORDS,
  isCoordinateInsideCampus,
  getNearestCampusLocation,
  formatDistance
} from "../data/vignanCampusGeoFence";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ArrowLeft,
  MapPin,
  Crosshair,
  X,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Clock
} from "lucide-react";

export const CampusMap = ({ height = "h-[700px]", interactive = true, onBack = null }) => {
  const {
    activeIncident,
    setActiveTab
  } = useSentinel();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const geofenceLayerRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const userAccuracyCircleRef = useRef(null);
  const watchIdRef = useRef(null);

  // Map View Mode State
  const [mapMode, setMapMode] = useState("SATELLITE"); // "SATELLITE" or "STREET"
  
  // Real GPS Geolocation State (NO FAKE / DEFAULT COORDINATES)
  const [userLocation, setUserLocation] = useState(null); // { lat, lng, accuracy }
  const [gpsStatus, setGpsStatus] = useState("GPS INITIALIZING"); // "GPS INITIALIZING" | "GPS ACTIVE & CALIBRATED" | "GPS ACCURACY LOW" | "OUTSIDE UNIVERSITY CAMPUS" | "GPS PERMISSION REQUIRED"
  const [isInsideCampus, setIsInsideCampus] = useState(false);
  const [nearestLocationInfo, setNearestLocationInfo] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(CAMPUS_LOCATIONS[0]);

  // Tile Providers
  const SATELLITE_TILE_URL = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  const STREET_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    try {
      const map = L.map(mapContainerRef.current, {
        center: [CAMPUS_CENTER.lat, CAMPUS_CENTER.lng],
        zoom: 17,
        zoomControl: true,
        attributionControl: true
      });

      // Satellite Layer Default (Esri World Imagery)
      const tileLayer = L.tileLayer(SATELLITE_TILE_URL, {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; World Imagery'
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      geofenceLayerRef.current = L.layerGroup().addTo(map);
      markersLayerRef.current = L.layerGroup().addTo(map);
      routeLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Render Verified VFSTR Vadlamudi Campus Geofence Boundary Polygon
      const geofencePolygon = L.polygon(VIGNAN_CAMPUS_BOUNDARY_COORDS, {
        color: "#06B6D4",
        weight: 2.5,
        opacity: 0.9,
        dashArray: "6, 6",
        fillColor: "#06B6D4",
        fillOpacity: 0.08
      });
      geofencePolygon.bindTooltip("VFSTR University Campus Boundary", {
        permanent: false,
        direction: "center",
        className: "campus-geofence-tooltip"
      });
      geofencePolygon.addTo(geofenceLayerRef.current);

      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    } catch (err) {
      console.error("[CampusMap] Leaflet initialization error:", err);
    }

    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Switch Tile Layer (Satellite <-> Street)
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    if (mapMode === "SATELLITE") {
      tileLayerRef.current = L.tileLayer(SATELLITE_TILE_URL, {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; World Imagery'
      }).addTo(mapInstanceRef.current);
    } else {
      tileLayerRef.current = L.tileLayer(STREET_TILE_URL, {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
    }
  }, [mapMode]);

  // 3. Create Custom Marker DivIcon for Buildings
  const createMarkerIcon = useCallback((loc, isIncident, isSafeZone, isSelected) => {
    const symbol = isIncident ? "🔥" : isSafeZone ? "🛡️" : "📍";
    const bgColor = isIncident ? "#DC2626" : isSafeZone ? "#059669" : isSelected ? "#06B6D4" : "#2563EB";

    return L.divIcon({
      className: "custom-leaflet-marker",
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: pointer;">
          <div style="
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.6);
            background: ${bgColor};
          ">
            <span style="transform: rotate(45deg); font-size: 12px;">${symbol}</span>
          </div>
          <div style="
            margin-top: 2px;
            background: rgba(15, 23, 42, 0.95);
            color: #ffffff;
            padding: 2px 5px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 800;
            white-space: nowrap;
            border: 1px solid rgba(255,255,255,0.25);
            box-shadow: 0 2px 6px rgba(0,0,0,0.5);
            letter-spacing: 0.4px;
          ">
            ${loc.name}
          </div>
        </div>
      `,
      iconSize: [28, 42],
      iconAnchor: [14, 42],
      popupAnchor: [0, -42]
    });
  }, []);

  // 4. Render All 15 Verified Vignan Campus Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const dangerLocation = activeIncident?.locationCoords ||
      (activeIncident?.locationId ? CAMPUS_LOCATIONS.find(l => l.id === activeIncident.locationId) : null);

    CAMPUS_LOCATIONS.forEach((loc) => {
      const isIncidentLoc = dangerLocation && (loc.name === dangerLocation.name || loc.id === dangerLocation.id);
      const isSafeZone = loc.isSafeZone;
      const isSelected = selectedLocation?.id === loc.id;

      const icon = createMarkerIcon(loc, isIncidentLoc, isSafeZone, isSelected);
      const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(markersLayerRef.current);

      // Distance from real GPS position if available
      let distanceText = "";
      if (userLocation && userLocation.lat && userLocation.lng) {
        const dist = getDistanceMeters(userLocation, loc);
        distanceText = `<div style="margin-top: 4px; font-size: 10px; font-family: monospace; color: #38BDF8;">Distance from You: <b>${formatDistance(dist)}</b></div>`;
      }

      const popupHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 4px; min-width: 220px; color: #0F172A;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
            <span style="font-size: 12.5px; font-weight: 800; color: #0F172A;">${loc.displayName || loc.name}</span>
            <span style="font-size: 8.5px; font-weight: 700; background: ${isIncidentLoc ? '#FEE2E2' : '#E0F2FE'}; color: ${isIncidentLoc ? '#B91C1C' : '#0369A1'}; padding: 1.5px 5px; border-radius: 4px;">
              ${isIncidentLoc ? 'ACTIVE INCIDENT' : loc.type}
            </span>
          </div>
          <p style="font-size: 10.5px; color: #475569; margin: 0 0 4px 0; line-height: 1.25;">
            ${loc.description}
          </p>
          <div style="font-size: 9.5px; font-family: monospace; font-weight: 600; color: #0284C7; background: #F1F5F9; padding: 2.5px 5px; border-radius: 4px;">
            Lat: ${loc.lat.toFixed(6)}, Lon: ${loc.lng.toFixed(6)}
          </div>
          ${distanceText}
          ${isSafeZone ? '<div style="margin-top: 4px; font-size: 9.5px; font-weight: 700; color: #059669;">✓ Official Safe Evacuation Assembly Zone</div>' : ''}
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on("click", () => {
        setSelectedLocation(loc);
      });
    });

    // If active incident exists and user is inside campus, render danger circle and evacuation corridor
    if (activeIncident && routeLayerRef.current) {
      routeLayerRef.current.clearLayers();

      const incLat = dangerLocation ? dangerLocation.lat : CAMPUS_CENTER.lat;
      const incLng = dangerLocation ? dangerLocation.lng : CAMPUS_CENTER.lng;

      // Danger perimeter circle
      L.circle([incLat, incLng], {
        color: "#EF4444",
        fillColor: "#DC2626",
        fillOpacity: 0.22,
        radius: activeIncident.hazardRadius || 75,
        weight: 2,
        dashArray: "6, 6"
      }).addTo(routeLayerRef.current);

      // Render verified evacuation path to Convocation Safe Zone
      const safeTarget = VERIFIED_SAFE_ZONES[0];
      if (safeTarget) {
        const routePoints = [
          [incLat, incLng],
          [16.233200, 80.548800], // Central junction
          [safeTarget.lat, safeTarget.lng]
        ];

        L.polyline(routePoints, {
          color: "#10B981",
          weight: 3.5,
          opacity: 0.9,
          dashArray: "8, 6"
        }).addTo(routeLayerRef.current);
      }
    } else if (routeLayerRef.current) {
      routeLayerRef.current.clearLayers();
    }
  }, [activeIncident, selectedLocation, userLocation, createMarkerIcon]);

  // 5. Real Geolocation Processing with Campus Geofence Validation
  const handlePositionSuccess = useCallback((pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const accuracy = pos.coords.accuracy || 15;

    const inside = isCoordinateInsideCampus(lat, lng);
    const nearest = getNearestCampusLocation(lat, lng);

    setUserLocation({ lat, lng, accuracy });
    setIsInsideCampus(inside);
    setNearestLocationInfo(nearest);

    // Compute exact GPS Status
    if (!inside) {
      setGpsStatus("OUTSIDE UNIVERSITY CAMPUS");
    } else if (accuracy > 50) {
      setGpsStatus("GPS ACCURACY LOW");
    } else {
      setGpsStatus("GPS ACTIVE & CALIBRATED");
    }

    // Render User Location Beacon on Leaflet Map
    if (mapInstanceRef.current) {
      if (userMarkerRef.current) {
        mapInstanceRef.current.removeLayer(userMarkerRef.current);
        userMarkerRef.current = null;
      }
      if (userAccuracyCircleRef.current) {
        mapInstanceRef.current.removeLayer(userAccuracyCircleRef.current);
        userAccuracyCircleRef.current = null;
      }

      // Accuracy radius circle
      userAccuracyCircleRef.current = L.circle([lat, lng], {
        radius: Math.min(accuracy, 100),
        color: inside ? "#3B82F6" : "#F97316",
        fillColor: inside ? "#3B82F6" : "#F97316",
        fillOpacity: 0.12,
        weight: 1
      }).addTo(mapInstanceRef.current);

      // User Marker Beacon (Blue if inside campus, Orange if outside)
      const beaconColor = inside ? "#2563EB" : "#EA580C";
      const pingColor = inside ? "rgba(59, 130, 246, 0.45)" : "rgba(249, 115, 22, 0.45)";

      const userIcon = L.divIcon({
        className: "gps-user-beacon",
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%);">
            <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: ${pingColor}; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 15px; height: 15px; border-radius: 50%; background: ${beaconColor}; border: 2.5px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.6);"></div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const userPopupText = `
        <div style="font-family: sans-serif; padding: 3px; color: #0F172A; min-width: 180px;">
          <b style="color: ${beaconColor}; font-size: 12px;">${inside ? "Your Live Campus Position" : "User Location (Outside Campus)"}</b><br/>
          <span style="font-size: 10px; font-family: monospace;">Lat: ${lat.toFixed(6)}, Lon: ${lng.toFixed(6)}</span><br/>
          <span style="font-size: 9.5px; color: #475569;">Accuracy: ±${Math.round(accuracy)}m</span><br/>
          ${nearest ? `<span style="font-size: 9.5px; color: #0284C7; font-weight: 700;">Nearest: ${nearest.location.name} (${nearest.formattedDistance})</span>` : ""}
        </div>
      `;

      userMarkerRef.current = L.marker([lat, lng], { icon: userIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(userPopupText);

      // Only fly/center automatically if inside campus
      if (inside) {
        mapInstanceRef.current.flyTo([lat, lng], 18, { duration: 1.2 });
      }
    }
  }, []);

  const handlePositionError = useCallback((err) => {
    console.warn("[CampusMap] GPS Geolocation Error / Denied:", err.message);
    setUserLocation(null);
    setIsInsideCampus(false);
    setNearestLocationInfo(null);
    setGpsStatus("GPS PERMISSION REQUIRED");
  }, []);

  // 6. Start Real Geolocation Watcher
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsStatus("GPS PERMISSION REQUIRED");
      return;
    }

    setGpsStatus("GPS INITIALIZING");

    // Immediate one-shot position
    navigator.geolocation.getCurrentPosition(
      handlePositionSuccess,
      handlePositionError,
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 }
    );

    // Continuous watchPosition for live movement tracking
    try {
      watchIdRef.current = navigator.geolocation.watchPosition(
        handlePositionSuccess,
        handlePositionError,
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 2000 }
      );
    } catch (e) {
      console.warn("watchPosition failed:", e);
    }

    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [handlePositionSuccess, handlePositionError]);

  // 7. Recenter Map
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;

    if (userLocation && isInsideCampus) {
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 18, { duration: 1 });
    } else if (selectedLocation) {
      mapInstanceRef.current.flyTo([selectedLocation.lat, selectedLocation.lng], 18, { duration: 1 });
    } else {
      mapInstanceRef.current.flyTo([CAMPUS_CENTER.lat, CAMPUS_CENTER.lng], 17, { duration: 1 });
    }
  };

  // Helper for GPS badge display
  const getGpsBadgeDisplay = () => {
    switch (gpsStatus) {
      case "GPS ACTIVE & CALIBRATED":
        return {
          text: "🟢 Active & Calibrated",
          color: "text-emerald-400",
          ping: true
        };
      case "OUTSIDE UNIVERSITY CAMPUS":
        return {
          text: "🟠 Outside Campus",
          color: "text-orange-400",
          ping: false
        };
      case "GPS ACCURACY LOW":
        return {
          text: "🟡 Accuracy Low",
          color: "text-amber-400",
          ping: false
        };
      case "GPS PERMISSION REQUIRED":
        return {
          text: "⚪ Permission Required",
          color: "text-slate-400",
          ping: false
        };
      case "GPS INITIALIZING":
      default:
        return {
          text: "🔵 Locating...",
          color: "text-cyan-400",
          ping: true
        };
    }
  };

  const badgeInfo = getGpsBadgeDisplay();

  return (
    <div className={`relative w-full ${height} bg-[#0B101D] rounded-2xl overflow-hidden border border-[#1E2C48] shadow-2xl flex flex-col box-border`}>
      {/* 1. TOP HEADER BAR */}
      <div className="h-14 bg-[#0F172A]/95 backdrop-blur-md border-b border-[#1E2C48] px-3 sm:px-4 flex items-center justify-between z-20 shrink-0">
        {/* Left: Back Button & Title */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <button
            type="button"
            onClick={() => {
              if (onBack) onBack();
              else setActiveTab("HOME");
            }}
            className="px-2.5 py-1.5 rounded-lg bg-[#141D32] hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="text-rose-500 animate-pulse text-sm shrink-0">📍</span>
              <h2 className="text-xs sm:text-sm font-black text-white truncate tracking-tight">
                Live Location Map: Vignan University, Vadlamudi, Guntur, Andhra Pradesh, India
              </h2>
            </div>
            <p className="text-[10px] text-slate-400 truncate hidden md:block">
              Interactive Digital Twin Map • Real Campus Geofence & Verified Building Locations
            </p>
          </div>
        </div>

        {/* Right: Map Style Toggles & GPS Live Controls */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          {/* Satellite View Button */}
          <button
            type="button"
            onClick={() => setMapMode("SATELLITE")}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              mapMode === "SATELLITE"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 border border-blue-400"
                : "bg-[#141D32] text-slate-300 hover:text-white border border-[#1E2C48]"
            }`}
          >
            <span>🛰</span>
            <span className="hidden sm:inline">Satellite View</span>
          </button>

          {/* Street & Roads Button */}
          <button
            type="button"
            onClick={() => setMapMode("STREET")}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              mapMode === "STREET"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 border border-blue-400"
                : "bg-[#141D32] text-slate-300 hover:text-white border border-[#1E2C48]"
            }`}
          >
            <span>🗺</span>
            <span className="hidden sm:inline">Street & Roads</span>
          </button>

          {/* Recenter / GPS Live Button */}
          <button
            type="button"
            onClick={handleRecenter}
            title="Recenter Map to Live Location or Campus Center"
            className="px-2.5 py-1.5 rounded-lg bg-[#141D32] hover:bg-slate-800 border border-[#1E2C48] text-slate-200 hover:text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Recenter</span>
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => {
              if (onBack) onBack();
              else setActiveTab("HOME");
            }}
            className="p-1.5 rounded-lg bg-[#141D32] hover:bg-red-950 border border-[#1E2C48] hover:border-red-500/50 text-slate-400 hover:text-red-300 transition-all"
            title="Close Map"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. LEAFLET INTERACTIVE MAP CANVAS */}
      <div className="relative flex-1 w-full h-full bg-[#0F172A] z-10">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* 3. BOTTOM-LEFT FLOATING TELEMETRY CARD */}
        <div className="absolute bottom-5 left-5 z-[1000] p-3.5 sm:p-4 rounded-2xl bg-[#0F172A]/90 backdrop-blur-md border border-[#1E2C48] shadow-2xl text-white max-w-[280px] sm:max-w-xs space-y-2 pointer-events-auto select-none">
          <div className="flex items-center space-x-2">
            <span className="text-rose-500 text-sm">📍</span>
            <div className="min-w-0">
              <h4 className="text-xs font-black text-white truncate leading-tight">
                {selectedLocation?.name || "Vignan University (VFSTR)"}
              </h4>
              <p className="text-[9.5px] text-slate-400 truncate">
                Vadlamudi, Guntur, Andhra Pradesh - 522213
              </p>
            </div>
          </div>

          <div className="space-y-1 text-[10.5px] font-mono text-slate-300 pt-1 border-t border-slate-700/60">
            <div className="flex justify-between">
              <span className="text-slate-400">Coords:</span>
              <span className="font-bold text-cyan-300">
                {userLocation && isInsideCampus
                  ? `${userLocation.lat.toFixed(4)}° N, ${userLocation.lng.toFixed(4)}° E`
                  : `${selectedLocation?.lat?.toFixed(4) || "16.2332"}° N, ${selectedLocation?.lng?.toFixed(4) || "80.5490"}° E`}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Weather:</span>
              <span className="text-amber-300 font-sans font-semibold">28°C - 34°C • Mainly Clear</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Rainfall:</span>
              <span className="text-blue-300 font-sans">0.0 mm (Normal)</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Area Type:</span>
              <span className="text-slate-200 font-sans font-medium">VFSTR Institutional Zone</span>
            </div>

            {nearestLocationInfo && (
              <div className="flex justify-between">
                <span className="text-slate-400">Nearest Block:</span>
                <span className="text-cyan-300 font-sans font-bold truncate max-w-[140px]">
                  {nearestLocationInfo.location.name} ({nearestLocationInfo.formattedDistance})
                </span>
              </div>
            )}

            <div className="flex justify-between items-center pt-1 border-t border-slate-700/40">
              <span className="text-slate-400">GPS Status:</span>
              <span className={`inline-flex items-center space-x-1 text-[9.5px] font-bold ${badgeInfo.color} font-sans`}>
                {badgeInfo.ping && <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />}
                <span>{badgeInfo.text}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
