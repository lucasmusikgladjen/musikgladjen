"use client";

export default function JobFormHeader() {
  return (
    <div className="w-full">
      <div className="relative overflow-hidden bg-gradient-to-r from-[#da3111] via-[#e8501a] to-[#da3111]">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none select-none"
          aria-hidden="true"
        >
          <span className="absolute text-4xl top-1 left-[8%] rotate-12">♪</span>
          <span className="absolute text-3xl top-3 left-[25%] -rotate-6">♫</span>
          <span className="absolute text-5xl -top-1 left-[48%] rotate-[20deg]">♩</span>
          <span className="absolute text-3xl top-2 left-[68%] -rotate-12">♬</span>
          <span className="absolute text-4xl top-0 left-[85%] rotate-6">♪</span>
        </div>
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
            <div className="inline-flex items-center gap-2">
              <span className="text-3xl drop-shadow-sm">🎵</span>
              <span className="text-2xl font-bold text-white tracking-tight drop-shadow-sm">
                Musikglädjen
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
