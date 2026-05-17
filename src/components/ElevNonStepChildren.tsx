"use client";

import { Child } from "@/lib/elev-non-types";
import StepWrapper from "./StepWrapper";

interface ElevNonStepChildrenProps {
  children: Child[];
  onChange: (children: Child[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const GRADES_WITH_EMOJI = [
  { grade: "Förskola", emoji: "🧸" },
  { grade: "Lågstadiet", emoji: "🎒" },
  { grade: "Mellanstadiet", emoji: "📚" },
  { grade: "Högstadiet", emoji: "📐" },
  { grade: "Äldre", emoji: "🎓" },
];


interface ChildCardProps {
  child: Child;
  index: number;
  canRemove: boolean;
  onChange: (updates: Partial<Child>) => void;
  onRemove: () => void;
}

function ChildCard({ child, index, canRemove, onChange, onRemove }: ChildCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={child.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Förnamn"
          maxLength={50}
          className="flex-1 text-base font-medium text-text-primary bg-transparent outline-none placeholder:text-gray-400"
        />
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:text-error hover:bg-red-50 transition-colors flex-shrink-0"
            aria-label="Ta bort"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <input
        type="text"
        inputMode="numeric"
        value={child.birthYear}
        onChange={(e) => onChange({ birthYear: e.target.value.replace(/\D/g, "").slice(0, 4) })}
        placeholder="Födelseår (t.ex. 2016)"
        maxLength={4}
        className="text-base text-text-primary bg-transparent outline-none placeholder:text-gray-400"
      />

      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-gray-100">
        <select
          value={child.grade}
          onChange={(e) => onChange({ grade: e.target.value })}
          className="text-xs text-text-secondary bg-gray-100 border-0 rounded-full px-2.5 py-1 outline-none cursor-pointer hover:bg-gray-200 transition-colors appearance-none"
        >
          {GRADES_WITH_EMOJI.map(({ grade, emoji }) => (
            <option key={grade} value={grade}>
              {emoji} {grade}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function ElevNonStepChildren({
  children,
  onChange,
  onNext,
  onBack,
}: ElevNonStepChildrenProps) {
  const addChild = () => {
    const last = children[children.length - 1];
    onChange([
      ...children,
      {
        name: "",
        birthYear: "",
        grade: last.grade,
        instruments: [...last.instruments],
        instrumentOther: "",
      },
    ]);
  };

  const removeChild = (idx: number) => {
    onChange(children.filter((_, i) => i !== idx));
  };

  const updateChild = (idx: number, updates: Partial<Child>) => {
    onChange(children.map((c, i) => (i === idx ? { ...c, ...updates } : c)));
  };

  const canProceed = children.every((c) => c.name.trim().length > 0);

  return (
    <StepWrapper onBack={onBack} onNext={onNext} ctaText="Gå vidare" ctaDisabled={!canProceed}>
      <h2 className="text-2xl font-bold text-text-primary mb-1 mt-2">
        Vem ska ha lektioner?
      </h2>
      <p className="text-sm text-text-secondary mb-5">
        Ange namn och födelseår för eleven.
      </p>

      <div className="flex flex-col gap-3 mb-5">
        {children.map((child, i) => (
          <ChildCard
            key={i}
            child={child}
            index={i}
            canRemove={children.length > 1}
            onChange={(updates) => updateChild(i, updates)}
            onRemove={() => removeChild(i)}
          />
        ))}
      </div>

      {children.length < 4 && (
        <button
          type="button"
          onClick={addChild}
          className="text-xs text-gray-400 hover:text-text-secondary transition-colors underline underline-offset-2 decoration-dotted"
        >
          + Lägg till ett syskon
        </button>
      )}
    </StepWrapper>
  );
}
