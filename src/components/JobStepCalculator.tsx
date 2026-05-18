"use client";

import { useEffect, useRef, useState } from "react";
import StepWrapper from "./StepWrapper";

const AGE_GROUPS = ["15–17 år", "18 år", "19 år", "20+ år"] as const;
type AgeGroup = (typeof AGE_GROUPS)[number];

const STUDENT_COUNTS = [1, 3, 5] as const;
type StudentCount = (typeof STUDENT_COUNTS)[number];

const RATES: Record<AgeGroup, number> = {
  "15–17 år": 130,
  "18 år": 145,
  "19 år": 160,
  "20+ år": 175,
};

const AGE_MIN: Record<AgeGroup, number> = {
  "15–17 år": 15,
  "18 år": 18,
  "19 år": 19,
  "20+ år": 20,
};

const MONSTER_PRICE = 25;

function formatPrice(n: number) {
  return n.toLocaleString("sv-SE");
}

interface JobStepCalculatorProps {
  onNext: () => void;
  onBack: () => void;
}

export default function JobStepCalculator({ onNext, onBack }: JobStepCalculatorProps) {
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("20+ år");
  const [studentCount, setStudentCount] = useState<StudentCount>(3);
  const [ageOpen, setAgeOpen] = useState(false);
  const ageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ageOpen) return;
    const handler = (e: MouseEvent) => {
      if (ageRef.current && !ageRef.current.contains(e.target as Node)) {
        setAgeOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ageOpen]);

  const rate = RATES[ageGroup];
  const perHour = rate * studentCount;
  const perMonth = perHour * 4;

  const sectionLabel = "text-sm font-semibold text-text-primary mb-2.5";

  return (
    <StepWrapper onBack={onBack} onNext={onNext} ctaText="Fortsätt" gaStep="steg-5">
      <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5 mt-2">
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-xl font-bold text-text-primary">Räkna på din lön</h2>
        </div>

        {/* Ålder */}
        <div className="p-4 border-b border-gray-100">
          <p className={sectionLabel}>Ålder</p>
          <div ref={ageRef} className="relative">
            <div className="flex items-center rounded-full border border-gray-200 bg-white p-1 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="flex-1 bg-[#8B1A00] text-white rounded-full py-2.5 px-5 text-center text-sm font-semibold">
                {ageGroup}
              </div>
              <button
                type="button"
                onClick={() => setAgeOpen((o) => !o)}
                className="flex-shrink-0 px-4 py-2 bg-white rounded-full text-sm font-semibold text-gray-500 flex items-center gap-1.5"
              >
                Välj
                <svg
                  className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${ageOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <div
              className={`absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden z-10 transition-all duration-200 origin-top-right ${
                ageOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
              }`}
            >
              {AGE_GROUPS.map((age, i) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => { setAgeGroup(age); setAgeOpen(false); }}
                  className={`w-full px-5 py-3.5 text-left text-sm flex items-center justify-between transition-colors ${
                    ageGroup === age ? "text-[#8B1A00]" : "text-text-primary hover:bg-gray-50"
                  } ${i > 0 ? "border-t border-gray-100" : ""}`}
                >
                  {age}
                  {ageGroup === age && (
                    <svg className="w-4 h-4 text-[#8B1A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Antal elever */}
        <div className="p-4 border-b border-gray-100">
          <p className={sectionLabel}>Antal elever</p>
          <div className="flex gap-1 rounded-full border border-gray-200 bg-white p-1 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            {STUDENT_COUNTS.map((count) => {
              const selected = studentCount === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => setStudentCount(count)}
                  className={`flex-1 py-2.5 rounded-full text-sm font-semibold min-h-[44px] transition-colors duration-150 ${
                    selected ? "bg-[#8B1A00] text-white" : "bg-white text-gray-500"
                  }`}
                >
                  {count} {count === 1 ? "elev" : "elever"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Result */}
        <div className="px-5 py-6 text-center">
          <p className="text-5xl font-extrabold text-text-primary tracking-tight">
            {formatPrice(perMonth)}{" "}
            <span className="text-xl font-semibold text-text-secondary">kr/mån</span>
          </p>
          <p className="text-sm text-text-secondary mt-2">
            {studentCount} {studentCount === 1 ? "elev" : "elever"} · {ageGroup} · {rate} kr/timme
          </p>
        </div>
      </div>

      {/* Info section */}
      <div className="mt-2 pt-4 border-t border-gray-100 mb-4 flex flex-col gap-4">
        <div className="flex gap-3">
          <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-text-secondary mb-0.5">Hur beräknas lönen?</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Lönen är uträknad på 4 genomförda lektioner per elev och månad, och är alltså endast preliminär.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-text-secondary mb-0.5">Din timlön</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Vi följer fasta löneklasser baserat på året du fyller år, inte din faktiska födelsedag.
            </p>
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}
