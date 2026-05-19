"use client";

import { useMemo, useRef, useState, KeyboardEvent } from "react";
import StepWrapper from "./StepWrapper";
import { JOB_INSTRUMENTS, JOB_INSTRUMENT_SUGGESTIONS } from "@/lib/job-types";

interface JobStepInstrumentsProps {
  value: string[];
  otherValue: string;
  onChange: (instruments: string[]) => void;
  onOtherChange: (value: string) => void;
  onNext: () => void;
  noValidation?: boolean;
}

export default function JobStepInstruments({
  value,
  otherValue,
  onChange,
  onOtherChange,
  onNext,
  noValidation = false,
}: JobStepInstrumentsProps) {
  const [otherInput, setOtherInput] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = (name: string) => {
    if (value.includes(name)) {
      onChange(value.filter((v) => v !== name));
    } else {
      onChange([...value, name]);
    }
  };

  const showOtherField = value.includes("Annat");

  const otherTags = useMemo(
    () =>
      otherValue
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
    [otherValue],
  );

  const suggestions = otherInput.trim()
    ? JOB_INSTRUMENT_SUGGESTIONS.filter(
        (s) =>
          s.toLowerCase().includes(otherInput.toLowerCase()) &&
          !otherTags.some((tag) => tag.toLowerCase() === s.toLowerCase()),
      ).slice(0, 6)
    : [];

  const updateOtherTags = (tags: string[]) => onOtherChange(tags.join(", "));

  const addOtherTag = (raw: string) => {
    const tag = raw.trim().replace(/,+$/, "").trim();
    if (!tag) return;
    if (otherTags.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      setOtherInput("");
      setHighlightedIndex(-1);
      return;
    }
    updateOtherTags([...otherTags, tag]);
    setOtherInput("");
    setHighlightedIndex(-1);
  };

  const removeOtherTag = (tag: string) => {
    updateOtherTags(otherTags.filter((t) => t !== tag));
  };

  const handleOtherKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setHighlightedIndex(-1);
      setOtherInput("");
    } else if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        addOtherTag(suggestions[highlightedIndex]);
      } else {
        addOtherTag(otherInput);
      }
    } else if (
      e.key === "Backspace" &&
      otherInput === "" &&
      otherTags.length > 0
    ) {
      updateOtherTags(otherTags.slice(0, -1));
    }
  };

  return (
    <StepWrapper
      onNext={onNext}
      ctaText="Nästa"
      ctaDisabled={!noValidation && value.length === 0}
      showBack={false}
    >
      <h2 className="text-2xl font-bold text-text-primary mb-1 mt-2">
        Välj instrument
      </h2>
      <p className="text-sm text-text-secondary mb-5">
        Kryssa i alla du kan spela, inte bara ditt huvudinstrument.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {JOB_INSTRUMENTS.map(({ name, badge }) => {
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
              <span className="text-base font-medium flex-1">{name}</span>
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
            Lägg till andra instrument
          </label>
          <p className="text-xs text-text-secondary mb-2">
            Välj eller skriv andra instrument du kan spela
          </p>
          <div ref={containerRef} className="relative">
            <div
              className="min-h-[48px] flex flex-wrap gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] bg-bg-white cursor-text"
              onClick={() =>
                document.getElementById("instrumentOther")?.focus()
              }
            >
              {otherTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOtherTag(tag);
                    }}
                    className="text-primary/60 hover:text-primary leading-none"
                    aria-label={`Ta bort ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                id="instrumentOther"
                type="text"
                value={otherInput}
                onChange={(e) => {
                  setOtherInput(e.target.value);
                  setHighlightedIndex(-1);
                }}
                onKeyDown={handleOtherKeyDown}
                onBlur={() => {
                  setTimeout(() => {
                    if (
                      !containerRef.current?.contains(document.activeElement)
                    ) {
                      if (otherInput.trim()) addOtherTag(otherInput);
                      setHighlightedIndex(-1);
                    }
                  }, 100);
                }}
                placeholder={
                  otherTags.length === 0 ? "T.ex. ukulele, didgeridoo..." : ""
                }
                autoComplete="off"
                className="flex-1 min-w-[120px] outline-none text-sm bg-transparent text-text-primary placeholder:text-gray-400 placeholder:text-sm"
                maxLength={100}
              />
            </div>

            {(suggestions.length > 0 || otherInput.trim()) && (
              <ul className="absolute z-10 left-0 right-0 bottom-full mb-1 bg-bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
                {otherInput.trim() &&
                  !otherTags.some(
                    (tag) =>
                      tag.toLowerCase() === otherInput.trim().toLowerCase(),
                  ) && (
                    <li>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          addOtherTag(otherInput);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-primary bg-accent-soft/60 hover:bg-accent-soft transition-colors font-medium"
                      >
                        Lägg till “{otherInput.trim()}”
                      </button>
                    </li>
                  )}
                {suggestions.map((suggestion, index) => (
                  <li key={suggestion}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        addOtherTag(suggestion);
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        index === highlightedIndex
                          ? "bg-accent-soft text-primary"
                          : "text-text-primary hover:bg-gray-50"
                      }`}
                    >
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </StepWrapper>
  );
}
