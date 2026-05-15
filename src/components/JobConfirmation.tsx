"use client";

import { JobFormData } from "@/lib/job-types";

interface JobConfirmationProps {
  data: JobFormData;
}

export default function JobConfirmation({ data }: JobConfirmationProps) {
  const firstName = data.name.split(" ")[0];

  return (
    <div className="w-full min-h-screen flex flex-col">
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

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px] text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-text-primary mb-3">
            Tack{firstName ? `, ${firstName}` : ""}!
          </h1>
          <p className="text-base text-text-secondary mb-8">
            Din ansökan har skickats. Vi går igenom den och hör av oss via
            telefon eller e-post inom kort.
          </p>

          <div className="bg-bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left mb-8">
            <h2 className="font-semibold text-text-primary mb-4">
              Så går det till härnäst
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  1
                </span>
                <p className="text-sm text-text-secondary">
                  Vi går igenom din ansökan och kollar om det finns elever som
                  passar dina instrument och område.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  2
                </span>
                <p className="text-sm text-text-secondary">
                  Om du går vidare hör vi av oss via telefon eller mejl för
                  ett kort samtal.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  3
                </span>
                <p className="text-sm text-text-secondary">
                  Svarstid kan variera beroende på hur många som söker just
                  nu. Vill du vara extra förberedd kan du beställa ditt
                  belastningsregister från Polisen.
                </p>
              </div>
            </div>
          </div>

          <a
            href="https://www.musikgladjen.se/jobb"
            className="text-sm text-text-secondary hover:text-primary underline transition-colors"
          >
            Tillbaka till musikgladjen.se
          </a>
        </div>
      </div>
    </div>
  );
}
