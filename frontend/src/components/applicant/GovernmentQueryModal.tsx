"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
  Send,
  X,
  Sparkles,
  Bot,
  Building2,
  ArrowRight
} from "lucide-react";

interface GovernmentQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (selectedFigure: string, notes: string) => void;
  onAskCopilot?: (query: string) => void;
}

export function GovernmentQueryModal({
  isOpen,
  onClose,
  onSuccess,
  onAskCopilot
}: GovernmentQueryModalProps) {
  const [selectedFigure, setSelectedFigure] = useState<"100 KLD" | "150 KLD">("100 KLD");
  const [applicantNotes, setApplicantNotes] = useState(
    "Confirmed 100 KLD base manufacturing discharge. The 150 KLD in the EIA summary represents the maximum peak utility envelope."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResolved, setIsResolved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsResolved(true);
      setTimeout(() => {
        onSuccess(selectedFigure, applicantNotes);
        onClose();
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono">
                  ACTION NEEDED
                </span>
                <span className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Due in 5 days</span>
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Pollution Control Board clarification on water usage
              </h3>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body Content */}
        {!isResolved ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs overflow-y-auto pr-1">
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-1.5">
              <p className="text-xs font-medium leading-relaxed">
                The Pollution Control Board reviewed your application and found a difference between two numbers in your submitted documents.
              </p>
            </div>

            {/* Side by side comparison */}
            <div className="space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">
                What happened?
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Document A (Form 1)</span>
                  <p className="font-extrabold text-slate-900 text-sm font-mono">100 KLD</p>
                  <p className="text-[11px] text-slate-500">Normal daily operational discharge</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Document B (EIA Report)</span>
                  <p className="font-extrabold text-slate-900 text-sm font-mono">150 KLD</p>
                  <p className="text-[11px] text-slate-500">Peak utility envelope mentioned</p>
                </div>
              </div>
            </div>

            {/* Quick 1-click Choice */}
            <div className="space-y-2 pt-1">
              <label className="font-bold text-slate-800">
                Please confirm the correct figure for your permit:
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { value: "100 KLD", label: "100 KLD (Base Production)", desc: "Standard capacity" },
                  { value: "150 KLD", label: "150 KLD (Peak Utility)", desc: "Maximum capacity" }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSelectedFigure(item.value as any)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedFigure === item.value
                        ? "bg-teal-50 border-teal-600 ring-2 ring-teal-500/20 shadow-xs"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{item.label}</span>
                      {selectedFigure === item.value && <CheckCircle2 className="h-4 w-4 text-teal-600" />}
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes to officer */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">Explanation for the officer (Optional):</label>
              <textarea
                rows={2}
                value={applicantNotes}
                onChange={(e) => setApplicantNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500 resize-none"
              />
            </div>

            {/* Need help explanation */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
              <span className="text-[11px]">Need help understanding this question?</span>
              {onAskCopilot && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onAskCopilot("Explain the water usage clarification from the Pollution Control Board in simple terms.");
                  }}
                  className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Bot className="h-3.5 w-3.5" />
                  <span>Explain this to me</span>
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Sending Response...</span>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Response to Government</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">Clarification Sent Successfully</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your confirmation ({selectedFigure}) was transmitted to the Pollution Control Board. Your application review will now resume.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
