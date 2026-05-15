"use client";

import StepWrapper from "./StepWrapper";
import { JOB_STUDENT_COUNTS, JOB_MOTIVATIONS } from "@/lib/job-types";

interface JobStepJobDetailsProps {
  studentCount: string;
  areas: string;
  motivations: string[];
  onStudentCountChange: (value: string) => void;
  onAreasChange: (value: string) => void;
  onMotivationsChange: (value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function JobStepJobDetails({
  studentCount,
  areas,
  motivations,
  onStudentCountChange,
  onAreasChange,
  onMotivationsChange,
  onNext,
  onBack,
}: JobStepJobDetailsProps) {
  const toggleMotivation = (m: string) => {
    if (motivations.includes(m)) {
      onMotivationsChange(motivations.filter((v) => v !== m));
    } else {
      onMotivationsChange([...motivations, m]);
    }
  };

  const canProceed = studentCount !== "" && areas.trim() !== "";

  return (
    <StepWrapper
      onBack={onBack}
      onNext={onNext}
      ctaText="Nästa"
      ctaDisabled={!canProceed}
    >
      <h2 className="text-2xl font-bold text-text-primary mb-6 mt-2">Om jobbet</h2>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-text-primary mb-1">
          Hur många elever kan du tänka dig att ta?{" "}
          <span className="text-error">*</span>
        </label>
        <p className="text-xs text-text-secondary mb-3">
          De flesta har 1–2 elever, vilket brukar passa bra som ett extrajobb
          vid sidan av plugget.
        </p>
        <div className="flex flex-col gap-2">
          {JOB_STUDENT_COUNTS.map(({ value, label }) => {
            const selected = studentCount === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onStudentCountChange(value)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 border-2 ${
                  selected
                    ? "bg-accent-soft border-primary text-primary ring-1 ring-primary"
                    : "bg-bg-white border-gray-200 hover:border-primary/40 hover:bg-accent-soft/50 text-text-primary"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                    selected ? "border-primary" : "border-gray-300"
                  }`}
                >
                  {selected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-primary block" />
                  )}
                </span>
                <span className="text-sm font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="areas"
          className="block text-sm font-semibold text-text-primary mb-1"
        >
          I vilka områden kan du ta elever?{" "}
          <span className="text-error">*</span>
        </label>
        <p className="text-xs text-text-secondary mb-2">
          Skriv vilka områden eller stadsdelar du kan ta elever i. Fundera
          gärna på om du även kan ta elever längs vägen till eller från
          plugget.
        </p>
        <input
          id="areas"
          type="text"
          value={areas}
          onChange={(e) => onAreasChange(e.target.value)}
          placeholder="T.ex. Södermalm, Vasastan, längs T-bana grön linje..."
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-base bg-bg-white"
          maxLength={300}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-primary mb-3">
          Vad vill du få ut av det här jobbet?
        </label>
        <div className="flex flex-col gap-2">
          {JOB_MOTIVATIONS.map((m) => {
            const selected = motivations.includes(m);
            return (
              <button
                key={m}
                type="button"
                onClick={() => toggleMotivation(m)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 border-2 ${
                  selected
                    ? "bg-accent-soft border-primary text-primary ring-1 ring-primary"
                    : "bg-bg-white border-gray-200 hover:border-primary/40 hover:bg-accent-soft/50 text-text-primary"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                    selected ? "bg-primary border-primary" : "border-gray-300"
                  }`}
                >
                  {selected && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </span>
                <span className="text-sm font-medium">{m}</span>
              </button>
            );
          })}
        </div>
      </div>
    </StepWrapper>
  );
}
