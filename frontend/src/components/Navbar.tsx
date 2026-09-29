"use client";

import React from "react";
import { ShieldCheck, Bot, Building2, Landmark, Compass, Sparkles, Map } from "lucide-react";

interface NavbarProps {
  activeTab: "applicant" | "government" | "inspector" | "gis-map";
  setActiveTab: (tab: "applicant" | "government" | "inspector" | "gis-map") => void;
  onOpenCopilot: () => void;
}

export function Navbar({ activeTab, setActiveTab, onOpenCopilot }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Emblem */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-md shadow-teal-500/10">
            <div className="h-full w-full bg-white rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-teal-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">PramaanFlow</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                Maharashtra · NSWS
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Location → Jurisdiction → Authority → Service → Action
            </p>
          </div>
        </div>

        {/* Persona Tabs Navigation */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner gap-0.5">
          {/* GIS Map — primary tab */}
          <button
            onClick={() => setActiveTab("gis-map")}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === "gis-map"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
          >
            <Map className="h-3.5 w-3.5" />
            <span>Location Intelligence</span>
          </button>

          <button
            onClick={() => setActiveTab("applicant")}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === "applicant"
                ? "bg-white text-teal-700 shadow-sm border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
          >
            <Building2 className="h-3.5 w-3.5 text-teal-600" />
            <span>Applicant Workspace</span>
          </button>

          <button
            onClick={() => setActiveTab("government")}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === "government"
                ? "bg-white text-indigo-700 shadow-sm border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
          >
            <Landmark className="h-3.5 w-3.5 text-indigo-600" />
            <span>Govt Command</span>
          </button>

          <button
            onClick={() => setActiveTab("inspector")}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === "inspector"
                ? "bg-white text-emerald-700 shadow-sm border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
          >
            <Compass className="h-3.5 w-3.5 text-emerald-600" />
            <span>Inspector</span>
          </button>
        </div>

        {/* Copilot Action Button */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Gemini AI Connected</span>
          </div>

          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-600/20 transition-all active:scale-95"
          >
            <Bot className="h-4 w-4" />
            <span>AI Copilot</span>
            <Sparkles className="h-3 w-3 text-teal-200" />
          </button>
        </div>
      </div>
    </header>
  );
}
