"use client";

import { ReactNode, useEffect, useRef } from "react";

interface StepWrapperProps {
  children: ReactNode;
  onBack?: () => void;
  onNext: () => void;
  ctaText: string;
  ctaDisabled?: boolean;
  ctaLoading?: boolean;
  ctaLarge?: boolean;
  showBack?: boolean;
  showCta?: boolean;
  subtext?: string;
  gaStep?: string;
}

export default function StepWrapper({
  children,
  onBack,
  onNext,
  ctaText,
  ctaDisabled = false,
  ctaLoading = false,
  ctaLarge = false,
  showBack = true,
  showCta = true,
  subtext,
  gaStep,
}: StepWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col flex-1 min-h-0" data-ga-step={gaStep}>
      <div className="flex-1 px-4 pt-8 pb-32">{children}</div>

      {showCta && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)] p-4 z-20">
          <div className="max-w-[560px] mx-auto flex items-center gap-3">
            {showBack && onBack && (
              <button
                type="button"
                onClick={onBack}
                data-ga-action="back"
                data-ga-step={gaStep}
                className="flex items-center justify-center flex-shrink-0 rounded-xl border border-gray-200 text-text-secondary hover:border-primary/40 hover:text-text-primary transition-colors w-[52px] h-[52px] sm:w-[60px] sm:h-[60px]"
                aria-label="Tillbaka"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={onNext}
              disabled={ctaDisabled || ctaLoading}
              data-ga-action="next"
              data-ga-step={gaStep}
              className={`flex-1 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 rounded-xl text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 ${ctaLarge ? "py-4 sm:py-5 min-h-[52px] sm:min-h-[64px] text-base sm:text-lg" : "min-h-[52px] sm:min-h-[60px]"}`}
            >
              {ctaLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                ctaText
              )}
            </button>
          </div>
          {subtext && (
            <p className="text-center text-xs text-text-secondary mt-2 max-w-[560px] mx-auto">
              {subtext}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
