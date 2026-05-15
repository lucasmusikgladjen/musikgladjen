"use client";

export default function JobFormHeader() {
  return (
    <div className="w-full bg-gradient-to-r from-[#da3111] via-[#e8501a] to-[#da3111]">
      <div className="relative flex items-center justify-center py-4 px-4">
        <img
          src="/musikgladjen-logotyp.svg"
          alt="Musikglädjen"
          className="h-8 w-auto"
          style={{ filter: "brightness(0) invert(1)" }}
        />
        <a
          href="https://musikgladjen.se/jobb"
          className="absolute right-4 text-white/70 hover:text-white transition-colors"
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
