import { NextRequest, NextResponse } from "next/server";
import { generateRegulatoryRoadmap, ProjectProfile, ResolvedLocation } from "@/lib/project-state";

export const dynamic = "force-dynamic";

/**
 * POST /api/applicant/analyze
 * Generates authoritative, deterministic regulatory roadmap for applicant project & location
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile, location } = body as {
      profile: ProjectProfile;
      location: ResolvedLocation;
    };

    if (!profile || !location) {
      return NextResponse.json(
        { error: "Missing required 'profile' or 'location' payload." },
        { status: 400 }
      );
    }

    const roadmap = generateRegulatoryRoadmap(profile, location);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      roadmap
    });
  } catch (error: any) {
    console.error("Applicant analysis API error:", error);
    return NextResponse.json(
      { error: "Failed to generate regulatory roadmap.", details: error.message },
      { status: 500 }
    );
  }
}
