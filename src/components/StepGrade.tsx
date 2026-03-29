"use client";

import { GRADES } from "@/lib/types";
import StepWrapper from "./StepWrapper";

interface StepGradeProps {
  value: string;
  onChange: (grade: string) => void;
  onNext: () => void;
}

export default function StepGrade({ value, onChange, onNext }: StepGradeProps) {
  return (
    <StepWrapper
      onNext={onNext}
      ctaText="Nästa"
      ctaDisabled={!value}
      showBack={false}
      showCta={!!value}
    >
      <h2 className="text-2xl font-bold text-text-primary mb-6 mt-2">
        Vilken årskurs går eleven i?
      </h2>

      <div className="flex flex-wrap gap-2">
        {GRADES.map((grade) => {
          const selected = value === grade;
          return (
            <button
              key={grade}
              type="button"
              onClick={() => onChange(grade)}
              className={`px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 min-h-[48px] border ${
                selected
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-text-primary border-border hover:border-primary/40"
              }`}
            >
              {grade}
            </button>
          );
        })}
      </div>
    </StepWrapper>
  );
}
