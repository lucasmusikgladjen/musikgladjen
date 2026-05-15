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
      className="flex items-center justify-center gap-2 py-3"
      role="progressbar"
      aria-valuenow={currentStep + 1}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Steg ${currentStep + 1} av ${totalSteps}`}
    >
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i <= currentStep
              ? "w-2.5 h-2.5 bg-primary"
              : "w-2 h-2 bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}
