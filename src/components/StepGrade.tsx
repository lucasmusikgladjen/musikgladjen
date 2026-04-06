"use client";

import { GRADES } from "@/lib/types";
import StepWrapper from "./StepWrapper";

interface StepGradeProps {
  value: string;
  onChange: (grade: string) => void;
  onNext: () => void;
}

export default function StepGrade({ value, onChange, onNext }: StepGradeProps) {
  const handleSelect = (grade: string) => {
    onChange(grade);
    setTimeout(onNext, 300);
  };

  return (
    <StepWrapper onNext={onNext} ctaText="Nästa" ctaDisabled={!value} showBack={false} showCta={false}>
      {/* Welcome message */}
      <div className="flex items-start gap-3 bg-bg-white rounded-xl p-4 mb-6 border border-gray-100 shadow-sm animate-fade-in-up">
        {/* PLACEHOLDER IMAGE: Vänligt foto på grundaren/en lärare — leende, ung, ca 25-30 år, håller en gitarr eller sitter vid piano */}
        <div className="w-12 h-12 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-xl">
          👋
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">
            Hej och välkommen!
          </p>
          <p className="text-sm text-text-secondary mt-0.5">
            Vi kopplar ihop ert barn med en personlig musiklärare som kommer hem
            till er. Svara på några snabba frågor så hittar vi rätt matchning!
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-text-primary mb-5">
        Vilken årskurs går eleven i?
      </h2>

      <div className="grid grid-cols-2 gap-2.5">
        {GRADES.map((grade) => {
          const selected = value === grade;
          return (
            <button
              key={grade}
              type="button"
              onClick={() => handleSelect(grade)}
              className={`py-4 px-4 rounded-xl text-base font-medium transition-all duration-200 min-h-[56px] border-2 text-left ${
                selected
                  ? "bg-accent-soft border-primary text-primary ring-1 ring-primary"
                  : "bg-bg-white text-text-primary border-gray-200 hover:border-primary/40 hover:bg-accent-soft/50"
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
