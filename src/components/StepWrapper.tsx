"use client";

import { ReactNode, useEffect, useRef } from "react";

interface StepWrapperProps {
  children: ReactNode;
  onBack?: () => void;
  onNext: () => void;
  ctaText: string;
  ctaDisabled?: boolean;
  ctaLoading?: boolean;
  showBack?: boolean;
  showCta?: boolean;
  subtext?: string;
}

export default function StepWrapper({
  children,
  onBack,
  onNext,
  ctaText,
  ctaDisabled = false,
  ctaLoading = false,
  showBack = true,
  showCta = true,
  subtext,
}: StepWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 px-4 pb-28 md:pb-8 md:px-0">{children}</div>

      {showCta && (
        <div className="fixed bottom-0 left-0 right-0 md:static md:mt-4 bg-white border-t border-border md:border-0 shadow-[0_-2px_8px_rgba(0,0,0,0.08)] md:shadow-none p-4 md:px-0 z-20">
          <div className="max-w-[560px] mx-auto flex items-center gap-4">
            {showBack && onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center justify-center w-12 h-12 rounded-xl border-2 border-gray-200 text-text-secondary hover:border-primary/40 hover:text-text-primary transition-colors flex-shrink-0"
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
              className="flex-1 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl text-base transition-all duration-200 flex items-center justify-center gap-2 min-h-[56px] shadow-lg shadow-primary/20"
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
