"use client";

import StepWrapper from "./StepWrapper";

interface ElevNonStepGradeProps {
  grade: string;
  onGradeChange: (grade: string) => void;
  onNext: () => void;
}

const GRADES = ["Förskola", "Lågstadiet", "Mellanstadiet", "Högstadiet", "Äldre"];

export default function ElevNonStepGrade({
  grade,
  onGradeChange,
  onNext,
}: ElevNonStepGradeProps) {
  return (
    <StepWrapper onNext={onNext} ctaText="Nästa" showBack={false}>
      <div className="flex items-stretch gap-4 mb-4 pb-4 border-b border-gray-100">
        <img
          src="/loka.jpeg"
          alt="Loka"
          className="w-20 rounded-xl object-cover flex-shrink-0"
        />
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold text-text-secondary mb-0.5">Hej och välkommen!</p>
          <p className="text-sm text-text-secondary">
            Jag heter Loka och jobbar med att hitta rätt lärare till er. När du skickat in anmälan är det jag som hör av mig.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-text-primary mb-5">
        Vilken årskurs går eleven i?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {GRADES.map((g) => {
          const selected = grade === g;
          return (
            <button
              key={g}
              type="button"
              onClick={() => onGradeChange(g)}
              className={`flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all duration-200 border shadow-[0_1px_2px_rgba(0,0,0,0.04)] min-h-[56px] ${
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
                {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
              <span className="text-base font-medium">{g}</span>
            </button>
          );
        })}
      </div>
    </StepWrapper>
  );
}
