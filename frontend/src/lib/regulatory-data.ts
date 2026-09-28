// Regulatory Knowledge Base & Comprehensive Operational Intelligence Models
// Aligned with Raj Nivesh (Govt of Rajasthan) & National Single Window System (NSWS)

export interface WhyEvidenceChain {
  projectAttribute: string;
  locationFactor: string;
  jurisdiction: string;
  statutoryAct: string;
  section: string;
  clause: string;
  gazetteExcerpt: string;
  effectiveDate: string;
  ruleType: 'DETERMINISTIC_STATUTORY' | 'GEOSPATIAL_OVERLAY' | 'SECTORAL_THRESHOLD' | 'AI_REASONED';
  sourceUrl: string;
}

export interface ApprovalNode {
  id: string;
  name: string;
  shortCode: string;
  department: string;
  act: string;
  section: string;
  type: 'PRE_ESTABLISHMENT' | 'PRE_OPERATION' | 'INSPECTION' | 'CLEARANCE';
  slaDays: number;
  daysRemaining: number;
  status: 'APPROVED' | 'IN_REVIEW' | 'PENDING_SUBMISSION' | 'BLOCKED' | 'ACTION_REQUIRED';
  dependencies: string[]; // IDs of preceding approvals
  blockedDownstream: string[]; // IDs of downstream approvals blocked by this
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  statutoryFeeInr: number;
  requiredDocuments: string[];
  inspectionsRequired?: string[];
  description: string;
  whyRequired: WhyEvidenceChain;
  timelineHistory: { stage: string; timestamp: string; note: string; officer?: string }[];
}

export interface H3CellData {
  h3Index: string;
  center: { lat: number; lng: number };
  zoneName: string;
  regulatoryIntensity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  activeProjects: number;
  pendingApplications: number;
  scheduledInspections: number;
  environmentalBuffer: string;
  groundwaterStatus: string;
  dominantSector: string;
}

export interface DocumentEvidenceItem {
  id: string;
  title: string;
  category: 'ENGINEERING_DRAWING' | 'STATUTORY_AFFIDAVIT' | 'FINANCIAL_REPORT' | 'ENVIRONMENTAL_AUDIT';
  status: 'VERIFIED' | 'INCONSISTENCY_FLAGGED' | 'PARSING_PENDING';
  pageCount: number;
  uploadedAt: string;
  extractedEntities: {
    companyName: string;
    siteAddress: string;
    reportedCapacity: string;
    investmentInr: string;
    landKhasra: string;
  };
  crossDocConsistency?: {
    field: string;
    sourceValue: string;
    conflictingDocTitle: string;
    conflictingValue: string;
    discrepancyNote: string;
    riskScore: number;
  };
}

export interface ProjectTwin {
  id: string;
  name: string;
  enterpriseName: string;
  sector: string;
  subSector: string;
  capacity: number;
  capacityUnit: string;
  investmentCrores: number;
  employmentTarget: number;
  powerRequirementKw: number;
  waterRequirementKld: number;
  hazardousChemicals: boolean;
  landAreaAcres: number;
  landType: 'RIICO_INDUSTRIAL_AREA' | 'PRIVATE_AGRICULTURAL' | 'PRIVATE_INDUSTRIAL' | 'FOREST_PROXIMATE';
  district: string;
  coordinates: { lat: number; lng: number };
  h3Cell: string;
  currentPhase: 'PRE_ESTABLISHMENT' | 'CONSTRUCTION' | 'PRE_OPERATION' | 'COMMERCIAL';
  overallReadiness: number; // percentage
  slaHealthScore: number; // 0 - 100
  approvals: ApprovalNode[];
  documents: DocumentEvidenceItem[];
  complianceConditions: {
    id: string;
    conditionText: string;
    authority: string;
    deadline: string;
    status: 'COMPLIED' | 'PENDING' | 'OVERDUE';
    riskRating: 'LOW' | 'MEDIUM' | 'CRITICAL';
  }[];
  incentiveSchemes: {
    id: string;
    schemeName: string;
    nodalAgency: string;
    subsidyAmount: string;
    matchedCriteria: string[];
    status: 'PRE_QUALIFIED' | 'CLAIM_SUBMITTED' | 'DISBURSED';
  }[];
}

export interface InspectionJob {
  id: string;
  projectId: string;
  projectName: string;
  inspectionType: string;
  department: string;
  address: string;
  coordinates: { lat: number; lng: number };
  timeWindow: [string, string];
  deadline: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'SCHEDULED' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  inspectorAssigned: string;
  requiredSkills: string[];
  slaRiskDays: number;
  checklistItems: { id: string; label: string; mandatory: boolean; passed?: boolean }[];
}

export interface ProcessMiningStep {
  stepId: string;
  activityName: string;
  department: string;
  expectedDurationDays: number;
  observedMedianDays: number;
  isLoop: boolean;
  reworkFrequencyRate: string;
  waitingTimeDays: number;
  bottleneckFlag: boolean;
}

export interface RegulatoryDiffItem {
  id: string;
  notificationNumber: string;
  title: string;
  issuingAuthority: string;
  effectiveDate: string;
  oldRequirement: string;
  newRequirement: string;
  impactMetrics: {
    affectedProjectsCount: number;
    affectedApplicationsCount: number;
    delayedDaysEstimate: number;
    documentsAdded: number;
    inspectionsAdded: number;
  };
  affectedProjects: {
    id: string;
    name: string;
    district: string;
    coordinates: { lat: number; lng: number };
    currentStatus: string;
  }[];
}

// ---------------------------------------------------------
// INITIAL SEED DATA
// ---------------------------------------------------------

export const INITIAL_PROJECT: ProjectTwin = {
  id: "PRJ-RAJ-2026-0849",
  name: "Apex Bio-Pharmaceuticals & Active Ingredients Unit",
  enterpriseName: "Apex LifeSciences Healthcare Pvt. Ltd.",
  sector: "Pharmaceuticals & Biotechnology",
  subSector: "Active Pharmaceutical Ingredients (API) Bulk Manufacturing",
  capacity: 100,
  capacityUnit: "TPD (Tonnes Per Day)",
  investmentCrores: 145.5,
  employmentTarget: 320,
  powerRequirementKw: 2500,
  waterRequirementKld: 180,
  hazardousChemicals: true,
  landAreaAcres: 12.5,
  landType: "RIICO_INDUSTRIAL_AREA",
  district: "Jaipur (Sitapura Industrial Area Phase IV)",
  coordinates: { lat: 26.7825, lng: 75.8362 },
  h3Cell: "886195669ffffff",
  currentPhase: "PRE_ESTABLISHMENT",
  overallReadiness: 78,
  slaHealthScore: 84,
  approvals: [
    {
      id: "NOC-LAND-ALLOT",
      name: "RIICO Industrial Plot Allotment & Lease Possession",
      shortCode: "LAND_POSS",
      department: "RIICO (Rajasthan State Industrial Dev. & Investment Corp)",
      act: "RIICO Allotment Rules, 2015",
      section: "Rule 14 (Special Economic & Industrial Zoning)",
      type: "PRE_ESTABLISHMENT",
      slaDays: 30,
      daysRemaining: 0,
      status: "APPROVED",
      dependencies: [],
      blockedDownstream: ["NOC-PCB-CTE", "NOC-EIA-CLEARANCE", "NOC-POWER-SANCTION"],
      riskLevel: "LOW",
      statutoryFeeInr: 520000,
      requiredDocuments: ["Project Feasibility DPR", "MSME Udyam Certificate", "Board Resolution"],
      description: "Confirmed allotment of Plot E-142, Phase IV with pre-vetted industrial zoning.",
      whyRequired: {
        projectAttribute: "Industrial Manufacturing in RIICO Industrial Area",
        locationFactor: "Sitapura Industrial Area Phase IV, Sanganer Tehsil",
        jurisdiction: "RIICO Regional Office, Sitapura, Jaipur",
        statutoryAct: "Rajasthan Industrial Areas Allotment Rules, 2015",
        section: "Rule 14(2)",
        clause: "Mandatory legal tenure & possession before infrastructure utility linkages",
        gazetteExcerpt: "No infrastructure clearance or statutory environmental consent shall be entertained without valid allotment letter & registered lease deed from the Corporation.",
        effectiveDate: "2015-06-12",
        ruleType: "DETERMINISTIC_STATUTORY",
        sourceUrl: "https://riico.onlinerevenue.rajasthan.gov.in"
      },
      timelineHistory: [
        { stage: "APPLICATION_SUBMITTED", timestamp: "2026-07-02", note: "Application filed with DPR" },
        { stage: "SCRUTINY_PASSED", timestamp: "2026-07-14", note: "Plot boundary verified via GIS survey" },
        { stage: "SANCTION_ISSUED", timestamp: "2026-07-28", note: "Possession letter executed", officer: "Sr. Regional Manager RIICO" }
      ]
    },
    {
      id: "NOC-EIA-CLEARANCE",
      name: "Prior Environmental Clearance (Category B2)",
      shortCode: "SEIAA_EC",
      department: "State Environment Impact Assessment Authority (SEIAA)",
      act: "Environment (Protection) Act, 1986",
      section: "EIA Notification 2006 (Schedule 5f - Synthetic Organic Chemicals)",
      type: "PRE_ESTABLISHMENT",
      slaDays: 90,
      daysRemaining: 0,
      status: "APPROVED",
      dependencies: ["NOC-LAND-ALLOT"],
      blockedDownstream: ["NOC-PCB-CTE"],
      riskLevel: "MEDIUM",
      statutoryFeeInr: 100000,
      requiredDocuments: ["Form 1 & Form 1M", "Environment Management Plan (EMP)", "Baseline Hydrogeological Study"],
      description: "State level clearance for synthetic chemical synthesis unit inside designated industrial park.",
      whyRequired: {
        projectAttribute: "Synthetic Organic Chemical Synthesis (API Bulk Drugs)",
        locationFactor: "Inside Notified Industrial Park without Public Hearing Requirement",
        jurisdiction: "SEIAA Rajasthan, Secretariat, Jaipur",
        statutoryAct: "Environment (Protection) Act, 1986",
        section: "Schedule 5(f)",
        clause: "Category B2 notification for industrial areas with CETP / ZLD",
        gazetteExcerpt: "All units engaged in synthetic organic chemicals manufacturing located in notified industrial areas are appraised as Category B2 projects without requirement of public consultation.",
        effectiveDate: "2006-09-14",
        ruleType: "DETERMINISTIC_STATUTORY",
        sourceUrl: "https://environment.rajasthan.gov.in"
      },
      timelineHistory: [
        { stage: "SUBMITTED_TO_SEAC", timestamp: "2026-07-30", note: "Form 1 uploaded with EMP" },
        { stage: "APPRAISAL_MEETING", timestamp: "2026-08-18", note: "SEAC 42nd meeting approved with ZLD conditions" },
        { stage: "EC_GRANTED", timestamp: "2026-08-29", note: "Formal Environmental Clearance Letter issued", officer: "Member Secretary SEIAA" }
      ]
    },
    {
      id: "NOC-PCB-CTE",
      name: "Consent to Establish (CTE - Red Category)",
      shortCode: "PCB_CTE",
      department: "Rajasthan State Pollution Control Board (RSPCB)",
      act: "Water (Prevention & Control of Pollution) Act 1974 & Air Act 1981",
      section: "Sec 25/26 (Water) & Sec 21 (Air)",
      type: "PRE_ESTABLISHMENT",
      slaDays: 60,
      daysRemaining: 14,
      status: "IN_REVIEW",
      dependencies: ["NOC-LAND-ALLOT", "NOC-EIA-CLEARANCE"],
      blockedDownstream: ["NOC-FIRE-PROV", "NOC-FACTORY-PLAN"],
      riskLevel: "HIGH",
      statutoryFeeInr: 185000,
      requiredDocuments: [
        "Effluent Treatment Plant (ETP) Engineering Layout",
        "Air Pollution Control Measures (APCM) Schematic",
        "Site Location Plan & Raw Material Mass Balance"
      ],
      inspectionsRequired: ["INSP-PCB-01"],
      description: "Mandatory statutory consent prior to any physical construction or plant erection for Red Category bulk chemical synthesis.",
      whyRequired: {
        projectAttribute: "Trade Effluent Generation: 140 KLD & Red Category Air Emissions",
        locationFactor: "Sitapura Industrial Area Phase IV (Sanganer)",
        jurisdiction: "RSPCB Regional Office Jaipur (South)",
        statutoryAct: "Water (Prevention & Control of Pollution) Act 1974",
        section: "Section 25",
        clause: "Prohibition on new outlets and discharges without prior board consent",
        gazetteExcerpt: "No person shall, without the previous consent of the State Board, establish or take any steps to establish any industry, operation or process which is likely to discharge trade effluent into a stream or well or sewer.",
        effectiveDate: "1974-03-23",
        ruleType: "DETERMINISTIC_STATUTORY",
        sourceUrl: "https://rspcb.rajasthan.gov.in"
      },
      timelineHistory: [
        { stage: "SUBMITTED", timestamp: "2026-09-02", note: "CTE Application filed under Raj Nivesh Single Window" },
        { stage: "DESK_SCRUTINY", timestamp: "2026-09-12", note: "Mass balance and solvent balance validated" },
        { stage: "INSPECTION_PENDING", timestamp: "2026-09-24", note: "Field site audit scheduled for Sept 30", officer: "Regional Officer RSPCB" }
      ]
    },
    {
      id: "NOC-FIRE-PROV",
      name: "Provisional Fire Safety NOC",
      shortCode: "FIRE_NOC",
      department: "Rajasthan Fire and Emergency Services",
      act: "Rajasthan Fire and Emergency Services Act, 2021",
      section: "Section 18 (Industrial Building Fire Safety Norms)",
      type: "PRE_ESTABLISHMENT",
      slaDays: 21,
      daysRemaining: 7,
      status: "IN_REVIEW",
      dependencies: ["NOC-PCB-CTE"],
      blockedDownstream: ["NOC-FACTORY-PLAN"],
      riskLevel: "MEDIUM",
      statutoryFeeInr: 45000,
      requiredDocuments: ["Architectural Fire Hydrant Layout", "Storage Plan for Solvent Tank Farms"],
      inspectionsRequired: ["INSP-FIRE-01"],
      description: "Verification of hazardous solvent storage containment, wet riser network, and evacuation routes.",
      whyRequired: {
        projectAttribute: "Bulk Flammable Solvent Storage: > 50,000 Litres (IPA, Methanol)",
        locationFactor: "Industrial Plot with Built-up Area > 2,000 sq.m",
        jurisdiction: "Chief Fire Officer, Jaipur Municipal Corporation / State Fire Directorate",
        statutoryAct: "Rajasthan Fire and Emergency Services Act, 2021",
        section: "Section 18(1)",
        clause: "Provisional clearance for flammable and explosive hazardous chemical installations",
        gazetteExcerpt: "Any commercial or industrial building dealing with flammable liquids of Class A or Class B shall obtain a provisional fire safety NOC prior to erection of storage vessels.",
        effectiveDate: "2021-11-18",
        ruleType: "DETERMINISTIC_STATUTORY",
        sourceUrl: "https://urban.rajasthan.gov.in/fire"
      },
      timelineHistory: [
        { stage: "SUBMITTED", timestamp: "2026-09-14", note: "Drawings uploaded" },
        { stage: "TECHNICAL_SCRUTINY", timestamp: "2026-09-21", note: "Water reservoir sizing checked: 150,000 Litres capacity" }
      ]
    },
    {
      id: "NOC-FACTORY-PLAN",
      name: "Factory Building Plan & Machinery Layout Approval",
      shortCode: "FACT_PLAN",
      department: "Directorate of Factories and Boilers, Rajasthan",
      act: "Factories Act, 1948",
      section: "Sec 6 & Rajasthan Factories Rules 1951 (Rule 3)",
      type: "PRE_ESTABLISHMENT",
      slaDays: 30,
      daysRemaining: 22,
      status: "BLOCKED",
      dependencies: ["NOC-FIRE-PROV"],
      blockedDownstream: ["NOC-FINAL-LICENSE"],
      riskLevel: "HIGH",
      statutoryFeeInr: 75000,
      requiredDocuments: ["Machinery Flow Diagram", "Ventilation Calculation Sheet", "Material Safety Data Sheets (MSDS)"],
      description: "Dependent on Provisional Fire NOC clearance. Cannot proceed until fire containment plans are approved.",
      whyRequired: {
        projectAttribute: "Factory employing > 50 workers with electric motive power > 50 HP",
        locationFactor: "Industrial Building Structure",
        jurisdiction: "Inspector of Factories & Boilers, Jaipur Division",
        statutoryAct: "Factories Act, 1948",
        section: "Section 6(1)(a)",
        clause: "Approval of plans and specifications of factory buildings",
        gazetteExcerpt: "No building shall be constructed or reconstructed for use as a factory nor shall any machinery be installed without prior approval of plans in writing from the Chief Inspector.",
        effectiveDate: "1948-09-23",
        ruleType: "DETERMINISTIC_STATUTORY",
        sourceUrl: "https://rajfab.rajasthan.gov.in"
      },
      timelineHistory: [
        { stage: "LOCKED_PRE_REQUISITE", timestamp: "2026-09-15", note: "Pipeline stalled waiting for Provisional Fire Safety NOC" }
      ]
    },
    {
      id: "NOC-POWER-SANCTION",
      name: "High Tension (HT) Industrial Power Sanction (33 kV)",
      shortCode: "POWER_HT",
      department: "Jaipur Vidyut Vitran Nigam Limited (JVVNL)",
      act: "Electricity Act, 2003",
      section: "Sec 43 & Rajasthan Electricity Regulatory Commission (RERC) Supply Code",
      type: "PRE_OPERATION",
      slaDays: 45,
      daysRemaining: 35,
      status: "PENDING_SUBMISSION",
      dependencies: ["NOC-LAND-ALLOT"],
      blockedDownstream: ["NOC-COMMERCIAL-OPS"],
      riskLevel: "LOW",
      statutoryFeeInr: 320000,
      requiredDocuments: ["Load Feasibility Test Report", "Substation Single Line Diagram"],
      description: "Sanction of 2.5 MW dedicated industrial feeder line from Sitapura 132kV GSS.",
      whyRequired: {
        projectAttribute: "Contract Demand: 2500 kW (High Tension Category)",
        locationFactor: "Connected to Sitapura 132kV Grid Substation",
        jurisdiction: "Superintending Engineer (Commercial), JVVNL, Jaipur",
        statutoryAct: "Electricity Act, 2003",
        section: "Section 43(1)",
        clause: "Duty to supply electricity on request for industrial load",
        gazetteExcerpt: "Every distribution licensee shall, on an application by the owner or occupier of any premises, give supply of electricity to such premises within thirty days.",
        effectiveDate: "2003-06-10",
        ruleType: "DETERMINISTIC_STATUTORY",
        sourceUrl: "https://energy.rajasthan.gov.in/jvvnl"
      },
      timelineHistory: []
    },
    {
      id: "NOC-CGWA-WATER",
      name: "Groundwater Extraction NOC",
      shortCode: "CGWA_WATER",
      department: "Central Ground Water Authority / State Ground Water Dept",
      act: "Environment (Protection) Act, 1986 / CGWA Guidelines 2020",
      section: "Guidelines for Regulation & Control of Groundwater Extraction",
      type: "PRE_ESTABLISHMENT",
      slaDays: 45,
      daysRemaining: 18,
      status: "ACTION_REQUIRED",
      dependencies: ["NOC-LAND-ALLOT"],
      blockedDownstream: ["NOC-PCB-CTE"],
      riskLevel: "HIGH",
      statutoryFeeInr: 25000,
      requiredDocuments: ["Rainwater Harvesting Plan", "Digital Water Flow Meter Certificate"],
      description: "Action Required: Submit certified piezometer calibration and rooftop rainwater harvesting recharge bore specs.",
      whyRequired: {
        projectAttribute: "Groundwater abstraction > 100 KLD for industrial synthesis",
        locationFactor: "Sanganer Block classified as Semi-Critical by CGWA",
        jurisdiction: "Regional Director, CGWA Western Region, Jaipur",
        statutoryAct: "Environment Protection Act / CGWA Guidelines",
        section: "Regulation 3.2",
        clause: "Mandatory telemetry flow meter and dual recharge structures",
        gazetteExcerpt: "Industrial units in semi-critical assessment units must inject at least 150% of the abstracted volume through scientifically designed artificial recharge structures.",
        effectiveDate: "2020-09-24",
        ruleType: "DETERMINISTIC_STATUTORY",
        sourceUrl: "https://cgwa-noc.gov.in"
      },
      timelineHistory: [
        { stage: "SUBMITTED", timestamp: "2026-08-10", note: "Hydrogeological study submitted" },
        { stage: "QUERY_RAISED", timestamp: "2026-09-18", note: "Query: Piezometer digital telemetry calibration certificate missing" }
      ]
    }
  ],
  documents: [
    {
      id: "DOC-DPR-01",
      title: "Detailed Project Report (DPR) & Mass Balance",
      category: "FINANCIAL_REPORT",
      status: "VERIFIED",
      pageCount: 84,
      uploadedAt: "2026-07-02",
      extractedEntities: {
        companyName: "Apex LifeSciences Healthcare Pvt. Ltd.",
        siteAddress: "Plot E-142, RIICO Sitapura Phase IV, Jaipur",
        reportedCapacity: "100 TPD Active Drug Synthesis",
        investmentInr: "₹145.50 Crores",
        landKhasra: "Khasra 412/1 & 412/2"
      }
    },
    {
      id: "DOC-ETP-02",
      title: "Effluent Treatment Plant (ETP) Engineering Layout & ZLD Plan",
      category: "ENGINEERING_DRAWING",
      status: "VERIFIED",
      pageCount: 16,
      uploadedAt: "2026-08-20",
      extractedEntities: {
        companyName: "Apex LifeSciences Healthcare Pvt. Ltd.",
        siteAddress: "Plot E-142, Sitapura Industrial Area, Jaipur",
        reportedCapacity: "140 KLD Effluent Stream (Zero Liquid Discharge)",
        investmentInr: "₹18.40 Crores (ETP CapEx)",
        landKhasra: "Plot E-142"
      }
    },
    {
      id: "DOC-EIA-03",
      title: "Environmental Impact Assessment & Baseline Air Study",
      category: "ENVIRONMENTAL_AUDIT",
      status: "INCONSISTENCY_FLAGGED",
      pageCount: 120,
      uploadedAt: "2026-08-24",
      extractedEntities: {
        companyName: "Apex LifeSciences Healthcare Pvt. Ltd.",
        siteAddress: "Plot E-142, RIICO Phase IV, Jaipur",
        reportedCapacity: "150 TPD API Synthesis (Phase I + II)",
        investmentInr: "₹145.50 Crores",
        landKhasra: "Plot E-142"
      },
      crossDocConsistency: {
        field: "Production Capacity",
        sourceValue: "150 TPD (EIA Technical Report, Page 24)",
        conflictingDocTitle: "Detailed Project Report (DPR, Page 4)",
        conflictingValue: "100 TPD",
        discrepancyNote: "DPR specifies 100 TPD but EIA Report mentions 150 TPD combined expansion. This 50 TPD discrepancy will trigger a statutory query under RSPCB CTE Scrutiny unless harmonized.",
        riskScore: 88
      }
    }
  ],
  complianceConditions: [
    {
      id: "COND-01",
      conditionText: "Installation of Online Continuous Emission Monitoring System (OCEMS) with server link to CPCB & RSPCB",
      authority: "Rajasthan State Pollution Control Board",
      deadline: "2026-11-30",
      status: "PENDING",
      riskRating: "CRITICAL"
    },
    {
      id: "COND-02",
      conditionText: "Development of minimum 33% peripheral green belt with native drought-tolerant tree species",
      authority: "SEIAA Rajasthan",
      deadline: "2026-12-15",
      status: "COMPLIED",
      riskRating: "LOW"
    },
    {
      id: "COND-03",
      conditionText: "Quarterly ground water quality analysis through NABL accredited laboratory for heavy metals",
      authority: "Central Ground Water Authority",
      deadline: "2026-10-15",
      status: "PENDING",
      riskRating: "MEDIUM"
    }
  ],
  incentiveSchemes: [
    {
      id: "SCHEME-RIPS-2024",
      schemeName: "Rajasthan Investment Promotion Scheme (RIPS 2024) - Thrust Sector",
      nodalAgency: "BIP (Bureau of Investment Promotion, Rajasthan)",
      subsidyAmount: "₹21.80 Crores (75% SGST Reimbursement for 7 Years)",
      matchedCriteria: [
        "Thrust Sector: Pharmaceuticals & Medical Devices eligible for 100% electricity duty exemption for 7 years",
        "Capital Subsidy: 15% of eligible fixed capital investment (CapEx > ₹100 Cr)",
        "Employment Generation: > 300 jobs grants additional 10% payroll subsidy"
      ],
      status: "PRE_QUALIFIED"
    },
    {
      id: "SCHEME-GREEN-2024",
      schemeName: "Rajasthan Green Industry & Zero Liquid Discharge Incentive",
      nodalAgency: "Department of Industries and Commerce",
      subsidyAmount: "₹1.50 Crores Capital Grant",
      matchedCriteria: [
        "CapEx assistance of 25% on Zero Liquid Discharge (ZLD) Multi-Effect Evaporator installation",
        "Rooftop Solar Plant subsidy of ₹25 Lakhs for > 500 kW captive generation"
      ],
      status: "PRE_QUALIFIED"
    }
  ]
};

// Spatial H3 Hexagonal Grid Cells (Jaipur & Industrial Zones)
export const H3_CELLS_DATA: H3CellData[] = [
  {
    h3Index: "886195669ffffff",
    center: { lat: 26.7825, lng: 75.8362 },
    zoneName: "Sitapura Industrial Area Phase I-IV",
    regulatoryIntensity: "HIGH",
    activeProjects: 42,
    pendingApplications: 87,
    scheduledInspections: 31,
    environmentalBuffer: "Safe (18.4 km to Wildlife Sanctuary)",
    groundwaterStatus: "Semi-Critical (Recharge Mandated)",
    dominantSector: "Pharma, Gems & Jewellery, Electronics"
  },
  {
    h3Index: "886195668ffffff",
    center: { lat: 26.6841, lng: 75.6219 },
    zoneName: "Phagi & Diggi Road Renewable Corridor",
    regulatoryIntensity: "MEDIUM",
    activeProjects: 18,
    pendingApplications: 34,
    scheduledInspections: 12,
    environmentalBuffer: "Safe (> 25 km buffer)",
    groundwaterStatus: "Safe",
    dominantSector: "Solar Energy & Agro Infrastructure"
  },
  {
    h3Index: "88619566affffff",
    center: { lat: 26.9421, lng: 75.6881 },
    zoneName: "Bindayaka & Bagru Agro & Textile Cluster",
    regulatoryIntensity: "CRITICAL",
    activeProjects: 65,
    pendingApplications: 142,
    scheduledInspections: 48,
    environmentalBuffer: "Amani Shah Nullah Drainage Catchment",
    groundwaterStatus: "Over-Exploited (Strict ZLD)",
    dominantSector: "Textile Dyeing, Food Processing"
  },
  {
    h3Index: "88619566bffffff",
    center: { lat: 26.9852, lng: 75.8741 },
    zoneName: "Vishwakarma Industrial Area (VKIA)",
    regulatoryIntensity: "HIGH",
    activeProjects: 88,
    pendingApplications: 196,
    scheduledInspections: 54,
    environmentalBuffer: "Nahargarh Foothills Eco-Sensitive Buffer (1.4 km)",
    groundwaterStatus: "Critical (No new tubewells)",
    dominantSector: "Engineering, Casting, Minerals"
  }
];

// Today's Inspection Manifest for Inspectors
export const INITIAL_INSPECTIONS: InspectionJob[] = [
  {
    id: "INSP-PCB-01",
    projectId: "PRJ-RAJ-2026-0849",
    projectName: "Apex Bio-Pharmaceuticals",
    inspectionType: "RSPCB Pre-CTE Environmental & Effluent Plan Audit",
    department: "Rajasthan State Pollution Control Board",
    address: "Plot E-142, RIICO Industrial Area Phase IV, Sitapura, Jaipur",
    coordinates: { lat: 26.7825, lng: 75.8362 },
    timeWindow: ["09:30", "11:00"],
    deadline: "2026-09-30",
    priority: "CRITICAL",
    status: "SCHEDULED",
    inspectorAssigned: "Dr. R. K. Sharma (Sr. Environmental Eng.)",
    requiredSkills: ["Hazardous Waste", "ETP ZLD Verification", "Air Stack Height"],
    slaRiskDays: 2,
    checklistItems: [
      { id: "c1", label: "Zero Liquid Discharge (ZLD) Multi-Effect Evaporator area earmarked", mandatory: true },
      { id: "c2", label: "Minimum 33% green belt tree plantation boundary demarcated", mandatory: true },
      { id: "c3", label: "DG Stack height compliant with H = h + 0.2(KVA)^0.5 formula", mandatory: true },
      { id: "c4", label: "Hazardous waste storage shed with impervious concrete flooring", mandatory: true }
    ]
  },
  {
    id: "INSP-FIRE-01",
    projectId: "PRJ-RAJ-2026-0849",
    projectName: "Apex Bio-Pharmaceuticals",
    inspectionType: "Provisional Fire Hydrant & Solvent Tank Safety Check",
    department: "Fire & Emergency Services, Jaipur Region",
    address: "Plot E-142, RIICO Sitapura, Jaipur",
    coordinates: { lat: 26.7831, lng: 75.8375 },
    timeWindow: ["11:30", "13:00"],
    deadline: "2026-10-02",
    priority: "HIGH",
    status: "SCHEDULED",
    inspectorAssigned: "C. P. Meena (Divisional Fire Officer)",
    requiredSkills: ["Solvent Storage NFPA 30", "Sprinkler Systems", "Static Grounding"],
    slaRiskDays: 4,
    checklistItems: [
      { id: "f1", label: "6m peripheral motorable road around entire factory building", mandatory: true },
      { id: "f2", label: "Dedicated 150,000L underground static fire water reservoir", mandatory: true },
      { id: "f3", label: "Nitrogen blanketing for IPA & Methanol bulk storage tanks", mandatory: true },
      { id: "f4", label: "Flameproof electrical fixtures in Class 1 Div 1 hazardous zones", mandatory: true }
    ]
  },
  {
    id: "INSP-SOLAR-02",
    projectId: "PRJ-RAJ-2026-0912",
    projectName: "Rajasthan Surya Green Energy Park",
    inspectionType: "Grid Interconnection & Substation Land Survey",
    department: "Rajasthan Rajya Vidyut Prasaran Nigam (RVPN)",
    address: "Khasra 284/1, Phagi Road, Jaipur Rural",
    coordinates: { lat: 26.6841, lng: 75.6219 },
    timeWindow: ["13:45", "15:00"],
    deadline: "2026-10-04",
    priority: "MEDIUM",
    status: "PENDING",
    inspectorAssigned: "Anil Verma (Executive Engineer)",
    requiredSkills: ["Transmission Line ROW", "Solar Inverter Bay", "Bay Spacing"],
    slaRiskDays: 6,
    checklistItems: [
      { id: "s1", label: "Right-of-way clearance for 132kV overhead double circuit", mandatory: true },
      { id: "s2", label: "Transformer oil sump fire barrier wall clearance", mandatory: true }
    ]
  },
  {
    id: "INSP-FOOD-03",
    projectId: "PRJ-RAJ-2026-0771",
    projectName: "Desert Fresh Agro-Processing Hub",
    inspectionType: "FSSAI Central Manufacturing Licence Hygiene Inspection",
    department: "Food Safety and Standards Authority of India (FSSAI)",
    address: "Plot B-18, Food Park, Bindayaka, Jaipur",
    coordinates: { lat: 26.9421, lng: 75.6881 },
    timeWindow: ["15:30", "17:00"],
    deadline: "2026-09-29",
    priority: "CRITICAL",
    status: "SCHEDULED",
    inspectorAssigned: "Dr. Sunita Choudhary (Food Safety Officer)",
    requiredSkills: ["HACCP", "Cold Chain Verification", "Water Microbiology"],
    slaRiskDays: 1,
    checklistItems: [
      { id: "d1", label: "Potable water tested as per IS 10500 standards", mandatory: true },
      { id: "d2", label: "Fly-catcher and positive air pressure airlocks at packaging bay", mandatory: true },
      { id: "d3", label: "Temperature logging sensors in cold storage units (-18C)", mandatory: true }
    ]
  }
];

// Process Mining (PM4Py) Expected vs Observed Process Model
export const PROCESS_XRAY_STEPS: ProcessMiningStep[] = [
  {
    stepId: "step-1",
    activityName: "Online Application Submission",
    department: "Raj Nivesh Single Window",
    expectedDurationDays: 1,
    observedMedianDays: 1.2,
    isLoop: false,
    reworkFrequencyRate: "0%",
    waitingTimeDays: 0.2,
    bottleneckFlag: false
  },
  {
    stepId: "step-2",
    activityName: "Automated Document Validation",
    department: "System Core",
    expectedDurationDays: 0.5,
    observedMedianDays: 0.8,
    isLoop: false,
    reworkFrequencyRate: "8%",
    waitingTimeDays: 0.3,
    bottleneckFlag: false
  },
  {
    stepId: "step-3",
    activityName: "Departmental Desk Scrutiny",
    department: "Directorate of Factories & Boilers",
    expectedDurationDays: 7,
    observedMedianDays: 19.4,
    isLoop: true,
    reworkFrequencyRate: "42.8%",
    waitingTimeDays: 12.4,
    bottleneckFlag: true
  },
  {
    stepId: "step-4",
    activityName: "Clarification / Query Resolution",
    department: "Inter-Departmental Query Cell",
    expectedDurationDays: 7,
    observedMedianDays: 16.2,
    isLoop: true,
    reworkFrequencyRate: "38.1%",
    waitingTimeDays: 9.2,
    bottleneckFlag: true
  },
  {
    stepId: "step-5",
    activityName: "Joint Multi-Dept On-Site Inspection",
    department: "Joint Inspection Committee",
    expectedDurationDays: 10,
    observedMedianDays: 24.1,
    isLoop: true,
    reworkFrequencyRate: "28.5%",
    waitingTimeDays: 14.1,
    bottleneckFlag: true
  },
  {
    stepId: "step-6",
    activityName: "Final Statutory Sanction & Certificate Issuance",
    department: "Competent Authority",
    expectedDurationDays: 5,
    observedMedianDays: 6.1,
    isLoop: false,
    reworkFrequencyRate: "2%",
    waitingTimeDays: 1.1,
    bottleneckFlag: false
  }
];

export const BOTTLENECK_DATA = {
  activeDepartmentBottlenecks: [
    {
      department: "Directorate of Factories and Boilers",
      avgDelayDays: 19.4,
      affectedApplications: 143,
      slaBreachRate: "34.2%",
      rootCause: "Cadre shortage of certified mechanical inspectors for high-pressure boiler plan verification",
      recommendation: "Batch automated CAD drawing pre-validation & cross-district temporary delegation",
      criticalPathCasesCount: 11
    },
    {
      department: "State Environment Impact Assessment Authority (SEIAA)",
      avgDelayDays: 24.1,
      affectedApplications: 88,
      slaBreachRate: "41.0%",
      rootCause: "Meeting frequency limitation (SEAC meets only twice a month)",
      recommendation: "Transition Category B2 standardized projects to auto-scrutiny with post-facto audit",
      criticalPathCasesCount: 7
    },
    {
      department: "Ground Water Department / CGWA",
      avgDelayDays: 14.8,
      affectedApplications: 62,
      slaBreachRate: "22.5%",
      rootCause: "Manual verification of piezometric recharge rate documentation",
      recommendation: "Integration with Central CGWA live telemetric piezometer portal",
      criticalPathCasesCount: 5
    }
  ],
  slaBreakdown: {
    totalActive: 492,
    withinSla: 386,
    nearBreach: 74,
    breached: 32
  }
};

// Regulatory Diff & Change Impact Analysis Data
export const REGULATORY_DIFF_DATA: RegulatoryDiffItem = {
  id: "DIFF-2026-F14",
  notificationNumber: "F.14(1)Env/RSPCB/ZLD/2026/419",
  title: "Mandatory Online VOC & Toxic Solvent Monitoring for API Units",
  issuingAuthority: "Department of Environment & Climate Change, Govt of Rajasthan",
  effectiveDate: "2026-10-01",
  oldRequirement: "Quarterly grab sampling of volatile organic compounds (VOC) through recognized lab; 5 statutory compliance documents.",
  newRequirement: "Real-time Photo-Ionization Detector (PID) Continuous VOC emission telemetry to RSPCB Central Server; 7 statutory compliance documents with bi-annual leak detection audit (LDAR).",
  impactMetrics: {
    affectedProjectsCount: 38,
    affectedApplicationsCount: 64,
    delayedDaysEstimate: 14,
    documentsAdded: 2,
    inspectionsAdded: 1
  },
  affectedProjects: [
    {
      id: "PRJ-RAJ-2026-0849",
      name: "Apex Bio-Pharmaceuticals & Active Ingredients Unit",
      district: "Jaipur (Sitapura Phase IV)",
      coordinates: { lat: 26.7825, lng: 75.8362 },
      currentStatus: "CTE Scrutiny Stage (Document Revision Required)"
    },
    {
      id: "PRJ-RAJ-2026-0612",
      name: "Marwar Bulk Synthetics Chemical Park",
      district: "Pali (Industrial Area Phase III)",
      coordinates: { lat: 25.7711, lng: 73.3234 },
      currentStatus: "Pre-Operation CTO Pending"
    },
    {
      id: "PRJ-RAJ-2026-0744",
      name: "Bhiwadi Active Peptides Laboratories",
      district: "Khairthal-Tijara (Bhiwadi)",
      coordinates: { lat: 28.2104, lng: 76.8606 },
      currentStatus: "Construction Phase"
    },
    {
      id: "PRJ-RAJ-2026-0931",
      name: "Neemrana Formulation Complex",
      district: "Kotputli-Behror (Japanese Zone)",
      coordinates: { lat: 27.9892, lng: 76.3881 },
      currentStatus: "CTE In Review"
    }
  ]
};

// Organization 360 Seed Data
export const ORGANIZATION_360_DATA = {
  id: "ORG-IND-RAJ-4491",
  companyName: "Apex LifeSciences Healthcare Pvt. Ltd.",
  incorporationDate: "2018-04-12",
  cin: "U24232RJ2018PTC061284",
  gstin: "08AABCA1234F1Z8",
  pan: "AABCA1234F",
  corporateHq: "Apex Towers, C-Scheme, Jaipur, Rajasthan 302001",
  complianceHealthScore: 92,
  directorKycStatus: "VERIFIED_AADHAAR_ESIGN",
  portfolioSummary: {
    activeProjects: 3,
    totalInvestmentInrCrores: 310.5,
    totalEmployment: 680,
    statutoryClearancesHeld: 19,
    openQueriesCount: 1,
    pendingRenewalsCount: 1
  },
  projectsPortfolio: [
    {
      id: "PRJ-RAJ-2026-0849",
      name: "Sitapura Active Ingredients Bulk Unit",
      district: "Jaipur",
      stage: "Pre-Establishment Clearances (78% Ready)"
    },
    {
      id: "PRJ-RAJ-2021-0210",
      name: "Bhiwadi Oral Dosage Formulation Facility",
      district: "Khairthal-Tijara",
      stage: "Commercial Operation (100% Compliant)"
    },
    {
      id: "PRJ-RAJ-2024-0551",
      name: "Jodhpur Sterile Injectables Formulation Hub",
      district: "Jodhpur",
      stage: "Expansion CTO Renewal in Progress"
    }
  ]
};
