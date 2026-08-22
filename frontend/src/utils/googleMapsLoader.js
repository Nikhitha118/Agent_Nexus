// Campus Sentinel - Google Maps JavaScript API Dynamic Loader Hook
import { useState, useEffect } from "react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyBOwIlrU3ZvenqmjOGxc-2xyJBmWXmmXxU";
const GOOGLE_MAPS_MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || "cc14d559398fb98ead858ea5";

let isScriptLoading = false;
let isScriptLoaded = false;
const callbacks = [];

export function loadGoogleMapsScript(callback) {
  if (typeof window === "undefined") return;

  if (window.google && window.google.maps) {
    callback(null, window.google.maps);
    return;
  }

  callbacks.push(callback);

  if (isScriptLoading) return;
  isScriptLoading = true;

  const scriptId = "google-maps-sentinel-script";
  const existing = document.getElementById(scriptId);

  if (existing) {
    existing.addEventListener("load", () => {
      isScriptLoaded = true;
      isScriptLoading = false;
      callbacks.forEach(cb => cb(null, window.google.maps));
      callbacks.length = 0;
    });
    existing.addEventListener("error", (err) => {
      isScriptLoading = false;
      callbacks.forEach(cb => cb(err));
      callbacks.length = 0;
    });
    return;
  }

  const script = document.createElement("script");
  script.id = scriptId;
  script.type = "text/javascript";
  // Load Google Maps beta with Vector 3D Map ID and geometry / marker / places libraries
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=beta&libraries=geometry,places,marker&map_ids=${GOOGLE_MAPS_MAP_ID}`;
  script.async = true;
  script.defer = true;

  script.onload = () => {
    isScriptLoaded = true;
    isScriptLoading = false;
    callbacks.forEach(cb => cb(null, window.google.maps));
    callbacks.length = 0;
  };

  script.onerror = (err) => {
    isScriptLoading = false;
    callbacks.forEach(cb => cb(err || new Error("Failed to load Google Maps script")));
    callbacks.length = 0;
  };

  document.head.appendChild(script);
}

export function useGoogleMaps() {
  const [mapsLoaded, setMapsLoaded] = useState(!!(typeof window !== "undefined" && window.google && window.google.maps));
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.google && window.google.maps) {
      setMapsLoaded(true);
      return;
    }

    loadGoogleMapsScript((err) => {
      if (err) {
        console.warn("[GoogleMapsLoader] Script load error:", err);
        setLoadError(err);
      } else {
        setMapsLoaded(true);
      }
    });
  }, []);

  return { mapsLoaded, loadError, googleMaps: typeof window !== "undefined" ? window.google?.maps : null, mapId: GOOGLE_MAPS_MAP_ID };
}
