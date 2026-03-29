"use client";

import { useFormContext } from "react-hook-form";
import { EXPECTATIONS, type FormData } from "@/lib/schema";

export default function StepExpectations({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const { setValue, watch } = useFormContext<FormData>();
  const selected = watch("expectations") || [];

  function toggle(exp: string) {
    const updated = selected.includes(exp)
      ? selected.filter((s) => s !== exp)
      : [...selected, exp];
    setValue("expectations", updated);
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-6">
        Vad hoppas ni få ut av lektionerna?
      </h2>

      <div className="space-y-3 mb-8">
        {EXPECTATIONS.map((exp) => (
          <label
            key={exp}
            className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              selected.includes(exp)
                ? "bg-accent-soft border-primary"
                : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(exp)}
              onChange={() => toggle(exp)}
              className="mt-0.5 h-5 w-5 rounded border-gray-300 text-primary accent-primary flex-shrink-0"
            />
            <span className="text-base">{exp}</span>
          </label>
        ))}
      </div>

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
          onClick={onNext}
          className="bg-primary text-white px-8 py-3 rounded-lg font-semibold text-base hover:bg-primary-hover transition min-h-[44px] cursor-pointer"
        >
          Nästa steg: fyll i dina uppgifter
        </button>
      </div>
    </div>
  );
}
