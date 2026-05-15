"use client";

import StepWrapper from "./StepWrapper";
import { JOB_INSTRUMENTS } from "@/lib/job-types";

interface JobStepInstrumentsProps {
  value: string[];
  otherValue: string;
  onChange: (instruments: string[]) => void;
  onOtherChange: (value: string) => void;
  onNext: () => void;
}

export default function JobStepInstruments({
  value,
  otherValue,
  onChange,
  onOtherChange,
  onNext,
}: JobStepInstrumentsProps) {
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
      onNext={onNext}
      ctaText="Nästa"
      ctaDisabled={value.length === 0}
      showBack={false}
    >
      <div className="flex items-start gap-3 bg-bg-white rounded-xl p-4 mb-6 border border-gray-100 shadow-sm animate-fade-in-up">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-xl">
          🎸
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">
            Kul att du vill jobba hos oss!
          </p>
          <p className="text-sm text-text-secondary mt-0.5">
            Svara på några snabba frågor så hör vi av oss inom kort. Det tar
            bara 5 minuter.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-text-primary mb-1">
        Vilka instrument kan du undervisa i?
      </h2>
      <p className="text-sm text-text-secondary mb-5">
        Kryssa i alla instrument du kan spela, inte bara ditt huvudinstrument.
      </p>

      <div className="grid grid-cols-2 gap-2">
        {JOB_INSTRUMENTS.map(({ name, badge }) => {
          const selected = value.includes(name);
          return (
            <button
              key={name}
              type="button"
              onClick={() => toggle(name)}
              className={`flex items-center gap-2.5 px-3 py-3 rounded-xl text-left transition-colors border ${
                selected
                  ? "border-gray-300 bg-gray-50"
                  : "border-gray-200 bg-bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span
                className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                  selected ? "bg-primary border-primary" : "border-gray-400"
                }`}
              >
                {selected && (
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-text-primary">{name}</span>
                {badge && (
                  <span className="text-xs text-orange-600 truncate">{badge}</span>
                )}
              </div>
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
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-base bg-bg-white focus:border-gray-400 transition-colors"
            maxLength={100}
          />
        </div>
      )}
    </StepWrapper>
  );
}
