"use client";

import { useState } from "react";
import { GRADES } from "@/lib/types";
import StepWrapper from "./StepWrapper";

interface ElevNonStepGradeProps {
  value: string;
  onChange: (grade: string) => void;
  onNext: () => void;
}

const GRADE_EMOJIS: Record<string, string> = {
  Förskola: "🧸",
  Lågstadiet: "🎒",
  Mellanstadiet: "📚",
  Högstadiet: "📐",
  Äldre: "🎓",
};

export default function ElevNonStepGrade({ value, onChange, onNext }: ElevNonStepGradeProps) {
  const [otherText, setOtherText] = useState("");
  const isOther = value === "Äldre";

  const handleSelect = (grade: string) => {
    onChange(grade);
    if (grade !== "Äldre") {
      setOtherText("");
    }
  };

  return (
    <StepWrapper onNext={onNext} ctaText="Nästa" ctaDisabled={!value} showBack={false}>
      <div className="flex items-start gap-3 bg-bg-white rounded-xl p-4 mb-6 border border-gray-100 shadow-sm animate-fade-in-up">
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

      <div className="grid grid-cols-2 gap-2">
        {GRADES.map((grade) => {
          const selected = value === grade;
          return (
            <button
              key={grade}
              type="button"
              onClick={() => handleSelect(grade)}
              className={`flex items-center gap-2.5 px-3 py-3.5 rounded-xl text-left transition-all duration-200 border shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${
                selected
                  ? "bg-accent-soft border-primary text-primary"
                  : "bg-bg-white border-gray-200 hover:border-primary/40 hover:bg-accent-soft/50 text-text-primary"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                  selected ? "bg-primary border-primary" : "border-gray-300"
                }`}
              >
                {selected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </span>
              <span className="text-xl flex-shrink-0">{GRADE_EMOJIS[grade]}</span>
              <span className="text-sm font-medium">{grade}</span>
            </button>
          );
        })}
      </div>

      {isOther && (
        <div className="mt-4 animate-fade-in-up">
          <label htmlFor="gradeOther" className="block text-sm font-medium text-text-primary mb-1">
            Beskriv kort
          </label>
          <input
            id="gradeOther"
            type="text"
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            placeholder="T.ex. gymnasiet, vuxen..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none text-base bg-bg-white"
            maxLength={80}
          />
        </div>
      )}
    </StepWrapper>
  );
}
