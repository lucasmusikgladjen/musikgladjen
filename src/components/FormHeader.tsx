"use client";

export default function FormHeader() {
  return (
    <div className="w-full">
      {/* Top section — dynamic red/orange gradient with decorative notes */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#da3111] via-[#e8501a] to-[#da3111]">
        {/* Decorative musical notes scattered in background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none" aria-hidden="true">
          <span className="absolute text-4xl top-1 left-[8%] rotate-12">♪</span>
          <span className="absolute text-3xl top-3 left-[25%] -rotate-6">♫</span>
          <span className="absolute text-5xl -top-1 left-[48%] rotate-[20deg]">♩</span>
          <span className="absolute text-3xl top-2 left-[68%] -rotate-12">♬</span>
          <span className="absolute text-4xl top-0 left-[85%] rotate-6">♪</span>
        </div>

        <div className="relative text-center py-5 px-4">
          {/* PLACEHOLDER LOGO: Musikglädjen logotyp i vitt */}
          <div className="inline-flex items-center gap-2">
            <span className="text-3xl drop-shadow-sm">🎵</span>
            <span className="text-2xl font-bold text-white tracking-tight drop-shadow-sm">
              Musikglädjen
            </span>
          </div>
        </div>
      </div>

      {/* Trust bar — slightly darker red */}
      <div className="bg-[#b8290e] text-white text-center py-2 px-4">
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <span className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg
                key={i}
                className="w-4 h-4 fill-yellow-300"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </span>
          <span>4.9/5</span>
          <span>Hundratals nöjda familjer</span>
        </div>
      </div>
    </div>
  );
}
