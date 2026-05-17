"use client";

import { Child } from "@/lib/elev-non-types";
import StepWrapper from "./StepWrapper";

interface ElevNonStepChildrenProps {
  children: Child[];
  onChange: (children: Child[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ElevNonStepChildren({
  children,
  onChange,
  onNext,
  onBack,
}: ElevNonStepChildrenProps) {
  const updateChild = (idx: number, updates: Partial<Child>) => {
    onChange(children.map((c, i) => (i === idx ? { ...c, ...updates } : c)));
  };

  const addChild = () => {
    const last = children[children.length - 1];
    onChange([
      ...children,
      { name: "", birthYear: "", grade: last.grade, instruments: [...last.instruments], instrumentOther: "" },
    ]);
  };

  const removeChild = (idx: number) => {
    onChange(children.filter((_, i) => i !== idx));
  };

  const canProceed = true;

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none text-base bg-bg-white placeholder:text-gray-400 placeholder:text-sm focus:border-primary transition-colors";
  const labelClass = "block text-sm font-semibold text-text-primary mb-1";

  return (
    <StepWrapper onBack={onBack} onNext={onNext} ctaText="Gå vidare" ctaDisabled={!canProceed}>
      <div className="mb-6 pb-6 border-b border-gray-100">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary mb-0.5">
          <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Läraren kommer hem till er
        </p>
        <p className="text-sm text-text-secondary">
          Alla våra lärare är noggrant utvalda. På första lektionen lär ni känna varandra och sätter upp mål tillsammans.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-text-primary mb-6 mt-2">
        Vem ska ha lektioner?
      </h2>

      <div className="flex flex-col gap-6">
        {children.map((child, i) => (
          <div key={i} className={i > 0 ? "pt-5 border-t border-gray-200" : ""}>
            {i > 0 && (
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-text-secondary">Barn {i + 1}</span>
                <button
                  type="button"
                  onClick={() => removeChild(i)}
                  className="text-xs text-gray-400 hover:text-error transition-colors"
                >
                  ta bort
                </button>
              </div>
            )}
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <div>
                <label htmlFor={`name-${i}`} className={labelClass}>
                  Elevens namn <span className="text-error">*</span>
                </label>
                <input
                  id={`name-${i}`}
                  type="text"
                  value={child.name}
                  onChange={(e) => updateChild(i, { name: e.target.value })}
                  placeholder="Förnamn"
                  maxLength={50}
                  autoComplete="off"
                  className={inputClass}
                />
              </div>
              <div className="w-24">
                <label htmlFor={`birthYear-${i}`} className={labelClass}>
                  Födelseår
                </label>
                <input
                  id={`birthYear-${i}`}
                  type="text"
                  inputMode="numeric"
                  value={child.birthYear}
                  onChange={(e) => updateChild(i, { birthYear: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                  placeholder="2018"
                  maxLength={4}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {children.length < 4 && (
        <button
          type="button"
          onClick={addChild}
          className="mt-6 text-sm text-gray-400 hover:text-text-secondary transition-colors"
        >
          + Lägg till ett barn
        </button>
      )}
    </StepWrapper>
  );
}
