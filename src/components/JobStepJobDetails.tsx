"use client";

import { useState, KeyboardEvent, useRef } from "react";
import StepWrapper from "./StepWrapper";
import { JOB_STUDENT_COUNTS, AREA_SUGGESTIONS } from "@/lib/job-types";

interface JobStepJobDetailsProps {
  studentCount: string;
  areas: string[];
  onStudentCountChange?: (value: string) => void;
  onAreasChange: (value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  noValidation?: boolean;
  enableAutocomplete?: boolean;
  showStudentCount?: boolean;
  showAreasFieldLabel?: boolean;
}

export default function JobStepJobDetails({
  studentCount,
  areas,
  onStudentCountChange,
  onAreasChange,
  onNext,
  onBack,
  noValidation = false,
  enableAutocomplete = false,
  showStudentCount = true,
  showAreasFieldLabel = true,
}: JobStepJobDetailsProps) {
  const [areaInput, setAreaInput] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions =
    enableAutocomplete && areaInput.trim()
      ? AREA_SUGGESTIONS.filter(
          (s) =>
            s.toLowerCase().includes(areaInput.toLowerCase()) &&
            !areas.includes(s),
        ).slice(0, 6)
      : [];

  const addTag = (raw: string) => {
    const tag = raw.trim().replace(/,+$/, "").trim();
    if (tag && !areas.includes(tag)) {
      onAreasChange([...areas, tag]);
    }
    setAreaInput("");
    setHighlightedIndex(-1);
  };

  const handleAreaKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setHighlightedIndex(-1);
      setAreaInput("");
    } else if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        addTag(suggestions[highlightedIndex]);
      } else {
        addTag(areaInput);
      }
    } else if (e.key === "Backspace" && areaInput === "" && areas.length > 0) {
      onAreasChange(areas.slice(0, -1));
    }
  };

  const handleAreaChange = (v: string) => {
    setHighlightedIndex(-1);
    if (v.endsWith(",")) {
      addTag(v);
    } else {
      setAreaInput(v);
    }
  };

  const removeTag = (tag: string) => {
    onAreasChange(areas.filter((a) => a !== tag));
  };

  const canProceed = showStudentCount
    ? studentCount !== "" && areas.length > 0
    : areas.length > 0;

  return (
    <StepWrapper
      onBack={onBack}
      onNext={onNext}
      ctaText="Nästa"
      ctaDisabled={!noValidation && !canProceed}
    >
      <h2 className="text-2xl font-bold text-text-primary mb-1 mt-2">
        Vart kan du ta elever?
      </h2>
      <p className="text-sm text-text-secondary mb-6">
        Skriv gärna flera områden, t.ex. där du bor, pluggar eller pendlar. Välj
        från listan eller skriv egna.
      </p>

      <div className="mb-8">
        {showAreasFieldLabel && (
          <>
            <label
              htmlFor="areas"
              className="block text-sm font-semibold text-text-primary mb-1"
            >
              I vilka områden kan du ta elever?{" "}
              <span className="text-error">*</span>
            </label>
            <p className="text-xs text-text-secondary mb-2">
              Välj från listan eller skriv egna.
            </p>
          </>
        )}
        <div ref={containerRef} className="relative">
          <div
            className="min-h-[48px] flex flex-wrap gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] bg-bg-white cursor-text"
            onClick={() => document.getElementById("areas")?.focus()}
          >
            {areas.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(tag);
                  }}
                  className="text-primary/60 hover:text-primary leading-none"
                  aria-label={`Ta bort ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
            <div className="flex items-center gap-1.5 flex-1 min-w-[80px]">
              <input
                id="areas"
                type="text"
                value={areaInput}
                onChange={(e) => handleAreaChange(e.target.value)}
                onKeyDown={handleAreaKeyDown}
                onBlur={() => {
                  setTimeout(() => {
                    if (
                      !containerRef.current?.contains(document.activeElement)
                    ) {
                      if (areaInput.trim()) addTag(areaInput);
                      setHighlightedIndex(-1);
                    }
                  }, 100);
                }}
                placeholder={areas.length === 0 ? "T.ex. Södermalm..." : ""}
                autoComplete="off"
                className="flex-1 min-w-0 outline-none text-sm bg-transparent text-text-primary placeholder:text-gray-400 placeholder:text-sm"
              />
              {areaInput.trim() && (
                <button
                  type="button"
                  onClick={() => addTag(areaInput)}
                  className="flex-shrink-0 px-2.5 py-1.5 rounded-md bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
                >
                  Lägg till “{areaInput.trim()}”
                </button>
              )}
            </div>
          </div>

          {(suggestions.length > 0 || areaInput.trim()) && (
            <ul className="absolute z-10 left-0 right-0 mt-1 bg-bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
              {areaInput.trim() && !areas.includes(areaInput.trim()) && (
                <li>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addTag(areaInput);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-primary bg-accent-soft/60 hover:bg-accent-soft transition-colors font-medium"
                  >
                    Lägg till “{areaInput.trim()}”
                  </button>
                </li>
              )}
              {suggestions.map((suggestion, index) => (
                <li key={suggestion}>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addTag(suggestion);
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

      {showStudentCount && (
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1">
            Hur många elever kan du tänka dig att ta?{" "}
            <span className="text-error">*</span>
          </label>
          <p className="text-xs text-text-secondary mb-3">
            De flesta har 1–2 elever, vilket brukar passa bra som ett extrajobb
            vid sidan av plugget.
          </p>
          <div className="flex flex-col gap-2">
            {JOB_STUDENT_COUNTS.map(({ value, label }) => {
              const selected = studentCount === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onStudentCountChange?.(value)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 border shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${
                    selected
                      ? "bg-accent-soft border-primary text-primary"
                      : "bg-bg-white border-gray-200 hover:border-primary/40 hover:bg-accent-soft/50 text-text-primary"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                      selected ? "border-primary" : "border-gray-300"
                    }`}
                  >
                    {selected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-primary block" />
                    )}
                  </span>
                  <span className="text-sm font-medium">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </StepWrapper>
  );
}
