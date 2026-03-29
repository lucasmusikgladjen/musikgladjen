"use client";

import { PRICE_TABLE } from "@/lib/types";
import StepWrapper from "./StepWrapper";

interface StepPricingProps {
  frequency: "weekly" | "biweekly";
  lessonLength: "45-60" | "90" | "120";
  startPreference: "asap" | "within_month" | "next_term";
  onFrequencyChange: (v: "weekly" | "biweekly") => void;
  onLessonLengthChange: (v: "45-60" | "90" | "120") => void;
  onStartPreferenceChange: (v: "asap" | "within_month" | "next_term") => void;
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
  onFrequencyChange,
  onLessonLengthChange,
  onStartPreferenceChange,
  onSubmit,
  onBack,
  isSubmitting,
  submitError,
}: StepPricingProps) {
  const price = PRICE_TABLE[lessonLength]?.[frequency] ?? 0;

  return (
    <StepWrapper
      onBack={onBack}
      onNext={onSubmit}
      ctaText="Skicka anmälan"
      ctaLoading={isSubmitting}
      subtext="Anmälan är inte bindande. Vi hör av oss inom 24 timmar."
    >
      <h2 className="text-2xl font-bold text-text-primary mb-5 mt-2">
        Välj ert upplägg
      </h2>

      {/* Frequency */}
      <div className="mb-5">
        <p className="text-sm font-medium text-text-primary mb-2">Hur ofta?</p>
        <div className="grid grid-cols-2 gap-2">
          {(["weekly", "biweekly"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onFrequencyChange(v)}
              className={`py-3.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 min-h-[48px] border ${
                frequency === v
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-text-primary border-border hover:border-primary/40"
              }`}
            >
              {v === "weekly" ? "Varje vecka" : "Varannan vecka"}
            </button>
          ))}
        </div>
      </div>

      {/* Lesson length */}
      <div className="mb-5">
        <p className="text-sm font-medium text-text-primary mb-2">
          Hur långa lektioner?
        </p>
        <div className="grid grid-cols-3 gap-2">
          {(["45-60", "90", "120"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onLessonLengthChange(v)}
              className={`py-3.5 px-2 rounded-xl text-sm font-medium transition-all duration-200 min-h-[48px] border ${
                lessonLength === v
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-text-primary border-border hover:border-primary/40"
              }`}
            >
              {getLessonLabel(v)}
            </button>
          ))}
        </div>
      </div>

      {/* Start preference */}
      <div className="mb-6">
        <p className="text-sm font-medium text-text-primary mb-2">
          När vill ni börja?
        </p>
        <div className="grid grid-cols-3 gap-2">
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
                className={`py-3.5 px-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 min-h-[48px] border ${
                  startPreference === v
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-text-primary border-border hover:border-primary/40"
                }`}
              >
                {labels[v]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price display */}
      <div className="bg-bg-secondary rounded-2xl p-5 text-center mb-6">
        <p className="text-sm text-text-secondary mb-1">Ert månadspris</p>
        <p className="text-3xl font-bold text-text-primary price-transition">
          {formatPrice(price)} kr/mån
        </p>
        <p className="text-sm text-text-secondary mt-1">
          {getLessonLabel(lessonLength)} · {getFrequencyLabel(frequency)}
        </p>
        <p className="text-xs text-text-secondary mt-0.5">
          Ingen bindningstid
        </p>
      </div>

      {/* Objection handling */}
      <div className="bg-bg-accent rounded-2xl p-5 space-y-4 mb-4">
        <div>
          <p className="font-semibold text-sm text-text-primary">
            {"\u{1F3E0}"} Vi kommer hem till er
          </p>
          <p className="text-sm text-text-secondary mt-0.5">
            Läraren håller lektionen hemma hos er, på en tid som passar. Ni
            slipper skjutsa, vänta och stressa.
          </p>
        </div>
        <div>
          <p className="font-semibold text-sm text-text-primary">
            {"\u{1F393}"} Personlig matchning
          </p>
          <p className="text-sm text-text-secondary mt-0.5">
            Ni matchas med en lärare som passar elevens ålder, instrument och
            personlighet.
          </p>
        </div>
        <div>
          <p className="font-semibold text-sm text-text-primary">
            {"\u{1F4C5}"} Ingen bindningstid
          </p>
          <p className="text-sm text-text-secondary mt-0.5">
            Avsluta när ni vill. Vi tror på att ni stannar för att ni vill.
          </p>
        </div>
        <div>
          <p className="font-semibold text-sm text-text-primary">
            {"\u2B50"} Unga, engagerade lärare
          </p>
          <p className="text-sm text-text-secondary mt-0.5">
            Våra lärare är musikstuderande och unga musiker som brinner för att
            lära ut.
          </p>
        </div>
        <div>
          <p className="font-semibold text-sm text-text-primary">
            {"\u{1F4B3}"} Enkel betalning
          </p>
          <p className="text-sm text-text-secondary mt-0.5">
            Betalning sker smidigt varje månad.
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
