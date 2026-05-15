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
        <div className="relative text-center py-5 px-4">
          <div className="inline-flex items-center gap-2">
            <span className="text-3xl drop-shadow-sm">🎵</span>
            <span className="text-2xl font-bold text-white tracking-tight drop-shadow-sm">
              Musikglädjen
            </span>
          </div>
        </div>
      </div>
      <div className="bg-[#b8290e] text-white text-center py-2 px-4">
        <p className="text-sm font-medium">Ansök som musiklärare — tar ca 5 minuter</p>
      </div>
    </div>
  );
}
