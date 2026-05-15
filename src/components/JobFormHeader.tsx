"use client";

export default function JobFormHeader() {
  return (
    <div className="w-full">
      <div className="relative bg-gradient-to-r from-[#da3111] via-[#e8501a] to-[#da3111]">
        <div className="relative py-5 px-4">
          <a
            href="https://musikgladjen.se/jobb"
            className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-white/60 hover:text-white/90 transition-colors text-sm"
            aria-label="Tillbaka till jobbannonsen"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Jobb
          </a>
          <div className="text-center">
            <span className="text-2xl font-bold text-white tracking-tight drop-shadow-sm">
              Musikglädjen
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
