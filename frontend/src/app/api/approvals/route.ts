import { NextResponse } from "next/server";
import { INITIAL_PROJECT, BOTTLENECK_DATA } from "@/lib/regulatory-data";

export async function GET() {
  return NextResponse.json({
    project: INITIAL_PROJECT,
    bottlenecks: BOTTLENECK_DATA
  });
}

export async function POST(req: Request) {
  try {
    const { action, payload } = await req.json();

    if (action === "PRE_VALIDATE_DOCUMENT") {
      const { docType } = payload;
      // Simulated Docling AI / Layout extraction check
      return NextResponse.json({
        valid: true,
        documentType: docType,
        confidence: 0.96,
        extractedMetadata: {
          issuingAuthority: "Registered Chartered Environmental Engineer",
          issueDate: "2026-08-15",
          hasDigitalSignature: true,
          geoBoundaryVerified: true,
          cadLayoutStandard: "DWG-IS-10500 Compliant"
        },
        checksPassed: [
          "Digital Signature Token Authenticated via Aadhaar e-Sign",
          "Geo-spatial coordinates match RIICO Plot E-142 boundary",
          "Mass balance equation matches Red Category bulk synthesis guidelines",
          "Statutory annexures complete (Annexure 1 to 4)"
        ]
      });
    }

    if (action === "SIMULATE_CHANGE") {
      const { parameter, newValue } = payload;
      // What-if simulator: e.g. increasing power from 2500 kW to 5000 kW
      let affectedApprovals = [];
      let delayImpactDays = 0;

      if (parameter === "powerRequirementKw" && Number(newValue) > 4000) {
        affectedApprovals = ["NOC-POWER-SANCTION", "NOC-FACTORY-PLAN"];
        delayImpactDays = 21;
      } else if (parameter === "waterRequirementKld" && Number(newValue) > 200) {
        affectedApprovals = ["NOC-PCB-CTE", "NOC-CGWA-WATER"];
        delayImpactDays = 35;
      } else {
        affectedApprovals = ["NOC-PCB-CTE"];
        delayImpactDays = 7;
      }

      return NextResponse.json({
        simulatedParameter: parameter,
        newValue,
        affectedApprovals,
        delayImpactDays,
        additionalCostInr: delayImpactDays * 12000,
        criticalPathAltered: delayImpactDays > 14
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
