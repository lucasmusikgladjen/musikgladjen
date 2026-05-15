"use client";

export default function JobFormHeader() {
  return (
    <div className="w-full bg-gradient-to-r from-[#da3111] via-[#e8501a] to-[#da3111]">
      <div className="relative text-center py-5 px-4">
        <span className="text-2xl font-bold text-white tracking-tight">
          Musikglädjen
        </span>
        <a
          href="https://musikgladjen.se/jobb"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
          aria-label="Stäng ansökan"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </a>
      </div>
    </div>
  );
}
