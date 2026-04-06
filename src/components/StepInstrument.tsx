"use client";

import { INSTRUMENTS } from "@/lib/types";
import StepWrapper from "./StepWrapper";

interface StepInstrumentProps {
  value: string[];
  otherValue: string;
  onChange: (instruments: string[]) => void;
  onOtherChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepInstrument({
  value,
  otherValue,
  onChange,
  onOtherChange,
  onNext,
  onBack,
}: StepInstrumentProps) {
  const toggle = (name: string) => {
    if (value.includes(name)) {
      onChange(value.filter((v) => v !== name));
    } else {
      onChange([...value, name]);
    }
  };

  const showOtherField = value.includes("Annat");

  return (
    <StepWrapper
      onBack={onBack}
      onNext={onNext}
      ctaText="Nästa"
      ctaDisabled={value.length === 0}
    >
      <h2 className="text-2xl font-bold text-text-primary mb-1 mt-2">
        Vilket instrument vill eleven spela?
      </h2>
      <p className="text-sm text-text-secondary mb-5">
        Om de kan tänka sig spela flera så markera det. Ju fler instrument ni markerar desto snabbare kan vi hitta en lärare.
      </p>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
        {INSTRUMENTS.map(({ name, emoji }) => {
          const selected = value.includes(name);
          return (
            <button
              key={name}
              type="button"
              onClick={() => toggle(name)}
              className={`flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all duration-200 min-h-[56px] border-2 ${
                selected
                  ? "bg-accent-soft border-primary text-primary ring-1 ring-primary"
                  : "bg-bg-white border-gray-200 hover:border-primary/40 hover:bg-accent-soft/50 text-text-primary"
              }`}
            >
              <span className="text-2xl flex-shrink-0">{emoji}</span>
              <span className="text-sm font-medium">{name}</span>
            </button>
          );
        })}
      </div>

      {showOtherField && (
        <div className="mt-4 animate-fade-in-up">
          <label
            htmlFor="instrumentOther"
            className="block text-sm font-medium text-text-primary mb-1"
          >
            Vilket instrument?
          </label>
          <input
            id="instrumentOther"
            type="text"
            value={otherValue}
            onChange={(e) => onOtherChange(e.target.value)}
            placeholder="T.ex. ukulele, cello..."
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-base bg-bg-white"
            maxLength={100}
          />
        </div>
      )}
    </StepWrapper>
  );
}
