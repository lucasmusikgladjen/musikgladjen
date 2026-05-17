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
      subtext="Anmälan är inte bindande. Vi hör av oss inom 24 timmar."
    >
      <h2 className="text-xl font-bold text-text-primary mb-5 mt-2">
        Välj ert upplägg
      </h2>

      {/* Hur ofta — wide display + Välj dropdown */}
      <div className="mb-5">
        <p className={sectionLabel}>Hur ofta?</p>
        <div className="flex gap-2 items-center">
          <div className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-b from-[#e8501a] to-[#da3111] text-white text-center text-sm font-semibold shadow-md shadow-primary/20">
            {getFrequencyLabel(frequency)}
          </div>
          <div className="relative flex-shrink-0">
            <button
              type="button"
              className="flex items-center gap-1.5 py-3 px-4 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] text-sm font-medium text-text-primary bg-bg-white"
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
                className={`flex-1 py-3 px-2 rounded-full text-sm font-semibold transition-all duration-200 min-h-[44px] ${
                  selected
                    ? "bg-gradient-to-b from-[#e8501a] to-[#da3111] text-white shadow-md shadow-primary/25"
                    : "bg-bg-white text-text-primary border border-gray-200 hover:border-primary/30"
                }`}
              >
                {getLessonLabel(v)}
              </button>
            );
          })}
        </div>
      </div>

      {/* När vill ni börja — dropdown */}
      <div className="mb-6">
        <p className={sectionLabel}>När vill ni börja?</p>
        <div className="relative">
          <select
            value={startPreference}
            onChange={(e) => onStartPreferenceChange(e.target.value as "asap" | "within_month" | "next_term")}
            className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none text-base bg-bg-white text-text-primary focus:border-primary transition-colors appearance-none"
          >
            <option value="asap">Så snart som möjligt</option>
            <option value="within_month">Inom en månad</option>
            <option value="next_term">Nästa termin</option>
          </select>
          <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
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
      <div className="mb-4 pt-2">
        <p className="text-sm font-semibold text-text-primary mb-1">Vad händer när du skickat?</p>
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
