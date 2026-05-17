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
      subtext="Anmälan är inte bindande. Vi hör av oss inom kort."
    >
      <h2 className="text-xl font-bold text-text-primary mb-5 mt-2">
        Välj ert upplägg
      </h2>

      {/* Hur ofta — split button */}
      <div className="mb-5">
        <p className={sectionLabel}>Hur ofta?</p>
        <div className="flex rounded-xl overflow-hidden shadow-md shadow-primary/20 border border-primary">
          <div className="flex-1 py-3 px-4 bg-[#8B1A00] text-white text-center text-sm font-semibold flex items-center justify-center">
            {getFrequencyLabel(frequency)}
          </div>
          <div className="relative flex-shrink-0 border-l border-white/30">
            <button
              type="button"
              className="h-full px-4 bg-bg-white text-text-primary text-sm font-medium flex items-center gap-1.5"
            >
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

      {/* Hur långa lektioner — pill toggles */}
      <div className="mb-5">
        <p className={sectionLabel}>Hur långa lektioner?</p>
        <div className="flex gap-2">
          {(["45-60", "90", "120"] as const).map((v) => {
            const selected = lessonLength === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => onLessonLengthChange(v)}
                className={`flex-1 py-3 px-2 rounded-xl text-sm font-semibold transition-all duration-200 min-h-[44px] ${
                  selected
                    ? "bg-[#8B1A00] text-white shadow-md shadow-black/20"
                    : "bg-bg-white text-text-primary border border-gray-200 hover:border-primary/30"
                }`}
              >
                {getLessonLabel(v)}
              </button>
            );
          })}
        </div>
      </div>

      {/* När vill ni börja — split button */}
      <div className="mb-6">
        <p className={sectionLabel}>När vill ni börja?</p>
        <div className="flex rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-gray-200">
          <div className="flex-1 py-3 px-4 bg-bg-white text-text-primary text-sm font-semibold flex items-center">
            {{ asap: "Så snart som möjligt", within_month: "Inom en månad", next_term: "Nästa termin" }[startPreference]}
          </div>
          <div className="relative flex-shrink-0 border-l border-gray-200">
            <button
              type="button"
              className="h-full px-4 bg-bg-white text-text-primary text-sm font-medium flex items-center gap-1.5"
            >
              Välj
              <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <select
              value={startPreference}
              onChange={(e) => onStartPreferenceChange(e.target.value as "asap" | "within_month" | "next_term")}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            >
              <option value="asap">Så snart som möjligt</option>
              <option value="within_month">Inom en månad</option>
              <option value="next_term">Nästa termin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Price display */}
      <div className="bg-gradient-to-br from-white to-[#fef8f6] rounded-2xl p-6 text-center mb-5 border border-primary/15 shadow-sm">
        <p className="text-xs text-text-secondary mb-1 uppercase tracking-wide">Ert månadspris</p>
        <p className="text-4xl font-extrabold text-text-primary">
          {formatPrice(price)} <span className="text-lg font-semibold text-text-secondary">kr/mån</span>
        </p>
        <p className="text-sm text-text-secondary mt-2">
          {getLessonLabel(lessonLength)} · {getFrequencyLabel(frequency)}
        </p>
        <p className="flex items-center justify-center gap-1 text-xs text-success font-semibold mt-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Ingen bindningstid
        </p>
      </div>

      {/* Next steps */}
      <div className="mt-2 pt-5 border-t border-gray-100 mb-4">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary mb-0.5">
          <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Vad händer när du skickat?
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          Vi hör av oss så snart vi gått igenom er anmälan och börjar leta efter en passande lärare. Ni bokar tillsammans in en första lektion och fortsätter bara om det känns rätt!
        </p>
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
