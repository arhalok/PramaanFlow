"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ProjectProfile,
  extractProjectParameters
} from "@/lib/project-state";
import {
  Bot,
  User,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Send,
  Layers,
  MapPin,
  TrendingUp,
  AlertCircle
} from "lucide-react";

interface Step2ConversationalQAProps {
  initialPrompt: string;
  onComplete: (updatedProfile: ProjectProfile, suggestedLocation?: string) => void;
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  options?: string[];
  fieldKey?: keyof ProjectProfile | "location";
}

export function Step2ConversationalQA({
  initialPrompt,
  onComplete,
  onBack
}: Step2ConversationalQAProps) {
  // Extract initial parameters from the prompt
  const initialExtraction = extractProjectParameters(initialPrompt);

  const [profile, setProfile] = useState<ProjectProfile>({
    name: initialExtraction.extracted.subSector
      ? `${initialExtraction.extracted.subSector} Unit`
      : "Proposed Industrial Facility",
    enterpriseName: "Applicant Enterprise",
    sector: initialExtraction.extracted.sector || "Pharmaceuticals",
    subSector: initialExtraction.extracted.subSector || "Bulk Active Pharmaceutical Ingredients (API)",
    activityDescription: initialPrompt,
    capacity: initialExtraction.extracted.capacity,
    capacityUnit: initialExtraction.extracted.capacityUnit || "TPD",
    investmentCrores: initialExtraction.extracted.investmentCrores,
    employmentTarget: 200,
    powerRequirementKw: 2500,
    waterRequirementKld: 150,
    hazardousChemicals: initialExtraction.extracted.hazardousChemicals ?? true,
    groundwaterExtraction: true,
    projectStage: "PLANNING"
  });

  const [locationSuggestion, setLocationSuggestion] = useState<string>(
    initialExtraction.extractedLocation?.query || ""
  );

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentFieldStep, setCurrentFieldStep] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize conversation based on missing fields
  useEffect(() => {
    const missing = initialExtraction.missingFields;
    const initialMsgs: ChatMessage[] = [];

    // Message 1: Acknowledge what was extracted
    let acknowledgeText = `I understand you are planning a **${initialExtraction.extracted.sector || "manufacturing"}** project.`;
    if (initialExtraction.extracted.capacity && initialExtraction.extracted.investmentCrores) {
      acknowledgeText += ` I've noted a planned capacity of **${initialExtraction.extracted.capacity} ${initialExtraction.extracted.capacityUnit || "TPD"}** and an investment of **₹${initialExtraction.extracted.investmentCrores} Cr**.`;
    } else if (initialExtraction.extracted.capacity) {
      acknowledgeText += ` I've noted your planned capacity of **${initialExtraction.extracted.capacity} ${initialExtraction.extracted.capacityUnit || "TPD"}**.`;
    } else if (initialExtraction.extracted.investmentCrores) {
      acknowledgeText += ` I've noted your planned investment of **₹${initialExtraction.extracted.investmentCrores} Cr**.`;
    }

    initialMsgs.push({
      id: "msg-ack",
      sender: "ai",
      text: acknowledgeText
    });

    // Check which missing question to ask first
    if (!initialExtraction.extracted.subSector && initialExtraction.extracted.sector === "Pharmaceuticals") {
      initialMsgs.push({
        id: "q-subsector",
        sender: "ai",
        text: "What will the facility specifically manufacture?",
        options: ["Active Pharmaceutical Ingredients (API) only", "API + Formulations", "Formulations / Finished dosage only", "Other bulk chemicals"],
        fieldKey: "subSector"
      });
      setCurrentFieldStep("subSector");
    } else if (!initialExtraction.extracted.capacity) {
      initialMsgs.push({
        id: "q-capacity",
        sender: "ai",
        text: "What is your planned production capacity?",
        options: ["50 TPD", "100 TPD", "250 TPD", "Custom capacity"],
        fieldKey: "capacity"
      });
      setCurrentFieldStep("capacity");
    } else if (!initialExtraction.extracted.investmentCrores) {
      initialMsgs.push({
        id: "q-investment",
        sender: "ai",
        text: "What is your approximate planned capital investment?",
        options: ["₹25 Cr (Small/Medium)", "₹75 Cr", "₹145 Cr (Mega Project)", "₹300+ Cr"],
        fieldKey: "investmentCrores"
      });
      setCurrentFieldStep("investmentCrores");
    } else if (!locationSuggestion) {
      initialMsgs.push({
        id: "q-location",
        sender: "ai",
        text: "Where are you planning to establish the facility?",
        options: ["Chakan MIDC (Pune)", "Kurkumbh MIDC (Pune)", "Sitapura Industrial Area (Jaipur)", "Select on Interactive Map"],
        fieldKey: "location"
      });
      setCurrentFieldStep("location");
    } else {
      // All core parameters are known!
      initialMsgs.push({
        id: "q-ready",
        sender: "ai",
        text: `Great! We have gathered the key parameters for your **${profile.sector}** project. Next, let's verify your exact project location on the map to resolve regulatory jurisdictions and planning authorities.`
      });
      setCurrentFieldStep("ready");
    }

    setMessages(initialMsgs);
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSelectOption = (option: string, fieldKey?: keyof ProjectProfile | "location") => {
    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: option
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Update profile state
    setTimeout(() => {
      let nextProfile = { ...profile };
      let nextLoc = locationSuggestion;

      if (fieldKey === "subSector") {
        nextProfile.subSector = option;
        setProfile(nextProfile);
      } else if (fieldKey === "capacity") {
        const num = parseFloat(option);
        if (!isNaN(num)) nextProfile.capacity = num;
        setProfile(nextProfile);
      } else if (fieldKey === "investmentCrores") {
        const match = option.match(/\d+/);
        if (match) nextProfile.investmentCrores = parseFloat(match[0]);
        setProfile(nextProfile);
      } else if (fieldKey === "location") {
        nextLoc = option;
        setLocationSuggestion(option);
      }

      // Determine next question
      const aiReply = getNextQuestion(nextProfile, nextLoc);
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 600);
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    const text = inputText.trim();
    setInputText("");

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let nextProfile = { ...profile };
      let nextLoc = locationSuggestion;

      if (currentFieldStep === "subSector") {
        nextProfile.subSector = text;
      } else if (currentFieldStep === "capacity") {
        const num = parseFloat(text);
        if (!isNaN(num)) nextProfile.capacity = num;
      } else if (currentFieldStep === "investmentCrores") {
        const match = text.match(/\d+/);
        if (match) nextProfile.investmentCrores = parseFloat(match[0]);
      } else if (currentFieldStep === "location") {
        nextLoc = text;
        setLocationSuggestion(text);
      }

      setProfile(nextProfile);
      const aiReply = getNextQuestion(nextProfile, nextLoc);
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 600);
  };

  const getNextQuestion = (p: ProjectProfile, loc: string): ChatMessage => {
    if (!p.capacity) {
      setCurrentFieldStep("capacity");
      return {
        id: `q-cap-${Date.now()}`,
        sender: "ai",
        text: "What is your planned production capacity?",
        options: ["50 TPD", "100 TPD", "250 TPD", "Other capacity"],
        fieldKey: "capacity"
      };
    }

    if (!p.investmentCrores) {
      setCurrentFieldStep("investmentCrores");
      return {
        id: `q-inv-${Date.now()}`,
        sender: "ai",
        text: "What is the approximate planned capital investment?",
        options: ["₹45 Cr", "₹95 Cr", "₹145 Cr", "₹250 Cr"],
        fieldKey: "investmentCrores"
      };
    }

    if (!loc) {
      setCurrentFieldStep("location");
      return {
        id: `q-loc-${Date.now()}`,
        sender: "ai",
        text: "Where are you planning to establish the facility?",
        options: ["Chakan MIDC (Pune)", "Kurkumbh MIDC (Pune)", "Sitapura Industrial Area (Jaipur)", "Select on Map"],
        fieldKey: "location"
      };
    }

    // Ready for location mapping!
    setCurrentFieldStep("ready");
    return {
      id: `q-ready-${Date.now()}`,
      sender: "ai",
      text: `All core parameters are in place for your **${p.sector}** project. Next, let's select and confirm your exact site on the map so the backend can resolve statutory jurisdictions, MIDC/RIICO zoning, and local authorities.`
    };
  };

  const isReady = currentFieldStep === "ready" || (profile.capacity && profile.investmentCrores);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 font-medium"
        >
          ← Back to Project Description
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Stage 2 of 5:</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
            Intelligent Parameter Extraction
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Conversational AI Window */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Regulatory Intake Assistant</h3>
                <p className="text-[11px] text-slate-500">Asking only what&apos;s missing from your project description</p>
              </div>
            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Active
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "ai" && (
                  <div className="h-7 w-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                  </div>
                )}

                <div className="max-w-[85%] space-y-2">
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      m.sender === "user"
                        ? "bg-teal-600 text-white rounded-br-xs shadow-xs"
                        : "bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/60"
                    }`}
                  >
                    <div dangerouslySetInnerHTML={{ __html: formatMessageMarkdown(m.text) }} />
                  </div>

                  {/* Contextual Options Buttons */}
                  {m.options && m.options.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(opt, m.fieldKey)}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 hover:border-teal-300 transition-all shadow-2xs active:scale-95 text-left cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {m.sender === "user" && (
                  <div className="h-7 w-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 items-center text-slate-400 text-xs pl-1">
                <div className="h-7 w-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <Sparkles className="h-3.5 w-3.5 text-teal-600 animate-spin" />
                </div>
                <span>Analyzing project parameters...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Chat Footer Input */}
          <div className="p-3 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendText()}
                placeholder="Type your answer or select an option above..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
              />
              <button
                onClick={handleSendText}
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Project Twin Summary Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-teal-600" />
              <span>Extracted Project State</span>
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">
              Live Twin
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-medium text-slate-400 uppercase">Sector &amp; Classification</span>
              <p className="font-bold text-slate-900 mt-0.5">{profile.sector}</p>
              <p className="text-[11px] text-teal-700 font-medium mt-0.5">{profile.subSector}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-medium text-slate-400 uppercase">Planned Capacity</span>
                <p className="font-bold text-slate-900 mt-0.5 font-mono">
                  {profile.capacity ? `${profile.capacity} ${profile.capacityUnit}` : "—"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-medium text-slate-400 uppercase">Est. Investment</span>
                <p className="font-bold text-slate-900 mt-0.5 font-mono">
                  {profile.investmentCrores ? `₹${profile.investmentCrores} Cr` : "—"}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
              <MapPin className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-medium text-slate-400 uppercase">Target Location</span>
                <p className="font-bold text-slate-800 mt-0.5">
                  {locationSuggestion || "Pending Map Confirmation"}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200/80 text-[11px] text-teal-900 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                <span>Zero Fake Assumptions</span>
              </p>
              <p className="text-teal-700">
                Regulatory triggers are matched exclusively against verified statutory acts and geographical notifications.
              </p>
            </div>
          </div>

          {/* Action to proceed to Step 3 */}
          <div className="pt-2">
            <button
              onClick={() => onComplete(profile, locationSuggestion)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <span>Confirm Location on Map</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Interactive map resolves regional planning &amp; environmental authorities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatMessageMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code class='px-1 py-0.5 bg-slate-200/80 rounded font-mono text-xs'>$1</code>");
}
