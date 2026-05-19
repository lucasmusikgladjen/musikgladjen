"use client";

import { useState } from "react";
import { Child } from "@/lib/elev-types";
import StepWrapper from "./StepWrapper";

interface ElevStepChildrenProps {
  children: Child[];
  onChange: (children: Child[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ElevStepChildren({
  children,
  onChange,
  onNext,
  onBack,
}: ElevStepChildrenProps) {
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
    setTouched((t) => {
      const next: Record<string, boolean> = {};
      for (const [key, val] of Object.entries(t)) {
        const m = key.match(/^(name|birthYear)-(\d+)$/);
        if (!m) continue;
        const k = m[1];
        const i = parseInt(m[2], 10);
        if (i < idx) next[key] = val;
        else if (i > idx) next[`${k}-${i - 1}`] = val;
      }
      return next;
    });
  };

  const currentYear = new Date().getFullYear();
  const isValidBirthYear = (y: string) =>
    /^\d{4}$/.test(y) && parseInt(y) >= 1925 && parseInt(y) <= currentYear;

  const childErrors = children.map((c) => ({
    name: c.name.trim().length < 1 ? "Ange elevens namn" : null,
    birthYear: !isValidBirthYear(c.birthYear)
      ? c.birthYear.length === 0
        ? "Ange födelseår"
        : "Ange ett giltigt födelseår (1925–" + currentYear + ")"
      : null,
  }));
  const canProceed = childErrors.every((e) => !e.name && !e.birthYear);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const touch = (field: string) => setTouched((t) => ({ ...t, [field]: true }));

  const handleNext = () => {
    if (canProceed) {
      onNext();
      return;
    }
    const next: Record<string, boolean> = {};
    children.forEach((_, i) => {
      next[`name-${i}`] = true;
      next[`birthYear-${i}`] = true;
    });
    setTouched(next);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none text-base bg-bg-white placeholder:text-gray-400 placeholder:text-sm focus:border-primary transition-colors";
  const labelClass = "block text-sm font-semibold text-text-primary mb-1";
  const errorClass = "mt-1 text-xs text-error";

  return (
    <StepWrapper onBack={onBack} onNext={handleNext} ctaText="Gå vidare" gaStep="steg-3">
      <div className="mb-4 pb-4 border-b border-gray-100">
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
                  onBlur={() => touch(`name-${i}`)}
                  placeholder="Förnamn"
                  maxLength={50}
                  autoComplete="off"
                  className={inputClass}
                />
              </div>
              <div className="w-24">
                <label htmlFor={`birthYear-${i}`} className={labelClass}>
                  Födelseår <span className="text-error">*</span>
                </label>
                <input
                  id={`birthYear-${i}`}
                  type="text"
                  inputMode="numeric"
                  value={child.birthYear}
                  onChange={(e) => updateChild(i, { birthYear: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                  onBlur={() => touch(`birthYear-${i}`)}
                  placeholder="2018"
                  maxLength={4}
                  className={inputClass}
                />
              </div>
            </div>
            {touched[`name-${i}`] && childErrors[i].name && (
              <p className={errorClass}>{childErrors[i].name}</p>
            )}
            {touched[`birthYear-${i}`] && childErrors[i].birthYear && (
              <p className={errorClass}>{childErrors[i].birthYear}</p>
            )}
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
