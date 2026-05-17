"use client";

import { Child } from "@/lib/elev-non-types";
import { INSTRUMENTS } from "@/lib/types";
import StepWrapper from "./StepWrapper";

interface ElevNonStepSiblingProps {
  children: Child[];
  onAddSibling: () => void;
  onContinue: () => void;
  onBack: () => void;
  maxChildren?: number;
}

function getInstrumentEmoji(name: string): string {
  return INSTRUMENTS.find((i) => i.name === name)?.emoji ?? "🎵";
}

const GRADE_EMOJIS: Record<string, string> = {
  Förskola: "🧸",
  Lågstadiet: "🎒",
  Mellanstadiet: "📚",
  Högstadiet: "📐",
  Äldre: "🎓",
};

export default function ElevNonStepSibling({
  children,
  onAddSibling,
  onContinue,
  onBack,
  maxChildren = 4,
}: ElevNonStepSiblingProps) {
  const canAddMore = children.length < maxChildren;

  return (
    <StepWrapper onBack={onBack} onNext={onContinue} ctaText="Gå vidare till kontakt">
      <h2 className="text-2xl font-bold text-text-primary mb-2 mt-2">
        Vill ni anmäla ett syskon?
      </h2>
      <p className="text-sm text-text-secondary mb-6">
        Ni kan anmäla upp till {maxChildren} barn på samma gång.
      </p>

      {/* Summary of added children */}
      <div className="flex flex-col gap-2 mb-6">
        {children.map((child, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-200 bg-bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <span className="text-xl flex-shrink-0">
              {GRADE_EMOJIS[child.grade] ?? "👤"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary">
                {child.name || `Barn ${i + 1}`}
              </p>
              <p className="text-xs text-text-secondary truncate">
                {child.grade} &middot;{" "}
                {child.instruments
                  .map((instr) => `${getInstrumentEmoji(instr)} ${instr}`)
                  .join(", ")}
              </p>
            </div>
            <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </span>
          </div>
        ))}
      </div>

      {canAddMore && (
        <button
          type="button"
          onClick={onAddSibling}
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-dashed border-gray-300 text-sm font-semibold text-text-secondary hover:border-primary/50 hover:text-primary hover:bg-accent-soft/30 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Lägg till syskon
        </button>
      )}
    </StepWrapper>
  );
}
