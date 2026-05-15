"use client";

import StepWrapper from "./StepWrapper";
import { JOB_MOTIVATIONS } from "@/lib/job-types";

interface JobStepMotivationsProps {
  motivations: string[];
  onMotivationsChange: (value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function JobStepMotivations({
  motivations,
  onMotivationsChange,
  onNext,
  onBack,
}: JobStepMotivationsProps) {
  const toggle = (m: string) => {
    if (motivations.includes(m)) {
      onMotivationsChange(motivations.filter((v) => v !== m));
    } else {
      onMotivationsChange([...motivations, m]);
    }
  };

  return (
    <StepWrapper
      onBack={onBack}
      onNext={onNext}
      ctaText="Nästa"
    >
      <h2 className="text-2xl font-bold text-text-primary mb-6 mt-2">
        Vad vill du få ut av jobbet?
      </h2>

      <div className="flex flex-col gap-2">
        {JOB_MOTIVATIONS.map((m) => {
          const selected = motivations.includes(m);
          return (
            <button
              key={m}
              type="button"
              onClick={() => toggle(m)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 border ${
                selected
                  ? "bg-accent-soft border-primary text-primary"
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
    </StepWrapper>
  );
}
