"use client";

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
    >
      <h2 className="text-xl font-bold text-text-primary mb-4 mt-2">Välj ert upplägg</h2>

      {/* Calculator card */}
      <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5">

        {/* Hur ofta */}
        <div className="p-4 border-b border-gray-100">
          <p className={sectionLabel}>Hur ofta?</p>
          <div className="flex rounded-full overflow-hidden border border-[#8B1A00]">
            <div className="flex-1 bg-[#8B1A00] text-white flex items-center justify-center py-3 text-sm font-semibold">
              {getFrequencyLabel(frequency)}
            </div>
            <div className="relative flex-shrink-0">
              <button type="button" className="h-full px-5 bg-white flex items-center gap-1.5 text-sm font-semibold text-text-primary border-l border-[#8B1A00]/20">
                Välj
                <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <select
                value={frequency}
                onChange={(e) => onFrequencyChange(e.target.value as "weekly" | "biweekly")}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              >
                <option value="weekly">Varje vecka</option>
                <option value="biweekly">Varannan vecka</option>
              </select>
            </div>
          </div>
        </div>

        {/* Hur långa lektioner */}
        <div className="p-4 border-b border-gray-100">
          <p className={sectionLabel}>Hur långa lektioner?</p>
          <div className="flex gap-2">
            {(["45-60", "90", "120"] as const).map((v) => {
              const selected = lessonLength === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => onLessonLengthChange(v)}
                  className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 min-h-[44px] ${
                    selected
                      ? "bg-[#8B1A00] text-white shadow-sm"
                      : "bg-white text-gray-500 border border-gray-200 hover:border-[#8B1A00]/30"
                  }`}
                >
                  {getLessonLabel(v)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price */}
        <div className="px-5 py-6 text-center bg-[#fdf7f5]">
          <p className="text-5xl font-extrabold text-text-primary tracking-tight">
            {formatPrice(price)} <span className="text-xl font-semibold text-text-secondary">kr/mån</span>
          </p>
          <p className="flex items-center justify-center gap-1.5 text-sm text-text-secondary mt-2 flex-wrap">
            <span>{getLessonLabel(lessonLength)}</span>
            <span>·</span>
            <span>{getFrequencyLabel(frequency)}</span>
            <span>·</span>
            <span className="text-success font-semibold flex items-center gap-0.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Ingen bindningstid
            </span>
          </p>
        </div>

      </div>

      {/* Next steps */}
      <div className="mt-2 pt-4 border-t border-gray-100 mb-4 flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold text-text-secondary mb-0.5">Vad händer när du skickat in?</p>
          <p className="text-sm text-text-secondary leading-relaxed">
            Vi hör av oss så snart vi gått igenom er anmälan och börjar leta efter en passande lärare.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-text-secondary mb-0.5">Första lektionen</p>
          <p className="text-sm text-text-secondary leading-relaxed">
            Ni bokar tillsammans in en första lektion och fortsätter bara om det känns rätt.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-text-secondary mb-0.5">Frågor?</p>
          <p className="text-sm text-text-secondary leading-relaxed">
            Hör gärna av dig till mig på{" "}
            <a href="mailto:hej@musikgladjen.se" className="text-primary underline-offset-2 hover:underline">
              hej@musikgladjen.se
            </a>
            {" "}så hjälper vi dig.
          </p>
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
