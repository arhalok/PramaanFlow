"use client";

import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

interface InteractiveOSMMapProps {
  initialLat: number;
  initialLng: number;
  onLocationSelect: (coords: { lat: number; lng: number; displayName?: string }) => void;
  selectedAreaName?: string;
}

export function InteractiveOSMMap({
  initialLat,
  initialLng,
  onLocationSelect,
  selectedAreaName
}: InteractiveOSMMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng
  });
  const [isMapReady, setIsMapReady] = useState(false);
  const [activeTileType, setActiveTileType] = useState<"standard" | "satellite">("standard");

  useEffect(() => {
    let isMounted = true;

    // Dynamically initialize Leaflet on client-side only
    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map instance
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      // Standard OpenStreetMap Tile Layer
      const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });

      osmLayer.addTo(map);

      // Add Zoom Control at top-right
      L.control.zoom({ position: "topright" }).addTo(map);

      // Custom SVG Pin Icon to eliminate broken webpack asset issues
      const customPinIcon = L.divIcon({
        className: "custom-osm-pin",
        html: `
          <div style="position: relative; width: 36px; height: 42px; transform: translate(-50%, -100%);">
            <svg viewBox="0 0 24 24" width="36" height="42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C7.58 0 4 3.58 4 8C4 13.54 12 24 12 24C12 24 20 13.54 20 8C20 3.58 16.42 0 12 0Z" fill="#0d9488"/>
              <circle cx="12" cy="8" r="3.5" fill="#ffffff"/>
            </svg>
            <div style="position: absolute; bottom: 0; left: 50%; width: 12px; height: 4px; background: rgba(0,0,0,0.3); border-radius: 50%; transform: translateX(-50%) blur(1px);"></div>
          </div>
        `,
        iconSize: [36, 42],
        iconAnchor: [18, 42]
      });

      // Add Pin Marker
      const marker = L.marker([initialLat, initialLng], {
        icon: customPinIcon,
        draggable: true
      }).addTo(map);

      if (selectedAreaName) {
        marker.bindPopup(`<b>${selectedAreaName}</b><br/>Drag or click anywhere to reposition site pin.`, {
          closeButton: false,
          offset: [0, -32]
        }).openPopup();
      }

      // Handle marker drag end
      marker.on("dragend", async () => {
        const position = marker.getLatLng();
        const lat = parseFloat(position.lat.toFixed(5));
        const lng = parseFloat(position.lng.toFixed(5));
        setCurrentCoords({ lat, lng });

        // Reverse geocode via OSM Nominatim with graceful fallback
        reverseGeocode(lat, lng, onLocationSelect);
      });

      // Handle Map Click to place marker
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        const roundedLat = parseFloat(lat.toFixed(5));
        const roundedLng = parseFloat(lng.toFixed(5));

        marker.setLatLng([roundedLat, roundedLng]);
        map.panTo([roundedLat, roundedLng]);
        setCurrentCoords({ lat: roundedLat, lng: roundedLng });

        reverseGeocode(roundedLat, roundedLng, onLocationSelect);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
      setIsMapReady(true);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map view when coordinates change externally
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current || !isMapReady) return;

    const currentMarkerPos = markerRef.current.getLatLng();
    if (
      Math.abs(currentMarkerPos.lat - initialLat) > 0.0001 ||
      Math.abs(currentMarkerPos.lng - initialLng) > 0.0001
    ) {
      markerRef.current.setLatLng([initialLat, initialLng]);
      mapInstanceRef.current.setView([initialLat, initialLng], 13);
      setCurrentCoords({ lat: initialLat, lng: initialLng });

      if (selectedAreaName) {
        markerRef.current.bindPopup(`<b>${selectedAreaName}</b>`, {
          closeButton: false,
          offset: [0, -32]
        }).openPopup();
      }
    }
  }, [initialLat, initialLng, isMapReady, selectedAreaName]);

  // Reverse Geocode helper
  const reverseGeocode = async (
    lat: number,
    lng: number,
    cb: (c: { lat: number; lng: number; displayName?: string }) => void
  ) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      if (res.ok) {
        const data = await res.json();
        const displayName = data.display_name;
        cb({ lat, lng, displayName });
        return;
      }
    } catch (_e) {
      // Offline or network error
    }
    cb({ lat, lng });
  };

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner flex flex-col bg-slate-100">
      {/* Map Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 z-0" style={{ minHeight: "420px" }} />

      {/* Floating Header Banner */}
      <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-sm flex items-center gap-2.5 text-xs">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="font-semibold text-slate-800">
          OpenStreetMap (OSM) Live Tile Engine
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
          Interactive
        </span>
      </div>

      {/* Floating GPS Location Display */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-sm flex items-center gap-2 text-xs font-mono text-slate-700">
        <span className="h-2 w-2 rounded-full bg-rose-500"></span>
        <span>
          Selected: {currentCoords.lat.toFixed(4)}° N, {currentCoords.lng.toFixed(4)}° E
        </span>
      </div>

      {/* Quick Recenter Button */}
      <div className="absolute bottom-3 right-3 z-10 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-200/90 shadow-sm flex items-center gap-1.5 text-[11px] text-slate-600">
        <span>Click anywhere to move pin</span>
      </div>
    </div>
  );
}
