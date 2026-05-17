"use client";

import { useState } from "react";
import { Child } from "@/lib/elev-non-types";
import { INSTRUMENTS } from "@/lib/types";
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

function getInstrumentEmoji(name: string): string {
  return INSTRUMENTS.find((i) => i.name === name)?.emoji ?? "🎵";
}

function gradeEmoji(grade: string): string {
  return GRADES_WITH_EMOJI.find((g) => g.grade === grade)?.emoji ?? "👤";
}

interface ChildCardProps {
  child: Child;
  index: number;
  canRemove: boolean;
  instrumentEditOpen: boolean;
  onToggleInstrumentEdit: () => void;
  onChange: (updates: Partial<Child>) => void;
  onRemove: () => void;
}

function ChildCard({
  child,
  index,
  canRemove,
  instrumentEditOpen,
  onToggleInstrumentEdit,
  onChange,
  onRemove,
}: ChildCardProps) {
  const toggleInstrument = (name: string) => {
    const next = child.instruments.includes(name)
      ? child.instruments.filter((i) => i !== name)
      : [...child.instruments, name];
    if (next.length > 0) onChange({ instruments: next });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
      {/* Name row */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-3">
        <input
          type="text"
          value={child.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder={`Barn ${index + 1} — förnamn`}
          maxLength={50}
          className="flex-1 text-sm font-semibold text-text-primary bg-transparent outline-none placeholder:text-gray-400 placeholder:font-normal"
        />
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-error hover:bg-red-50 transition-colors flex-shrink-0"
            aria-label="Ta bort"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Grade + instrument summary */}
      <div className="flex flex-wrap items-center gap-2 px-4 pb-3">
        <select
          value={child.grade}
          onChange={(e) => onChange({ grade: e.target.value })}
          className="text-xs font-medium text-text-secondary bg-gray-100 border-0 rounded-full px-2.5 py-1 outline-none cursor-pointer hover:bg-gray-200 transition-colors appearance-none"
        >
          {GRADES_WITH_EMOJI.map(({ grade, emoji }) => (
            <option key={grade} value={grade}>
              {emoji} {grade}
            </option>
          ))}
        </select>

        {child.instruments.map((instr) => (
          <span
            key={instr}
            className="inline-flex items-center gap-1 text-xs font-medium bg-accent-soft text-primary rounded-full px-2.5 py-1"
          >
            {getInstrumentEmoji(instr)} {instr}
          </span>
        ))}
      </div>

      {/* Instrument toggle */}
      <button
        type="button"
        onClick={onToggleInstrumentEdit}
        className="w-full flex items-center justify-between px-4 py-2.5 border-t border-gray-100 text-xs text-text-secondary hover:text-primary hover:bg-gray-50 transition-colors"
      >
        <span>{instrumentEditOpen ? "Dölj instrument" : "Vill de spela ett annat instrument?"}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform ${instrumentEditOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {instrumentEditOpen && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {INSTRUMENTS.map(({ name, emoji }) => {
              const selected = child.instruments.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleInstrument(name)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all duration-150 border shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${
                    selected
                      ? "bg-accent-soft border-primary text-primary"
                      : "bg-bg-white border-gray-200 hover:border-primary/40 hover:bg-accent-soft/50 text-text-primary"
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                      selected ? "bg-primary border-primary" : "border-gray-300"
                    }`}
                  >
                    {selected && (
                      <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className="text-base flex-shrink-0">{emoji}</span>
                  <span className="text-xs font-medium">{name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ElevNonStepChildren({
  children,
  onChange,
  onNext,
  onBack,
}: ElevNonStepChildrenProps) {
  const [instrumentEditOpen, setInstrumentEditOpen] = useState<Record<number, boolean>>({});

  const toggleInstrumentEdit = (idx: number) => {
    setInstrumentEditOpen((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const addChild = () => {
    const last = children[children.length - 1];
    onChange([
      ...children,
      {
        name: "",
        grade: last.grade,
        instruments: [...last.instruments],
        instrumentOther: "",
      },
    ]);
  };

  const removeChild = (idx: number) => {
    onChange(children.filter((_, i) => i !== idx));
    setInstrumentEditOpen((prev) => {
      const next: Record<number, boolean> = {};
      Object.entries(prev).forEach(([k, v]) => {
        const ki = Number(k);
        if (ki < idx) next[ki] = v;
        else if (ki > idx) next[ki - 1] = v;
      });
      return next;
    });
  };

  const updateChild = (idx: number, updates: Partial<Child>) => {
    onChange(children.map((c, i) => (i === idx ? { ...c, ...updates } : c)));
  };

  const canProceed = children.every((c) => c.name.trim().length > 0);

  return (
    <StepWrapper onBack={onBack} onNext={onNext} ctaText="Gå vidare" ctaDisabled={!canProceed}>
      <h2 className="text-2xl font-bold text-text-primary mb-2 mt-2">
        {children.length === 1 ? "Vem ska ha lektioner?" : "Vilka ska ha lektioner?"}
      </h2>
      <p className="text-sm text-text-secondary mb-5">
        Ange förnamn för {children.length === 1 ? "eleven" : "varje barn"}.
      </p>

      <div className="flex flex-col gap-3 mb-4">
        {children.map((child, i) => (
          <ChildCard
            key={i}
            child={child}
            index={i}
            canRemove={children.length > 1}
            instrumentEditOpen={!!instrumentEditOpen[i]}
            onToggleInstrumentEdit={() => toggleInstrumentEdit(i)}
            onChange={(updates) => updateChild(i, updates)}
            onRemove={() => removeChild(i)}
          />
        ))}
      </div>

      {children.length < 4 && (
        <button
          type="button"
          onClick={addChild}
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
