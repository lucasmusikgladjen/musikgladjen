"use client";

const STEP_LABELS = ["Kom igång", "Om jobbet", "Om dig", "Kontakt"];

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
}: ProgressBarProps) {
  return (
    <div
      className="w-full bg-[#b8290e] py-3 px-4"
      role="progressbar"
      aria-valuenow={currentStep + 1}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Steg ${currentStep + 1} av ${totalSteps}`}
    >
      <div className="flex items-start justify-center">
        {Array.from({ length: totalSteps }, (_, i) => {
          const done = i < currentStep;
          const current = i === currentStep;
          return (
            <div key={i} className="flex items-start">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    done || current ? "bg-white" : "bg-white/30"
                  }`}
                />
                <span
                  className={`text-[10px] font-medium transition-colors ${
                    current ? "text-white" : done ? "text-white/70" : "text-white/40"
                  }`}
                >
                  {STEP_LABELS[i]}
                </span>
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={`h-px w-8 mx-2 mt-1 transition-all duration-300 ${
                    i < currentStep ? "bg-white/70" : "bg-white/20"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
