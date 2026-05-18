"use client";

import { ElevFormData } from "@/lib/elev-types";
import { INSTRUMENTS } from "@/lib/types";

interface ElevConfirmationProps {
  data: ElevFormData;
}

function getInstrumentEmoji(name: string): string {
  return INSTRUMENTS.find((i) => i.name === name)?.emoji ?? "🎵";
}

const GRADE_EMOJIS: Record<string, string> = {
  Förskola: "🧸",
  Lågstadiet: "🎒",
  Mellanstadiet: "📚",
  Högstadiet: "📐",
  Äldre: "🎓",
};

export default function ElevConfirmation({ data }: ElevConfirmationProps) {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start px-4 py-12">
      <div className="w-full max-w-[480px]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 text-3xl">
            🎉
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Tack för er anmälan!
          </h1>
          <p className="text-sm text-text-secondary">
            Vi hör av oss inom kort för att kunna hitta rätt lärare till er.
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-8">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
            {data.children.length === 1 ? "Anmält barn" : "Anmälda barn"}
          </p>
          {data.children.map((child, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-200 bg-bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <span className="text-xl flex-shrink-0">
                {GRADE_EMOJIS[child.grade] ?? "👤"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary">
                  {child.name || `Barn ${i + 1}`}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {child.grade} &middot;{" "}
                  {child.instruments
                    .map((instr) => `${getInstrumentEmoji(instr)} ${instr}`)
                    .join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>

        {data.email && (
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm text-text-secondary">
            <p>
              <span className="font-semibold text-text-primary">Bekräftelse skickas till:</span>{" "}
              {data.email}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
