"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Building2,
  Factory,
  Briefcase,
  Layers,
  Search,
  Check,
  RefreshCw,
  HelpCircle,
  Clock,
  FileCheck2,
  X
} from "lucide-react";
import { ProjectTwin, INITIAL_PROJECT } from "@/lib/regulatory-data";

interface GuidedProjectOnboardingProps {
  onComplete: (createdProject: Partial<ProjectTwin>) => void;
  onCancelOrContinueExisting: () => void;
}

export function GuidedProjectOnboarding({
  onComplete,
  onCancelOrContinueExisting
}: GuidedProjectOnboardingProps) {
  // Step in wizard: 0 = Welcome, 1 = What are you building?, 2 = Tell us about project, 3 = Location, 4 = Analyzing, 5 = Plan Ready
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);

  // Form State
  const [projectIntent, setProjectIntent] = useState("Build a new factory");
  const [naturalDescription, setNaturalDescription] = useState("");
  const [businessActivity, setBusinessActivity] = useState("Food processing & cold chain");
  const [projectScale, setProjectScale] = useState("₹10–50 Cr");
  const [employeeCount, setEmployeeCount] = useState("250");
  const [hasLand, setHasLand] = useState("Yes");
  const [locationSearch, setLocationSearch] = useState("Sitapura Industrial Area, Jaipur");
  const [confirmedLocation, setConfirmedLocation] = useState({
    name: "Sitapura Industrial Area, Jaipur",
    state: "Rajasthan",
    district: "Jaipur",
    authority: "RIICO (Rajasthan State Industrial Development and Investment Corp.)"
  });

  // Analysis Animation Progress (Step 4)
  const [analysisProgress, setAnalysisProgress] = useState(0);

  useEffect(() => {
    if (step === 4) {
      setAnalysisProgress(0);
      const interval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep(5), 400);
            return 100;
          }
          return prev + 25;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Handle Natural Language Quick Fill (Vercel AI SDK / Gemini Parser pattern)
  const handleNaturalExtract = () => {
    if (!naturalDescription.trim()) return;
    const lower = naturalDescription.toLowerCase();

    if (lower.includes("food") || lower.includes("agro") || lower.includes("cold storage")) {
      setBusinessActivity("Food processing & cold storage");
    } else if (lower.includes("pharma") || lower.includes("api") || lower.includes("drug")) {
      setBusinessActivity("Active Pharmaceutical Ingredients (API)");
    } else if (lower.includes("solar") || lower.includes("renewable")) {
      setBusinessActivity("Solar module & renewable energy assembly");
    }

    if (lower.includes("jaipur")) {
      setLocationSearch("Sitapura Industrial Area, Jaipur");
      setConfirmedLocation({
        name: "Sitapura Industrial Area, Jaipur",
        state: "Rajasthan",
        district: "Jaipur",
        authority: "RIICO Industrial Area"
      });
    } else if (lower.includes("pune") || lower.includes("chakan")) {
      setLocationSearch("Chakan MIDC Phase II, Pune");
      setConfirmedLocation({
        name: "Chakan Industrial Area Phase II, Pune",
        state: "Maharashtra",
        district: "Pune",
        authority: "MIDC (Maharashtra Industrial Development Corporation)"
      });
    }

    if (lower.includes("cr") || lower.includes("crore")) {
      const match = naturalDescription.match(/(\d+)\s*(?:cr|crore)/i);
      if (match) {
        const val = parseInt(match[1], 10);
        if (val < 50) setProjectScale("₹10–50 Cr");
        else if (val <= 100) setProjectScale("₹50–100 Cr");
        else setProjectScale("₹100+ Cr");
      }
    }

    setStep(2);
  };

  const handleFinishOnboarding = () => {
    const isJaipur = confirmedLocation.district.toLowerCase().includes("jaipur");

    onComplete({
      name: `${businessActivity} Plant`,
      enterpriseName: `${businessActivity.split(" ")[0]} Enterprises Pvt. Ltd.`,
      sector: businessActivity.includes("Food") ? "Food Processing" : "Manufacturing",
      subSector: businessActivity,
      district: confirmedLocation.name,
      investmentCrores: projectScale.includes("100+") ? 145 : projectScale.includes("50–100") ? 75 : 35,
      capacity: 100,
      employmentTarget: parseInt(employeeCount, 10) || 200
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8 px-4 animate-in fade-in duration-300">
      {/* ─────────────────────────────────────────────────────────────
          STEP 0: WELCOME SCREEN (Section 1 of Master Prompt)
         ───────────────────────────────────────────────────────────── */}
      {step === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-12 text-center space-y-8 relative overflow-hidden">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-teal-50 text-teal-700 mx-auto shadow-2xs">
            <Building2 className="h-7 w-7" />
          </div>

          <div className="space-y-3 max-w-lg mx-auto">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome to PramaanFlow
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Set up your project. We&apos;ll guide you through the required government approvals like a navigation system.
            </p>
          </div>

          <div className="space-y-3.5 max-w-md mx-auto pt-2">
            <button
              onClick={() => setStep(1)}
              className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Start a New Project</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onCancelOrContinueExisting}
              className="w-full py-3 px-6 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              Already have a project? Continue Existing Project
            </button>
          </div>

          {/* That one transformative sentence */}
          <div className="pt-6 border-t border-slate-100 max-w-md mx-auto">
            <p className="text-xs text-slate-600 leading-normal font-medium">
              💡 You don&apos;t need to know which approvals or departments apply. We&apos;ll identify them for you.
            </p>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 1: WHAT ARE YOU PLANNING TO DO? (Section 2)
         ───────────────────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-10 space-y-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider font-mono">Step 1 of 4</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              What are you planning to do?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Pick the option that best matches your plan, or describe it in your own words.
            </p>
          </div>

          {/* Quick Choice Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              { id: "Build a new factory", label: "Build a new factory", desc: "Manufacturing or industrial production", icon: Factory },
              { id: "Start a new business", label: "Start a new business", desc: "Commercial enterprise or service", icon: Building2 },
              { id: "Expand an existing facility", label: "Expand an existing facility", desc: "Scale up capacity or area", icon: Layers },
              { id: "Set up a warehouse", label: "Set up a warehouse", desc: "Storage, logistics & distribution", icon: Briefcase }
            ].map((opt) => (
              <div
                key={opt.id}
                onClick={() => setProjectIntent(opt.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  projectIntent === opt.id
                    ? "bg-teal-50/60 border-teal-500 ring-2 ring-teal-500/20 shadow-xs"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${projectIntent === opt.id ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                  <opt.icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{opt.label}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Natural Language Box */}
          <div className="pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                <span>Or describe your project in your own words:</span>
              </label>
              <textarea
                rows={2}
                value={naturalDescription}
                onChange={(e) => setNaturalDescription(e.target.value)}
                placeholder='e.g. "I want to start a food processing factory near Jaipur with cold storage and ₹25 Cr investment."'
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 resize-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setStep(0)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={() => {
                if (naturalDescription.trim()) handleNaturalExtract();
                else setStep(2);
              }}
              className="py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 2: PROGRESSIVE QUESTIONS (Section 3 of Master Prompt)
         ───────────────────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-10 space-y-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider font-mono">Step 2 of 4</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Tell us a little more about your project
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Only 4 quick questions. We&apos;ll figure out everything else automatically.
            </p>
          </div>

          <div className="space-y-4 pt-1 text-xs">
            {/* Q1: Business Activity */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">What will your business do?</label>
              <input
                type="text"
                value={businessActivity}
                onChange={(e) => setBusinessActivity(e.target.value)}
                placeholder="e.g. Food processing, Pharmaceuticals, Agro products..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Q2: Project Scale */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">How big will the project be?</label>
              <div className="grid grid-cols-3 gap-2">
                {["Under ₹10 Cr", "₹10–50 Cr", "₹50–100 Cr", "₹100+ Cr"].slice(1).map((scale) => (
                  <button
                    key={scale}
                    type="button"
                    onClick={() => setProjectScale(scale)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      projectScale === scale
                        ? "bg-teal-600 text-white border-teal-600 shadow-2xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {scale}
                  </button>
                ))}
              </div>
            </div>

            {/* Q3: Employees */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">How many people do you expect to employ?</label>
              <input
                type="number"
                value={employeeCount}
                onChange={(e) => setEmployeeCount(e.target.value)}
                placeholder="e.g. 250"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Q4: Land */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">Do you already have land?</label>
              <div className="grid grid-cols-3 gap-2">
                {["Yes", "No", "I'm looking"].map((ans) => (
                  <button
                    key={ans}
                    type="button"
                    onClick={() => setHasLand(ans)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      hasLand === ans
                        ? "bg-teal-600 text-white border-teal-600 shadow-2xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {ans}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-teal-50 border border-teal-100 text-teal-900 text-xs">
            ✨ <strong>Great. That&apos;s enough for now.</strong> Next, let&apos;s identify the location.
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setStep(3)}
              className="py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Location</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 3: LOCATION LIKE GOOGLE MAPS (Section 4 of Master Prompt)
         ───────────────────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-10 space-y-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider font-mono">Step 3 of 4</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Where will your project be located?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Search an address or pick an industrial area. We&apos;ll pinpoint the exact government offices for you.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              placeholder="Search city, district, or industrial park..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Quick Location Presets */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
            <span className="text-slate-400 shrink-0 font-medium">Quick pick:</span>
            {[
              { name: "Sitapura Industrial Area, Jaipur", state: "Rajasthan", district: "Jaipur", authority: "RIICO" },
              { name: "Chakan MIDC Phase II, Pune", state: "Maharashtra", district: "Pune", authority: "MIDC" },
              { name: "Butibori Industrial Area, Nagpur", state: "Maharashtra", district: "Nagpur", authority: "MIDC" }
            ].map((loc) => (
              <button
                key={loc.name}
                type="button"
                onClick={() => {
                  setLocationSearch(loc.name);
                  setConfirmedLocation(loc);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 border border-slate-200 shrink-0 transition-colors"
              >
                {loc.name.split(",")[0]}
              </button>
            ))}
          </div>

          {/* Map Preview Box */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 relative h-48 sm:h-56 flex items-center justify-center">
            {/* Visual Map Representation */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
            <div className="relative z-10 text-center space-y-2 p-4">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-rose-500 text-white shadow-lg animate-bounce">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-md max-w-sm mx-auto text-left space-y-0.5">
                <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Location found</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{confirmedLocation.name}</h4>
                <p className="text-[11px] text-slate-500">
                  {confirmedLocation.district}, {confirmedLocation.state} • {confirmedLocation.authority}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs">
            💡 We&apos;ll use this location to automatically determine which government offices and approvals apply to your project.
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setStep(4)}
              className="py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Confirm Location</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 4: "WE'RE FIGURING IT OUT" (Section 5 of Master Prompt)
         ───────────────────────────────────────────────────────────── */}
      {step === 4 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-12 text-center space-y-6">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-teal-50 text-teal-600 mx-auto animate-pulse">
            <RefreshCw className="h-7 w-7 animate-spin" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Understanding your project...
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Matching your location and activity against state regulatory rules.
            </p>
          </div>

          {/* Animated Checklist */}
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Project type identified: <strong>{businessActivity}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Location identified: <strong>{confirmedLocation.name}</strong></span>
            </div>
            <div className={`flex items-center gap-2 transition-opacity ${analysisProgress >= 50 ? "text-emerald-800" : "text-slate-400"}`}>
              {analysisProgress >= 50 ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" /> : <Clock className="h-4 w-4 shrink-0" />}
              <span>Applicable departments found: <strong>Pollution Control, Fire, Labor</strong></span>
            </div>
            <div className={`flex items-center gap-2 transition-opacity ${analysisProgress >= 75 ? "text-emerald-800" : "text-slate-400"}`}>
              {analysisProgress >= 75 ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" /> : <Clock className="h-4 w-4 shrink-0" />}
              <span>Regulatory requirements checked</span>
            </div>
            <div className={`flex items-center gap-2 transition-opacity ${analysisProgress >= 100 ? "text-emerald-800" : "text-slate-400"}`}>
              {analysisProgress >= 100 ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" /> : <Clock className="h-4 w-4 shrink-0" />}
              <span>Required documents identified &amp; sequence mapped</span>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 5: "YOUR APPROVAL PLAN IS READY" (Section 5 of Master Prompt)
         ───────────────────────────────────────────────────────────── */}
      {step === 5 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-12 text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto shadow-md">
            <Check className="h-8 w-8 stroke-[3]" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Your Approval Plan Is Ready 🎉
            </h2>
            <div className="inline-block px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
              {businessActivity} • {confirmedLocation.name}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed pt-1">
              We found <strong>8 government approvals</strong> for your project.
            </p>
            <p className="text-xs text-slate-500">
              You don&apos;t need to understand all of them. We&apos;ll guide you step by step.
            </p>
          </div>

          <div className="pt-4 max-w-sm mx-auto">
            <button
              onClick={handleFinishOnboarding}
              className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm shadow-lg shadow-teal-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>View My Approval Plan</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
