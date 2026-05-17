"use client";

import { useEffect, useRef, useState } from "react";
import { PRICE_TABLE, EXPECTATIONS } from "@/lib/types";
import StepWrapper from "./StepWrapper";

interface StepPricingProps {
  frequency: "weekly" | "biweekly";
  lessonLength: "45-60" | "90" | "120";
  startPreference: "asap" | "within_month" | "next_term";
  expectations: string[];
  onFrequencyChange: (v: "weekly" | "biweekly") => void;
  onLessonLengthChange: (v: "45-60" | "90" | "120") => void;
  onStartPreferenceChange: (v: "asap" | "within_month" | "next_term") => void;
  onExpectationsChange: (v: string[]) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}

function formatPrice(price: number): string {
  return price.toLocaleString("sv-SE");
}

function getLessonLabel(length: string): string {
  switch (length) {
    case "45-60": return "45–60 min";
    case "90": return "90 min";
    case "120": return "120 min";
    default: return length;
  }
}

function getFrequencyLabel(freq: string): string {
  return freq === "weekly" ? "Varje vecka" : "Varannan vecka";
}

const sectionLabel = "text-sm font-semibold text-text-primary mb-2.5";

export default function StepPricing({
  frequency,
  lessonLength,
  startPreference,
  expectations,
  onFrequencyChange,
  onLessonLengthChange,
  onStartPreferenceChange,
  onExpectationsChange,
  onSubmit,
  onBack,
  isSubmitting,
  submitError,
}: StepPricingProps) {
  const price = PRICE_TABLE[lessonLength]?.[frequency] ?? 0;
  const [freqOpen, setFreqOpen] = useState(false);
  const freqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!freqOpen) return;
    const handler = (e: MouseEvent) => {
      if (freqRef.current && !freqRef.current.contains(e.target as Node)) {
        setFreqOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [freqOpen]);

  const toggleExpectation = (exp: string) => {
    if (expectations.includes(exp)) {
      onExpectationsChange(expectations.filter((e) => e !== exp));
    } else {
      onExpectationsChange([...expectations, exp]);
    }
  };

  return (
    <StepWrapper
      onBack={onBack}
      onNext={onSubmit}
      ctaText="Skicka anmälan"
      ctaLoading={isSubmitting}
      gaStep="pricing"
    >
      {/* Calculator card */}
      <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5">

        <div className="px-4 pt-4 pb-2">
          <h2 className="text-xl font-bold text-text-primary">Välj ert upplägg</h2>
        </div>

        {/* Hur ofta */}
        <div className="p-4 border-b border-gray-100">
          <p className={sectionLabel}>Hur ofta?</p>
          <div ref={freqRef} className="relative">
            <div className="flex items-center rounded-full border border-gray-200 bg-white p-1 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="flex-1 bg-[#8B1A00] text-white rounded-full py-2.5 px-5 text-center text-sm font-semibold">
                {getFrequencyLabel(frequency)}
              </div>
              <button
                type="button"
                onClick={() => setFreqOpen((o) => !o)}
                className="flex-shrink-0 px-4 py-2 bg-white rounded-full text-sm font-semibold text-gray-500 flex items-center gap-1.5"
              >
                Välj
                <svg
                  className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${freqOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <div className={`absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden z-10 transition-all duration-200 origin-top-right ${freqOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"}`}>{/* always rendered for CSS transition */}
                {(["weekly", "biweekly"] as const).map((v, i) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => { onFrequencyChange(v); setFreqOpen(false); }}
                    data-ga-item-type="frequency"
                    data-ga-item-value={v}
                    className={`w-full px-5 py-3.5 text-left text-sm flex items-center justify-between transition-colors ${
                      frequency === v ? "text-[#8B1A00]" : "text-text-primary hover:bg-gray-50"
                    } ${i > 0 ? "border-t border-gray-100" : ""}`}
                  >
                    {getFrequencyLabel(v)}
                    {frequency === v && (
                      <svg className="w-4 h-4 text-[#8B1A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
          </div>
        </div>

        {/* Hur långa lektioner */}
        <div className="p-4 border-b border-gray-100">
          <p className={sectionLabel}>Lektionslängd</p>
          <div className="flex gap-1 rounded-full border border-gray-200 bg-white p-1 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            {(["45-60", "90", "120"] as const).map((v) => {
              const selected = lessonLength === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => onLessonLengthChange(v)}
                  data-ga-item-type="lesson_length"
                  data-ga-item-value={v}
                  className={`flex-1 py-2.5 rounded-full text-sm font-semibold min-h-[44px] transition-colors duration-150 ${
                    selected
                      ? "bg-[#8B1A00] text-white"
                      : "bg-white text-gray-500"
                  }`}
                >
                  {getLessonLabel(v)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price */}
        <div className="px-5 py-6 text-center">
          <p className="text-5xl font-extrabold text-text-primary tracking-tight">
            {formatPrice(price)} <span className="text-xl font-semibold text-text-secondary">kr/mån</span>
          </p>
          <p className="text-sm text-text-secondary mt-2">
            {getLessonLabel(lessonLength)} · {getFrequencyLabel(frequency)}
          </p>
          <p className="flex items-center justify-center gap-1 text-sm text-text-secondary mt-0.5">
            <svg className="w-3.5 h-3.5 text-text-secondary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Ingen bindningstid
          </p>
        </div>

      </div>

      {/* Next steps */}
      <div className="mt-2 pt-4 border-t border-gray-100 mb-4 flex flex-col gap-4">
        <div className="flex gap-3">
          <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-text-secondary mb-0.5">Vad händer när du skickat in?</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Vi hör av oss så snart vi gått igenom er anmälan och börjar leta efter en passande lärare.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-text-secondary mb-0.5">Första lektionen</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Ni bokar tillsammans in en första lektion och fortsätter bara om det känns rätt.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-text-secondary mb-0.5">Frågor?</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Hör gärna av dig på{" "}
              <a href="tel:+46760223451" className="text-text-secondary underline-offset-2 hover:underline">
                076-022 34 51
              </a>
              {" "}eller{" "}
              <a href="mailto:hej@musikgladjen.se" className="text-text-secondary underline-offset-2 hover:underline">
                hej@musikgladjen.se
              </a>
              {" "}så hjälper vi dig.
            </p>
          </div>
        </div>
      </div>

      {submitError && (
        <div className="bg-red-50 border border-error/20 rounded-xl p-4 mb-4">
          <p className="text-error text-sm">{submitError}</p>
          <button
            type="button"
            onClick={onSubmit}
            className="text-primary text-sm font-medium mt-1 hover:underline"
          >
            Försök igen
          </button>
        </div>
      )}
    </StepWrapper>
  );
}
