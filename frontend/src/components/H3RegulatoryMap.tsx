"use client";

import React from "react";
import { MaharashtraJurisdictionMap } from "@/components/MaharashtraJurisdictionMap";
import { LocationAnalysisResult } from "@/lib/maharashtra-geospatial";

interface H3RegulatoryMapProps {
  onLocationSelected?: (loc: { lat: number; lng: number; zoneName: string }) => void;
  highlightImpactProjects?: boolean;
}

export function H3RegulatoryMap({
  onLocationSelected,
  highlightImpactProjects = false
}: H3RegulatoryMapProps) {
  const handleLocationSelected = (result: LocationAnalysisResult) => {
    if (onLocationSelected) {
      onLocationSelected({
        lat: result.location.lat,
        lng: result.location.lng,
        zoneName: result.industrial.insideMidc
          ? result.industrial.industrialArea || "MIDC Industrial Estate"
          : `${result.administrative?.taluka || "Rural"} Taluka, ${result.administrative?.district || "Maharashtra"}`
      });
    }
  };

  return (
    <MaharashtraJurisdictionMap
      onLocationSelected={handleLocationSelected}
      defaultPresetIndex={0}
    />
  );
}
