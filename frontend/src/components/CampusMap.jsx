// Campus Sentinel AI - Interactive Digital Twin Campus Map
import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  Circle,
  Marker,
  Popup,
  Tooltip,
  useMap
} from "react-leaflet";
import L from "leaflet";
import { useSentinel } from "../context/SentinelContext";
import {
  Flame,
  Shield,
  Ambulance,
  Radio,
  Users,
  Navigation,
  Eye,
  AlertOctagon,
  Layers,
  Crosshair
} from "lucide-react";

// Fix Leaflet default icon paths in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

// Custom HTML DivIcons for rich tactical markers
const createCustomIcon = (htmlContent, className = "") => {
  return L.divIcon({
    className: `custom-sentinel-icon ${className}`,
    html: htmlContent,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

// Recenter Map Helper
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 17, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
};

export const CampusMap = ({ height = "h-[550px]", selectedBuildingId = null, interactive = true }) => {
  const {
    buildings,
    cameras,
    assemblyPoints,
    resources,
    graphNodes,
    graphEdges,
    blockedEdgeIds,
    activeIncident
  } = useSentinel();

  const [mapCenter, setMapCenter] = useState([37.7765, -122.4175]);
  const [showCameras, setShowCameras] = useState(true);
  const [showBuildings, setShowBuildings] = useState(true);
  const [showSafeRoute, setShowSafeRoute] = useState(true);
  const [showResponders, setShowResponders] = useState(true);
  const [showAssemblyZones, setShowAssemblyZones] = useState(true);
  const [inspectedBuilding, setInspectedBuilding] = useState(null);

  // If incident active, recenter slightly near incident
  useEffect(() => {
    if (activeIncident && activeIncident.locationCoords) {
      setMapCenter([activeIncident.locationCoords.lat, activeIncident.locationCoords.lng]);
    }
  }, [activeIncident]);

  // Icons
  const fireHazardIcon = createCustomIcon(
    `<div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-red-600 border-2 border-white shadow-lg shadow-red-500 animate-bounce">
       <span class="text-base">🔥</span>
     </div>`
  );

  const cameraIcon = (risk) => createCustomIcon(
    `<div class="flex items-center justify-center w-6 h-6 rounded-full ${
      risk === 'CRITICAL' ? 'bg-red-600 border-red-300 animate-ping' :
      risk === 'SUSPICIOUS' ? 'bg-amber-500 border-amber-200' : 'bg-slate-800 border-cyan-400'
    } border text-[10px] text-white shadow-md">
       📷
     </div>`
  );

  const assemblyIcon = (isRecommended) => createCustomIcon(
    `<div class="flex items-center justify-center w-7 h-7 rounded-full ${
      isRecommended ? 'bg-emerald-600 border-2 border-white shadow-lg shadow-emerald-500/50' : 'bg-emerald-950 border border-emerald-500/60'
    } text-[11px] text-white font-bold">
       🛡️
     </div>`
  );

  const securityIcon = createCustomIcon(
    `<div class="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 border border-white text-[10px] text-white shadow-md">
       👮
     </div>`
  );

  const ambulanceIcon = createCustomIcon(
    `<div class="flex items-center justify-center w-6 h-6 rounded-full bg-rose-600 border border-white text-[10px] text-white shadow-md animate-pulse">
       🚑
     </div>`
  );

  const fireUnitIcon = createCustomIcon(
    `<div class="flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 border border-white text-[10px] text-white shadow-md">
       🚒
     </div>`
  );

  return (
    <div className={`relative ${height} w-full rounded-xl overflow-hidden border border-[#1E2C48] shadow-2xl bg-[#080B13]`}>
      <MapContainer
        center={mapCenter}
        zoom={17}
        scrollWheelZoom={interactive}
        className="w-full h-full"
      >
        {/* Map Controller */}
        <MapController center={mapCenter} zoom={17} />

        {/* Dark CartoDB Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* 1. CAMPUS BUILDINGS POLYGONS */}
        {showBuildings && buildings.map((b) => {
          const isAffected = activeIncident && (b.id === activeIncident.buildingId || b.name === activeIncident.location);
          const isSelected = selectedBuildingId === b.id;
          const isInspected = inspectedBuilding && inspectedBuilding.id === b.id;

          let fillColor = "#1E293B";
          let strokeColor = "#334155";

          if (isAffected) {
            fillColor = "#EF4444";
            strokeColor = "#F87171";
          } else if (b.riskLevel === "CRITICAL") {
            fillColor = "#DC2626";
            strokeColor = "#EF4444";
          } else if (isSelected || isInspected) {
            fillColor = "#3B82F6";
            strokeColor = "#60A5FA";
          }

          return (
            <Polygon
              key={b.id}
              positions={b.polygon}
              eventHandlers={{
                click: () => {
                  setInspectedBuilding(b);
                  setMapCenter([b.lat, b.lng]);
                }
              }}
              pathOptions={{
                color: strokeColor,
                fillColor: fillColor,
                fillOpacity: isAffected ? 0.65 : isInspected ? 0.55 : 0.35,
                weight: isAffected ? 3 : isInspected ? 3 : 1.5
              }}
            >
              <Tooltip sticky>
                <div className="text-xs bg-[#0F1626] text-white p-1 rounded font-sans">
                  <p className="font-bold text-cyan-400">{b.name} ({b.code})</p>
                  <p className="text-slate-300">Occupancy: <span className="font-semibold text-white">{b.occupancy}</span> / {b.maxCapacity}</p>
                  <p className="text-[10px] text-slate-400 font-mono">Status: {b.riskLevel}</p>
                </div>
              </Tooltip>
              <Popup>
                <div className="text-xs text-slate-100 p-1 space-y-1">
                  <h4 className="font-bold text-sm text-cyan-300">{b.name}</h4>
                  <p className="text-slate-300 font-medium">Category: {b.category} • {b.floors} Floors</p>
                  <p className="text-slate-300">Current Occupants: <span className="font-bold text-amber-400">{b.occupancy}</span></p>
                  <p className="text-[11px] text-slate-400">Exits: {b.exits ? b.exits.join(", ") : "N/A"}</p>
                  <p className="text-[11px] text-slate-400">Suppression: {b.suppressionSystem}</p>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {/* 2. CCTV CAMERA MARKERS */}
        {showCameras && cameras.map((cam) => (
          <Marker
            key={cam.id}
            position={[cam.lat, cam.lng]}
            icon={cameraIcon(cam.currentRisk)}
          >
            <Tooltip>
              <div className="text-[11px] bg-[#0B101D] text-white p-1 rounded font-mono">
                <p className="font-bold text-cyan-300">{cam.id}: {cam.name}</p>
                <p>Confidence: {cam.aiConfidence}% | Risk: {cam.currentRisk}</p>
              </div>
            </Tooltip>
            <Popup>
              <div className="text-xs p-1">
                <p className="font-bold text-cyan-400">{cam.id} — {cam.name}</p>
                <p className="text-slate-300">Status: <span className="font-semibold text-white">{cam.status}</span></p>
                <p className="text-slate-300">AI Confidence: <span className="font-bold text-amber-400">{cam.aiConfidence}%</span></p>
                <p className="text-slate-300">Location: {cam.location}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 3. ASSEMBLY POINTS */}
        {showAssemblyZones && assemblyPoints.map((ap) => {
          const isRecommended = activeIncident && activeIncident.recommendedAssemblyPoint && activeIncident.recommendedAssemblyPoint.id === ap.id;
          return (
            <React.Fragment key={ap.id}>
              <Circle
                center={[ap.lat, ap.lng]}
                radius={35}
                pathOptions={{
                  color: isRecommended ? "#10B981" : "#059669",
                  fillColor: isRecommended ? "#10B981" : "#065F46",
                  fillOpacity: isRecommended ? 0.35 : 0.15,
                  weight: isRecommended ? 2.5 : 1,
                  dashArray: isRecommended ? "4, 4" : null
                }}
              />
              <Marker
                position={[ap.lat, ap.lng]}
                icon={assemblyIcon(isRecommended)}
              >
                <Tooltip sticky>
                  <div className="text-xs bg-[#090D16] text-white p-1 rounded">
                    <p className="font-bold text-emerald-400">{ap.name}</p>
                    <p className="text-[10px]">Occupancy: {ap.currentOccupancy} / {ap.capacity} ({Math.round((ap.currentOccupancy / ap.capacity) * 100)}%)</p>
                    {isRecommended && <p className="text-[10px] font-bold text-emerald-300">★ RECOMMENDED SAFE ZONE</p>}
                  </div>
                </Tooltip>
              </Marker>
            </React.Fragment>
          );
        })}

        {/* 4. ACTIVE EMERGENCY HAZARD ZONE (FIRE RADIUS) */}
        {activeIncident && activeIncident.locationCoords && (
          <>
            {/* Pulsing Hazard Core */}
            <Circle
              center={[activeIncident.locationCoords.lat, activeIncident.locationCoords.lng]}
              radius={activeIncident.hazardRadius || 85}
              pathOptions={{
                color: "#EF4444",
                fillColor: "#DC2626",
                fillOpacity: 0.25,
                weight: 2,
                dashArray: "6, 6"
              }}
            />
            <Circle
              center={[activeIncident.locationCoords.lat, activeIncident.locationCoords.lng]}
              radius={(activeIncident.hazardRadius || 85) * 0.45}
              pathOptions={{
                color: "#F87171",
                fillColor: "#B91C1C",
                fillOpacity: 0.5,
                weight: 3
              }}
            />
            <Marker
              position={[activeIncident.locationCoords.lat, activeIncident.locationCoords.lng]}
              icon={fireHazardIcon}
            >
              <Popup>
                <div className="text-xs p-1">
                  <p className="font-bold text-red-500 uppercase">{activeIncident.severity} {activeIncident.type}</p>
                  <p className="text-slate-200">{activeIncident.location}</p>
                  <p className="text-slate-400 text-[10px]">Thermal Hazard Radius: {activeIncident.hazardRadius || 85}m</p>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* 5. SAFE EVACUATION ROUTE (A* Polyline) */}
        {showSafeRoute && activeIncident && activeIncident.evacuationRoute && activeIncident.evacuationRoute.coordinates && (
          <>
            {/* Glowing background stroke */}
            <Polyline
              positions={activeIncident.evacuationRoute.coordinates}
              pathOptions={{
                color: "#10B981",
                weight: 8,
                opacity: 0.4
              }}
            />
            {/* Animated dashed green safe route */}
            <Polyline
              positions={activeIncident.evacuationRoute.coordinates}
              pathOptions={{
                color: "#34D399",
                weight: 4,
                opacity: 0.95,
                dashArray: "8, 8"
              }}
            >
              <Tooltip sticky>
                <div className="text-xs bg-[#090D16] text-emerald-400 p-1 rounded font-bold">
                  🟢 SAFE EVACUATION ROUTE ({activeIncident.evacuationRoute.totalDistanceMeters}m)
                </div>
              </Tooltip>
            </Polyline>
          </>
        )}

        {/* 6. RESPONDER ROUTES (Ambulance / Fire Unit / Security) */}
        {showResponders && activeIncident && activeIncident.responderRoutes && activeIncident.responderRoutes.map((rr, idx) => {
          if (!rr.coordinates) return null;
          return (
            <Polyline
              key={idx}
              positions={rr.coordinates}
              pathOptions={{
                color: rr.unitType === "AMBULANCE" ? "#06B6D4" : rr.unitType === "FIRE_TENDER" ? "#F59E0B" : "#3B82F6",
                weight: 4,
                opacity: 0.85,
                dashArray: "5, 5"
              }}
            >
              <Tooltip sticky>
                <div className="text-xs bg-[#090D16] text-cyan-300 p-1 rounded font-mono">
                  🔵 {rr.unitType} ROUTE: {rr.unitId} (ETA: {rr.etaMinutes} min)
                </div>
              </Tooltip>
            </Polyline>
          );
        })}

        {/* 7. BLOCKED ROADS (Dynamic Re-planning Obstacles) */}
        {blockedEdgeIds && blockedEdgeIds.length > 0 && graphEdges.map((edge) => {
          if (!blockedEdgeIds.includes(edge.id)) return null;
          const nodeA = graphNodes[edge.from];
          const nodeB = graphNodes[edge.to];
          if (!nodeA || !nodeB) return null;

          return (
            <Polyline
              key={`blocked-${edge.id}`}
              positions={[[nodeA.lat, nodeA.lng], [nodeB.lat, nodeB.lng]]}
              pathOptions={{
                color: "#EF4444",
                weight: 6,
                opacity: 0.9,
                dashArray: "4, 6"
              }}
            >
              <Tooltip sticky>
                <div className="text-xs bg-red-950 text-red-300 p-1 rounded font-bold border border-red-500">
                  🚫 ROAD BLOCKED: {edge.name}
                </div>
              </Tooltip>
            </Polyline>
          );
        })}

        {/* 8. ACTIVE DISPATCHED RESPONDER ICONS */}
        {showResponders && (
          <>
            {/* Security Patrols */}
            {resources.security.filter(s => s.status === "DISPATCHING" || s.status === "ON_SCENE").map(s => (
              <Marker key={s.id} position={[s.lat, s.lng]} icon={securityIcon}>
                <Tooltip><span className="text-xs font-mono">{s.name} ({s.status})</span></Tooltip>
              </Marker>
            ))}
            {/* Ambulances */}
            {resources.ambulances.filter(a => a.status === "DISPATCHING" || a.status === "ON_SCENE").map(a => (
              <Marker key={a.id} position={[a.lat, a.lng]} icon={ambulanceIcon}>
                <Tooltip><span className="text-xs font-mono">{a.name} ({a.status})</span></Tooltip>
              </Marker>
            ))}
            {/* Fire Units */}
            {resources.fireSafety.filter(f => f.status === "DISPATCHING" || f.status === "ON_SCENE").map(f => (
              <Marker key={f.id} position={[f.lat, f.lng]} icon={fireUnitIcon}>
                <Tooltip><span className="text-xs font-mono">{f.name} ({f.status})</span></Tooltip>
              </Marker>
            ))}
          </>
        )}
      </MapContainer>

      {/* Map Overlay Controls & Legend */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col space-y-1.5 bg-[#0B101D]/90 backdrop-blur-md p-2.5 rounded-xl border border-[#1E2C48] shadow-xl text-xs">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#1E2C48] text-slate-300 font-bold">
          <span className="flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Map Layers</span>
          </span>
          <button
            onClick={() => setMapCenter([37.7765, -122.4175])}
            className="p-1 rounded bg-[#141D32] hover:bg-slate-700 text-slate-300"
            title="Recenter Campus"
          >
            <Crosshair className="w-3 h-3 text-cyan-400" />
          </button>
        </div>

        <label className="flex items-center space-x-2 text-slate-300 cursor-pointer text-[11px]">
          <input
            type="checkbox"
            checked={showBuildings}
            onChange={(e) => setShowBuildings(e.target.checked)}
            className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
          />
          <span>Buildings & Footprints</span>
        </label>

        <label className="flex items-center space-x-2 text-slate-300 cursor-pointer text-[11px]">
          <input
            type="checkbox"
            checked={showCameras}
            onChange={(e) => setShowCameras(e.target.checked)}
            className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
          />
          <span>CCTV Cameras (8)</span>
        </label>

        <label className="flex items-center space-x-2 text-slate-300 cursor-pointer text-[11px]">
          <input
            type="checkbox"
            checked={showAssemblyZones}
            onChange={(e) => setShowAssemblyZones(e.target.checked)}
            className="rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0"
          />
          <span>Assembly Safe Zones (5)</span>
        </label>

        <label className="flex items-center space-x-2 text-slate-300 cursor-pointer text-[11px]">
          <input
            type="checkbox"
            checked={showSafeRoute}
            onChange={(e) => setShowSafeRoute(e.target.checked)}
            className="rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0"
          />
          <span>Safe Evacuation Route</span>
        </label>

        <label className="flex items-center space-x-2 text-slate-300 cursor-pointer text-[11px]">
          <input
            type="checkbox"
            checked={showResponders}
            onChange={(e) => setShowResponders(e.target.checked)}
            className="rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-0"
          />
          <span>Emergency Responders</span>
        </label>
      </div>

      {/* Inspected Building Quick Card Overlay */}
      {inspectedBuilding && (
        <div className="absolute top-3 left-3 z-[1000] max-w-sm bg-[#0B101D]/95 backdrop-blur-md p-3 rounded-xl border border-cyan-500/50 shadow-2xl space-y-1.5 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-cyan-300">{inspectedBuilding.name} ({inspectedBuilding.code})</span>
            <button
              onClick={() => setInspectedBuilding(null)}
              className="text-slate-400 hover:text-white text-[11px] p-0.5 font-bold"
            >
              ✕
            </button>
          </div>
          <p className="text-[11px] text-slate-300">Category: {inspectedBuilding.category} • {inspectedBuilding.floors} Floors</p>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-[#1E2C48]">
            <span>Occupancy: <strong className="text-white">{inspectedBuilding.occupancy}</strong> / {inspectedBuilding.maxCapacity}</span>
            <span>Risk: <strong className={inspectedBuilding.riskLevel === 'CRITICAL' ? 'text-red-400' : 'text-emerald-400'}>{inspectedBuilding.riskLevel}</strong></span>
          </div>
          <p className="text-[10px] text-slate-400">Suppression: {inspectedBuilding.suppressionSystem}</p>
        </div>
      )}

      {/* Map Tactical Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-[#0B101D]/90 backdrop-blur-md px-3 py-2 rounded-xl border border-[#1E2C48] shadow-xl text-[10px] text-slate-300 flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block animate-ping"></span>
          <span className="font-semibold text-slate-200">Hazard Zone</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-4 h-1 bg-emerald-400 inline-block rounded"></span>
          <span className="font-semibold text-emerald-400">Safe Evac Route (A*)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-4 h-1 bg-cyan-400 inline-block rounded"></span>
          <span className="font-semibold text-cyan-400">Responder Route</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-4 h-1 bg-red-600 inline-block rounded border border-red-300"></span>
          <span className="font-semibold text-red-400">Blocked Path</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
          <span className="font-semibold text-emerald-300">Assembly Point</span>
        </div>
      </div>
    </div>
  );
};
