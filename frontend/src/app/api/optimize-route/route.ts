import { NextResponse } from "next/server";
import { INITIAL_INSPECTIONS } from "@/lib/regulatory-data";
import { optimizeInspectionRoute } from "@/lib/vroom-router";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const jobs = body.jobs || INITIAL_INSPECTIONS;
    const depotCoords = body.depotCoords || { lat: 26.9124, lng: 75.7873 };

    const result = await optimizeInspectionRoute(jobs, depotCoords);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...result
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to optimize route" },
      { status: 500 }
    );
  }
}
