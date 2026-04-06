"use client";

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
      className="w-full px-6 py-4"
      role="progressbar"
      aria-valuenow={currentStep + 1}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Steg ${currentStep + 1} av ${totalSteps}`}
    >
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => {
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;
          return (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                isCurrent
                  ? "w-8 h-2.5 bg-primary"
                  : isCompleted
                    ? "w-2.5 h-2.5 bg-primary"
                    : "w-2.5 h-2.5 bg-gray-300"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
