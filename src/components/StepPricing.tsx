"use client";

import { useFormContext } from "react-hook-form";
import {
  PRICE_TABLE,
  LESSON_LENGTH_LABELS,
  FREQUENCY_LABELS,
  type FormData,
} from "@/lib/schema";

export default function StepPricing({
  onBack,
  onSubmit,
  isSubmitting,
}: {
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const { setValue, watch } = useFormContext<FormData>();
  const frequency = watch("frequency");
  const lessonLength = watch("lessonLength");
  const startPreference = watch("startPreference");

  const price = PRICE_TABLE[lessonLength]?.[frequency] ?? 0;

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-8">Välj ert upplägg</h2>

      {/* Frequency */}
      <div className="mb-6">
        <p className="text-sm font-medium mb-2">Hur ofta?</p>
        <div className="grid grid-cols-2 gap-3">
          {(["weekly", "biweekly"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setValue("frequency", f)}
              className={`p-4 rounded-xl border-2 font-medium transition-all duration-200 cursor-pointer min-h-[44px] ${
                frequency === f
                  ? "bg-accent-soft border-primary text-primary"
                  : "bg-white border-gray-200 hover:border-primary"
              }`}
            >
              {FREQUENCY_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Lesson length */}
      <div className="mb-6">
        <p className="text-sm font-medium mb-2">Hur långa lektioner?</p>
        <div className="flex flex-wrap gap-3">
          {(["45-60", "90", "120"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setValue("lessonLength", l)}
              className={`px-5 py-3 rounded-full border-2 font-medium transition-all duration-200 cursor-pointer min-h-[44px] ${
                lessonLength === l
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-gray-200 hover:border-primary"
              }`}
            >
              {LESSON_LENGTH_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      {/* Start date */}
      <div className="mb-8">
        <p className="text-sm font-medium mb-2">När vill ni börja?</p>
        <div className="flex flex-wrap gap-3">
          {(
            [
              { value: "asap", label: "Så snart som möjligt" },
              { value: "within_month", label: "Inom en månad" },
              { value: "next_term", label: "Nästa termin" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setValue("startPreference", opt.value)}
              className={`px-5 py-3 rounded-full border-2 font-medium transition-all duration-200 cursor-pointer min-h-[44px] ${
                startPreference === opt.value
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-gray-200 hover:border-primary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price display */}
      <div className="bg-bg-secondary rounded-2xl p-6 text-center mb-8">
        <p className="text-text-secondary text-sm mb-1">Ert månadspris</p>
        <p className="text-4xl font-bold text-text-primary price-animate">
          {price.toLocaleString("sv-SE")} kr/mån
        </p>
        <p className="text-text-secondary text-sm mt-2">
          {LESSON_LENGTH_LABELS[lessonLength]} &middot;{" "}
          {FREQUENCY_LABELS[frequency]}
        </p>
        <p className="text-text-secondary text-sm mt-1">Ingen bindningstid</p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="flex items-start gap-3 p-4 bg-bg-secondary rounded-xl">
          <span className="text-xl">🏠</span>
          <div>
            <p className="font-semibold text-sm">Vi kommer hem till er</p>
            <p className="text-text-secondary text-sm">
              Läraren håller lektionen hemma hos er, på en tid som passar.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 bg-bg-secondary rounded-xl">
          <span className="text-xl">🎓</span>
          <div>
            <p className="font-semibold text-sm">Personlig lärare</p>
            <p className="text-text-secondary text-sm">
              Ni matchas med en lärare som passar elevens ålder och instrument.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 bg-bg-secondary rounded-xl">
          <span className="text-xl">📅</span>
          <div>
            <p className="font-semibold text-sm">Ingen bindningstid</p>
            <p className="text-text-secondary text-sm">
              Avsluta när ni vill. Vi tror på att ni stannar för att ni vill.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 bg-bg-secondary rounded-xl">
          <span className="text-xl">💳</span>
          <div>
            <p className="font-semibold text-sm">Betalning</p>
            <p className="text-text-secondary text-sm">
              Enkel månadsbetalning via faktura.
            </p>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-text-secondary hover:text-text-primary transition cursor-pointer"
        >
          Tillbaka
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-primary text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-primary-hover transition disabled:opacity-70 disabled:cursor-not-allowed min-h-[44px] cursor-pointer flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Skickar...
            </>
          ) : (
            "Skicka anmälan"
          )}
        </button>
      </div>
      <p className="text-center text-text-secondary text-xs mt-3">
        Anmälan är inte bindande. Vi hör av oss inom 24 timmar.
      </p>
    </div>
  );
}
