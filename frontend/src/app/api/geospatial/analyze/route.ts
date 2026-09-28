import { NextRequest, NextResponse } from "next/server";
import { analyzeMaharashtraLocation } from "@/lib/maharashtra-geospatial";

export const dynamic = "force-dynamic";

/**
 * GET /api/geospatial/analyze?lat=<lat>&lng=<lng>
 * Authoritative Maharashtra Geospatial & Jurisdiction Analysis Endpoint
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");

    if (!latParam || !lngParam) {
      return NextResponse.json(
        {
          error: "Missing required query parameters 'lat' and 'lng'.",
          example: "/api/geospatial/analyze?lat=18.7612&lng=73.8542"
        },
        { status: 400 }
      );
    }

    const lat = parseFloat(latParam);
    const lng = parseFloat(lngParam);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        {
          error: "Invalid coordinates provided. 'lat' and 'lng' must be valid numbers.",
          received: { lat: latParam, lng: lngParam }
        },
        { status: 400 }
      );
    }

    // Execute authoritative Maharashtra spatial analysis pipeline
    const startTime = Date.now();
    const analysisResult = analyzeMaharashtraLocation(lat, lng);
    const executionDurationMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      executionDurationMs,
      ...analysisResult
    });
  } catch (error: any) {
    console.error("Geospatial analysis error:", error);
    return NextResponse.json(
      {
        error: "Failed to perform spatial jurisdiction analysis.",
        details: error.message || "Unknown internal error"
      },
      { status: 500 }
    );
  }
}
