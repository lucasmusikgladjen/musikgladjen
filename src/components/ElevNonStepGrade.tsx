"use client";

import StepWrapper from "./StepWrapper";

interface ElevNonStepGradeProps {
  name: string;
  onNameChange: (name: string) => void;
  grade: string;
  onGradeChange: (grade: string) => void;
  onNext: () => void;
  onBack?: () => void;
  showBack?: boolean;
  childIndex: number;
}

const GRADES_WITH_EMOJI = [
  { grade: "Förskola", emoji: "🧸" },
  { grade: "Lågstadiet", emoji: "🎒" },
  { grade: "Mellanstadiet", emoji: "📚" },
  { grade: "Högstadiet", emoji: "📐" },
  { grade: "Äldre", emoji: "🎓" },
];

export default function ElevNonStepGrade({
  name,
  onNameChange,
  grade,
  onGradeChange,
  onNext,
  onBack,
  showBack = false,
  childIndex,
}: ElevNonStepGradeProps) {
  const canProceed = name.trim().length >= 1 && grade !== "";
  const displayName = name.trim() || "eleven";
  const isFirstChild = childIndex === 0;

  return (
    <StepWrapper
      onNext={onNext}
      ctaText="Nästa"
      ctaDisabled={!canProceed}
      showBack={showBack}
      onBack={onBack}
    >
      {isFirstChild ? (
        <div className="flex items-start gap-3 bg-bg-white rounded-xl p-4 mb-6 border border-gray-100 shadow-sm animate-fade-in-up">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-xl">
            👋
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Hej och välkommen!</p>
            <p className="text-sm text-text-secondary mt-0.5">
              Vi kopplar ihop ert barn med en personlig musiklärare som kommer hem till er. Svara
              på några snabba frågor så hittar vi rätt matchning!
            </p>
          </div>
        </div>
      ) : (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-5">
          <span>Barn {childIndex + 1}</span>
        </div>
      )}

      <div className="mb-5">
        <label htmlFor="childName" className="block text-2xl font-bold text-text-primary mb-3">
          {isFirstChild ? "Vad heter eleven?" : `Vad heter barn ${childIndex + 1}?`}
        </label>
        <input
          id="childName"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Förnamn"
          autoComplete="off"
          maxLength={50}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none text-base bg-bg-white placeholder:text-gray-400 focus:border-primary transition-colors"
        />
      </div>

      <h2 className="text-2xl font-bold text-text-primary mb-4">
        Vilken årskurs går {displayName} i?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {GRADES_WITH_EMOJI.map(({ grade: g, emoji }) => {
          const selected = grade === g;
          return (
            <button
              key={g}
              type="button"
              onClick={() => onGradeChange(g)}
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
                {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
              <span className="text-xl flex-shrink-0">{emoji}</span>
              <span className="text-sm font-medium">{g}</span>
            </button>
          );
        })}
      </div>
    </StepWrapper>
  );
}
