import { NextRequest, NextResponse } from "next/server";
import {
  generateRegulatoryRoadmap,
  DEFAULT_PROJECT_PROFILE,
  DEFAULT_RESOLVED_LOCATION,
  ProjectProfile,
  ResolvedLocation
} from "@/lib/project-state";
import { analyzeMaharashtraLocation } from "@/lib/maharashtra-geospatial";
import { executeApplicantTool, APPLICANT_TOOLS_CATALOG } from "@/lib/applicant-tools";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 0. Direct Tool Execution Endpoint (In compliance with applicant-tool-spec (1))
    if (body.tool) {
      const toolResult = await executeApplicantTool(body.tool, body.input || {}, body.context || {});
      return NextResponse.json(toolResult);
    }

    const { messages, projectProfile, locationContext, currentApprovalId } = body;
    const apiKey =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GEMINI_API_KEY;

    const lastMessage =
      messages && messages.length > 0
        ? messages[messages.length - 1].content.toLowerCase()
        : "";

    const profile: ProjectProfile = projectProfile || DEFAULT_PROJECT_PROFILE;
    const location: ResolvedLocation = locationContext || DEFAULT_RESOLVED_LOCATION;

    // Generate authoritative roadmap from backend rules (Gemini NEVER invents regulatory data)
    const verifiedRoadmap = generateRegulatoryRoadmap(profile, location);

    // 1. If Gemini API key is configured, invoke Gemini with backend-verified context
    if (apiKey && apiKey !== "your_gemini_api_key_here") {
      try {
        const approvalSummary = verifiedRoadmap.approvals
          .map(
            (a) =>
              `- [${a.id}] ${a.name} (${a.department}, SLA: ${a.slaDays}d, Status: ${a.status}, Prereqs: [${a.dependencies.join(", ")}], Why: "${a.whyRequired.clause}")`
          )
          .join("\n");

        const promptSystem = `You are the Regulatory Assistant for PramaanFlow / National Single Window System (NSWS).
You guide entrepreneurs through regulatory approvals, statutory acts, and dependencies.

CRITICAL INSTRUCTIONS:
1. You MUST NEVER fabricate or invent approval names, dependencies, or legal citations.
2. Rely ONLY on the verified backend regulatory data below:
- Project: ${profile.name} (Sector: ${profile.sector}, Capacity: ${profile.capacity || 100} ${profile.capacityUnit || "TPD"}, Investment: ₹${profile.investmentCrores || 145} Cr)
- Location: ${location.displayAddress} (Industrial Area: ${location.industrialArea || "Notified Zone"}, Planning Authority: ${location.planningAuthority}, Environmental Office: ${location.environmentalOffice})
- Verified Applicable Approvals:
${approvalSummary}

3. When asked "Why do I need this approval?", cite the exact statutory act, clause, and why it applies to this project's parameters.
4. When asked about dependencies or "What comes before this?", specify the exact preceding node in the DAG.
5. When asked about documents, list the exact required statutory documents verified by the backend.
6. Always maintain a professional, trustworthy, enterprise-grade tone. Clearly indicate: "Based on the verified regulatory data available to the system..."`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: messages.map((m: any) => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }]
              })),
              systemInstruction: {
                parts: [{ text: promptSystem }]
              }
            })
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const candidateText =
            geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (candidateText) {
            return streamFormattedText(candidateText);
          }
        }
      } catch (geminiError) {
        console.error("Gemini API error in applicant chat, falling back to deterministic explanation:", geminiError);
      }
    }

    // 2. Deterministic Structured Fallback (Always accurate, grounded in verified regulatory data)
    let responseText = "";

    // If currentApprovalId is provided or user asked about a specific approval
    const targetedApproval = currentApprovalId
      ? verifiedRoadmap.approvals.find((a) => a.id === currentApprovalId)
      : verifiedRoadmap.approvals.find(
          (a) =>
            lastMessage.includes(a.id.toLowerCase()) ||
            lastMessage.includes(a.shortCode.toLowerCase()) ||
            lastMessage.includes(a.name.toLowerCase())
        );

    if (
      lastMessage.includes("why do i need") ||
      lastMessage.includes("why required") ||
      lastMessage.includes("why this approval")
    ) {
      const target = targetedApproval || verifiedRoadmap.approvals[1] || verifiedRoadmap.approvals[0];
      responseText = `### 📋 Statutory Basis: ${target.name}
**Authority:** ${target.department}  
**Legal Basis:** ${target.act} (${target.section})  
**Official Source:** [${target.whyRequired.sourceUrl}](${target.whyRequired.sourceUrl})

#### Why this applies to your project:
${target.whyRequired.clause}

> **Official Gazette Excerpt:**  
> "${target.whyRequired.gazetteExcerpt}"

**Project Factor:** ${target.whyRequired.projectAttribute}  
**Location Factor:** ${target.whyRequired.locationFactor}  
**Statutory SLA:** ${target.slaDays} days  
*Based on verified regulatory rules. Highlighted on your dependency graph.*`;
    } else if (
      lastMessage.includes("what comes before") ||
      lastMessage.includes("dependency") ||
      lastMessage.includes("prerequisite") ||
      lastMessage.includes("sequence")
    ) {
      const target = targetedApproval || verifiedRoadmap.approvals[2] || verifiedRoadmap.approvals[1];
      if (target.dependencies.length === 0) {
        responseText = `### ⛓️ Dependencies for ${target.name}
**Status:** Entry Milestone  
This approval is in **Stage 1 (Initial Statutory Filing)** and does **not depend** on any preceding approvals. You can apply for this directly with the ${target.department}.`;
      } else {
        const prereqNames = target.dependencies
          .map((depId) => {
            const depNode = verifiedRoadmap.approvals.find((a) => a.id === depId);
            return depNode ? `**${depNode.name}** (\`${depNode.shortCode}\` - ${depNode.department})` : depId;
          })
          .join("\n- ");

        responseText = `### ⛓️ Prerequisite Sequence for ${target.name}
This clearance is statutory gated and **cannot be sanctioned** until the following preceding clearances are in place:

- ${prereqNames}

**Why this sequence exists:**  
Under ${target.act}, the department requires verified site possession and environmental terms before issuing plan clearance.`;
      }
    } else if (
      lastMessage.includes("document") ||
      lastMessage.includes("paperwork") ||
      lastMessage.includes("prepare first") ||
      lastMessage.includes("checklist")
    ) {
      const target = targetedApproval;
      if (target) {
        responseText = `### 📑 Required Documents for ${target.name}
The following statutory filings are required by **${target.department}**:

${target.requiredDocuments.map((doc, idx) => `${idx + 1}. **${doc}** (Mandatory statutory submission)`).join("\n")}

*Official Portal:* [${target.whyRequired.sourceUrl}](${target.whyRequired.sourceUrl})`;
      } else {
        responseText = `### 📑 Priority Documents Checklist for Your Project
Based on your project profile (**${profile.sector}**, ₹${profile.investmentCrores} Cr, **${location.displayAddress}**), prepare these core documents first:

1. **Detailed Project Report (DPR) & Mass Balance** (Required for Land Allotment & Environmental Clearance)
2. **Effluent Treatment Plant (ETP) / APCM Engineering Layout** (Required for Consent to Establish - CTE)
3. **Architectural Fire Hydrant & Life Safety Drawing** (Required for Provisional Fire NOC)
4. **Site Boundary Plan & Land Title / Lease Deed** (Required for Factory Plan & Power Sanction)

*You can upload and pre-validate these documents directly in the Pre-Submission Doc X-Ray tab.*`;
      }
    } else if (
      lastMessage.includes("who handles") ||
      lastMessage.includes("authority") ||
      lastMessage.includes("department")
    ) {
      responseText = `### 🏛️ Competent Authorities for Your Facility
Your project at **${location.displayAddress}** is governed by:

1. **Planning & Land Authority:** ${location.planningAuthority}  
   *Role:* Plot demarcation, zoning certification, and building plan sanction.
2. **Environmental Authority:** ${location.environmentalOffice}  
   *Role:* Consent to Establish (CTE) & Consent to Operate (CTO).
3. **Safety & Labor Directorate:** Directorate of Industrial Safety & Health  
   *Role:* Factory building layout and machinery installation approval.
4. **Utility Distribution:** High Tension Industrial Feeder Substation  
   *Role:* Dedicated power infrastructure sanction.

*All statutory filings can be tracked in the Single Window System.*`;
    } else {
      responseText = `### 🤖 PramaanFlow Regulatory Assistant
I am connected directly to your project's verified regulatory roadmap for **${profile.name}** at **${location.displayAddress}**.

Here are some questions you can ask me:
1. **"Why do I need this approval?"** — Explains statutory legal basis and official gazette citations.
2. **"What comes before this?"** — Shows required prerequisite clearances on the DAG.
3. **"What documents should I prepare first?"** — Compiles the statutory checklist for key clearances.
4. **"Who handles this?"** — Details the competent regional authorities for your site.`;
    }

    return streamFormattedText(responseText);
  } catch (error: any) {
    console.error("Applicant chat error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

function streamFormattedText(text: string): Response {
  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      const words = text.split(" ");
      for (const word of words) {
        controller.enqueue(encoder.encode(`0:${JSON.stringify(word + " ")}\n`));
        await new Promise((r) => setTimeout(r, 12));
      }
      controller.close();
    }
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Vercel-AI-Data-Stream": "v1"
    }
  });
}
