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
      <h2 className="text-xl font-bold text-text-primary mb-4 mt-2">
        Välj ert upplägg
      </h2>

      {/* Frequency */}
      <div className="mb-4">
        <p className="text-xs font-medium text-text-primary mb-1.5">Hur ofta?</p>
        <div className="grid grid-cols-2 gap-2">
          {(["weekly", "biweekly"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onFrequencyChange(v)}
              className={`py-3 px-3 rounded-xl text-sm font-medium transition-all duration-200 min-h-[48px] border-2 ${
                frequency === v
                  ? "bg-accent-soft border-primary text-primary ring-1 ring-primary"
                  : "bg-bg-white text-text-primary border-gray-200 hover:border-primary/40 hover:bg-accent-soft/50"
              }`}
            >
              {v === "weekly" ? "Varje vecka" : "Varannan vecka"}
            </button>
          ))}
        </div>
      </div>

      {/* Lesson length + Start preference side by side */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-xs font-medium text-text-primary mb-1.5">Lektionslängd</p>
          <div className="space-y-1.5">
            {(["45-60", "90", "120"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onLessonLengthChange(v)}
                className={`w-full py-2.5 px-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                  lessonLength === v
                    ? "bg-accent-soft border-primary text-primary ring-1 ring-primary"
                    : "bg-bg-white text-text-primary border-gray-200 hover:border-primary/40 hover:bg-accent-soft/50"
                }`}
              >
                {getLessonLabel(v)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-text-primary mb-1.5">När börja?</p>
          <div className="space-y-1.5">
            {(["asap", "within_month", "next_term"] as const).map((v) => {
              const labels: Record<string, string> = {
                asap: "Så snart som möjligt",
                within_month: "Inom en månad",
                next_term: "Nästa termin",
              };
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => onStartPreferenceChange(v)}
                  className={`w-full py-2.5 px-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border-2 ${
                    startPreference === v
                      ? "bg-accent-soft border-primary text-primary ring-1 ring-primary"
                      : "bg-bg-white text-text-primary border-gray-200 hover:border-primary/40 hover:bg-accent-soft/50"
                  }`}
                >
                  {labels[v]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Price display */}
      <div className="bg-bg-white rounded-2xl p-5 text-center mb-5 border-2 border-primary/20 shadow-sm">
        <p className="text-xs text-text-secondary mb-0.5">Ert månadspris</p>
        <p className="text-3xl font-bold text-text-primary price-transition">
          {formatPrice(price)} kr/mån
        </p>
        <p className="text-xs text-text-secondary mt-1">
          {getLessonLabel(lessonLength)} · {getFrequencyLabel(frequency)}
        </p>
        <p className="text-xs text-success font-medium mt-0.5">
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
