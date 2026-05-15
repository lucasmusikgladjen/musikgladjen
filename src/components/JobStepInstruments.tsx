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
      <h2 className="text-2xl font-bold text-text-primary mb-1">
        Välj instrument
      </h2>
      <p className="text-sm text-text-secondary mb-5">
        Kryssa i alla du kan spela, inte bara ditt huvudinstrument.
      </p>

      <div className="grid grid-cols-2 gap-2">
        {JOB_INSTRUMENTS.map(({ name, badge }) => {
          const selected = value.includes(name);
          return (
            <button
              key={name}
              type="button"
              onClick={() => toggle(name)}
              className={`flex items-center gap-2.5 px-3 py-3.5 rounded-xl text-left transition-all duration-200 border shadow-sm ${
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
              <span className="text-sm font-medium flex-1">{name}</span>
              {badge && (
                <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 leading-tight font-medium">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {showOtherField && (
        <div className="mt-4">
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
            className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm outline-none text-base bg-bg-white focus:border-gray-400 transition-colors placeholder:text-gray-400"
            maxLength={100}
          />
        </div>
      )}
    </StepWrapper>
  );
}
