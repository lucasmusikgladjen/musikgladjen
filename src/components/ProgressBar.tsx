"use client";

const TOTAL_STEPS = 5;

export default function ProgressBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={TOTAL_STEPS} aria-label={`Steg ${current} av ${TOTAL_STEPS}`}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const step = i + 1;
        const isCompleted = step < current;
        const isCurrent = step === current;
        return (
          <div
            key={step}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              isCurrent
                ? "w-8 bg-primary"
                : isCompleted
                  ? "w-2.5 bg-primary"
                  : "w-2.5 bg-gray-300"
            }`}
          />
        );
      })}
    </div>
  );
}
