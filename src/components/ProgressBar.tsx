"use client";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
}: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div
      className="w-full h-1.5 bg-gray-200"
      role="progressbar"
      aria-valuenow={currentStep + 1}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Steg ${currentStep + 1} av ${totalSteps}`}
    >
      <div
        className={`h-full bg-[#8a1f0a] transition-all duration-500 ease-in-out ${progress < 100 ? "rounded-r-full" : ""}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
