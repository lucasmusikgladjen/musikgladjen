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
    case "45-60":
      return "45–60 min";
    case "90":
      return "90 min";
    case "120":
      return "120 min";
    default:
      return length;
  }
}

function getFrequencyLabel(freq: string): string {
  return freq === "weekly" ? "Varje vecka" : "Varannan vecka";
}

function PillButton({
  selected,
  onClick,
  children,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative py-3 px-4 rounded-full text-sm font-semibold transition-all duration-200 min-h-[44px] ${
        selected
          ? "bg-gradient-to-b from-[#e8501a] to-[#da3111] text-white shadow-md shadow-primary/25"
          : "bg-bg-white text-text-primary border border-gray-200 hover:border-primary/30 hover:shadow-sm"
      } ${className}`}
    >
      {children}
    </button>
  );
}

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

      {/* Frequency */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-text-primary mb-2.5">Hur ofta?</p>
        <div className="flex gap-2">
          <PillButton
            selected={frequency === "weekly"}
            onClick={() => onFrequencyChange("weekly")}
            className="flex-1"
          >
            Varje vecka
          </PillButton>
          <PillButton
            selected={frequency === "biweekly"}
            onClick={() => onFrequencyChange("biweekly")}
            className="flex-1"
          >
            Varannan vecka
          </PillButton>
        </div>
      </div>

      {/* Lesson length */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-text-primary mb-2.5">Hur långa lektioner?</p>
        <div className="flex gap-2">
          {(["45-60", "90", "120"] as const).map((v) => (
            <PillButton
              key={v}
              selected={lessonLength === v}
              onClick={() => onLessonLengthChange(v)}
              className="flex-1"
            >
              {getLessonLabel(v)}
            </PillButton>
          ))}
        </div>
      </div>

      {/* Start preference */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-text-primary mb-2.5">När vill ni börja?</p>
        <div className="flex gap-2">
          {(["asap", "within_month", "next_term"] as const).map((v) => {
            const labels: Record<string, string> = {
              asap: "Direkt",
              within_month: "Inom en månad",
              next_term: "Nästa termin",
            };
            return (
              <PillButton
                key={v}
                selected={startPreference === v}
                onClick={() => onStartPreferenceChange(v)}
                className="flex-1"
              >
                {labels[v]}
              </PillButton>
            );
          })}
        </div>
      </div>

      {/* Price display */}
      <div className="bg-gradient-to-br from-white to-[#fef8f6] rounded-2xl p-6 text-center mb-5 border border-primary/15 shadow-sm">
        <p className="text-xs text-text-secondary mb-1 uppercase tracking-wide">Ert månadspris</p>
        <p className="text-4xl font-extrabold text-text-primary price-transition">
          {formatPrice(price)} <span className="text-lg font-semibold text-text-secondary">kr/mån</span>
        </p>
        <p className="text-sm text-text-secondary mt-2">
          {getLessonLabel(lessonLength)} · {getFrequencyLabel(frequency)}
        </p>
        <p className="text-xs text-success font-semibold mt-1">
          ✓ Ingen bindningstid
        </p>
      </div>

      {/* Expectations / objection handling */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-text-primary mb-2">
          Vad hoppas ni få ut av undervisningen?
          <span className="text-text-secondary font-normal text-xs ml-1">(frivilligt)</span>
        </p>
        <div className="space-y-2">
          {EXPECTATIONS.map((exp) => (
            <label
              key={exp}
              className={`flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer transition-all duration-150 border ${
                expectations.includes(exp)
                  ? "bg-accent-soft border-primary/20"
                  : "bg-transparent border-transparent hover:bg-accent-soft/50"
              }`}
            >
              <input
                type="checkbox"
                checked={expectations.includes(exp)}
                onChange={() => toggleExpectation(exp)}
                className="h-4 w-4 rounded border-gray-300 text-primary accent-primary flex-shrink-0"
              />
              <span className="text-sm text-text-primary">{exp}</span>
            </label>
          ))}
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
