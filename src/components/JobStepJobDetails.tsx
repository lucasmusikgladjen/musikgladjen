"use client";

import { useState, KeyboardEvent } from "react";
import StepWrapper from "./StepWrapper";
import { JOB_STUDENT_COUNTS } from "@/lib/job-types";

interface JobStepJobDetailsProps {
  studentCount: string;
  areas: string[];
  onStudentCountChange: (value: string) => void;
  onAreasChange: (value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function JobStepJobDetails({
  studentCount,
  areas,
  onStudentCountChange,
  onAreasChange,
  onNext,
  onBack,
}: JobStepJobDetailsProps) {
  const [areaInput, setAreaInput] = useState("");

  const addTag = (raw: string) => {
    const tag = raw.trim().replace(/,+$/, "").trim();
    if (tag && !areas.includes(tag)) {
      onAreasChange([...areas, tag]);
    }
    setAreaInput("");
  };

  const handleAreaKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(areaInput);
    } else if (e.key === "Backspace" && areaInput === "" && areas.length > 0) {
      onAreasChange(areas.slice(0, -1));
    }
  };

  const handleAreaChange = (v: string) => {
    if (v.endsWith(",")) {
      addTag(v);
    } else {
      setAreaInput(v);
    }
  };

  const removeTag = (tag: string) => {
    onAreasChange(areas.filter((a) => a !== tag));
  };

  const canProceed = studentCount !== "" && areas.length > 0;

  return (
    <StepWrapper
      onBack={onBack}
      onNext={onNext}
      ctaText="Nästa"
      ctaDisabled={!canProceed}
    >
      <h2 className="text-2xl font-bold text-text-primary mb-6 mt-2">Om jobbet</h2>

      <div className="mb-8">
        <label
          htmlFor="areas"
          className="block text-sm font-semibold text-text-primary mb-1"
        >
          I vilka områden kan du ta elever?{" "}
          <span className="text-error">*</span>
        </label>
        <p className="text-xs text-text-secondary mb-2">
          Tryck Enter eller komma efter varje område.
        </p>
        <div
          className="min-h-[48px] flex flex-wrap gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] bg-bg-white transition-colors cursor-text"
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
                onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                className="text-primary/60 hover:text-primary leading-none"
                aria-label={`Ta bort ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
          <input
            id="areas"
            type="text"
            value={areaInput}
            onChange={(e) => handleAreaChange(e.target.value)}
            onKeyDown={handleAreaKeyDown}
            onBlur={() => { if (areaInput.trim()) addTag(areaInput); }}
            placeholder={areas.length === 0 ? "T.ex. Södermalm, Vasastan..." : ""}
            className="flex-1 min-w-[120px] outline-none text-sm bg-transparent text-text-primary placeholder:text-gray-400"
          />
        </div>
      </div>

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
                onClick={() => onStudentCountChange(value)}
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
    </StepWrapper>
  );
}
