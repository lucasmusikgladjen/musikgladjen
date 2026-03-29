"use client";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[];
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  stepNames,
}: ProgressBarProps) {
  return (
    <div className="w-full px-2 py-4">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const isActive = i <= currentStep;
          const isCurrent = i === currentStep;
          return (
            <div key={i} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {i > 0 && (
                  <div
                    className={`h-0.5 flex-1 transition-colors duration-300 ${
                      i <= currentStep ? "bg-primary" : "bg-step-inactive"
                    }`}
                  />
                )}
                <div
                  className={`w-3 h-3 rounded-full flex-shrink-0 transition-colors duration-300 ${
                    isActive ? "bg-primary" : "bg-step-inactive"
                  } ${isCurrent ? "ring-2 ring-primary/30 ring-offset-1" : ""}`}
                />
                {i < totalSteps - 1 && (
                  <div
                    className={`h-0.5 flex-1 transition-colors duration-300 ${
                      i < currentStep ? "bg-primary" : "bg-step-inactive"
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-[11px] mt-1.5 text-center leading-tight transition-colors duration-300 ${
                  isActive ? "text-primary font-medium" : "text-step-inactive"
                }`}
              >
                {stepNames[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
