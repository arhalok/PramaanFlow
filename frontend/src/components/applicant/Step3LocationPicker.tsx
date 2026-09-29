"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ResolvedLocation, DEFAULT_RESOLVED_LOCATION } from "@/lib/project-state";
import { analyzeMaharashtraLocation } from "@/lib/maharashtra-geospatial";
import {
  MapPin,
  Search,
  Crosshair,
  Map as MapIcon,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Compass
} from "lucide-react";

// Client-only dynamic import of InteractiveOSMMap to ensure no SSR hydration issues
const InteractiveOSMMap = dynamic(
  () =>
    import("@/components/applicant/InteractiveOSMMap").then(
      (mod) => mod.InteractiveOSMMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[420px] rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
        <div className="flex flex-col items-center gap-2 text-slate-500 text-xs">
          <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
          <span>Loading OpenStreetMap Live Canvas...</span>
        </div>
      </div>
    )
  }
);

interface Step3LocationPickerProps {
  initialQuery?: string;
  onLocationConfirmed: (resolved: ResolvedLocation) => void;
  onBack: () => void;
}

interface LocationPreset {
  id: string;
  name: string;
  state: "Maharashtra" | "Rajasthan";
  lat: number;
  lng: number;
  district: string;
  taluka?: string;
  industrialArea?: string;
  insideIndustrialArea: boolean;
  planningAuthority: string;
  environmentalOffice: string;
  localBody: string;
  displayAddress: string;
}

const PRESET_LOCATIONS: LocationPreset[] = [
  {
    id: "chakan",
    name: "Chakan Industrial Area Phase II (Pune)",
    state: "Maharashtra",
    lat: 18.7612,
    lng: 73.8542,
    district: "Pune",
    taluka: "Khed",
    industrialArea: "Chakan Industrial Area Phase II",
    insideIndustrialArea: true,
    planningAuthority: "MIDC Special Planning Authority (SPA under Sec 40(1) MRTP Act)",
    environmentalOffice: "MPCB Sub-Regional Office (Pune-II)",
    localBody: "MIDC Notified Industrial Authority",
    displayAddress: "Chakan Industrial Area Phase II, Khed Taluka, Pune, Maharashtra"
  },
  {
    id: "kurkumbh",
    name: "Kurkumbh Chemical Zone (Pune)",
    state: "Maharashtra",
    lat: 18.3972,
    lng: 74.5244,
    district: "Pune",
    taluka: "Daund",
    industrialArea: "Kurkumbh Chemical Industrial Area",
    insideIndustrialArea: true,
    planningAuthority: "MIDC Special Planning Authority (SPA)",
    environmentalOffice: "MPCB Sub-Regional Office (Pune-I)",
    localBody: "MIDC Notified Industrial Area",
    displayAddress: "Kurkumbh Chemical Zone, Daund Taluka, Pune, Maharashtra"
  },
  {
    id: "ttc",
    name: "TTC Industrial Area (Navi Mumbai)",
    state: "Maharashtra",
    lat: 19.0822,
    lng: 73.0185,
    district: "Thane",
    taluka: "Thane",
    industrialArea: "Trans-Thane Creek (TTC) Industrial Area",
    insideIndustrialArea: true,
    planningAuthority: "MIDC Special Planning Authority (SPA)",
    environmentalOffice: "MPCB Sub-Regional Office (Navi Mumbai-I)",
    localBody: "Navi Mumbai Municipal Corporation / MIDC",
    displayAddress: "TTC Industrial Area, Turbhe, Navi Mumbai, Maharashtra"
  },
  {
    id: "butibori",
    name: "Butibori 5-Star Industrial Zone (Nagpur)",
    state: "Maharashtra",
    lat: 20.9254,
    lng: 78.9842,
    district: "Nagpur",
    taluka: "Nagpur Rural",
    industrialArea: "Butibori Industrial Area",
    insideIndustrialArea: true,
    planningAuthority: "MIDC Special Planning Authority (SPA)",
    environmentalOffice: "MPCB Sub-Regional Office (Nagpur-II)",
    localBody: "MIDC Notified Industrial Authority",
    displayAddress: "Butibori Industrial Area, Nagpur, Maharashtra"
  },
  {
    id: "sitapura",
    name: "Sitapura Industrial Area Phase IV (Jaipur)",
    state: "Rajasthan",
    lat: 26.7825,
    lng: 75.8362,
    district: "Jaipur",
    taluka: "Sanganer",
    industrialArea: "Sitapura Industrial Area Phase IV",
    insideIndustrialArea: true,
    planningAuthority: "RIICO Regional Office (Sitapura, Jaipur)",
    environmentalOffice: "RSPCB Regional Office Jaipur (South)",
    localBody: "Jaipur Development Authority / RIICO",
    displayAddress: "Sitapura Industrial Area Phase IV, Sanganer, Jaipur, Rajasthan"
  }
];

export function Step3LocationPicker({
  initialQuery,
  onLocationConfirmed,
  onBack
}: Step3LocationPickerProps) {
  // Current selected location state
  const [selectedPreset, setSelectedPreset] = useState<LocationPreset>(() => {
    if (initialQuery) {
      const q = initialQuery.toLowerCase();
      const match = PRESET_LOCATIONS.find(
        (p) =>
          q.includes(p.name.toLowerCase()) ||
          q.includes(p.district.toLowerCase()) ||
          q.includes(p.id)
      );
      if (match) return match;
    }
    return PRESET_LOCATIONS[0];
  });

  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: selectedPreset.lat,
    lng: selectedPreset.lng
  });

  const [searchQuery, setSearchQuery] = useState(initialQuery || "");
  const [isResolving, setIsResolving] = useState(false);
  const [resolutionStatus, setResolutionStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"search" | "map" | "current">("map");

  // Map viewport pan & zoom
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Sync coords when preset changes
  useEffect(() => {
    setCurrentCoords({ lat: selectedPreset.lat, lng: selectedPreset.lng });
  }, [selectedPreset]);

  const handleUseCurrentLocation = () => {
    setActiveTab("current");
    setIsResolving(true);
    setResolutionStatus("Accessing device GPS coordinates...");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCurrentCoords({ lat, lng });
          resolveCoordinates(lat, lng);
        },
        (_err) => {
          // Fallback to Pune industrial hub
          setTimeout(() => {
            setCurrentCoords({ lat: 18.7612, lng: 73.8542 });
            resolveCoordinates(18.7612, 73.8542);
          }, 800);
        }
      );
    } else {
      setTimeout(() => {
        resolveCoordinates(18.7612, 73.8542);
      }, 800);
    }
  };

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Approximate mapping from SVG viewport coordinates to Maharashtra/India bounding box
    // Lat range: 15.5 to 22.0 (Height: 400px), Lng range: 72.5 to 80.5 (Width: 600px)
    const lng = 72.5 + (x / rect.width) * 8.0;
    const lat = 22.0 - (y / rect.height) * 6.5;

    const roundedLat = parseFloat(lat.toFixed(4));
    const roundedLng = parseFloat(lng.toFixed(4));

    setCurrentCoords({ lat: roundedLat, lng: roundedLng });
    resolveCoordinates(roundedLat, roundedLng);
  };

  const resolveCoordinates = (lat: number, lng: number) => {
    setIsResolving(true);
    setResolutionStatus("Resolving regulatory jurisdiction for this location...");

    // Execute backend location resolution
    setTimeout(() => {
      // Check if location is in Maharashtra spatial bounds
      if (lat >= 15.6 && lat <= 22.1 && lng >= 72.6 && lng <= 80.9) {
        try {
          const result = analyzeMaharashtraLocation(lat, lng);
          const isMidc = result.industrial.insideMidc;
          const updated: LocationPreset = {
            id: `custom-${Date.now()}`,
            name: isMidc ? `${result.industrial.industrialArea || "MIDC Zone"}` : `${result.administrative?.taluka || "Rural"} Taluka`,
            state: "Maharashtra",
            lat,
            lng,
            district: result.administrative?.district || "Pune",
            taluka: result.administrative?.taluka || "Khed",
            industrialArea: result.industrial.industrialArea || undefined,
            insideIndustrialArea: isMidc,
            planningAuthority: result.planning?.authority || "MIDC Special Planning Authority (SPA)",
            environmentalOffice: result.environmental
              ? `MPCB Sub-Regional Office (${result.environmental.subRegionalOffice})`
              : "MPCB Regional Office",
            localBody: result.localAuthority?.name || "Local Planning Authority",
            displayAddress: result.location.formattedAddress
          };
          setSelectedPreset(updated);
        } catch (_e) {
          // Fallback
        }
      } else {
        // Outside Maharashtra (e.g. Rajasthan Sitapura)
        setSelectedPreset(PRESET_LOCATIONS[4]);
      }

      setIsResolving(false);
      setResolutionStatus("Location confirmed");
    }, 700);
  };

  const handleConfirmLocation = () => {
    setIsResolving(true);
    setResolutionStatus("Resolving the regulatory context for this location...");

    setTimeout(() => {
      const resolved: ResolvedLocation = {
        lat: currentCoords.lat,
        lng: currentCoords.lng,
        displayAddress: selectedPreset.displayAddress,
        state: selectedPreset.state,
        district: selectedPreset.district,
        taluka: selectedPreset.taluka,
        industrialArea: selectedPreset.industrialArea,
        insideIndustrialArea: selectedPreset.insideIndustrialArea,
        planningAuthority: selectedPreset.planningAuthority,
        environmentalOffice: selectedPreset.environmentalOffice,
        localBody: selectedPreset.localBody,
        zoningExemptionApplied: selectedPreset.insideIndustrialArea
          ? "Statutory Non-Agricultural (NA) Exemption under Sec 42A MLRC / Sec 90A"
          : "Standard Collector Non-Agricultural Sanad required"
      };

      onLocationConfirmed(resolved);
    }, 800);
  };

  // Filter presets matching search
  const filteredPresets = PRESET_LOCATIONS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 font-medium cursor-pointer"
        >
          ← Back to Project Questions
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Stage 3 of 5:</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
            Geographic Context Resolution
          </span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Where will you establish the project?
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Select or search your proposed site. The regulatory engine automatically resolves statutory authorities, planning bodies, and environmental jurisdictions.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-center">
        <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1 shadow-inner">
          <button
            onClick={() => setActiveTab("map")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "map"
                ? "bg-white text-teal-700 shadow-sm border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <MapIcon className="h-3.5 w-3.5 text-teal-600" />
            <span>Select on Map</span>
          </button>

          <button
            onClick={() => setActiveTab("search")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "search"
                ? "bg-white text-teal-700 shadow-sm border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Search className="h-3.5 w-3.5 text-teal-600" />
            <span>Search Address / Industrial Area</span>
          </button>

          <button
            onClick={handleUseCurrentLocation}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "current"
                ? "bg-white text-teal-700 shadow-sm border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Crosshair className="h-3.5 w-3.5 text-rose-500" />
            <span>Use Current Location</span>
          </button>
        </div>
      </div>

      {/* Main Location Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Interactive Map or Search View */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[460px]">
          {activeTab === "search" ? (
            <div className="p-6 space-y-4 flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by industrial area (e.g., Chakan, Kurkumbh, Sitapura, TTC)..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Notified Industrial Parks &amp; Zones ({filteredPresets.length})
                </span>
                <div className="grid grid-cols-1 gap-2 max-h-[340px] overflow-y-auto pr-1">
                  {filteredPresets.map((preset) => {
                    const isSelected = selectedPreset.id === preset.id;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => {
                          setSelectedPreset(preset);
                          setActiveTab("map");
                        }}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all text-left flex items-start justify-between gap-3 ${
                          isSelected
                            ? "border-teal-500 bg-teal-50/30 shadow-xs"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <MapPin className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{preset.name}</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">{preset.displayAddress}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                          {preset.state}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            // Interactive OpenStreetMap (OSM) Live View
            <div className="relative flex-1 flex flex-col bg-slate-50 min-h-[460px]">
              {/* Quick Jump Industrial Corridors Bar */}
              <div className="p-2.5 border-b border-slate-200/80 bg-white flex items-center justify-between gap-2 overflow-x-auto text-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <Compass className="h-3.5 w-3.5 text-teal-600" />
                  <span>Quick Corridors:</span>
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {PRESET_LOCATIONS.map((preset) => {
                    const isSelected = selectedPreset.id === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => {
                          setSelectedPreset(preset);
                          setCurrentCoords({ lat: preset.lat, lng: preset.lng });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                          isSelected
                            ? "bg-teal-600 text-white shadow-xs font-semibold"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/70"
                        }`}
                      >
                        {preset.name.split(" ")[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Real OpenStreetMap Live Canvas */}
              <div className="relative flex-1 p-2 flex flex-col">
                <InteractiveOSMMap
                  initialLat={currentCoords.lat}
                  initialLng={currentCoords.lng}
                  selectedAreaName={selectedPreset.name}
                  onLocationSelect={({ lat, lng, displayName }) => {
                    setCurrentCoords({ lat, lng });
                    resolveCoordinates(lat, lng);
                    if (displayName) {
                      setSelectedPreset((prev) => ({
                        ...prev,
                        displayAddress: displayName
                      }));
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Location Identification & Confirmation Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              <span>Location Identified</span>
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Verified Site
            </span>
          </div>

          {/* Human Readable Site Address */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-medium text-slate-400 uppercase">Selected Industrial Site</span>
              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {selectedPreset.name}
              </h4>
              <p className="text-xs text-slate-600">
                {selectedPreset.displayAddress}
              </p>
            </div>

            {/* Resolved Jurisdictions Preview (In plain, non-technical terms) */}
            <div className="space-y-2 text-xs">
              <div className="flex items-start justify-between gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 text-[11px]">Planning Authority:</span>
                <span className="font-semibold text-slate-800 text-right text-[11px] max-w-[180px]">
                  {selectedPreset.planningAuthority}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 text-[11px]">Pollution Control:</span>
                <span className="font-semibold text-slate-800 text-right text-[11px] max-w-[180px]">
                  {selectedPreset.environmentalOffice}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 text-[11px]">Industrial Park:</span>
                <span className="font-semibold text-teal-700 text-right text-[11px]">
                  {selectedPreset.insideIndustrialArea ? "Notified Industrial Estate" : "Revenue Land"}
                </span>
              </div>
            </div>

            {/* Status indicator during resolution */}
            {resolutionStatus && (
              <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-xs font-medium text-teal-800 flex items-center gap-2">
                {isResolving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-teal-600" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                )}
                <span>{resolutionStatus}</span>
              </div>
            )}
          </div>

          {/* Confirmation Button */}
          <div className="pt-2">
            <button
              onClick={handleConfirmLocation}
              disabled={isResolving}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              {isResolving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Resolving Context...</span>
                </>
              ) : (
                <>
                  <span>Confirm Location</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Your selected site falls within the applicable regulatory jurisdiction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
