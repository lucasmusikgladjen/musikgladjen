"use client";

import { INSTRUMENTS } from "@/lib/types";
import StepWrapper from "./StepWrapper";

interface ElevNonStepInstrumentProps {
  childName: string;
  value: string[];
  otherValue: string;
  onChange: (instruments: string[]) => void;
  onOtherChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ElevNonStepInstrument({
  childName,
  value,
  otherValue,
  onChange,
  onOtherChange,
  onNext,
  onBack,
}: ElevNonStepInstrumentProps) {
  const toggle = (name: string) => {
    if (value.includes(name)) {
      onChange(value.filter((v) => v !== name));
    } else {
      onChange([...value, name]);
    }
  };

  const showOtherField = value.includes("Annat");
  const displayName = childName.trim() || "eleven";

  return (
    <StepWrapper
      onBack={onBack}
      onNext={onNext}
      ctaText="Nästa"
      ctaDisabled={false}
    >
      <div className="flex items-start gap-3 bg-bg-white rounded-xl p-4 mb-6 border border-gray-100 shadow-sm">
        <div className="flex-1">
          <p className="text-sm font-semibold text-text-primary">En personlig lärare till ert barn</p>
          <p className="text-sm text-text-secondary mt-0.5">
            Läraren anpassar varje lektion efter barnets nivå och intressen, oavsett om det är Minecraft-melodier eller Mozart.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-text-primary mb-1 mt-2">
        Vilket instrument vill {displayName} spela?
      </h2>
      <p className="text-sm text-text-secondary mb-5">
        Markera gärna flera, ju fler desto snabbare hittar vi en lärare.
      </p>

      <div className="grid grid-cols-2 gap-2">
        {INSTRUMENTS.map(({ name, emoji }) => {
          const selected = value.includes(name);
          return (
            <button
              key={name}
              type="button"
              onClick={() => toggle(name)}
              className={`flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all duration-200 border shadow-[0_1px_2px_rgba(0,0,0,0.04)] min-h-[56px] ${
                selected
                  ? "bg-accent-soft border-primary text-primary"
                  : "bg-bg-white border-gray-200 hover:border-primary/40 hover:bg-accent-soft/50 text-text-primary"
              }`}
            >
              <span
                className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                  selected ? "bg-primary border-primary" : "border-gray-300"
                }`}
              >
                {selected && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span className="text-base font-medium">{name}</span>
            </button>
          );
        })}
      </div>

      {showOtherField && (
        <div className="mt-4 animate-fade-in-up">
          <label htmlFor="instrumentOther" className="block text-sm font-medium text-text-primary mb-1">
            Vilket instrument?
          </label>
          <input
            id="instrumentOther"
            type="text"
            value={otherValue}
            onChange={(e) => onOtherChange(e.target.value)}
            placeholder="T.ex. ukulele, cello..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none text-base bg-bg-white"
            maxLength={100}
          />
        </div>
      )}
    </StepWrapper>
  );
}
