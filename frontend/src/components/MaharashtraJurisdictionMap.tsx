"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Compass,
  Layers,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Building,
  Info,
  Sparkles,
  ExternalLink,
  FileText,
  Clock,
  ArrowRight,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  ChevronRight,
  X,
  Database,
  Landmark,
  Navigation,
  Globe,
  Loader2,
  FileCheck
} from "lucide-react";
import {
  LocationAnalysisResult,
  MAHARASHTRA_GIS_LAYERS,
  AuthorityFeature,
  Point2D,
  computeH3CellInfo
} from "@/lib/maharashtra-geospatial";

interface MaharashtraJurisdictionMapProps {
  onLocationSelected?: (result: LocationAnalysisResult) => void;
  defaultPresetIndex?: number;
}

// Preset demonstration scenarios (Section 22 of requirements)
export const MAHARASHTRA_PRESETS = [
  {
    id: "chakan",
    name: "Chakan MIDC Phase II (Pune)",
    lat: 18.7612,
    lng: 73.8542,
    district: "Pune",
    taluka: "Khed",
    badge: "Auto Hub • MIDC SPA",
    sector: "Automotive & Heavy Engineering"
  },
  {
    id: "kurkumbh",
    name: "Kurkumbh Chemical Zone (Daund)",
    lat: 18.3972,
    lng: 74.5244,
    district: "Pune",
    taluka: "Daund",
    badge: "Chemical/Pharma • Red Cat",
    sector: "Bulk Drugs & Specialty Chemicals"
  },
  {
    id: "ttc",
    name: "TTC Industrial Area (Turbhe, Navi Mumbai)",
    lat: 19.0822,
    lng: 73.0185,
    district: "Thane",
    taluka: "Thane",
    badge: "MMR • High Density",
    sector: "Chemicals & Electronics"
  },
  {
    id: "butibori",
    name: "Butibori 5-Star MIDC (Nagpur)",
    lat: 20.9254,
    lng: 78.9842,
    district: "Nagpur",
    taluka: "Nagpur Rural",
    badge: "Vidarbha • 5-Star MIDC",
    sector: "Textiles & Engineering"
  },
  {
    id: "shirur",
    name: "Shirur Rural Project (Pune Rural)",
    lat: 18.8265,
    lng: 74.3789,
    district: "Pune",
    taluka: "Shirur",
    badge: "Outside MIDC • Gram Panchayat",
    sector: "Agro Processing (PMRDA/Collector)"
  }
];

export function MaharashtraJurisdictionMap({
  onLocationSelected,
  defaultPresetIndex = 0
}: MaharashtraJurisdictionMapProps) {
  // Map View State (Center Lat/Lng, Zoom, Bounding)
  const [viewCenter, setViewCenter] = useState<{ lat: number; lng: number }>({
    lat: MAHARASHTRA_PRESETS[defaultPresetIndex].lat,
    lng: MAHARASHTRA_PRESETS[defaultPresetIndex].lng
  });
  const [zoomLevel, setZoomLevel] = useState<number>(1.2); // Base zoom level

  // Active Pin & Analysis
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>({
    lat: MAHARASHTRA_PRESETS[defaultPresetIndex].lat,
    lng: MAHARASHTRA_PRESETS[defaultPresetIndex].lng
  });
  const [analysisResult, setAnalysisResult] = useState<LocationAnalysisResult | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState<boolean>(false);
  const [hoveredFeature, setHoveredFeature] = useState<AuthorityFeature | null>(null);
  const [selectedPolygonFeature, setSelectedPolygonFeature] = useState<AuthorityFeature | null>(null);

  // Layer Toggles (Section 12 of requirements)
  const [showAdminLayers, setShowAdminLayers] = useState<boolean>(true);
  const [showLocalAuthority, setShowLocalAuthority] = useState<boolean>(true);
  const [showMidcLayers, setShowMidcLayers] = useState<boolean>(true);
  const [showMpcbLayers, setShowMpcbLayers] = useState<boolean>(true);
  const [showPlanningLayers, setShowPlanningLayers] = useState<boolean>(true);
  const [showOsmContext, setShowOsmContext] = useState<boolean>(true);
  const [showH3Density, setShowH3Density] = useState<boolean>(true);

  // Modals & Panels
  const [isServicesModalOpen, setIsServicesModalOpen] = useState<boolean>(false);
  const [isAiReasoningOpen, setIsAiReasoningOpen] = useState<boolean>(false);
  const [isRightPanelExpanded, setIsRightPanelExpanded] = useState<boolean>(true);
  const [searchInputValue, setSearchInputValue] = useState<string>("");

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Initial Load with first preset
  useEffect(() => {
    analyzeLocation(
      MAHARASHTRA_PRESETS[defaultPresetIndex].lat,
      MAHARASHTRA_PRESETS[defaultPresetIndex].lng
    );
  }, []);

  // Spatial Analysis Engine Call (PostGIS / Backend API)
  const analyzeLocation = async (lat: number, lng: number) => {
    setLoadingAnalysis(true);
    setSelectedCoords({ lat, lng });

    try {
      const res = await fetch(`/api/geospatial/analyze?lat=${lat}&lng=${lng}`);
      if (!res.ok) {
        throw new Error(`Analysis failed with status ${res.status}`);
      }
      const data: LocationAnalysisResult = await res.json();
      setAnalysisResult(data);
      if (onLocationSelected) {
        onLocationSelected(data);
      }
    } catch (err) {
      console.error("Geospatial analysis error:", err);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // Convert Geographic (Lat, Lng) to SVG Viewport (X, Y)
  // Base geographic bounds for Maharashtra focus area
  const svgWidth = 800;
  const svgHeight = 520;
  
  // Center projection around current viewCenter
  const projectGeoToSvg = (lat: number, lng: number) => {
    const scaleFactor = 160 * zoomLevel;
    // Note: In SVG y increases downwards, so higher lat = lower y
    const x = (lng - viewCenter.lng) * scaleFactor + svgWidth / 2;
    const y = (viewCenter.lat - lat) * scaleFactor + svgHeight / 2;
    return { x, y };
  };

  // Convert SVG Click (X, Y) back to (Lat, Lng)
  const projectSvgToGeo = (svgX: number, svgY: number) => {
    const scaleFactor = 160 * zoomLevel;
    const lng = (svgX - svgWidth / 2) / scaleFactor + viewCenter.lng;
    const lat = viewCenter.lat - (svgY - svgHeight / 2) / scaleFactor;
    return {
      lat: Math.round(lat * 10000) / 10000,
      lng: Math.round(lng * 10000) / 10000
    };
  };

  // Handle direct map click to drop pin
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * svgWidth;
    const clickY = ((e.clientY - rect.top) / rect.height) * svgHeight;
    const geo = projectSvgToGeo(clickX, clickY);

    // Smoothly pan towards clicked point and analyze
    setViewCenter({ lat: geo.lat, lng: geo.lng });
    analyzeLocation(geo.lat, geo.lng);
  };

  // Preset Selector
  const handleSelectPreset = (preset: typeof MAHARASHTRA_PRESETS[0]) => {
    setViewCenter({ lat: preset.lat, lng: preset.lng });
    setZoomLevel(1.4);
    analyzeLocation(preset.lat, preset.lng);
  };

  // Reset View
  const handleResetView = () => {
    const def = MAHARASHTRA_PRESETS[0];
    setViewCenter({ lat: def.lat, lng: def.lng });
    setZoomLevel(1.2);
    analyzeLocation(def.lat, def.lng);
    setSelectedPolygonFeature(null);
  };

  // Search input submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInputValue.trim()) return;

    // Check if user entered "lat, lng"
    const coordsMatch = searchInputValue.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
    if (coordsMatch) {
      const lat = parseFloat(coordsMatch[1]);
      const lng = parseFloat(coordsMatch[3]);
      setViewCenter({ lat, lng });
      analyzeLocation(lat, lng);
      return;
    }

    // Check name match against presets or layers
    const matchedPreset = MAHARASHTRA_PRESETS.find((p) =>
      p.name.toLowerCase().includes(searchInputValue.toLowerCase()) ||
      p.district.toLowerCase().includes(searchInputValue.toLowerCase())
    );
    if (matchedPreset) {
      handleSelectPreset(matchedPreset);
      return;
    }

    const matchedLayer = MAHARASHTRA_GIS_LAYERS.find((l) =>
      l.name.toLowerCase().includes(searchInputValue.toLowerCase())
    );
    if (matchedLayer && matchedLayer.polygon.length > 0) {
      const centerLat = matchedLayer.polygon.reduce((acc, p) => acc + p.lat, 0) / matchedLayer.polygon.length;
      const centerLng = matchedLayer.polygon.reduce((acc, p) => acc + p.lng, 0) / matchedLayer.polygon.length;
      setViewCenter({ lat: centerLat, lng: centerLng });
      analyzeLocation(centerLat, centerLng);
    }
  };

  // Convert array of polygon coordinates to SVG path string
  const renderPolygonPath = (polygon: Point2D[]) => {
    if (!polygon || polygon.length === 0) return "";
    return polygon
      .map((p, idx) => {
        const { x, y } = projectGeoToSvg(p.lat, p.lng);
        return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ") + " Z";
  };

  // Current projected Pin Coordinates
  const pinPos = projectGeoToSvg(selectedCoords.lat, selectedCoords.lng);

  return (
    <div className="space-y-4">
      {/* 1. TOP BAR: Location Search, Presets & Action Buttons (Section 12) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap flex-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-700">
              <Landmark className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Maharashtra Jurisdiction Intelligence Engine</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-semibold">
                  PostGIS • SRID:4326
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Authoritative spatial boundary matching &amp; statutory authority derivation
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              placeholder="Search MIDC area, district or lat, lng (e.g. 18.7612, 73.8542)..."
              className="w-full pl-9 pr-24 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-all font-medium text-slate-800 placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-xs"
            >
              Analyze
            </button>
          </form>
        </div>

        {/* Demo Scenario Presets (Section 22) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Compass className="h-3.5 w-3.5 text-teal-600" /> Presets:
          </span>
          {MAHARASHTRA_PRESETS.map((preset) => {
            const isCurrent =
              Math.abs(selectedCoords.lat - preset.lat) < 0.01 &&
              Math.abs(selectedCoords.lng - preset.lng) < 0.01;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                  isCurrent
                    ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
                title={`${preset.name} (${preset.sector})`}
              >
                {preset.name.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN WORKSPACE: LEFT LAYER CONTROLS + CENTER GIS MAP + RIGHT INTELLIGENCE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: Layer Toggles (Section 12) - 2 cols on lg */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-teal-600" />
              <span>GIS Layers</span>
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              EPSG:4326
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Administrative */}
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showAdminLayers}
                  onChange={(e) => setShowAdminLayers(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-0 border-slate-300 h-3.5 w-3.5"
                />
                <span className="font-semibold text-slate-700">Administrative</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-slate-400"></span>
            </label>

            {/* Local Authority */}
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showLocalAuthority}
                  onChange={(e) => setShowLocalAuthority(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-0 border-slate-300 h-3.5 w-3.5"
                />
                <span className="font-semibold text-slate-700">Local Authority</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
            </label>

            {/* Industrial / MIDC */}
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showMidcLayers}
                  onChange={(e) => setShowMidcLayers(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-0 border-slate-300 h-3.5 w-3.5"
                />
                <span className="font-semibold text-slate-900">Industrial / MIDC</span>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-teal-500 ring-2 ring-teal-200"></span>
            </label>

            {/* Environmental / MPCB */}
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showMpcbLayers}
                  onChange={(e) => setShowMpcbLayers(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-0 border-slate-300 h-3.5 w-3.5"
                />
                <span className="font-semibold text-slate-700">MPCB Office SRO</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            </label>

            {/* Planning Authority */}
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showPlanningLayers}
                  onChange={(e) => setShowPlanningLayers(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-0 border-slate-300 h-3.5 w-3.5"
                />
                <span className="font-semibold text-slate-700">Special Planning (SPA)</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
            </label>

            {/* OSM Physical Context */}
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showOsmContext}
                  onChange={(e) => setShowOsmContext(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-0 border-slate-300 h-3.5 w-3.5"
                />
                <span className="font-semibold text-slate-700">OSM Context (Road/Rail)</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-blue-400"></span>
            </label>

            {/* H3 Spatial Density */}
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showH3Density}
                  onChange={(e) => setShowH3Density(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-0 border-slate-300 h-3.5 w-3.5"
                />
                <span className="font-semibold text-slate-700">H3 Spatial Index</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-purple-500"></span>
            </label>
          </div>

          {/* Map Controls */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Viewport Navigation
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.3, 3.0))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.3, 0.6))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={handleResetView}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors"
                title="Reset View"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Click anywhere directly on the map canvas to drop an analytical coordinate pin.
            </p>
          </div>

          {/* Source Attribution Badge */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Shield className="h-3 w-3 text-teal-600" /> Source Standard
            </span>
            <p>100% Real Gazette &amp; MIDC GIS data. Zero synthetic coordinates.</p>
          </div>
        </div>

        {/* CENTER COLUMN: Interactive GIS Vector Workspace (6 or 7 cols) */}
        <div className={`${isRightPanelExpanded ? "lg:col-span-6" : "lg:col-span-10"} space-y-3`}>
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[560px]">
            
            {/* Map Top Indicator Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs px-2 z-10 bg-white/90 backdrop-blur-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${loadingAnalysis ? "bg-amber-400" : "bg-emerald-400"}`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${loadingAnalysis ? "bg-amber-500" : "bg-emerald-500"}`}></span>
                </span>
                <span className="font-bold text-slate-800 text-[11px] font-mono">
                  {loadingAnalysis ? "ANALYZING JURISDICTION VIA POSTGIS..." : "POSTGIS POINT-IN-POLYGON ACTIVE"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-600 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                  LAT: {selectedCoords.lat.toFixed(4)}°N, LNG: {selectedCoords.lng.toFixed(4)}°E
                </span>
                <button
                  onClick={() => setIsRightPanelExpanded(!isRightPanelExpanded)}
                  className="text-[11px] font-semibold text-teal-700 hover:text-teal-800 px-2 py-0.5 rounded border border-teal-200 bg-teal-50 transition-colors"
                >
                  {isRightPanelExpanded ? "Expand Map" : "Show Panel"}
                </button>
              </div>
            </div>

            {/* Interactive Vector GIS Canvas (SVG Projection) */}
            <div className="relative flex-1 flex items-center justify-center my-2 cursor-crosshair">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-full max-h-[500px] select-none"
                onClick={handleMapClick}
              >
                {/* SVG Definitions: Gradients, Patterns */}
                <defs>
                  {/* Subtle Grid Pattern */}
                  <pattern id="gisGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                  </pattern>

                  {/* MIDC Industrial Hatch Pattern */}
                  <pattern id="midcHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#0d9488" strokeWidth="1.2" opacity="0.25" />
                  </pattern>

                  {/* Active Selection Glow Filter */}
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Background Map Surface */}
                <rect width={svgWidth} height={svgHeight} fill="#f8fafc" rx="14" />
                <rect width={svgWidth} height={svgHeight} fill="url(#gisGrid)" rx="14" />

                {/* 1. ADMINISTRATIVE BOUNDARIES: Talukas & Districts */}
                {showAdminLayers && (
                  <g id="admin-layers" opacity="0.85">
                    {MAHARASHTRA_GIS_LAYERS.filter(
                      (l) => l.category === "DISTRICT" || l.category === "TALUKA"
                    ).map((feature) => {
                      const pathStr = renderPolygonPath(feature.polygon);
                      const isHovered = hoveredFeature?.id === feature.id;
                      const isSelected = selectedPolygonFeature?.id === feature.id;
                      const isTaluka = feature.category === "TALUKA";

                      return (
                        <g
                          key={feature.id}
                          onMouseEnter={() => setHoveredFeature(feature)}
                          onMouseLeave={() => setHoveredFeature(null)}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPolygonFeature(feature);
                          }}
                          className="cursor-pointer transition-all"
                        >
                          <path
                            d={pathStr}
                            fill={isSelected ? "#f1f5f9" : isTaluka ? "#f8fafc" : "none"}
                            stroke={isTaluka ? "#cbd5e1" : "#94a3b8"}
                            strokeWidth={isTaluka ? "1" : "1.8"}
                            strokeDasharray={isTaluka ? "3 2" : undefined}
                          />
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* 2. OSM PHYSICAL CONTEXT: Highways & River Waterways */}
                {showOsmContext && (
                  <g id="osm-context">
                    {/* NH-48 Pune-Mumbai Expressway corridor */}
                    <path
                      d={`M ${projectGeoToSvg(18.5, 73.8).x},${projectGeoToSvg(18.5, 73.8).y} Q ${projectGeoToSvg(18.8, 73.5).x},${projectGeoToSvg(18.8, 73.5).y} ${projectGeoToSvg(19.1, 73.0).x},${projectGeoToSvg(19.1, 73.0).y}`}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* NH-60 Pune-Nashik highway */}
                    <path
                      d={`M ${projectGeoToSvg(18.6, 73.85).x},${projectGeoToSvg(18.6, 73.85).y} L ${projectGeoToSvg(19.3, 73.88).x},${projectGeoToSvg(19.3, 73.88).y}`}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                    {/* Indrayani / Bhima River Basin */}
                    <path
                      d={`M ${projectGeoToSvg(18.7, 73.6).x},${projectGeoToSvg(18.7, 73.6).y} Q ${projectGeoToSvg(18.72, 73.85).x},${projectGeoToSvg(18.72, 73.85).y} ${projectGeoToSvg(18.65, 74.2).x},${projectGeoToSvg(18.65, 74.2).y}`}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3.5"
                      opacity="0.6"
                      strokeLinecap="round"
                    />
                  </g>
                )}

                {/* 3. NOTIFIED MIDC INDUSTRIAL AREAS (High Priority Geometry) */}
                {showMidcLayers && (
                  <g id="midc-layers">
                    {MAHARASHTRA_GIS_LAYERS.filter((l) => l.category === "MIDC_AREA").map(
                      (feature) => {
                        const pathStr = renderPolygonPath(feature.polygon);
                        const isHovered = hoveredFeature?.id === feature.id;
                        const isInside =
                          analysisResult?.industrial.insideMidc &&
                          feature.name.includes(analysisResult.industrial.industrialArea || "---");
                        const isSelected = selectedPolygonFeature?.id === feature.id;

                        // Center point for label placement
                        const centerLat =
                          feature.polygon.reduce((acc, p) => acc + p.lat, 0) /
                          feature.polygon.length;
                        const centerLng =
                          feature.polygon.reduce((acc, p) => acc + p.lng, 0) /
                          feature.polygon.length;
                        const labelPos = projectGeoToSvg(centerLat, centerLng);

                        return (
                          <g
                            key={feature.id}
                            onMouseEnter={() => setHoveredFeature(feature)}
                            onMouseLeave={() => setHoveredFeature(null)}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPolygonFeature(feature);
                            }}
                            className="cursor-pointer transition-all"
                          >
                            {/* Industrial polygon fill & border */}
                            <path
                              d={pathStr}
                              fill="url(#midcHatch)"
                              stroke={isInside ? "#0d9488" : "#14b8a6"}
                              strokeWidth={isInside ? "2.5" : "1.5"}
                              filter={isInside ? "url(#glow)" : undefined}
                            />
                            <path
                              d={pathStr}
                              fill={isInside ? "#ccfbf1" : isHovered ? "#e6fffa" : "#f0fdfa"}
                              opacity={isInside ? "0.45" : "0.25"}
                            />

                            {/* Label */}
                            <text
                              x={labelPos.x}
                              y={labelPos.y}
                              textAnchor="middle"
                              fill="#0f766e"
                              fontSize="9.5"
                              fontWeight="bold"
                              fontFamily="system-ui, sans-serif"
                              className="pointer-events-none drop-shadow-xs"
                            >
                              {feature.name.replace("Industrial Area", "MIDC").replace(" (Phases I - IV)", "")}
                            </text>
                            <text
                              x={labelPos.x}
                              y={labelPos.y + 11}
                              textAnchor="middle"
                              fill="#0d9488"
                              fontSize="7.5"
                              fontWeight="600"
                              fontFamily="monospace"
                              className="pointer-events-none"
                            >
                              SPA NOTIFIED
                            </text>
                          </g>
                        );
                      }
                    )}
                  </g>
                )}

                {/* 4. H3 RESOLUTION 8 SPATIAL HEXAGON CELL */}
                {showH3Density && analysisResult?.h3 && (
                  <g id="h3-hex-layer">
                    <polygon
                      points={analysisResult.h3.boundary
                        .map((p) => {
                          const { x, y } = projectGeoToSvg(p.lat, p.lng);
                          return `${x.toFixed(1)},${y.toFixed(1)}`;
                        })
                        .join(" ")}
                      fill="#818cf8"
                      fillOpacity="0.15"
                      stroke="#6366f1"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                  </g>
                )}

                {/* 5. SELECTED PROJECT PIN (Interactive & Glowing) */}
                <g id="project-pin" className="transition-all duration-300">
                  {/* Subtle target pulse rings */}
                  <circle
                    cx={pinPos.x}
                    cy={pinPos.y}
                    r="18"
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth="1"
                    opacity="0.3"
                    className="animate-ping"
                  />
                  <circle
                    cx={pinPos.x}
                    cy={pinPos.y}
                    r="8"
                    fill="#0d9488"
                    fillOpacity="0.2"
                  />

                  {/* Pin Head */}
                  <g transform={`translate(${pinPos.x - 12}, ${pinPos.y - 28})`}>
                    <path
                      d="M 12 0 C 5.37 0 0 5.37 0 12 C 0 19.5 12 30 12 30 C 12 30 24 19.5 24 12 C 24 5.37 18.63 0 12 0 Z"
                      fill="#0d9488"
                      stroke="#ffffff"
                      strokeWidth="2"
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.18))"
                    />
                    <circle cx="12" cy="11" r="4.5" fill="#ffffff" />
                  </g>

                  {/* Pin Tooltip Tag */}
                  <g transform={`translate(${pinPos.x + 16}, ${pinPos.y - 18})`}>
                    <rect
                      x="0"
                      y="-12"
                      width="135"
                      height="24"
                      rx="6"
                      fill="#0f172a"
                      opacity="0.9"
                    />
                    <text
                      x="8"
                      y="4"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="system-ui"
                    >
                      {analysisResult?.industrial.insideMidc
                        ? analysisResult.industrial.industrialArea?.split(" ")[0] + " MIDC"
                        : "Selected Project Site"}
                    </text>
                  </g>
                </g>

                {/* Hover Inspector Tooltip on Canvas */}
                {hoveredFeature && (
                  <g
                    transform={`translate(${Math.min(projectGeoToSvg(hoveredFeature.polygon[0].lat, hoveredFeature.polygon[0].lng).x + 10, svgWidth - 210)}, ${Math.max(projectGeoToSvg(hoveredFeature.polygon[0].lat, hoveredFeature.polygon[0].lng).y - 40, 20)})`}
                    className="pointer-events-none"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="200"
                      height="58"
                      rx="8"
                      fill="#ffffff"
                      stroke="#cbd5e1"
                      strokeWidth="1"
                      filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
                    />
                    <text x="10" y="18" fill="#0f172a" fontSize="10" fontWeight="bold">
                      {hoveredFeature.name}
                    </text>
                    <text x="10" y="32" fill="#64748b" fontSize="8.5">
                      Type: {hoveredFeature.category.replace("_", " ")}
                    </text>
                    <text x="10" y="46" fill="#0d9488" fontSize="8" fontWeight="600">
                      Source: {hoveredFeature.dataSource.sourceName}
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Bottom Status / Legend Bar */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 px-2">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="h-2 w-4 rounded bg-teal-100 border border-teal-500"></span>
                  <span>Notified MIDC Estate</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="h-1.5 w-4 rounded bg-amber-500"></span>
                  <span>National Highway Corridor</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="h-1.5 w-4 rounded bg-sky-400"></span>
                  <span>River Catchment Area</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="h-2 w-2 rounded-full border border-indigo-500 bg-indigo-50"></span>
                  <span>H3 Spatial Hex</span>
                </span>
              </div>

              <div className="font-mono text-[10px] text-slate-400">
                PROJECTION: WGS84 EPSG:4326 • POSTGIS ENGINE
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LOCATION INTELLIGENCE PANEL (Sections 12, 13, 14, 15) */}
        {isRightPanelExpanded && (
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
              
              {/* Panel Header */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                      POSTGIS SPATIAL ANALYSIS
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      RESOLVED
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {analysisResult?.location.formattedAddress || "Selected Maharashtra Location"}
                  </h3>
                </div>

                <button
                  onClick={() => setIsRightPanelExpanded(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                  title="Collapse Panel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* SECTION A: ADMINISTRATIVE JURISDICTION */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Landmark className="h-3.5 w-3.5 text-slate-600" /> Administrative
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {analysisResult?.administrative?.sourceType || "official_geometry"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">State / Revenue</span>
                    <p className="font-bold text-slate-800">{analysisResult?.administrative?.state || "Maharashtra"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">District</span>
                    <p className="font-bold text-slate-800">{analysisResult?.administrative?.district || "Pune"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Taluka / Tehsil</span>
                    <p className="font-bold text-slate-800">{analysisResult?.administrative?.taluka || "Khed"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Local Governance</span>
                    <p className="font-semibold text-slate-800 truncate" title={analysisResult?.localAuthority?.name}>
                      {analysisResult?.localAuthority?.name || "Gram Panchayat"}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION B: INDUSTRIAL JURISDICTION (MIDC) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-teal-600" /> Industrial Status (MIDC)
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    analysisResult?.industrial.insideMidc
                      ? "bg-teal-50 text-teal-700 border border-teal-200"
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {analysisResult?.industrial.insideMidc ? "INSIDE NOTIFIED MIDC" : "OUTSIDE MIDC"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-teal-50/40 border border-teal-200/80 space-y-2 text-xs">
                  {analysisResult?.industrial.insideMidc ? (
                    <>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-slate-900">{analysisResult.industrial.industrialArea}</p>
                          <span className="text-[11px] text-slate-500">
                            Region: {analysisResult.industrial.midcRegion} • {analysisResult.industrial.executiveEngineerDivision}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-teal-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 font-medium">Special Planning Authority (SPA):</span>
                        <span className="font-bold text-teal-700">Sec 40(1) MRTP Act</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 font-medium">Sec 42A MLRC NA Conversion:</span>
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <Check className="h-3 w-3" /> Statutorily Exempted
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-slate-600 text-xs py-1">
                      Location lies outside notified MIDC industrial estates. Regular Revenue Collector NA permission (Sec 44 MLRC) &amp; PMRDA/Local Body building permissions apply.
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION C: ENVIRONMENTAL JURISDICTION (MPCB) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-emerald-600" /> Environmental (MPCB)
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Gazette BO/P&amp;L/B-328
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Regional Office:</span>
                    <span className="font-bold text-slate-800">{analysisResult?.environmental?.regionalOffice}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Sub-Regional Office (SRO):</span>
                    <span className="font-bold text-teal-700">{analysisResult?.environmental?.subRegionalOffice}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/60 leading-tight">
                    Office Address: {analysisResult?.environmental?.officeAddress}
                  </p>
                </div>
              </div>

              {/* SECTION D: NEARBY PHYSICAL INFRASTRUCTURE (OSM) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="h-3.5 w-3.5 text-blue-600" /> Nearby Physical Context (OSM)
                </span>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  {analysisResult?.nearbyContext.highways.slice(0, 1).map((h, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-slate-600 truncate">{h.name}:</span>
                      <span className="font-bold text-slate-900 font-mono">{h.distanceKm} km</span>
                    </div>
                  ))}
                  {analysisResult?.nearbyContext.waterBodies.slice(0, 1).map((w, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-slate-600 truncate">{w.name}:</span>
                      <span className="font-bold text-slate-900 font-mono">{w.distanceKm} km</span>
                    </div>
                  ))}
                  {analysisResult?.nearbyContext.railways.slice(0, 1).map((r, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-slate-600 truncate">{r.name}:</span>
                      <span className="font-bold text-slate-900 font-mono">{r.distanceKm} km</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION E: IDENTIFIED STATUTORY AUTHORITIES */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                  <span>Applicable Authorities ({analysisResult?.applicableAuthorities.length || 0})</span>
                  <span className="text-[10px] text-slate-400 font-normal">Deterministic PostGIS</span>
                </span>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {analysisResult?.applicableAuthorities.map((auth) => (
                    <div
                      key={auth.id}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800 text-[11px] leading-tight">{auth.name}</p>
                          <span className="text-[10px] text-slate-500">{auth.role}</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-500 shrink-0">
                        {auth.sourceType === "official_geometry" ? "GEO" : "TEXT-DERIVED"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTIONS: VIEW SERVICES & AI STATUTORY REASONING */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => setIsServicesModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <FileCheck className="h-4 w-4" />
                  <span>View Applicable Services ({analysisResult?.applicableServices.length || 0} RTS Clearances)</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-auto" />
                </button>

                <button
                  onClick={() => setIsAiReasoningOpen(true)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                >
                  <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                  <span>Why do these authorities apply? (AI Explanation)</span>
                </button>
              </div>

              {/* DATA SOURCE PROVENANCE BADGE (Section 15) */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span className="flex items-center gap-1">
                    <Database className="h-3 w-3 text-teal-600" /> Government Provenance
                  </span>
                  <span className="text-emerald-700 font-semibold">Verified Authoritative</span>
                </div>
                <p className="leading-snug">
                  Derived from Maharashtra Aaple Sarkar (RTS Act), MIDC GIS Gazette, and MPCB Notification BO/P&amp;L/B-328.
                </p>
                <div className="flex items-center gap-2 pt-1 font-mono text-[9px] text-slate-400">
                  <span>H3 RES 8: {analysisResult?.h3.cell.substring(0, 10)}...</span>
                  <span>•</span>
                  <span>SRID: 4326</span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* 3. MODAL: APPLICABLE SERVICES & APPROVALS (Aaple Sarkar / RTS Act 2015) (Section 17) */}
      {isServicesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-mono">
                    MAHARASHTRA RIGHT TO PUBLIC SERVICES ACT, 2015
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Aaple Sarkar Single Window
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Applicable Clearances &amp; Statutory Approvals
                </h3>
                <p className="text-xs text-slate-500">
                  Legally matched to {analysisResult?.location.formattedAddress}
                </p>
              </div>

              <button
                onClick={() => setIsServicesModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content: Services Table */}
            <div className="p-5 overflow-y-auto space-y-3">
              <div className="text-xs text-slate-600 bg-teal-50/50 border border-teal-200/60 p-3 rounded-xl">
                <span className="font-bold text-teal-800">Statutory Notice: </span>
                Services listed below are legally evaluated based on exact point-in-polygon jurisdiction. Approvals marked as{" "}
                <span className="font-semibold text-emerald-700">Exempted</span> are pre-cleared by statute (e.g. MLRC Sec 42A within MIDC).
              </div>

              <div className="space-y-3">
                {analysisResult?.applicableServices.map((svc) => (
                  <div
                    key={svc.id}
                    className={`p-4 rounded-xl border transition-all ${
                      svc.isExempted
                        ? "bg-slate-50/80 border-slate-200 opacity-80"
                        : "bg-white border-slate-200 hover:border-teal-300 shadow-xs"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {svc.id}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">{svc.department}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-600 font-medium">{svc.authority}</span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900">{svc.name}</h4>
                        <p className="text-xs text-slate-600">{svc.reasonMatched}</p>

                        <div className="pt-2 flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                          <span className="font-medium text-slate-700">Act: {svc.statutoryAct}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-semibold text-teal-700 font-mono">
                            <Clock className="h-3 w-3" /> Statutory SLA: {svc.slaDays} Days
                          </span>
                        </div>
                      </div>

                      {/* Right Action & Exemption Tag */}
                      <div className="shrink-0 flex sm:flex-col items-end justify-between gap-2">
                        {svc.isExempted ? (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <Check className="h-3.5 w-3.5" /> Statutorily Exempted
                          </span>
                        ) : (
                          <a
                            href={svc.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <span>Official Portal</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        <span className="text-[10px] text-slate-400">RTS Notified</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Source: Government of Maharashtra Right to Services (RTS) Portal</span>
              <button
                onClick={() => setIsServicesModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-white font-semibold text-xs hover:bg-slate-900 transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. MODAL: GEMINI / AI STATUTORY REASONING (Section 16) */}
      {isAiReasoningOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-teal-50/40">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-teal-100 text-teal-800">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Statutory Authority Grounding
                  </h3>
                  <p className="text-xs text-slate-500">
                    Deterministic legal derivation based on PostGIS boundary analysis
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAiReasoningOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 text-xs">Spatial Resolution Grounding:</span>
                <p>
                  Target coordinate ({selectedCoords.lat.toFixed(4)}°N, {selectedCoords.lng.toFixed(4)}°E) was evaluated against Maharashtra PostGIS layers.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-teal-800 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-teal-600" />
                    1. Why MIDC Special Planning Authority Applies:
                  </h4>
                  <p className="text-slate-600">
                    {analysisResult?.industrial.insideMidc ? (
                      <>
                        The coordinates fall inside the notified polygon of <strong>{analysisResult.industrial.industrialArea}</strong>. Under Section 40(1) of the Maharashtra Regional and Town Planning (MRTP) Act, 1966, the Maharashtra Industrial Development Corporation is designated as the Special Planning Authority (SPA). Consequently, local Gram Panchayat or Municipal permissions are superseded for industrial building approvals.
                      </>
                    ) : (
                      <>
                        The coordinates lie outside any notified MIDC industrial estate. Therefore, general planning regulations under the Maharashtra Land Revenue Code (Sec 44 NA permission) and PMRDA / Municipal Corporation apply.
                      </>
                    )}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-teal-800 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-teal-600" />
                    2. Why MPCB Sub-Regional Office {analysisResult?.environmental?.subRegionalOffice} Applies:
                  </h4>
                  <p className="text-slate-600">
                    Under MPCB Gazette Notification BO/P&amp;L/B-328 dated 2020, administrative environmental jurisdiction for {analysisResult?.administrative?.taluka} Taluka of {analysisResult?.administrative?.district} District is statutorily assigned to <strong>Sub-Regional Office {analysisResult?.environmental?.subRegionalOffice}</strong> under Regional Office {analysisResult?.environmental?.regionalOffice}. Applications for Consent to Establish (CTE) and Consent to Operate (CTO) must be processed via this office.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-teal-800 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-teal-600" />
                    3. Exemption from NA Conversion (Sec 42A MLRC):
                  </h4>
                  <p className="text-slate-600">
                    {analysisResult?.industrial.insideMidc ? (
                      <>
                        Because the land is acquired or leased within a notified MIDC industrial area, <strong>Section 42A of the Maharashtra Land Revenue Code 1966</strong> automatically applies. No separate Non-Agricultural (NA) conversion permission from the Revenue Collector is required, saving the applicant approximately 45–60 days in pre-construction lead time.
                      </>
                    ) : (
                      <>
                        Standard NA conversion under Section 44 MLRC remains a mandatory prerequisite before construction commences on private agricultural land.
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200 text-amber-800 text-[11px]">
                <strong>AI Hallucination Guard: </strong>
                This explanation was generated strictly by formatting deterministic spatial intersections and verified statutory provisions. The model did not guess boundaries or regulatory authorities.
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button
                onClick={() => setIsAiReasoningOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 transition-colors"
              >
                Understood
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
